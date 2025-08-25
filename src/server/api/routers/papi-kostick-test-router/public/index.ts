import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { SubmitAnswerPapiKostickRequest } from "../schema";
import { TRPCError } from "@trpc/server";

export const papiKostickTestPublicRouter = createTRPCRouter({
  findAllQuestions: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.papiKostickQuestion.findMany({
      select: {
        id: true,
        descriptionA: true,
        descriptionB: true,
      },
    });
  }),
  submitAnswers: publicProcedure
    .input(SubmitAnswerPapiKostickRequest)
    .mutation(async ({ ctx, input }) => {
      if (input.data.length != 90) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid input: the total number of answers must be 90",
        });
      }
      const insertBatchAnswer = ctx.db.papiKostickAnswer.createMany({
        data: input.data.map((i) => ({
          invitationId: input.invitationId,
          questionId: i.questionId,
          answer: i.answer,
        })),
      });
      const updateStatusInvitation = ctx.db.papiKostickInvitation.update({
        where: { id: input.invitationId },
        data: {
          status: "DONE",
        },
      });
      await Promise.all([insertBatchAnswer, updateStatusInvitation]);
    }),
});
