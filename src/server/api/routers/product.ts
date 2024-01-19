import { type Product, Status, type Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { generateSlug } from "~/lib/utils";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { AddonSchema, SaveProductRouterSchema } from "../schemas";

export const productRouter = createTRPCRouter({
	save: protectedProcedure
		.input(SaveProductRouterSchema)
		.mutation(async ({ ctx, input }) => {
			const status = input.status.toUpperCase();
			if (Status.ACTIVE !== status && Status.INACTIVE !== status)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "status code invalid",
				});
			const slug = input.slug ?? generateSlug(input.name);
			const data: Omit<
				Product,
				"createdAt" | "updatedAt" | "id" | "addon"
			> & { addon: Prisma.JsonArray } = {
				name: input.name,
				price: input.price,
				description: input.description ?? null,
				slug: slug,
				status: status,
				addon: (input.addon ?? []) as Prisma.JsonArray,
				createdById: ctx.session.user.id,
				images: input.images.map((img) => img.url),
				variants: input.variants?.map((variant) => variant.value) ?? [],
			};
			await ctx.db.product.upsert({
				where: {
					slug,
				},
				update: { ...data },
				create: { ...data },
			});
		}),
	getAllProduct: protectedProcedure.query(async ({ ctx }) => {
		const { id } = ctx.session.user;
		return await ctx.db.product.findMany({
			where: {
				createdById: id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
	}),
	getById: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const { id } = ctx.session.user;
			const product = await ctx.db.product.findUnique({
				where: {
					createdById: id,
					id: input,
				},
			});
			if (!product)
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Product not found",
				});
			const assets = product?.images
				? await ctx.db.assetUser.findMany({
						where: {
							url: {
								in: product.images,
							},
						},
					})
				: [];

			const addons = await AddonSchema.parseAsync(product?.addon);
			return {
				...product,
				images: assets.map((item) => ({
					key: item.key,
					name: item.key,
					url: item.url,
				})),
				addon: addons,
			};
		}),
	deleteById: protectedProcedure
		.input(z.string())
		.mutation(async ({ ctx, input }) => {
			return await ctx.db.product.delete({
				where: {
					id: input,
				},
			});
		}),
});
