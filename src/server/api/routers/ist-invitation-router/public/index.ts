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
    //   if (invitation?.startAt) {
    //     if (!compareDates(new Date(), invitation.startAt)) {
    //       return undefined;
    //     }
    //   }
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
      let step = 0;
      let resultId = "";
    //   if (invitation.startAt) {
    //     step = 1;
    //     const result = await ctx.db.kraepelinResult.findFirst({
    //       where: {
    //         invitationId: id,
    //       },
    //     });
    //     resultId = result?.id ?? "";
    //   }
      return {
        step,
        resultId,
      };
    }),
  profileUpdate: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        phone: z.string(),
        address: z.string(),
        education: z.string(),
        educationDescription: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, phone, address, education, educationDescription } =
        input;
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
      await ctx.db.invitation.update({
        where: {
          id,
        },
        data: {
          testerProfile: {
            create: {
              address,
              phone,
              name,
              educationId: education,
              educationDescription: educationDescription,
              educationName: "",
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
});
