import { buildMultiFieldBulkUpdateSQL } from "@/lib/prisma-utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { IstResult, IstResultDetail, Prisma } from "@prisma/client";
import type { Pick } from "@prisma/client/runtime/library";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const istReviewRouter = createTRPCRouter({
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

      const updated: Pick<
        IstResult,
        "id" | "answeredCorrectly" | "answered"
      >[] = listAnswerSubtest
        .filter(
          (subtest) =>
            !subtest.answeredCorrectly && subtest.subtestTemplateId !== "4",
        )
        .map((subtest) => {
          const answeredCorrectly = correctionSubtest(
            subtest.subtestTemplateId,
            subtest.IstResultDetail,
          );
          return {
            id: subtest.id,
            answeredCorrectly,
            answered: subtest.IstResultDetail.length,
          };
        });
      if (updated.length) {
        const { sql: sqlIstResult, params: paramsIstResult } =
          buildMultiFieldBulkUpdateSQL<
            IstResult,
            "answeredCorrectly" | "answered"
          >({
            table: "IstResult",
            updates: updated,
            fields: ["answeredCorrectly", "answered"],
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
        const updates: Pick<IstResultDetail, "id" | "isCorrect" | "score">[][] =
          listAnswerSubtest
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
                  score: 1,
                };
              });
            });

        const { sql, params } = buildMultiFieldBulkUpdateSQL<
          IstResultDetail,
          "isCorrect" | "score"
        >({
          table: "IstResultDetail",
          updates: updates.flat(),
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
          })).sort((a, b) => a.order - b.order),
        }))
        .sort((a, b) => Number(a.type) - Number(b.type));
      return results;
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
