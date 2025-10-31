import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { 
  InsertUser, 
  users, 
  weeklyDashboard, 
  InsertWeeklyDashboard,
  salesLog,
  InsertSalesLog,
  insightsFeed,
  InsertInsightsFeed
} from "../drizzle/schema";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.SUPABASE_DATABASE_URL) {
    try {
      const client = postgres(process.env.SUPABASE_DATABASE_URL);
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ===== User Management =====

export async function createUser(user: InsertUser): Promise<void> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.insert(users).values(user);
}

export async function getUserByUsername(username: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserLastSignIn(id: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ lastSignedIn: new Date() }).where(eq(users.id, id));
}

// ===== Weekly Dashboard =====

export async function createWeeklyDashboard(dashboard: InsertWeeklyDashboard) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(weeklyDashboard).values(dashboard);
}

export async function getWeeklyDashboardsByUserId(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(weeklyDashboard).where(eq(weeklyDashboard.userId, userId));
}

export async function getWeeklyDashboardById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(weeklyDashboard).where(eq(weeklyDashboard.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateWeeklyDashboard(id: string, data: Partial<InsertWeeklyDashboard>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(weeklyDashboard).set({ ...data, updatedAt: new Date() }).where(eq(weeklyDashboard.id, id));
}

export async function deleteWeeklyDashboard(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(weeklyDashboard).where(eq(weeklyDashboard.id, id));
}

// ===== Sales Log =====

export async function createSalesLog(log: InsertSalesLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(salesLog).values(log);
}

export async function getSalesLogsByUserId(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(salesLog).where(eq(salesLog.userId, userId));
}

export async function getSalesLogById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(salesLog).where(eq(salesLog.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSalesLog(id: string, data: Partial<InsertSalesLog>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(salesLog).set({ ...data, updatedAt: new Date() }).where(eq(salesLog.id, id));
}

export async function deleteSalesLog(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(salesLog).where(eq(salesLog.id, id));
}

// ===== Insights Feed =====

export async function createInsightsFeed(insight: InsertInsightsFeed) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(insightsFeed).values(insight);
}

export async function getInsightsFeedByUserId(userId: string) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(insightsFeed).where(eq(insightsFeed.userId, userId));
}

export async function getInsightsFeedById(id: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(insightsFeed).where(eq(insightsFeed.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateInsightsFeed(id: string, data: Partial<InsertInsightsFeed>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(insightsFeed).set({ ...data, updatedAt: new Date() }).where(eq(insightsFeed.id, id));
}

export async function deleteInsightsFeed(id: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(insightsFeed).where(eq(insightsFeed.id, id));
}

