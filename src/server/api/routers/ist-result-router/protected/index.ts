import { getAge } from "@/lib/date-utils";
import { IstIQ } from "@/lib/ist-utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { IstResult } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

interface DefaultDataSchema {
  rawScore: number;
  standarizedScore: number;
}
interface DefaultScoreSchema {
  top: DefaultDataSchema;
  bottom: DefaultDataSchema;
}
export const istResultRouter = createTRPCRouter({
  initResult: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const answers = await ctx.db.istResult.findMany({
        where: {
          istInvitationId: input,
        },
        include: {
          IstResultDetail: {
            include: {
              question: true,
            },
          },
          IstSubtestTemplate: true,
        },
      });

      // check standarized Score
      const notCalculatedYet = answers.filter((a) => !a.standarizedScore);
      if (notCalculatedYet.length) {
        const invitation = await ctx.db.istInvitation.findUnique({
          where: {
            id: input,
          },
          include: {
            testerProfile: true,
          },
        });
        if (invitation?.testerProfile) {
          const age = getAge(invitation.testerProfile.dateOfBirth);
          const scoreTemplate = await ctx.db.istStandardScore.findMany({
            where: {
              age,
            },
          });
          const queryUpdateResult = answers.map((a) => {
            const { top, bottom }: DefaultScoreSchema = scoreTemplate
              .filter((sc) => sc.subtestTemplateId === a.subtestTemplateId)
              .reduce(
                (result, score, index) => {
                  if (index === 0) {
                    return {
                      top: {
                        rawScore: score.rawScore,
                        standarizedScore: score.standarizedScore,
                      },
                      bottom: {
                        rawScore: score.rawScore,
                        standarizedScore: score.standarizedScore,
                      },
                    };
                  }
                  let top = result.top;
                  let bottom = result.bottom;
                  if (top.rawScore < score.rawScore) {
                    top = {
                      rawScore: score.rawScore,
                      standarizedScore: score.standarizedScore,
                    };
                  }
                  if (bottom.rawScore > score.rawScore) {
                    bottom = {
                      rawScore: score.rawScore,
                      standarizedScore: score.standarizedScore,
                    };
                  }
                  return {
                    top,
                    bottom,
                  };
                },
                {
                  top: {
                    rawScore: 0,
                    standarizedScore: 0,
                  },
                  bottom: {
                    rawScore: 0,
                    standarizedScore: 0,
                  },
                } as DefaultScoreSchema,
              );

            let standarizedScore = scoreTemplate.find(
              (sc) =>
                sc.subtestTemplateId === a.subtestTemplateId &&
                sc.rawScore === a.answeredCorrectly,
            )?.standarizedScore;
            if (!standarizedScore) {
              if (top.rawScore < a.answeredCorrectly!) {
                standarizedScore = top.standarizedScore;
              }
              if (bottom.rawScore > a.answeredCorrectly!) {
                standarizedScore = bottom.standarizedScore;
              }
            }
            return ctx.db.istResult.update({
              where: {
                id: a.id,
              },
              data: {
                standarizedScore,
              },
            });
          });

          const updatedResult = await ctx.db.$transaction(queryUpdateResult);

          const summary = await ctx.db.istResultSummary.findUnique({
            where: {
              istInvitationId: input,
            },
          });
          // if not found then calculate
          if (!summary) {
            const listResult = await ctx.db.istResult.findMany({
              where: {
                istInvitationId: input,
              },
              include: {
                IstSubtestTemplate: true,
              },
            });

            const sumRawScore = listResult.reduce(
              (total, result) => total + (result.answeredCorrectly ?? 0),
              0,
            );

            const mappedResult = updatedResult.reduce(
              (map, result) => {
                return {
                  ...map,
                  [result.subtestTemplateId]: result,
                };
              },
              {} as Record<string, IstResult>,
            );

            // SUM(3;4;6;7)
            const keyThinkingFlexibility = ["3", "4", "6", "7"];
            const thinkingFlexibility =
              keyThinkingFlexibility.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyThinkingFlexibility.length;

            const keyAttentionFlexibility = ["7", "8"];
            const attentionFlexibility =
              keyAttentionFlexibility.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyAttentionFlexibility.length;

            const keyReasoningLogic = ["1", "2", "5"];
            const reasoningLogic =
              keyReasoningLogic.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyReasoningLogic.length;

            const keyMemoryAndConcentration = ["9"];
            const memoryAndConcentration =
              keyMemoryAndConcentration.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyMemoryAndConcentration.length;

            const keyAnalyticalSynthesis = ["2", "3", "4", "7", "8"];
            const analyticalSynthesis =
              keyAnalyticalSynthesis.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyAnalyticalSynthesis.length;

            const keyNumericalAbility = ["5", "6"];
            const numericalAbility =
              keyNumericalAbility.reduce((total, key) => {
                const score = mappedResult[key]?.standarizedScore ?? 0;
                return total + score;
              }, 0) / keyNumericalAbility.length;

            const age = getAge(invitation?.testerProfile?.dateOfBirth);
            const standardIq = await ctx.db.istStandardIqScore.findFirst({
              where: {
                from: { lte: sumRawScore }, // from <= age
                to: { gte: sumRawScore }, // to >= age
                age,
              },
            });
            if (standardIq) {
              const totalIQ = IstIQ(standardIq.standarizedScore);
              await ctx.db.istResultSummary.create({
                data: {
                  istInvitationId: input,
                  sumRawScore,
                  sumStandarizedScore: standardIq.standarizedScore,
                  totalIQ,
                  thinkingFlexibility,
                  attentionFlexibility,
                  reasoningLogic,
                  memoryAndConcentration,
                  analyticalSynthesis,
                  numericalAbility,
                },
              });
            }
          }
        }
      }
      return {
        success: true,
      };
    }),
  getSummaryScoreResult: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const summary = await ctx.db.istResultSummary.findUnique({
        where: {
          istInvitationId: input,
        },
      });
      if (!summary)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid Invitation",
        });
      return summary;
    }),
  getAnswerDetailsResult: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const answers = await ctx.db.istResult.findMany({
        where: {
          istInvitationId: input,
        },
        include: {
          IstResultDetail: {
            include: {
              question: true,
            },
          },
          IstSubtestTemplate: true,
        },
        orderBy: {
          subtestTemplateId: "asc",
        },
      });
      return answers.map((answer) => ({
        id: answer.id,
        subtestTemplateId: answer.subtestTemplateId,
        name: answer.IstSubtestTemplate.name,
        fullName: answer.IstSubtestTemplate.description,
        rawScore: answer.answeredCorrectly,
        standarizedScore: answer.standarizedScore,
        totalAnswered: answer.answered,
        correctAnswers: answer.answeredCorrectly,
        incorrectAnswers: answer.answeredWrong,
        detailAnswers: answer.IstResultDetail.map((res) => ({
          questionNumber: res.question.order,
          participantAnswer: res.answer,
          correctAnswers: res.question.correctAnswer,
          isCorrect: res.isCorrect,
          score: res.score,
        })),
      }));
    }),
});
