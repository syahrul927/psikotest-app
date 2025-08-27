import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

function compareDates(firstDate: Date, secondDate: Date): boolean {
  const timeDifference: number = Math.abs(
    firstDate.getTime() - secondDate.getTime(),
  );
  const minutesDifference: number = timeDifference / (1000 * 60);
  if (minutesDifference > 20) {
    return false;
  } else {
    return true;
  }
}

export const publicIstInvitationRouter = createTRPCRouter({
  findIstInvitation: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.istInvitation.findUnique({
        where: {
          id: input,
        },
      });
      if (!invitation) {
        throw new Error("Invitation not found");
      }
      return {
        invitationName: invitation?.name,
      };
    }),
  confirmationSecretKey: publicProcedure
    .input(
      z.object({
        id: z.string(),
        secretKey: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, secretKey } = input;
      const invitation = await ctx.db.istInvitation.findFirst({
        where: {
          id,
        },
      });
      if (!invitation || invitation.secretKey !== secretKey) {
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
  profileUpdate: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        dob: z.date(),
        pob: z.string(),
        education: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, phone, address, dob, pob, education } = input;
      const invitation = await ctx.db.istInvitation.findFirst({
        where: {
          id,
        },
      });
      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid invitation status!",
        });
      }
      await ctx.db.istInvitation.update({
        where: { id },
        data: { status: "ONPROGRESS" },
      });
      await ctx.db.istInvitation.update({
        where: {
          id,
        },
        data: {
          testerProfile: {
            create: {
              address,
              phone,
              name,
              dateOfBirth: dob,
              placeOfBirth: pob,
              educationDescription: education,
            },
          },
        },
      });
    }),
  startInvitation: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const invitation = await ctx.db.invitation.findFirst({
        where: {
          id,
        },
      });
      if (!invitation || invitation.startAt !== null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid invitation!",
        });
      }
      const resultId = await ctx.db.kraepelinResult.create({
        data: {
          invitationId: id,
        },
      });
      await ctx.db.invitation.update({
        where: {
          id,
        },
        data: {
          startAt: new Date(),
        },
      });
      return { resultId: resultId.id };
    }),
  getUserDetail: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const istProfile = await ctx.db.istInvitation.findUnique({
        where: { id: input },
        include: {
          testerProfile: true,
        },
      });
      return istProfile;
    }),
});
