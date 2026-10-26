import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  deleteInvitationSchema,
  getInvitationByIdSchema,
  wwqInvitationFormSchema,
} from "../schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const wwqInvitationProtectedRouter = createTRPCRouter({
  save: protectedProcedure
    .input(wwqInvitationFormSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;

      if (id) {
        // Update existing invitation
        const existing = await ctx.db.wwqInvitation.findUnique({
          where: { id },
        });

        if (!existing) {
          throw new Error("Invitation not found");
        }

        if (existing.status !== "PENDING") {
          throw new Error(
            "Cannot edit invitation that is currently in progress or already done",
          );
        }

        return await ctx.db.wwqInvitation.update({
          where: { id },
          data,
        });
      } else {
        // Create new invitation
        return await ctx.db.wwqInvitation.create({
          data: {
            ...data,
            status: "PENDING",
          },
        });
      }
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const invitations = await ctx.db.wwqInvitation.findMany({
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
      const invitation = await ctx.db.wwqInvitation.findUnique({
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
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }

      if (invitation.status !== "PENDING") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Cannot delete an invitation that has been started",
        });
      }

      return await ctx.db.wwqInvitation.delete({
        where: { id: input.id },
      });
    }),
  getResult: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: invitationId },
        include: {
          WwqResult: {
            include: {
              WwqResultDetail: { orderBy: { aspectNo: "asc" } },
            },
          },
        },
      });
      if (!invitation?.WwqResult) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }
      return {
        result: {
          totalWeighted: invitation.WwqResult.totalWeighted,
          overallValue: invitation.WwqResult.overallValue,
          category: invitation.WwqResult.category,
          completedAt: invitation.WwqResult.completedAt,
        },
        details: invitation.WwqResult.WwqResultDetail,
      };
    }),
  getDetailAnswers: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: invitationId },
        include: {
          WwqAnswer: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid InvitationId",
        });
      }
      return invitation.WwqAnswer;
    }),
});
