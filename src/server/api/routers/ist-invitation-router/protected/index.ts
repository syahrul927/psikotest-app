import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import _ from "underscore";
import { z } from "zod";
import { SaveIstInvitationRouterSchema, ResetIstSubtestRouterSchema } from "./type";

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
                questionOrder: _.sortBy(type.questions, "order").map(
                  (q) => q.id,
                ),
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

  // Get subtest status for reset validation
  getSubtestStatus: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: invitationId }) => {
      const invitation = await ctx.db.istInvitation.findUnique({
        where: { id: invitationId },
        include: {
          IstSubtestSession: {
            include: {
              IstSubtestTemplate: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Undangan tidak ditemukan",
        });
      }

      return {
        status: invitation.status,
        subtests: invitation.IstSubtestSession.map((session) => ({
          id: parseInt(session.subtestTemplateId), // Convert string ID to number
          name: session.IstSubtestTemplate?.name || `Subtest ${session.subtestTemplateId}`,
          startedAt: session.startedAt,
          finishedAt: session.submittedAt,
          canReset: session.startedAt !== null && // Only started subtests can be reset
            ["ONPROGRESS", "AWAITING_REVIEW"].includes(invitation.status),
        })),
      };
    }),

  // Reset specific subtest
  resetSubtest: protectedProcedure
    .input(ResetIstSubtestRouterSchema)
    .mutation(async ({ ctx, input }) => {
      const { invitationId, subtestId } = input;
      
      // Step 1: Validate invitation exists and has correct status
      const invitation = await ctx.db.istInvitation.findUnique({
        where: { id: invitationId },
        include: {
          IstSubtestSession: {
            where: { subtestTemplateId: subtestId.toString() }, // Convert number to string
          },
        },
      });

      if (!invitation || !["ONPROGRESS", "AWAITING_REVIEW"].includes(invitation.status)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Hanya undangan dengan status ONPROGRESS atau AWAITING_REVIEW yang dapat direset",
        });
      }

      // Step 2: Check if subtest was started (startedAt not null)
      const subtestSession = invitation.IstSubtestSession[0];
      if (!subtestSession?.startedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST", 
          message: "Subtest belum dimulai, tidak perlu direset",
        });
      }

      // Step 3: Get subtest template info
      const subtestTemplate = await ctx.db.istSubtestTemplate.findUnique({
        where: { id: subtestId.toString() }, // Convert number to string
      });

      // Step 4: Reset subtest: set startedAt and submittedAt to null
      await ctx.db.istSubtestSession.update({
        where: { id: subtestSession.id },
        data: {
          startedAt: null,
          submittedAt: null,
        },
      });

      // Step 5: Delete IstResult records (hard delete)
      await ctx.db.istResult.deleteMany({
        where: {
          istInvitationId: invitationId,
          subtestTemplateId: subtestId.toString(), // Convert number to string
        },
      });

      // Step 6: Update invitation status
      // If invitation was AWAITING_REVIEW, change to ONPROGRESS since subtest is now incomplete
      // If invitation was already ONPROGRESS, keep it as ONPROGRESS
      if (invitation.status === "AWAITING_REVIEW") {
        await ctx.db.istInvitation.update({
          where: { id: invitationId },
          data: { status: "ONPROGRESS" },
        });
      }

      return {
        success: true,
        message: `Subtest ${subtestTemplate?.name} berhasil direset`,
        resetSubtestName: subtestTemplate?.name,
      };
    }),
});
