import { TRPCError } from "@trpc/server";
import { z } from "zod";
import moment from "moment";

import {
  SaveInvitationRouterSchema,
  type ResponseInvitationRouterSchema,
} from "./type";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { PrismaClient } from "@prisma/client";
import _ from "underscore";
import { plusKraepelin, validateAnswer } from "@/lib/kraeplin-utils";

const STATUS = {
  PENDING: "PENDING",
  ONPROGRESS: "ONPROGRESS",
  DONE: "DONE",
} as const;

const FilterRow = [6, 7, 8, 9, 10, 21, 22, 23, 24, 25, 36, 37, 38, 39, 40];
export const kraeplinInvitationRouter = createTRPCRouter({
  save: protectedProcedure
    .input(SaveInvitationRouterSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, name, secretKey } = input;

      if (id) {
        const existing = await ctx.db.invitation.findUnique({ where: { id } });

        if (!existing) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Undangan tidak valid.",
          });
        }

        await ctx.db.invitation.update({
          where: { id },
          data: { name, secretKey },
        });

        return { success: true, message: "Undangan berhasil diperbarui." };
      }

      await ctx.db.invitation.create({
        data: {
          name,
          secretKey,
          createdAt: new Date(),
        },
      });

      return { success: true, message: "Undangan berhasil dibuat." };
    }),

  getAll: protectedProcedure.query(async ({ ctx }) => {
    const invitationsRaw = await ctx.db.invitation.findMany({
      orderBy: { createdAt: "desc" },
      include: { testerProfile: true },
    });

    let counts = {
      [STATUS.PENDING]: 0,
      [STATUS.ONPROGRESS]: 0,
      [STATUS.DONE]: 0,
    };

    const now = moment();

    const invitations: ResponseInvitationRouterSchema[] = invitationsRaw.map(
      (invitation) => {
        let status: keyof typeof STATUS = STATUS.PENDING;

        if (invitation.startAt) {
          const duration = moment.duration(
            now.diff(moment(invitation.startAt)),
          );
          const minutes = duration.asMinutes();

          status = minutes >= 20 ? STATUS.DONE : STATUS.ONPROGRESS;
        }

        counts[status]++;

        return {
          status,
          ...invitation,
        };
      },
    );

    return {
      invitations,
      pending: counts.PENDING,
      onprogress: counts.ONPROGRESS,
      done: counts.DONE,
      total: invitations.length,
    };
  }),

  getById: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan.",
        });
      }

      return invitation;
    }),

  getDetailInvitation: protectedProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.invitation.findUnique({
        where: { id: input },
        include: { testerProfile: true },
      });

      if (!invitation) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Undangan tidak ditemukan.",
        });
      }

      const kraepelinResult = await ctx.db.kraepelinResult.findFirst({
        where: { invitationId: input },
        include: {
          KraepelinResultDetail: true,
          KraepelinResultSummary: true,
        },
      });

      return { invitation, kraepelinResult };
    }),

  deleteById: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.db.invitation.delete({
        where: { id: input },
      });
      return;
    }),

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
      const informationTester = await ctx.db.invitation.findFirst({
        where: {
          id: input,
        },
        include: {
          testerProfile: true,
        },
      });

      const startTime = moment(informationTester?.startAt);
      const now = moment(new Date());
      const diff = moment.duration(now.diff(startTime));
      const minutes = diff.asMinutes();
      if (minutes <= 20) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invitation is not ended yet, please wait until it's done",
        });
      }
      if (!result.generated) {
        await generateResult(result.id, ctx.db);
      }

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
            validateAnswer(aft.a, aft.b, aft.value) ? prev + 1 : prev,
          0,
        ),
        wrong: groupedX[key]?.reduce(
          (prev, aft) =>
            validateAnswer(aft.a, aft.b, aft.value) ? prev : prev + 1,
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
      panker,
      janker,
      hanker,
      deciel,
    },
  });
};
