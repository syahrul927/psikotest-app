import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { startInvitationSchema, createProfileSchema } from "../schema";
import { TRPCError } from "@trpc/server";

export const papiKostickInvitationPublicRouter = createTRPCRouter({
  startInvitation: publicProcedure
    .input(startInvitationSchema)
    .mutation(async ({ ctx, input }) => {
      const { secretKey } = input;

      const invitation = await ctx.db.papiKostickInvitation.findFirst({
        where: { secretKey, status: "PENDING" },
        include: {
          testerProfile: true,
        },
      });

      if (!invitation) {
        throw new Error("Invitation not found or already started");
      }

      // Update status to ONPROGRESS if first access
      if (invitation.status === "PENDING") {
        await ctx.db.papiKostickInvitation.update({
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
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
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

      // Check if invitation exists and is on progress
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Invitation",
        });
      }

      // Create or update tester profile
      const testerProfile = await ctx.db.papiKostickTesterProfile.upsert({
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
      const updatedInvitation = await ctx.db.papiKostickInvitation.update({
        where: { id: invitationId },
        data: { testerProfileId: testerProfile.id, status: "ONPROGRESS" },
      });

      return { success: true, invitation: updatedInvitation };
    }),
  // Check invitation access for testing
  confirmationSecretKey: publicProcedure
    .input(
      z.object({
        id: z.string(),
        secretKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
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
  findPapiKostickInvitation: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.papiKostickInvitation.findUnique({
        where: { id: invitationId },
      });

      if (!invitation) {
        throw new Error("Invitation not found");
      }

      return {
        invitationName: invitation.name,
      };
    }),
});
