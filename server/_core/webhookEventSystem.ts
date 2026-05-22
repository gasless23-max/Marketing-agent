import { db } from "../db";
import { webhooks, InsertWebhook } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Webhook and Event System
 * Provides API-first, event-driven architecture for extensibility
 */

export type EventType =
  | "campaign.created"
  | "campaign.updated"
  | "campaign.started"
  | "campaign.completed"
  | "content.generated"
  | "content.published"
  | "content.failed"
  | "optimization.completed"
  | "optimization.started"
  | "analytics.updated"
  | "trend.detected"
  | "performance.threshold_reached"
  | "custom";

export interface WebhookEvent {
  eventId: string;
  eventType: EventType;
  timestamp: number;
  userId: number;
  campaignId?: number;
  data: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface WebhookConfig {
  url: string;
  events: EventType[];
  headers?: Record<string, string>;
  retryPolicy?: {
    maxRetries: number;
    retryDelayMs: number;
    backoffMultiplier: number;
  };
}

export interface EventFilter {
  eventTypes?: EventType[];
  userId?: number;
  campaignId?: number;
  startTime?: number;
  endTime?: number;
}

export class WebhookEventSystem {
  /**
   * Register a webhook
   */
  static async registerWebhook(
    userId: number,
    eventType: EventType,
    config: WebhookConfig
  ): Promise<InsertWebhook> {
    const webhook: InsertWebhook = {
      userId,
      eventType,
      targetUrl: config.url,
      isActive: 1,
      retryPolicy: JSON.stringify(
        config.retryPolicy || {
          maxRetries: 3,
          retryDelayMs: 1000,
          backoffMultiplier: 2,
        }
      ),
      headers: JSON.stringify(config.headers || {}),
    };

    const result = await db.insert(webhooks).values(webhook);
    return webhook;
  }

  /**
   * Unregister a webhook
   */
  static async unregisterWebhook(webhookId: number): Promise<void> {
    await db
      .update(webhooks)
      .set({ isActive: 0 })
      .where(eq(webhooks.id, webhookId));
  }

  /**
   * Get all webhooks for a user
   */
  static async getUserWebhooks(userId: number): Promise<InsertWebhook[]> {
    return await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.userId, userId));
  }

  /**
   * Get webhooks for specific event type
   */
  static async getWebhooksForEvent(
    eventType: EventType
  ): Promise<InsertWebhook[]> {
    return await db
      .select()
      .from(webhooks)
      .where(eq(webhooks.eventType, eventType));
  }

  /**
   * Emit an event and trigger webhooks
   */
  static async emitEvent(event: WebhookEvent): Promise<void> {
    console.log(`[WebhookEventSystem] Emitting event: ${event.eventType}`);

    // Get all webhooks subscribed to this event
    const webhooksToFire = await this.getWebhooksForEvent(event.eventType);

    for (const webhook of webhooksToFire) {
      this.fireWebhook(webhook, event).catch((err) => {
        console.error(`[WebhookEventSystem] Failed to fire webhook:`, err);
      });
    }
  }

  /**
   * Fire a single webhook with retry logic
   */
  private static async fireWebhook(
    webhook: InsertWebhook,
    event: WebhookEvent,
    attempt: number = 1
  ): Promise<void> {
    if (!webhook.targetUrl || webhook.isActive === 0) {
      return;
    }

    const retryPolicy = webhook.retryPolicy
      ? JSON.parse(webhook.retryPolicy as string)
      : { maxRetries: 3, retryDelayMs: 1000, backoffMultiplier: 2 };

    const headers = webhook.headers
      ? JSON.parse(webhook.headers as string)
      : {};

    try {
      const response = await fetch(webhook.targetUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Event": event.eventType,
          "X-Webhook-Timestamp": event.timestamp.toString(),
          ...headers,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      console.log(
        `[WebhookEventSystem] Webhook fired successfully: ${webhook.targetUrl}`
      );
    } catch (error) {
      if (attempt < retryPolicy.maxRetries) {
        const delay = retryPolicy.retryDelayMs * Math.pow(retryPolicy.backoffMultiplier, attempt - 1);
        console.log(
          `[WebhookEventSystem] Retrying webhook in ${delay}ms (attempt ${attempt + 1}/${retryPolicy.maxRetries})`
        );
        setTimeout(() => {
          this.fireWebhook(webhook, event, attempt + 1);
        }, delay);
      } else {
        console.error(
          `[WebhookEventSystem] Failed to fire webhook after ${retryPolicy.maxRetries} attempts:`,
          error
        );
      }
    }
  }

  /**
   * Subscribe to multiple events
   */
  static async subscribeToMultipleEvents(
    userId: number,
    events: EventType[],
    config: WebhookConfig
  ): Promise<InsertWebhook[]> {
    const webhooks: InsertWebhook[] = [];

    for (const eventType of events) {
      const webhook = await this.registerWebhook(userId, eventType, config);
      webhooks.push(webhook);
    }

    return webhooks;
  }

  /**
   * Emit performance threshold event
   */
  static async emitPerformanceEvent(
    userId: number,
    campaignId: number,
    metric: string,
    value: number,
    threshold: number
  ): Promise<void> {
    if (value >= threshold) {
      const event: WebhookEvent = {
        eventId: `perf_${campaignId}_${Date.now()}`,
        eventType: "performance.threshold_reached",
        timestamp: Date.now(),
        userId,
        campaignId,
        data: {
          metric,
          value,
          threshold,
          exceeded: true,
        },
      };

      await this.emitEvent(event);
    }
  }

  /**
   * Emit trend detected event
   */
  static async emitTrendEvent(
    userId: number,
    campaignId: number,
    trendName: string,
    viralityScore: number
  ): Promise<void> {
    const event: WebhookEvent = {
      eventId: `trend_${campaignId}_${Date.now()}`,
      eventType: "trend.detected",
      timestamp: Date.now(),
      userId,
      campaignId,
      data: {
        trendName,
        viralityScore,
        platforms: ["X", "TikTok", "Instagram"],
        action: "Consider incorporating into campaign",
      },
    };

    await this.emitEvent(event);
  }

  /**
   * Emit optimization completed event
   */
  static async emitOptimizationEvent(
    userId: number,
    campaignId: number,
    improvements: Record<string, number>
  ): Promise<void> {
    const event: WebhookEvent = {
      eventId: `opt_${campaignId}_${Date.now()}`,
      eventType: "optimization.completed",
      timestamp: Date.now(),
      userId,
      campaignId,
      data: {
        improvements,
        totalImprovement: Object.values(improvements).reduce((a, b) => a + b, 0),
        nextOptimizationScheduled: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    };

    await this.emitEvent(event);
  }

  /**
   * Batch emit events
   */
  static async emitBatch(events: WebhookEvent[]): Promise<void> {
    for (const event of events) {
      await this.emitEvent(event);
    }
  }
}
