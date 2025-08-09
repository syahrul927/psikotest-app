import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const dashboardRouter = createTRPCRouter({
  // Get dashboard metrics for section cards
  getMetrics: protectedProcedure.query(async ({ ctx }) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Get IST invitation counts
    const istInvitations = await ctx.db.istInvitation.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    // Get Kraepelin invitation counts (simple count without relationships)
    const kraepelinTotal = await ctx.db.invitation.count();

    // Get Kraepelin results with summary status
    const kraepelinResults = await ctx.db.kraepelinResult.findMany({
      select: {
        id: true,
        generated: true,
        invitationId: true,
      },
    });

    // Get Kraepelin result summaries count
    const kraepelinResultSummaries =
      await ctx.db.kraepelinResultSummary.findMany({
        select: {
          kraepelinResultId: true,
        },
      });

    // Calculate metrics
    const istPending =
      istInvitations.find((i) => i.status === "PENDING")?._count.id || 0;
    const istOnProgress =
      istInvitations.find((i) => i.status === "ONPROGRESS")?._count.id || 0;
    const istAwaitingReview =
      istInvitations.find((i) => i.status === "AWAITING_REVIEW")?._count.id ||
      0;
    const istDone =
      istInvitations.find((i) => i.status === "DONE")?._count.id || 0;

    // Kraepelin metrics - using simple field-based logic
    const kraepelinSummaryResultIds = kraepelinResultSummaries.map(
      (s) => s.kraepelinResultId,
    );

    // Calculate awaiting review: results that exist but have no summary and are not generated
    const kraepelinAwaitingReview = kraepelinResults.filter(
      (r) => !kraepelinSummaryResultIds.includes(r.id) && !r.generated,
    ).length;

    const kraepelinCompleted = kraepelinResults.filter(
      (r) => r.generated === true,
    ).length;
    const kraepelinActive = kraepelinTotal - kraepelinCompleted;

    // Get completed tests this month
    const istCompletedThisMonth = await ctx.db.istInvitation.count({
      where: {
        status: "DONE",
        updatedAt: {
          gte: startOfMonth,
        },
      },
    });

    const kraepelinCompletedThisMonth = await ctx.db.kraepelinResult.count({
      where: {
        generated: true,
        // Note: KraepelinResult doesn't have updatedAt, so we'll use a different approach
        // We'll count based on when the result was generated (assuming recent)
      },
    });

    return {
      totalActiveTests: istPending + istOnProgress + kraepelinActive,
      testsAwaitingReview: istAwaitingReview + kraepelinAwaitingReview,
      completedThisMonth: istCompletedThisMonth + kraepelinCompletedThisMonth,
      totalTests:
        istPending +
        istOnProgress +
        istAwaitingReview +
        istDone +
        kraepelinTotal,
      completionRate:
        ((istDone + kraepelinCompleted) /
          (istDone +
            kraepelinCompleted +
            istPending +
            istOnProgress +
            kraepelinActive)) *
        100,
      breakdown: {
        ist: {
          pending: istPending,
          onProgress: istOnProgress,
          awaitingReview: istAwaitingReview,
          done: istDone,
        },
        kraepelin: {
          active: kraepelinActive,
          awaitingReview: kraepelinAwaitingReview,
          completed: kraepelinCompleted,
          total: kraepelinTotal,
        },
      },
    };
  }),

  // Get test completion trends for chart
  getCompletionTrends: protectedProcedure
    .input(
      z.object({
        days: z.number().default(30),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { days } = input;
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - days);
      // Get IST completions by day (when status changed to DONE)
      const istCompletions = await ctx.db.istInvitation.findMany({
        where: {
          status: "DONE",
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          updatedAt: true,
        },
      });

      // For Kraepelin, since we don't have updatedAt on KraepelinResult,
      // we'll use the Invitation's updatedAt when it has results
      const kraepelinInvitationsWithResults = await ctx.db.invitation.findMany({
        where: {
          updatedAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: {
          id: true,
          updatedAt: true,
        },
      });

      // Check which of these invitations have completed results
      const kraepelinResultsByInvitation =
        await ctx.db.kraepelinResult.findMany({
          where: {
            invitationId: {
              in: kraepelinInvitationsWithResults.map((inv) => inv.id),
            },
            generated: true,
          },
          select: {
            invitationId: true,
          },
        });

      const completedKraepelinInvitationIds = kraepelinResultsByInvitation.map(
        (r) => r.invitationId,
      );
      const kraepelinCompletions = kraepelinInvitationsWithResults.filter(
        (inv) => completedKraepelinInvitationIds.includes(inv.id),
      );

      // Group by date
      const dateMap = new Map<string, { ist: number; kraepelin: number }>();

      // Initialize all dates in range
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateKey = d.toISOString().split("T")[0];
        dateMap.set(dateKey!, { ist: 0, kraepelin: 0 });
      }

      // Count IST completions by date
      istCompletions.forEach((completion) => {
        const dateKey = completion.updatedAt.toISOString().split("T")[0];
        if (dateKey && dateMap.has(dateKey)) {
          const current = dateMap.get(dateKey)!;
          dateMap.set(dateKey, { ...current, ist: current.ist + 1 });
        }
      });

      // Count Kraepelin completions by date
      kraepelinCompletions.forEach((completion) => {
        const dateKey = completion.updatedAt.toISOString().split("T")[0];
        if (dateKey && dateMap.has(dateKey)) {
          const current = dateMap.get(dateKey)!;
          dateMap.set(dateKey, {
            ...current,
            kraepelin: current.kraepelin + 1,
          });
        }
      });

      const result = Array.from(dateMap.entries()).map(([date, counts]) => ({
        date,
        ist: counts.ist,
        kraepelin: counts.kraepelin,
        total: counts.ist + counts.kraepelin,
      }));

      return result;
    }),

  // Get recent tests for table
  getRecentTests: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(10),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { limit } = input;

      // Get recent IST invitations
      const recentIstTests = await ctx.db.istInvitation.findMany({
        take: Math.ceil(limit / 2),
        orderBy: { updatedAt: "desc" },
        include: {
          testerProfile: {
            select: {
              name: true,
            },
          },
        },
      });

      // Get recent Kraepelin invitations
      const recentKraepelinTests = await ctx.db.invitation.findMany({
        take: Math.ceil(limit / 2),
        orderBy: { updatedAt: "desc" },
        include: {
          testerProfile: {
            select: {
              name: true,
            },
          },
        },
      });

      // Combine and format
      const combinedTests = [
        ...recentIstTests.map((test) => ({
          id: test.id,
          name: test.name || "Unnamed Test",
          type: "IST" as const,
          status: test.status,
          participantName: test.testerProfile?.name || "-",
          updatedAt: test.updatedAt,
          secretKey: test.secretKey,
        })),
        ...recentKraepelinTests.map((test) => ({
          id: test.id,
          name: test.name || "Unnamed Test",
          type: "KRAEPELIN" as const,
          status: test.startAt ? "STARTED" : "PENDING",
          participantName: test.testerProfile?.name || "-",
          updatedAt: test.updatedAt,
          secretKey: test.secretKey,
        })),
      ];

      // Sort by updatedAt and limit
      return combinedTests
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, limit);
    }),

  // Get status distribution for pie chart
  getStatusDistribution: protectedProcedure.query(async ({ ctx }) => {
    const istInvitations = await ctx.db.istInvitation.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
    });

    const kraepelinResults = await ctx.db.kraepelinResult.findMany({
      select: {
        id: true,
        generated: true,
      },
    });

    const kraepelinResultSummaries =
      await ctx.db.kraepelinResultSummary.findMany({
        select: {
          kraepelinResultId: true,
        },
      });

    const kraepelinTotal = await ctx.db.invitation.count();
    const kraepelinCompleted = kraepelinResults.filter(
      (r) => r.generated === true,
    ).length;
    const kraepelinSummaryResultIds = kraepelinResultSummaries.map(
      (s) => s.kraepelinResultId,
    );
    const kraepelinAwaitingReview = kraepelinResults.filter(
      (r) => !kraepelinSummaryResultIds.includes(r.id) && !r.generated,
    ).length;
    const kraepelinPending =
      kraepelinTotal - kraepelinCompleted - kraepelinAwaitingReview;

    return [
      {
        status: "Pending",
        count:
          (istInvitations.find((i) => i.status === "PENDING")?._count.id || 0) +
          kraepelinPending,
        color: "#f59e0b",
      },
      {
        status: "In Progress",
        count:
          istInvitations.find((i) => i.status === "ONPROGRESS")?._count.id || 0,
        color: "#3b82f6",
      },
      {
        status: "Awaiting Review",
        count:
          (istInvitations.find((i) => i.status === "AWAITING_REVIEW")?._count
            .id || 0) + kraepelinAwaitingReview,
        color: "#f97316",
      },
      {
        status: "Completed",
        count:
          (istInvitations.find((i) => i.status === "DONE")?._count.id || 0) +
          kraepelinCompleted,
        color: "#10b981",
      },
    ];
  }),
});
