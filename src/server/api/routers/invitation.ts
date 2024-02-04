import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import {
	type ResponseInvitationRouterSchema,
	SaveInvitationRouterSchema,
} from "../schemas";

export const invitationRouter = createTRPCRouter({
	save: protectedProcedure
		.input(SaveInvitationRouterSchema)
		.mutation(async ({ ctx, input }) => {
			if (input.id) {
				const exist = await ctx.db.invitation.findUnique({
					where: {
						id: input.id,
					},
				});
				if (!exist) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Invalid invitation",
					});
				}
				await ctx.db.invitation.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						secretKey: input.secretKey,
					},
				});
			}
			await ctx.db.invitation.create({
				data: {
					createdAt: new Date(),
					name: input.name,
					secretKey: input.secretKey,
				},
			});
		}),
	getAll: protectedProcedure.query(async ({ ctx }) => {
		const array = await ctx.db.invitation.findMany({
			orderBy: {
				createdAt: "desc",
			},
			include: {
				testerProfile: true,
			},
		});
		let pending = 0;
		let done = 0;
		const invitations: ResponseInvitationRouterSchema[] = array.map(
			(item) => {
				let status = "PENDING";
				if (item.startAt) {
					status = "DONE";
					done++;
				} else {
					pending++;
				}
				return {
					status,
					...item,
				};
			},
		);
		return {
			invitations,
			pending,
			done,
			total: invitations.length,
		};
	}),
	getById: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			if (!input) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: " Invalid invitation",
				});
			}
			const invitation = await ctx.db.invitation.findUnique({
				where: {
					id: input,
				},
			});
			if (!invitation) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: " Invalid invitation",
				});
			}
			return invitation;
		}),
	getDetailInvitation: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const invitation = await ctx.db.invitation.findUnique({
				where: {
					id: input,
				},
				include: {
					testerProfile: true,
				},
			});
			if (!invitation) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid invitation",
				});
			}
			const kraepelinResult = await ctx.db.kraepelinResult.findFirst({
				where: {
					invitationId: input,
				},
				include: {
					KraepelinResultDetail: true,
					KraepelinResultSummary: true,
				},
			});
			return {
				invitation,
				kraepelinResult,
			};
		}),
	deleteById: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.invitation.delete({
				where: {
					id: input,
				},
			});
		}),
});
