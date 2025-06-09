import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { getImageKeyByValue } from "@/lib/image-map";

export const IstSubtestRouter = createTRPCRouter({
    getAllSubtest: publicProcedure
        .query(async ({ ctx }) => {
            const template = await ctx.db.istSubtestTemplate.findMany({
                include: {
                    questions: true
                }
            });           
            if (!template) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No subtests found with the provided ID"
                });
            }
            
            return template;
        }),
    setStartTime: publicProcedure
        .input(z.object({
            isInvitationId: z.string(),
            subtest: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            const session = await ctx.db.istSubtestSession.findFirst({
                where: {
                    istInvitationId: input.isInvitationId,
                }
            });

            if (!session) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No session found for this subtest"
                });
            }

            await ctx.db.istSubtestSession.updateMany({
                where: {
                    istInvitationId: input.isInvitationId,
                    subtestTemplateId: input.subtest
                },
                data: {
                    startedAt: new Date()
                }
            });

            return { success: true };
        }),
    getIstQuestionTemplateById: publicProcedure
        .input(z.object({
            subtest: z.string()
        }))
        .query(async ({ ctx, input }) => {
            const template = await ctx.db.istSubtestTemplate.findUnique({
                where: {
                    id: input.subtest
                },
                include: {
                    questions: {
                        include: {
                            options: true
                        }
                    }
                }
            });

            if (!template) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "No subtest template found with the provided ID"
                });
            }

            return {...template, questions: template.questions.map(temp => ({...temp, imageUrl: getImageKeyByValue(temp.imageUrl)}))};
        }),
})