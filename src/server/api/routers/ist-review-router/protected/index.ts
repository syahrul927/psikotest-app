/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { buildMultiFieldBulkUpdateSQL } from "@/lib/prisma-utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { IstResult, IstResultDetail, Prisma } from "@prisma/client";
import type { Pick } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const istReviewRouter = createTRPCRouter({
  completeReview: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input: invitationId }) => {
      // Check if invitation exists
      const invitation = await ctx.db.istInvitation.findUnique({
        where: {
          id: invitationId,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan.",
        });
      }

      // Update invitation status to DONE
      await ctx.db.istInvitation.update({
        where: {
          id: invitationId,
        },
        data: {
          status: "DONE",
        },
      });

      return { success: true, message: "Review berhasil diselesaikan." };
    }),
  getProfileInvitation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.istInvitation.findUnique({
        where: {
          id: invitationId,
        },
        include: {
          testerProfile: true,
          IstResult: true,
        },
      });

      if (!invitation)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak valid.",
        });
      return {
        placeOfBirth: invitation.testerProfile?.placeOfBirth,
        dayOfBirth: invitation.testerProfile?.dateOfBirth,
        educationName: invitation.testerProfile?.educationName,
        name: invitation.testerProfile?.name,
        phone: invitation.testerProfile?.phone,
        startAt: invitation.updatedAt,
      };
    }),
  getAnswerReview: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      let listAnswerSubtest = await ctx.db.istResult.findMany({
        where: {
          istInvitationId: input,
        },
        include: {
          IstSubtestTemplate: true,
          IstResultDetail: {
            include: {
              question: true,
            },
          },
        },
      });
      const notReviewYet: Pick<
        IstResult,
        "id" | "answeredCorrectly" | "answered" | "answeredWrong" | "missed"
      >[] = listAnswerSubtest.map((subtest) => {
        const answeredCorrectly = correctionSubtest(
          subtest.subtestTemplateId,
          subtest.IstResultDetail,
        );
        return {
          id: subtest.id,
          answeredCorrectly,
          answeredWrong:
            (subtest.subtestTemplateId === "4" ? 32 : 20) - answeredCorrectly,
          answered: subtest.IstResultDetail.length,
          missed:
            (subtest.subtestTemplateId === "4" ? 16 : 20) -
            subtest.IstResultDetail.length,
        };
      });
      if (notReviewYet.length) {
        const { sql: sqlIstResult, params: paramsIstResult } =
          buildMultiFieldBulkUpdateSQL<
            IstResult,
            "answeredCorrectly" | "answered" | "answeredWrong" | "missed"
          >({
            table: "IstResult",
            updates: notReviewYet,
            fields: [
              "answeredCorrectly",
              "answered",
              "answeredWrong",
              "missed",
            ],
          });

        await ctx.db.$executeRawUnsafe(sqlIstResult, ...paramsIstResult);
        listAnswerSubtest = await ctx.db.istResult.findMany({
          where: {
            istInvitationId: input,
          },
          include: {
            IstSubtestTemplate: true,
            IstResultDetail: {
              include: {
                question: true,
              },
            },
          },
        });
        const updatedResultDetail: Pick<
          IstResultDetail,
          "id" | "isCorrect" | "score"
        >[][] = listAnswerSubtest
          .filter((subtest) => subtest.subtestTemplateId !== "4")
          .map((subtest) => {
            return subtest.IstResultDetail.map((detail) => {
              const isCorrect =
                detail.answer ===
                validateCorrectAnswer(
                  subtest.subtestTemplateId,
                  detail.question.correctAnswer,
                );

              return {
                id: detail.id,
                isCorrect,
                score: isCorrect ? 1 : 0,
              };
            });
          });

        const { sql, params } = buildMultiFieldBulkUpdateSQL<
          IstResultDetail,
          "isCorrect" | "score"
        >({
          table: "IstResultDetail",
          updates: updatedResultDetail.flat(),
          fields: ["isCorrect", "score"],
        });

        await ctx.db.$executeRawUnsafe(sql, ...params);
      }
      const results = listAnswerSubtest
        .map((subtest) => ({
          id: subtest.id,
          type: subtest.subtestTemplateId,
          title: subtest.IstSubtestTemplate.name,
          description: subtest.IstSubtestTemplate.description,
          totalCorrect: subtest.answeredCorrectly ?? 0,
          data: subtest.IstResultDetail.map((detail) => ({
            id: detail.id,
            order: detail.question.order,
            text: detail.question.text ?? "",
            image: detail.question.imageUrl ?? "",
            correctAnswer: detail.question.correctAnswer ?? "",
            userAnswer: detail.answer ?? "",
            isCorrect: detail.isCorrect,
            score: detail.score,
          })).sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => Number(a.type) - Number(b.type));
      return results;
    }),
  submitCorrection: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        isCorrect: z.boolean().nullable(),
        score: z.number().nullable(),
      }),
    )
    .mutation(async ({ ctx, input: { id, isCorrect, score } }) => {
      const resultDetail = await ctx.db.istResultDetail.findUnique({
        where: {
          id,
        },
      });
      if (!resultDetail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Result Detail",
        });
      }
      await ctx.db.istResultDetail.update({
        where: {
          id,
        },
        data: {
          score,
          isCorrect,
        },
      });
      const result = await ctx.db.istResult.findUnique({
        where: {
          id: resultDetail.istResultId,
        },
        include: {
          IstResultDetail: {
            include: {
              question: true,
            },
          },
        },
      });
      if (result) {
        const answeredCorrectly = correctionSubtest(
          result?.subtestTemplateId,
          result?.IstResultDetail,
        );
        await ctx.db.istResult.update({
          where: {
            id: resultDetail.istResultId,
          },
          data: {
            answeredCorrectly,
            answeredWrong:
              (result.subtestTemplateId === "4" ? 32 : 20) - answeredCorrectly,
            answered: result.IstResultDetail.length,
            missed:
              (result.subtestTemplateId === "4" ? 16 : 20) -
              result.IstResultDetail.length,
          },
        });
      }
    }),
});
const validateCorrectAnswer = (
  subtestTemplateId: string,
  str: string | null,
) => {
  if (["5", "6"].includes(subtestTemplateId)) {
    return str?.split("").sort().join("");
  }
  return str;
};
function correctionSubtest(
  subtestTemplateId: string,
  IstResultDetail: Prisma.IstResultDetailGetPayload<{
    include: { question: true };
  }>[],
): number {
  if (subtestTemplateId === "4") {
    return IstResultDetail.reduce(
      (total, data) => total + (data.score ?? 0),
      0,
    );
  }
  const totalCorrect = IstResultDetail.reduce((prev, data) => {
    const isCorrect =
      data.answer ===
      validateCorrectAnswer(subtestTemplateId, data.question.correctAnswer)
        ? 1
        : 0;
    return prev + isCorrect;
  }, 0);
  return totalCorrect;
}
