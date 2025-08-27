import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  deleteInvitationSchema,
  getInvitationByIdSchema,
  papiKostickInvitationFormSchema,
} from "../schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const papiKostickInvitationProtectedRouter = createTRPCRouter({
  save: protectedProcedure
    .input(papiKostickInvitationFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (id) {
        // Update existing invitation
        const existing = await ctx.db.papiKostickInvitation.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new Error("Invitation not found");
        }

        if (existing.status === "ONPROGRESS") {
          throw new Error(
            "Cannot edit invitation that is currently in progress",
          );
        }

        return await ctx.db.papiKostickInvitation.update({
          where: { id },
          data,
        });
      } else {
        // Create new invitation
        return await ctx.db.papiKostickInvitation.create({
          data: {
            ...data,
            status: "PENDING",
          },
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const invitations = await ctx.db.papiKostickInvitation.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        testerProfile: true,
      },
    });

    return {
      items: invitations,
    };
  }),

  getById: protectedProcedure
    .input(getInvitationByIdSchema)
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: { id: input.id },
        include: {
          testerProfile: true,
        },
      });

      if (!invitation) {
        throw new Error("Invitation not found");
      }

      return invitation;
    }),

  deleteById: protectedProcedure
    .input(deleteInvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }

      if (invitation.status === "ONPROGRESS") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }

      return await ctx.db.papiKostickInvitation.delete({
        where: { id: input.id },
      });
    }),
  getResult: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: {
          id: invitationId,
        },
        include: {
          PapiKostickResult: {
            include: {
              PapiKostickResultDetail: true,
            },
          },
        },
      });
      if (!invitation?.PapiKostickResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }
      const { PapiKostickResultDetail: details } = invitation.PapiKostickResult;
      return details;
    }),
  getDetailAnswers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: { id: invitationId },
        include: {
          PapiKostickAnswer: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }
      return invitation.PapiKostickAnswer;
    }),
});
