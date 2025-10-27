import { pgEnum, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Sales Weekly Tool Database Schema
 * PostgreSQL schema for Supabase
 */

// Enums
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const healthEnum = pgEnum("health", ["green", "yellow", "red"]);
export const categoryEnum = pgEnum("category", ["pipeline", "kpi", "process", "enablement", "deal", "pricing"]);
export const statusEnum = pgEnum("status", ["open", "in_progress", "done"]);
export const impactLevelEnum = pgEnum("impact_level", ["low", "medium", "high"]);
export const playbookUpdateEnum = pgEnum("playbook_update", ["yes", "no"]);

/**
 * Users table - Authentication and user management
 */
export const users = pgTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  username: varchar("username", { length: 100 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

/**
 * Weekly Dashboard table - Track weekly sales metrics
 */
export const weeklyDashboard = pgTable("weekly_dashboard", {
  id: varchar("id", { length: 64 }).primaryKey(),
  week: varchar("week", { length: 20 }).notNull(),
  date: timestamp("date").notNull(),
  pipelineCoverage: varchar("pipeline_coverage", { length: 20 }),
  oppsTotal: varchar("opps_total", { length: 20 }),
  proposals: varchar("proposals", { length: 20 }),
  wins: varchar("wins", { length: 20 }),
  sqlProposalRate: varchar("sql_proposal_rate", { length: 20 }),
  velocity: varchar("velocity", { length: 20 }),
  overallHealth: healthEnum("overall_health").default("green").notNull(),
  oppsToMove: text("opps_to_move"),
  oppsToPush: text("opps_to_push"),
  oppsToClose: text("opps_to_close"),
  movementNotes: text("movement_notes"),
  owner: varchar("owner", { length: 100 }),
  nextSteps: text("next_steps"),
  userId: varchar("user_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Sales Log table - Track observations, causes, and actions
 */
export const salesLog = pgTable("sales_log", {
  id: varchar("id", { length: 64 }).primaryKey(),
  weeklyDashboardId: varchar("weekly_dashboard_id", { length: 64 }).notNull(),
  category: categoryEnum("category").notNull(),
  observation: text("observation").notNull(),
  cause: text("cause"),
  action: text("action"),
  owner: varchar("owner", { length: 100 }),
  dueDate: timestamp("due_date"),
  status: statusEnum("status").default("open").notNull(),
  impactLevel: impactLevelEnum("impact_level").default("medium").notNull(),
  crmDealLink: varchar("crm_deal_link", { length: 500 }),
  userId: varchar("user_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Insights Feed table - Monthly insights and learnings
 */
export const insightsFeed = pgTable("insights_feed", {
  id: varchar("id", { length: 64 }).primaryKey(),
  month: varchar("month", { length: 20 }).notNull(),
  topLearnings: text("top_learnings"),
  topActions: text("top_actions"),
  patterns: text("patterns"),
  playbookUpdateNeeded: playbookUpdateEnum("playbook_update_needed").default("no").notNull(),
  trainingNeed: text("training_need"),
  owner: varchar("owner", { length: 100 }),
  userId: varchar("user_id", { length: 64 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type WeeklyDashboard = typeof weeklyDashboard.$inferSelect;
export type InsertWeeklyDashboard = typeof weeklyDashboard.$inferInsert;

export type SalesLog = typeof salesLog.$inferSelect;
export type InsertSalesLog = typeof salesLog.$inferInsert;

export type InsightsFeed = typeof insightsFeed.$inferSelect;
export type InsertInsightsFeed = typeof insightsFeed.$inferInsert;

