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
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Undangan tidak ditemukan",
          });
        }

        // Atomic guard: only PENDING invitations can be edited
        const { count } = await ctx.db.wwqInvitation.updateMany({
          where: { id, status: "PENDING" },
          data,
        });

        if (count === 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Undangan tidak dapat diedit setelah tes dimulai.",
          });
        }

        return await ctx.db.wwqInvitation.findUniqueOrThrow({
          where: { id },
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
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan",
        });
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
          message: "Undangan tidak ditemukan",
        });
      }

      // Atomic guard: only PENDING invitations can be deleted
      const { count } = await ctx.db.wwqInvitation.deleteMany({
        where: { id: input.id, status: "PENDING" },
      });

      if (count === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak dapat dihapus setelah tes dimulai.",
        });
      }

      return invitation;
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
          message: "Hasil tes belum tersedia.",
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
          message: "Undangan tidak ditemukan",
        });
      }
      return invitation.WwqAnswer;
    }),
});
