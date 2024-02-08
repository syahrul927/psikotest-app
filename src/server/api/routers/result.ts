import { type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import _ from "underscore";
import { z } from "zod";
import { plusKraepelin, validateAnswer } from "~/lib/utils";
import { createTRPCRouter, protectedProcedure } from "../trpc";
const FilterRow = [6, 7, 8, 9, 10, 21, 22, 23, 24, 25, 36, 37, 38, 39, 40];
export const resultRouter = createTRPCRouter({
	getResult: protectedProcedure
		.input(z.string())
		.query(async ({ ctx, input }) => {
			const result = await ctx.db.kraepelinResult.findFirst({
				where: {
					invitationId: input,
				},
			});
			if (!result) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: "Invalid invitation",
				});
			}
			if (!result.generated) {
				await generateResult(result.id, ctx.db);
			}
			const informationTester = await ctx.db.invitation.findFirst({
				where: {
					id: input,
				},
				include: {
					testerProfile: true,
				},
			});
			const kraepelinResult = await ctx.db.kraepelinResult.findFirst({
				where: {
					id: result.id,
				},
				include: {
					KraepelinResultDetail: {
						where: {
							xA: {
								in: FilterRow,
							},
						},
						orderBy: [
							{
								xA: "asc",
							},
							{
								yA: "asc",
							},
						],
					},
					KraepelinResultSummary: true,
				},
			});
			return {
				informationTester: informationTester?.testerProfile,
				kraepelinResult,
			};
		}),
});

const generateResult = async (id: string, db: PrismaClient) => {
	const answers = await db.kraepelinResultDetail.findMany({
		where: {
			kraepelinResultId: id,
		},
	});
	const groupedX = _.groupBy(answers, "xA");

	await db.kraepelinResultSummary.createMany({
		data: Object.keys(groupedX).map((key) => {
			return {
				x: Number(key),
				answered: groupedX[key]?.length ?? 0,
				kraepelinResultId: id,
				correct: groupedX[key]?.reduce(
					(prev, aft) =>
						validateAnswer(aft.a, aft.b, aft.value)
							? prev + 1
							: prev,
					0,
				),
				wrong: groupedX[key]?.reduce(
					(prev, aft) =>
						validateAnswer(aft.a, aft.b, aft.value)
							? prev
							: prev + 1,
					0,
				),
			};
		}),
	});

	const highestJanker = Object.keys(groupedX).reduce((prev, aft) => {
		const x = groupedX[aft];
		if (x?.length && prev < x.length) {
			return x.length;
		}
		return prev;
	}, 0);

	const lowestJanker: number =
		Object.keys(groupedX).reduce<number | undefined>((prev, aft) => {
			const x = groupedX[aft];
			if (!prev) return x?.length;
			if (x?.length && prev > x.length) {
				return x.length;
			}
			return prev;
		}, undefined) ?? 0;
	const janker = highestJanker - lowestJanker;
	const panker = answers.length / 40;
	const hanker = (panker + janker) / 2;
	const deciel = (highestJanker + lowestJanker) / 2;
	const totalIncorrect = answers
		.filter((item) => FilterRow.includes(item.xA))
		.reduce(
			(prev, aft) =>
				aft.value !== plusKraepelin(aft.a, aft.b) ? prev + 1 : prev,
			0,
		);
	await db.kraepelinResult.update({
		where: {
			id: id,
		},
		data: {
			generated: true,
			totalAnswered: answers.length,
			tianker: totalIncorrect,
			totalNotAnswered: 2440 - answers.length,
			totalIncorrect,
			lowestJanker,
			highestJanker,
			janker,
			hanker,
			deciel,
		},
	});
};
