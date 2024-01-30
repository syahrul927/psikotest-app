import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const testKrapelinRouter = createTRPCRouter({
	getTemplate: publicProcedure.query(async ({ ctx }) => {
		const template = await ctx.db.kraepelinTemplate.findMany({
			where: {
				version: "version-0.1",
			},
			orderBy: [
				{
					x: "asc",
				},
				{
					y: "asc",
				},
			],
		});
		return template;
	}),
	submitAnswer: publicProcedure
		.input(
			z.object({
				id: z.string(),
				xA: z.number(),
				yA: z.number(),
				xB: z.number(),
				yB: z.number(),
				a: z.number(),
				b: z.number(),
				value: z.number(),
			}),
		)
		.mutation(async ({ ctx, input }) => {
			const { xA, yA, xB, yB, a, b, id, value } = input;
			await ctx.db.kraepelinResultDetail.create({
				data: {
					xA,
					yA,
					xB,
					yB,
					a,
					b,
					kraepelinResultId: id,
					value,
				},
			});
		}),
});
