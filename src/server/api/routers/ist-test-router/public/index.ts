import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getImageKeyByValue } from "@/lib/image-map";

export const IstSubtestRouter = createTRPCRouter({
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
      include: {
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
        invitationId: z.string()
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
          subtestTemplateId: input.subtestId
        }
      })

      if(!session) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No subtest template found with the provided ID",
        });
      }

      const result =  {
        ...template,
        questions: template.questions.map((temp) => ({
          ...temp,
          imageUrl: getImageKeyByValue(temp.imageUrl),
        })),
      };

      return {
        ...result,
        questions: session.questionOrder.map((question) => (
          result.questions.find((item) => item.id === question)
        ))
      }
    }),
});
