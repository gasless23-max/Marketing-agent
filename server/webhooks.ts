import { Express } from 'express';
import { Server as SocketIOServer } from 'socket.io';
import { nanoid } from 'nanoid';
import crypto from 'crypto';

export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
  secret: string;
  createdAt: number;
  lastTriggered?: number;
  failureCount: number;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  payload: any;
  timestamp: number;
  status: 'pending' | 'success' | 'failed';
  attempts: number;
  nextRetry?: number;
}

export class WebhookManager {
  private webhooks: Map<string, Webhook> = new Map();
  private events: Map<string, WebhookEvent> = new Map();
  private io: SocketIOServer;
  private retryIntervals = [60000, 300000, 900000]; // 1min, 5min, 15min

  constructor(io: SocketIOServer) {
    this.io = io;
  }

  // Register a new webhook
  registerWebhook(name: string, url: string, events: string[]): Webhook {
    const webhook: Webhook = {
      id: nanoid(),
      name,
      url,
      events,
      active: true,
      secret: crypto.randomBytes(32).toString('hex'),
      createdAt: Date.now(),
      failureCount: 0,
    };

    this.webhooks.set(webhook.id, webhook);
    console.log(`[Webhook] Registered webhook: ${name} (${webhook.id})`);
    return webhook;
  }

  // Trigger a webhook event
  async triggerEvent(eventType: string, payload: any): Promise<void> {
    const matchingWebhooks = Array.from(this.webhooks.values()).filter(
      (w) => w.active && w.events.includes(eventType)
    );

    for (const webhook of matchingWebhooks) {
      const event: WebhookEvent = {
        id: nanoid(),
        webhookId: webhook.id,
        event: eventType,
        payload,
        timestamp: Date.now(),
        status: 'pending',
        attempts: 0,
      };

      this.events.set(event.id, event);
      await this.deliverWebhook(webhook, event);
    }
  }

  // Deliver webhook with retry logic
  private async deliverWebhook(webhook: Webhook, event: WebhookEvent): Promise<void> {
    try {
      event.attempts++;
      const signature = this.generateSignature(event.payload, webhook.secret);

      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-ID': event.id,
          'X-Webhook-Signature': signature,
          'X-Webhook-Timestamp': event.timestamp.toString(),
        },
        body: JSON.stringify(event.payload),
      });

      if (response.ok) {
        event.status = 'success';
        webhook.lastTriggered = Date.now();
        webhook.failureCount = 0;
        console.log(`[Webhook] Successfully delivered event ${event.id} to ${webhook.name}`);
      } else {
        throw new Error(`HTTP ${response.status}`);
      }
    } catch (error) {
      event.status = 'failed';
      webhook.failureCount++;

      if (event.attempts < this.retryIntervals.length) {
        event.nextRetry = Date.now() + this.retryIntervals[event.attempts - 1];
        console.log(`[Webhook] Retry scheduled for event ${event.id} at ${new Date(event.nextRetry).toISOString()}`);
      } else {
        console.error(`[Webhook] Failed to deliver event ${event.id} after ${event.attempts} attempts:`, error);
      }
    }

    this.events.set(event.id, event);
    this.io.to('webhooks').emit('webhook:event', event);
  }

  // Generate HMAC signature
  private generateSignature(payload: any, secret: string): string {
    const message = JSON.stringify(payload);
    return crypto.createHmac('sha256', secret).update(message).digest('hex');
  }

  // Get webhook by ID
  getWebhook(id: string): Webhook | undefined {
    return this.webhooks.get(id);
  }

  // List all webhooks
  listWebhooks(): Webhook[] {
    return Array.from(this.webhooks.values());
  }

  // Update webhook
  updateWebhook(id: string, updates: Partial<Webhook>): Webhook | undefined {
    const webhook = this.webhooks.get(id);
    if (webhook) {
      const updated = { ...webhook, ...updates };
      this.webhooks.set(id, updated);
      return updated;
    }
    return undefined;
  }

  // Delete webhook
  deleteWebhook(id: string): boolean {
    return this.webhooks.delete(id);
  }

  // Get webhook events
  getWebhookEvents(webhookId?: string): WebhookEvent[] {
    if (webhookId) {
      return Array.from(this.events.values()).filter((e) => e.webhookId === webhookId);
    }
    return Array.from(this.events.values());
  }

  // Retry failed events
  async retryFailedEvents(): Promise<void> {
    const now = Date.now();
    const failedEvents = Array.from(this.events.values()).filter(
      (e) => e.status === 'failed' && e.nextRetry && e.nextRetry <= now
    );

    for (const event of failedEvents) {
      const webhook = this.webhooks.get(event.webhookId);
      if (webhook) {
        await this.deliverWebhook(webhook, event);
      }
    }
  }
}

// Initialize webhook system
export function initializeWebhookSystem(app: Express, io: SocketIOServer): WebhookManager {
  const webhookManager = new WebhookManager(io);

  // Webhook management routes
  app.post('/api/webhooks', (req, res) => {
    const { name, url, events } = req.body;
    if (!name || !url || !events) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const webhook = webhookManager.registerWebhook(name, url, events);
    res.json(webhook);
  });

  app.get('/api/webhooks', (req, res) => {
    res.json(webhookManager.listWebhooks());
  });

  app.get('/api/webhooks/:id', (req, res) => {
    const webhook = webhookManager.getWebhook(req.params.id);
    if (!webhook) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.json(webhook);
  });

  app.put('/api/webhooks/:id', (req, res) => {
    const updated = webhookManager.updateWebhook(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.json(updated);
  });

  app.delete('/api/webhooks/:id', (req, res) => {
    const deleted = webhookManager.deleteWebhook(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.json({ success: true });
  });

  app.get('/api/webhooks/:id/events', (req, res) => {
    const events = webhookManager.getWebhookEvents(req.params.id);
    res.json(events);
  });

  // Retry failed webhook events every minute
  setInterval(() => {
    webhookManager.retryFailedEvents().catch(console.error);
  }, 60000);

  // Subscribe to webhook events via WebSocket
  io.on('connection', (socket) => {
    socket.on('subscribe:webhooks', () => {
      socket.join('webhooks');
    });
  });

  return webhookManager;
}
