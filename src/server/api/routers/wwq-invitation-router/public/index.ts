import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { startInvitationSchema, createProfileSchema } from "../schema";
import { TRPCError } from "@trpc/server";

export const wwqInvitationPublicRouter = createTRPCRouter({
  startInvitation: publicProcedure
    .input(startInvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const { secretKey } = input;

      const invitation = await ctx.db.wwqInvitation.findFirst({
        where: { secretKey, status: "PENDING" },
        select: {
          id: true,
          name: true,
          status: true,
          testerProfileId: true,
          createdAt: true,
          updatedAt: true,
          testerProfile: true,
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan atau sudah dimulai",
        });
      }

      // Update status to ONPROGRESS if first access
      if (invitation.status === "PENDING") {
        await ctx.db.wwqInvitation.update({
          where: { id: invitation.id },
          data: { status: "ONPROGRESS" },
        });
      }

      return {
        invitation: {
          ...invitation,
          status: "ONPROGRESS" as const,
        },
      };
    }),

  getProfile: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: {
          id: invitationId,
        },
        include: {
          testerProfile: true,
        },
      });
      if (!invitation?.testerProfile) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Invitation",
        });
      }
      return { ...invitation.testerProfile };
    }),
  updateProfile: publicProcedure
    .input(createProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const { invitationId, ...profileData } = input;

      // Check if invitation exists and is not already finished
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Invitation",
        });
      }

      if (invitation.status === "DONE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan sudah selesai!",
        });
      }

      // Create or update tester profile
      const testerProfile = await ctx.db.wwqTesterProfile.upsert({
        where: { id: invitation.testerProfileId || "" },
        create: {
          ...profileData,
        },
        update: {
          ...profileData,
        },
        select: { id: true },
      });

      // Link profile to invitation
      const updatedInvitation = await ctx.db.wwqInvitation.update({
        where: { id: invitationId },
        data: { testerProfileId: testerProfile.id, status: "ONPROGRESS" },
        select: {
          id: true,
          name: true,
          status: true,
          testerProfileId: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return { success: true, invitation: updatedInvitation };
    }),
  // Guest entry gate: validates invitation id + secret key and tells the
  // guest UI whether the profile form (step 0) or the test (step 1) comes next
  confirmationSecretKey: publicProcedure
    .input(
      z.object({
        id: z.string(),
        secretKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: input.id },
      });

      if (!invitation || invitation.secretKey !== input.secretKey) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak valid!",
        });
      }
      const step = invitation.testerProfileId ? 1 : 0;
      return {
        step,
      };
    }),

  // Find invitation by secret key
  findWwqInvitation: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.wwqInvitation.findUnique({
        where: { id: invitationId, status: { not: "DONE" } },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan",
        });
      }

      return {
        invitationName: invitation.name,
      };
    }),
});
