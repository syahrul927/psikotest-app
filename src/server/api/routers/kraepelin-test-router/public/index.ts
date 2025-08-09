import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const kraepelinTestRouter = createTRPCRouter({
  getTemplate: publicProcedure.query(async ({ ctx }) => {
    const template = await ctx.db.kraepelinTemplate.findMany({
      where: {
        version: "version-0.1",
      },
      orderBy: [
        {
          x: "asc",
        },
        {
          y: "asc",
        },
      ],
    });
    return template;
  }),
  getLatest: publicProcedure
    .input(
      z.object({
        invitationId: z.string(),
        resultId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const latest = await ctx.db.kraepelinResultDetail.findFirst({
        where: {
          kraepelinResultId: input.resultId,
        },
        orderBy: [
          {
            xB: "asc",
          },
          {
            yB: "asc",
          },
        ],
      });
      const invitation = await ctx.db.invitation.findUnique({
        where: {
          id: input.invitationId,
        },
      });
      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak valid",
        });
      }

      return {
        latest: {
          x: latest?.xB,
          y: latest?.yB,
        },
      };
    }),
  submitAnswer: publicProcedure
    .input(
      z.object({
        id: z.string(),
        xA: z.number(),
        yA: z.number(),
        xB: z.number(),
        yB: z.number(),
        a: z.number(),
        b: z.number(),
        value: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { xA, yA, xB, yB, a, b, id, value } = input;
      await ctx.db.kraepelinResultDetail.create({
        data: {
          xA,
          yA,
          xB,
          yB,
          a,
          b,
          kraepelinResultId: id,
          value,
        },
      });
    }),
});
