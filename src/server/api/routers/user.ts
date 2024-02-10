import { TRPCError } from "@trpc/server";
import { hash, verify } from "argon2";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
const DEFAULT_PASSWORD = "123456789";

export const userRouter = createTRPCRouter({
	save: protectedProcedure
		.input(
			z.object({
				id: z.string().optional(),
				name: z.string().nullable().default(""),
				email: z.string(),
				password: z.string().optional(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			if (input.id) {
				const existUser = await ctx.db.user.findFirst({
					where: {
						id: input.id,
					},
				});
				if (!existUser) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "User doesn't exist",
					});
				}
				await ctx.db.user.update({
					where: {
						id: input.id,
					},
					data: {
						name: input.name,
						email: input.email,
					},
				});
				return;
			}
			const existUser = await ctx.db.user.findFirst({
				where: {
					email: input.email,
				},
			});
			if (existUser) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Username has registered",
				});
			}
			if (!input.password) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Password invalid",
				});
			}
			const hashPass = await hash(input.password);
			const {
				password: _pass,
				emailVerified: _emailVerif,
				...user
			} = await ctx.db.user.create({
				data: {
					name: input.name,
					email: input.email,
					password: hashPass,
				},
			});
			return user;
		}),
	getAllUser: protectedProcedure.query(async ({ ctx }) => {
		return ctx.db.user.findMany({
			select: {
				email: true,
				name: true,
				image: true,
				id: true,
			},
		});
	}),
	getById: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const data = await ctx.db.user.findUnique({
				select: {
					email: true,
					name: true,
					image: true,
					id: true,
				},

				where: {
					id: input,
				},
			});
			if (!data) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found",
				});
			}
			return {
				...data,
			};
		}),
	update: protectedProcedure
		.input(
			z.object({
				email: z.string(),
				name: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findFirst({
				where: {
					email: input.email,
				},
			});
			if (!user) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found ",
				});
			}
			const updatedUser = await ctx.db.user.update({
				data: {
					...user,
					name: input.name,
				},
				where: {
					email: input.email,
				},
			});
			return updatedUser;
		}),
	deleteById: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.user.delete({
				where: {
					id: input,
				},
			});
		}),
	resetPassword: protectedProcedure
		.input(
			z.object({
				email: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findFirst({
				where: {
					email: input.email,
				},
			});
			if (!user) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found ",
				});
			}
			const hashPass = await hash(DEFAULT_PASSWORD);
			await ctx.db.user.update({
				data: {
					password: hashPass,
				},
				where: {
					email: input.email,
				},
			});
		}),
	updatePassword: protectedProcedure
		.input(
			z.object({
				email: z.string(),
				newPassword: z.string(),
				oldPassword: z.string(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const user = await ctx.db.user.findFirst({
				where: {
					email: input.email,
				},
			});
			if (!user) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "User not found ",
				});
			}
			if (user.password) {
				const isValidPass = await verify(
					user.password,
					input.oldPassword,
				);
				if (!isValidPass) {
					throw new TRPCError({
						code: "BAD_REQUEST",
						message: "Wrong Password or Email, Please Try Again",
					});
				}
			}
			const hashPass = await hash(input.newPassword);
			await ctx.db.user.update({
				data: {
					password: hashPass,
				},
				where: {
					email: input.email,
				},
			});
		}),
});
