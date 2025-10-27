import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { authRouter } from "./auth";
import { z } from "zod";
import { nanoid } from "nanoid";
import * as db from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: authRouter,

  // Weekly Dashboard routes
  weeklyDashboard: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getWeeklyDashboardsByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getWeeklyDashboardById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          week: z.string(),
          date: z.date(),
          pipelineCoverage: z.string().optional(),
          oppsTotal: z.string().optional(),
          proposals: z.string().optional(),
          wins: z.string().optional(),
          sqlProposalRate: z.string().optional(),
          velocity: z.string().optional(),
          overallHealth: z.enum(["green", "yellow", "red"]).default("green"),
          oppsToMove: z.string().optional(),
          oppsToPush: z.string().optional(),
          oppsToClose: z.string().optional(),
          movementNotes: z.string().optional(),
          owner: z.string().optional(),
          nextSteps: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = nanoid();
        await db.createWeeklyDashboard({
          id,
          ...input,
          userId: ctx.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true, id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          week: z.string().optional(),
          date: z.date().optional(),
          pipelineCoverage: z.string().optional(),
          oppsTotal: z.string().optional(),
          proposals: z.string().optional(),
          wins: z.string().optional(),
          sqlProposalRate: z.string().optional(),
          velocity: z.string().optional(),
          overallHealth: z.enum(["green", "yellow", "red"]).optional(),
          oppsToMove: z.string().optional(),
          oppsToPush: z.string().optional(),
          oppsToClose: z.string().optional(),
          movementNotes: z.string().optional(),
          owner: z.string().optional(),
          nextSteps: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateWeeklyDashboard(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteWeeklyDashboard(input.id);
        return { success: true };
      }),
  }),

  // Sales Log routes
  salesLog: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getSalesLogsByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getSalesLogById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          weeklyDashboardId: z.string(),
          category: z.enum(["pipeline", "kpi", "process", "enablement", "deal", "pricing"]),
          observation: z.string(),
          cause: z.string().optional(),
          action: z.string().optional(),
          owner: z.string().optional(),
          dueDate: z.date().optional(),
          status: z.enum(["open", "in_progress", "done"]).default("open"),
          impactLevel: z.enum(["low", "medium", "high"]).default("medium"),
          crmDealLink: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = nanoid();
        await db.createSalesLog({
          id,
          ...input,
          userId: ctx.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true, id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          category: z.enum(["pipeline", "kpi", "process", "enablement", "deal", "pricing"]).optional(),
          observation: z.string().optional(),
          cause: z.string().optional(),
          action: z.string().optional(),
          owner: z.string().optional(),
          dueDate: z.date().optional(),
          status: z.enum(["open", "in_progress", "done"]).optional(),
          impactLevel: z.enum(["low", "medium", "high"]).optional(),
          crmDealLink: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateSalesLog(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteSalesLog(input.id);
        return { success: true };
      }),
  }),

  // Insights Feed routes
  insightsFeed: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getInsightsFeedByUserId(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getInsightsFeedById(input.id);
      }),

    create: protectedProcedure
      .input(
        z.object({
          month: z.string(),
          topLearnings: z.string().optional(),
          topActions: z.string().optional(),
          patterns: z.string().optional(),
          playbookUpdateNeeded: z.enum(["yes", "no"]).default("no"),
          trainingNeed: z.string().optional(),
          owner: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const id = nanoid();
        await db.createInsightsFeed({
          id,
          ...input,
          userId: ctx.user.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        return { success: true, id };
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.string(),
          month: z.string().optional(),
          topLearnings: z.string().optional(),
          topActions: z.string().optional(),
          patterns: z.string().optional(),
          playbookUpdateNeeded: z.enum(["yes", "no"]).optional(),
          trainingNeed: z.string().optional(),
          owner: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await db.updateInsightsFeed(id, data);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteInsightsFeed(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;

