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
});
