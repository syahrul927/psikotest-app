import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getImageKeyByValue } from "@/lib/image-map";

export const istSubtestRouter = createTRPCRouter({
  getSubtestSession: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: istInvitationId }) => {
      const session = await ctx.db.istSubtestSession.findMany({
        where: {
          istInvitationId: istInvitationId,
        },
      });
      return session;
    }),
  getAllSubtest: publicProcedure.query(async ({ ctx }) => {
    const template = await ctx.db.istSubtestTemplate.findMany({
      orderBy: {
        id: "asc",
      },
      select: {
        id: true,
        name: true,
        description: true,
        instruction: true,
        videos: true,
        timeLimit: true,
        _count: {
          select: {
            questions: true,
          },
        },
      },
    });
    if (!template) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "No subtests found with the provided ID",
      });
    }

    return template;
  }),
  setStartTime: publicProcedure
    .input(
      z.object({
        isInvitationId: z.string(),
        subtest: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.istSubtestSession.findFirst({
        where: {
          istInvitationId: input.isInvitationId,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No session found for this subtest",
        });
      }

      await ctx.db.istSubtestSession.updateMany({
        where: {
          istInvitationId: input.isInvitationId,
          subtestTemplateId: input.subtest,
        },
        data: {
          startedAt: new Date(),
        },
      });

      return { success: true };
    }),

  //Add invitationId
  //Select subtest session where invitationId === invitationId && subtestTemplateId === subtest
  getIstQuestionTemplateById: publicProcedure
    .input(
      z.object({
        subtestId: z.string(),
        invitationId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const template = await ctx.db.istSubtestTemplate.findUnique({
        where: {
          id: input.subtestId,
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subtest template found with the provided ID",
        });
      }

      const session = await ctx.db.istSubtestSession.findFirst({
        where: {
          istInvitationId: input.invitationId,
          subtestTemplateId: input.subtestId,
        },
      });

      // Check if a result already exists for this invitation and subtest
      const existingResult = await ctx.db.istResult.findFirst({
        where: {
          istInvitationId: input.invitationId,
          subtestTemplateId: input.subtestId,
        },
      });

      let istResultId = existingResult?.id;
      if (!existingResult) {
        const newResult = await ctx.db.istResult.create({
          data: {
            istInvitationId: input.invitationId,
            subtestTemplateId: input.subtestId,
          },
        });
        istResultId = newResult.id;
      }

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subtest template found with the provided ID",
        });
      }

      const result = {
        ...template,
        questions: template.questions.map((temp) => ({
          ...temp,
          imageUrl: getImageKeyByValue(temp.imageUrl),
        })),
      };

      return {
        ...result,
        questions: session.questionOrder
          .map((question) =>
            result.questions.find((item) => item.id === question),
          )
          .filter((question) => question != undefined),
        istResultId,
      };
    }),
  submitIstAnswers: publicProcedure
    .input(
      z.object({
        istResultId: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            answer: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Process answers to map option IDs to labels, if applicable
      const optionIds = input.answers.map((a) => a.answer);
      const options = await ctx.db.istOptionTemplate.findMany({
        where: { id: { in: optionIds } },
        select: { id: true, label: true },
      });
      const optionMap = new Map(options.map((opt) => [opt.id, opt.label]));

      const processedAnswers = input.answers.map((ans) => ({
        questionId: ans.questionId,
        answer: optionMap.get(ans.answer) || ans.answer,
      }));

      // Find existing answers to determine which to update vs. create
      const existingAnswers = await ctx.db.istResultDetail.findMany({
        where: {
          istResultId: input.istResultId,
          questionId: { in: processedAnswers.map((a) => a.questionId) },
        },
        select: { id: true, questionId: true },
      });
      const existingAnswersMap = new Map(
        existingAnswers.map((a) => [a.questionId, a.id]),
      );

      const toCreate: {
        istResultId: string;
        questionId: string;
        answer: string;
      }[] = [];
      const toUpdate: { id: string; answer: string }[] = [];

      for (const ans of processedAnswers) {
        const existingId = existingAnswersMap.get(ans.questionId);
        if (existingId) {
          toUpdate.push({ id: existingId, answer: ans.answer });
        } else {
          toCreate.push({
            istResultId: input.istResultId,
            questionId: ans.questionId,
            answer: ans.answer,
          });
        }
      }

      const updateOperations = toUpdate.map((ans) =>
        ctx.db.istResultDetail.update({
          where: { id: ans.id },
          data: { answer: ans.answer },
        }),
      );

      // Perform DB operations in a transaction for atomicity
      await ctx.db.$transaction([
        ctx.db.istResultDetail.createMany({
          data: toCreate,
        }),
        ...updateOperations,
      ]);

      // Update the answered field in IstResult
      await ctx.db.istResult.update({
        where: { id: input.istResultId },
        data: { answered: input.answers.length },
      });

      // Update submittedAt in istSubtestSession
      // First, get istResult to find istInvitationId and subtestTemplateId
      const istResult = await ctx.db.istResult.findUnique({
        where: { id: input.istResultId },
        select: { istInvitationId: true, subtestTemplateId: true },
      });
      if (istResult) {
        await ctx.db.istSubtestSession.updateMany({
          where: {
            istInvitationId: istResult.istInvitationId,
            subtestTemplateId: istResult.subtestTemplateId,
          },
          data: { submittedAt: new Date() },
        });
      }

      const totalResult = await ctx.db.istResult.count({
        where: {
          istInvitationId: istResult?.istInvitationId,
        },
      });
      if (totalResult === 9) {
        await ctx.db.istInvitation.update({
          where: {
            id: istResult?.istInvitationId,
          },
          data: {
            status: "AWAITING_REVIEW",
          },
        });
      }

      return { success: true, totalResult };
    }),

  checkSubtest9ImageAccess: publicProcedure
    .input(
      z.object({
        istInvitationId: z.string(),
        subtestId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Only check for subtest 9
      if (input.subtestId !== "9") {
        return { viewed: false };
      }

      const session = await ctx.db.istSubtestSession.findFirst({
        where: {
          istInvitationId: input.istInvitationId,
          subtestTemplateId: input.subtestId,
        },
        select: {
          subtest9ImageViewedAt: true,
        },
      });

      return { viewed: session?.subtest9ImageViewedAt !== null };
    }),

  markSubtest9ImageViewed: publicProcedure
    .input(
      z.object({
        istInvitationId: z.string(),
        subtestId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Ensure this is for subtest 9
      if (input.subtestId !== "9") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid subtest ID",
        });
      }

      const session = await ctx.db.istSubtestSession.findFirst({
        where: {
          istInvitationId: input.istInvitationId,
          subtestTemplateId: input.subtestId,
        },
      });

      if (!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Subtest session not found",
        });
      }

      // Check if already viewed (idempotent)
      if (session.subtest9ImageViewedAt) {
        return { success: true, viewed: true, alreadyMarked: true };
      }

      // Mark as viewed
      await ctx.db.istSubtestSession.update({
        where: { id: session.id },
        data: {
          subtest9ImageViewedAt: new Date(),
        },
      });

      return { success: true, viewed: true, alreadyMarked: false };
    }),
});
