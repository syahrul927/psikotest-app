import { calculateWWQScores, WWQ_TOTAL_QUESTIONS } from "@/lib/wwq-utils";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { SubmitAnswerWwqRequest } from "../schema";

export const wwqTestPublicRouter = createTRPCRouter({
  findAllQuestions: publicProcedure.query(async ({ ctx }) => {
    const questions = await ctx.db.wwqQuestion.findMany({
      select: { id: true, order: true, description: true },
      orderBy: { order: "asc" },
    });
    return questions;
  }),

  submitAnswers: publicProcedure
    .input(SubmitAnswerWwqRequest)
    .mutation(async ({ ctx, input }) => {
      if (input.data.length !== WWQ_TOTAL_QUESTIONS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Invalid input: the total number of answers must be ${WWQ_TOTAL_QUESTIONS}`,
        });
      }
      if (
        new Set(input.data.map((d) => d.questionId)).size !==
        WWQ_TOTAL_QUESTIONS
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid input: duplicate or missing question ids",
        });
      }

      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: input.invitationId },
      });
      if (!invitation || invitation.status !== "ONPROGRESS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation is not in progress",
        });
      }

      const questions = await ctx.db.wwqQuestion.findMany({
        select: { id: true, order: true },
      });
      const orderById = new Map(questions.map((q) => [q.id, q.order]));

      const answers = new Map<number, boolean>();
      for (const d of input.data) {
        // client sends DB question ids (cuid); scoring key is by order
        const order = orderById.get(d.questionId);
        if (order === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Unknown question id",
          });
        }
        answers.set(order, d.answer);
      }

      const scores = calculateWWQScores(answers);

      const resultDetails: Prisma.WwqResultDetailCreateWithoutResultInput[] =
        scores.aspects.map((a) => ({
          aspectNo: a.aspectNo,
          aspect: a.aspect,
          rawScore: a.rawScore,
          acuan: a.acuan,
          weighted: a.weighted,
          percent: a.percent,
          category: a.category,
        }));

      await ctx.db.$transaction([
        ctx.db.wwqAnswer.createMany({
          data: input.data.map((i) => ({
            invitationId: input.invitationId,
            questionId: i.questionId,
            answer: i.answer,
          })),
        }),
        ctx.db.wwqInvitation.update({
          where: { id: input.invitationId },
          data: {
            WwqResult: {
              create: {
                totalWeighted: scores.totalWeighted,
                overallValue: scores.overallValue,
                category: scores.category,
                completedAt: new Date(),
                WwqResultDetail: { createMany: { data: resultDetails } },
              },
            },
            status: "DONE",
          },
        }),
      ]);

      return { success: true };
    }),
});
