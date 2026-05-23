import { eq, desc } from 'drizzle-orm';
import { getDb } from './db';
import {
  campaigns,
  autonomousTasks,
  webhooks,
  webhookEvents,
  learningModels,
  insights,
  userPreferences,
  type Campaign,
  type InsertCampaign,
  type AutonomousTask,
  type InsertAutonomousTask,
  type Webhook,
  type InsertWebhook,
  type WebhookEvent,
  type InsertWebhookEvent,
  type LearningModel,
  type Insight,
  type InsertInsight,
} from '../drizzle/schema';

// Campaign helpers
export async function createCampaign(data: InsertCampaign): Promise<Campaign | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(campaigns).values(data);
    return (await db.select().from(campaigns).where(eq(campaigns.id, data.id)).limit(1))[0] || null;
  } catch (error) {
    console.error('[DB] Error creating campaign:', error);
    return null;
  }
}

export async function getCampaigns(userId: number): Promise<Campaign[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(campaigns).where(eq(campaigns.userId, userId)).orderBy(desc(campaigns.createdAt));
  } catch (error) {
    console.error('[DB] Error fetching campaigns:', error);
    return [];
  }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(campaigns).where(eq(campaigns.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Error fetching campaign:', error);
    return null;
  }
}

export async function updateCampaign(id: string, data: Partial<Campaign>): Promise<Campaign | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(campaigns).set(data).where(eq(campaigns.id, id));
    return getCampaignById(id);
  } catch (error) {
    console.error('[DB] Error updating campaign:', error);
    return null;
  }
}

// Autonomous Task helpers
export async function createTask(data: InsertAutonomousTask): Promise<AutonomousTask | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(autonomousTasks).values(data);
    return (await db.select().from(autonomousTasks).where(eq(autonomousTasks.id, data.id)).limit(1))[0] || null;
  } catch (error) {
    console.error('[DB] Error creating task:', error);
    return null;
  }
}

export async function getTasks(userId: number): Promise<AutonomousTask[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(autonomousTasks).where(eq(autonomousTasks.userId, userId)).orderBy(desc(autonomousTasks.createdAt));
  } catch (error) {
    console.error('[DB] Error fetching tasks:', error);
    return [];
  }
}

export async function getTaskById(id: string): Promise<AutonomousTask | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(autonomousTasks).where(eq(autonomousTasks.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Error fetching task:', error);
    return null;
  }
}

export async function updateTask(id: string, data: Partial<AutonomousTask>): Promise<AutonomousTask | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(autonomousTasks).set(data).where(eq(autonomousTasks.id, id));
    return getTaskById(id);
  } catch (error) {
    console.error('[DB] Error updating task:', error);
    return null;
  }
}

// Webhook helpers
export async function createWebhook(data: InsertWebhook): Promise<Webhook | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(webhooks).values(data);
    return (await db.select().from(webhooks).where(eq(webhooks.id, data.id)).limit(1))[0] || null;
  } catch (error) {
    console.error('[DB] Error creating webhook:', error);
    return null;
  }
}

export async function getWebhooks(userId: number): Promise<Webhook[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db.select().from(webhooks).where(eq(webhooks.userId, userId)).orderBy(desc(webhooks.createdAt));
  } catch (error) {
    console.error('[DB] Error fetching webhooks:', error);
    return [];
  }
}

export async function getWebhookById(id: string): Promise<Webhook | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.select().from(webhooks).where(eq(webhooks.id, id)).limit(1);
    return result[0] || null;
  } catch (error) {
    console.error('[DB] Error fetching webhook:', error);
    return null;
  }
}

export async function updateWebhook(id: string, data: Partial<Webhook>): Promise<Webhook | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.update(webhooks).set(data).where(eq(webhooks.id, id));
    return getWebhookById(id);
  } catch (error) {
    console.error('[DB] Error updating webhook:', error);
    return null;
  }
}

// Webhook Event helpers
export async function createWebhookEvent(data: InsertWebhookEvent): Promise<WebhookEvent | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(webhookEvents).values(data);
    return (await db.select().from(webhookEvents).where(eq(webhookEvents.id, data.id)).limit(1))[0] || null;
  } catch (error) {
    console.error('[DB] Error creating webhook event:', error);
    return null;
  }
}

export async function getWebhookEvents(webhookId: string, limit: number = 50): Promise<WebhookEvent[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(webhookEvents)
      .where(eq(webhookEvents.webhookId, webhookId))
      .orderBy(desc(webhookEvents.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[DB] Error fetching webhook events:', error);
    return [];
  }
}

// Insights helpers
export async function createInsight(data: InsertInsight): Promise<Insight | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    await db.insert(insights).values(data);
    return (await db.select().from(insights).where(eq(insights.id, data.id)).limit(1))[0] || null;
  } catch (error) {
    console.error('[DB] Error creating insight:', error);
    return null;
  }
}

export async function getInsights(userId: number, limit: number = 50): Promise<Insight[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(insights)
      .where(eq(insights.userId, userId))
      .orderBy(desc(insights.createdAt))
      .limit(limit);
  } catch (error) {
    console.error('[DB] Error fetching insights:', error);
    return [];
  }
}
