import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const pubInvitationRouter = createTRPCRouter({
	findInvitation: publicProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			return await ctx.db.invitation.findUnique({
				where: {
					id: input,
					AND: {
						endAt: null,
						startAt: null,
						testerProfileId: null,
					},
				},
			});
		}),
});
