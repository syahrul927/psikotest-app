import {
  calculatePAPIScores,
  MasterCategoryScale,
  papiKostickDescription,
  type Scale,
} from "@/lib/papi-kostick-utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { SubmitAnswerPapiKostickRequest } from "../schema";

export const papiKostickTestPublicRouter = createTRPCRouter({
  findAllQuestions: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.db.papiKostickQuestion.findMany({
      select: {
        id: true,
        descriptionA: true,
        descriptionB: true,
      },
    });
    return questions
      .map((q) => ({ ...q, id: Number(q.id) }))
      .sort((a, b) => a.id - b.id);
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
          questionId: String(i.questionId),
          answer: i.answer,
        })),
      });
      const answers = input.data
        .sort((a, b) => {
          return Number(a.questionId) - Number(b.questionId);
        })
        .map((d) => d.answer);
      const scores = calculatePAPIScores(answers);
      const resultDetail: Prisma.PapiKostickResultDetailCreateWithoutResultInput[] =
        Object.entries(scores).map(([key, value]) => {
          const selectedScale = MasterCategoryScale[key as Scale];
          return {
            score: value,
            factor: key,
            aspect: selectedScale.aspect,
            category: selectedScale.category,
            interpretation: papiKostickDescription(key, value),
          };
        });
      const updateStatusInvitation = ctx.db.papiKostickInvitation.update({
        where: { id: input.invitationId },
        data: {
          PapiKostickResult: {
            create: {
              completedAt: new Date(),
              PapiKostickResultDetail: {
                createMany: {
                  data: resultDetail,
                },
              },
            },
          },
          status: "DONE",
        },
      });
      await Promise.all([insertBatchAnswer, updateStatusInvitation]);
    }),
});
