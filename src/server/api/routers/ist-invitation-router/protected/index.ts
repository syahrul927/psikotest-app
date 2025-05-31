import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  SaveIstInvitationRouterSchema,
  type ResponseIstInvitationRouterSchema,
} from "./type";
import { z } from "zod";
import { STATUS_INVITATION } from "@/server/data/status-invitation";
import moment from "moment";

export const istInvitationRouter = createTRPCRouter({
  save: protectedProcedure
    .input(SaveIstInvitationRouterSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, secretKey } = input;
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

      await ctx.db.istInvitation.create({
        data: {
          name,
          secretKey,
          createdAt: new Date(),
        },
      });

      return { success: true, message: "Undangan berhasil dibuat." };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const istInvitationRaw = await ctx.db.istInvitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { testerProfile: true },
    });

    const counts = {
      [STATUS_INVITATION.PENDING]: 0,
      [STATUS_INVITATION.ONPROGRESS]: 0,
      [STATUS_INVITATION.DONE]: 0,
    };

    const now = moment();

    const istInvitation: ResponseIstInvitationRouterSchema[] =
      istInvitationRaw.map((invitation) => {
        let status: keyof typeof STATUS_INVITATION = STATUS_INVITATION.PENDING;

        if (invitation.startAt) {
          const duration = moment.duration(
            now.diff(moment(invitation.startAt)),
          );
          const minutes = duration.asMinutes();

          status =
            minutes >= 20
              ? STATUS_INVITATION.DONE
              : STATUS_INVITATION.ONPROGRESS;
        }

        counts[status]++;

        return {
          status,
          ...invitation,
        };
      });

    return {
      invitations: istInvitation,
      pending: counts.PENDING,
      onprogress: counts.ONPROGRESS,
      done: counts.DONE,
      total: istInvitation.length,
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
