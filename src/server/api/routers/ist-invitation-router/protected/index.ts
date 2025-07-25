import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import _ from "underscore";
import { z } from "zod";
import { SaveIstInvitationRouterSchema } from "./type";
import { QuestionMarkIcon } from "@radix-ui/react-icons";

export const istInvitationRouter = createTRPCRouter({
  save: protectedProcedure
    .input(SaveIstInvitationRouterSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, secretKey } = input;
      // if pass id, then edit
      if (id) {
        const existing = await ctx.db.istInvitation.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Undangan tidak valid.",
          });
        }

        await ctx.db.istInvitation.update({
          where: { id },
          data: { name, secretKey },
        });

        return { success: true, message: "Undangan berhasil diperbarui." };
      }

      const istTypes = await ctx.db.istSubtestTemplate.findMany({
        include: {
          questions: true,
        },
      });
      // create invitation
      await ctx.db.istInvitation.create({
        data: {
          name,
          status: "PENDING",
          secretKey,
          createdAt: new Date(),
          IstSubtestSession: {
            createMany: {
              data: istTypes.map((type) => ({
                subtestTemplateId: type.id,
                // questionOrder: _.shuffle(type.questions.map((q) => q.id)),
                questionOrder: _.sortBy(type.questions, "id").map((q) => q.id),
              })),
            },
          },
        },
      });

      return { success: true, message: "Undangan berhasil dibuat." };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const istInvitationRaw = await ctx.db.istInvitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { testerProfile: true },
    });
    const istInvitation = _.groupBy(istInvitationRaw, (item) => item.status);

    return {
      invitations: istInvitationRaw,
      pending: istInvitation.PENDING?.length,
      onprogress: istInvitation.ONPROGRESS?.length,
      done: istInvitation.DONE?.length,
      awaitingreview: istInvitation.AWAITING_REVIEW?.length,
      total: istInvitationRaw.length,
    };
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const istInvitation = await ctx.db.istInvitation.findUnique({
        where: { id: input },
      });

      if (!istInvitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan.",
        });
      }

      return istInvitation;
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.istInvitation.delete({
        where: { id: input },
      });
      return;
    }),
});
