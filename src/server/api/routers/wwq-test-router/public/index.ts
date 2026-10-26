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
          message: `Tidak valid: jumlah jawaban harus ${WWQ_TOTAL_QUESTIONS} soal.`,
        });
      }
      if (
        new Set(input.data.map((d) => d.questionId)).size !==
        WWQ_TOTAL_QUESTIONS
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "ID pertanyaan duplikat atau tidak lengkap.",
        });
      }

      // Fast path: reject clearly-finished/unknown invitations before doing
      // any scoring work. The authoritative claim happens inside the
      // transaction below, so a concurrent loser still gets a clean 400.
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: input.invitationId },
        select: { id: true, status: true },
      });
      if (!invitation || invitation.status !== "ONPROGRESS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak sedang berlangsung.",
        });
      }

      const questions = await ctx.db.wwqQuestion.findMany({
        select: { id: true, order: true },
      });
      if (questions.length !== WWQ_TOTAL_QUESTIONS) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "WWQ question seed is invalid",
        });
      }
      const orderById = new Map(questions.map((q) => [q.id, q.order]));

      const answers = new Map<number, boolean>();
      for (const d of input.data) {
        // client sends DB question ids (cuid); scoring key is by order
        const order = orderById.get(d.questionId);
        if (order === undefined) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Pertanyaan tidak dikenal.",
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

      await ctx.db.$transaction(async (tx) => {
        // Atomic claim: only one submission can flip ONPROGRESS -> DONE
        const { count } = await tx.wwqInvitation.updateMany({
          where: { id: input.invitationId, status: "ONPROGRESS" },
          data: { status: "DONE" },
        });
        if (count === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Undangan tidak sedang berlangsung.",
          });
        }

        await tx.wwqAnswer.createMany({
          data: input.data.map((i) => ({
            invitationId: input.invitationId,
            questionId: i.questionId,
            answer: i.answer,
          })),
        });

        await tx.wwqResult.create({
          data: {
            invitation: { connect: { id: input.invitationId } },
            totalWeighted: scores.totalWeighted,
            overallValue: scores.overallValue,
            category: scores.category,
            completedAt: new Date(),
            WwqResultDetail: { createMany: { data: resultDetails } },
          },
        });
      });

      return { success: true };
    }),
});
