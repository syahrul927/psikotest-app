import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const istSettingsRouter = createTRPCRouter({
  // Get all subtest templates
  getAllSubtestTemplates: protectedProcedure.query(async ({ ctx }) => {
    const templates = await ctx.db.istSubtestTemplate.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return templates;
  }),

  // Get single subtest template by ID
  getSubtestTemplate: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input: id }) => {
      const template = await ctx.db.istSubtestTemplate.findUnique({
        where: {
          id,
        },
      });

      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template subtest tidak ditemukan.",
        });
      }

      return template;
    }),

  // Update subtest template (description, instruction, and timeLimit)
  updateSubtestTemplate: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        description: z.string().min(1, "Deskripsi harus diisi"),
        instruction: z.string().min(1, "Instruksi harus diisi"),
        timeLimit: z.number().min(1, "Batas waktu minimal 1 menit"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if template exists
      const existingTemplate = await ctx.db.istSubtestTemplate.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!existingTemplate) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template subtest tidak ditemukan.",
        });
      }

      // Update description, instruction, and timeLimit
      const updatedTemplate = await ctx.db.istSubtestTemplate.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
          instruction: input.instruction,
          timeLimit: input.timeLimit,
        },
      });

      return {
        success: true,
        message: "Template subtest berhasil diperbarui.",
        data: updatedTemplate,
      };
    }),

  // Get summary statistics
  getSubtestTemplatesSummary: protectedProcedure.query(async ({ ctx }) => {
    const totalTemplates = await ctx.db.istSubtestTemplate.count();
    
    const lastModified = await ctx.db.istSubtestTemplate.findFirst({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        updatedAt: true,
        name: true,
      },
    });

    return {
      totalTemplates,
      lastModified: lastModified ? {
        date: lastModified.updatedAt,
        templateName: lastModified.name,
      } : null,
    };
  }),
});