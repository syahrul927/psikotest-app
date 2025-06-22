import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import type { s } from "node_modules/framer-motion/dist/types.d-CtuPurYT";
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
      const listAnswerSubtest = await ctx.db.istResult.findMany({
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
      const results = listAnswerSubtest.map((subtest) => ({
        id: subtest.id,
        type: subtest.subtestTemplateId,
        title: subtest.IstSubtestTemplate.name,
        description: subtest.IstSubtestTemplate.description,
        data: subtest.IstResultDetail.map((detail) => ({
          id: detail.id,
          order: detail.question.order,
          text: detail.question.text ?? "",
          image: detail.question.imageUrl ?? "",
          correctAnswer: detail.question.correctAnswer ?? "",
          userAnswer: detail.answer ?? "",
        })).sort((a, b) => a.order - b.order),
      }));
      return results;
    }),
});
