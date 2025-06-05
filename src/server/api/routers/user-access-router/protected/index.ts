import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { comparePassword, hashPassword } from "@/lib/password-utils";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Prisma, User } from "@prisma/client";

const DEFAULT_PASSWORD = "123456789";

export const userAccessRouter = createTRPCRouter({
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
      const { id, name, email, password } = input;

      if (id) {
        const existingUser = await ctx.db.user.findUnique({ where: { id } });

        if (!existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Pengguna tidak ditemukan.",
          });
        }

        const updateData: Prisma.UserUpdateInput = {
          name,
          email,
        };

        if (password) {
          updateData.password = hashPassword(password);
        }

        await ctx.db.user.update({
          where: { id },
          data: updateData,
        });

        return { success: true, message: "Pengguna berhasil diperbarui." };
      }

      const emailInUse = await ctx.db.user.findFirst({ where: { email } });

      if (emailInUse) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Email sudah terdaftar.",
        });
      }

      if (!password || password.length < 6) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Kata sandi tidak valid. Minimal 6 karakter.",
        });
      }

      const newUser = await ctx.db.user.create({
        data: {
          name,
          email,
          password: hashPassword(password),
        },
      });

      const {
        password: _omit,
        emailVerified: _emailVerified,
        ...userWithoutSensitive
      } = newUser;

      return userWithoutSensitive;
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
      const hashPass = hashPassword(DEFAULT_PASSWORD);
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
        const isValidPass = await comparePassword(
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
      const hashPass = hashPassword(input.newPassword);
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
