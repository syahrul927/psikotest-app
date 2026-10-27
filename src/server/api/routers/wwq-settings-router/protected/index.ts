import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

// WWQ Settings: admins may only reword existing question text. Order,
// count, aspect mapping and scoring keys are fixed — there are deliberately
// no create/delete procedures and `order` is not an input.
export const wwqSettingsRouter = createTRPCRouter({
  getAllQuestions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.wwqQuestion.findMany({
      orderBy: { order: "asc" },
      select: {
        id: true,
        order: true,
        description: true,
        updatedAt: true,
      },
    });
  }),

  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z
          .string()
          .trim()
          .min(1, "Teks soal harus diisi")
          .max(500, "Teks soal maksimal 500 karakter"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.wwqQuestion.findUnique({
        where: { id: input.id },
        select: { id: true },
      });

      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Soal tidak ditemukan.",
        });
      }

      return ctx.db.wwqQuestion.update({
        where: { id: input.id },
        data: { description: input.description },
        select: {
          id: true,
          order: true,
          description: true,
          updatedAt: true,
        },
      });
    }),
});
