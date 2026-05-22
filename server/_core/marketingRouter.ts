import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  campaigns,
  content,
  schedules,
  trends,
  analytics,
  predictions,
  channelCredentials,
  agentMetrics,
  type InsertCampaign,
  type InsertContent,
  type InsertSchedule,
  type InsertAnalytics,
  type InsertPrediction,
} from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, router } from "./trpc";
import { getDb } from "../db";

// Campaign Router
export const campaignRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return db.select().from(campaigns).where(eq(campaigns.userId, ctx.user.id));
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        targetAudience: z.string().optional(),
        goals: z.array(z.string()).optional(),
        platforms: z.array(z.string()).default([]),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data: InsertCampaign = {
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        targetAudience: input.targetAudience,
        goals: input.goals ? JSON.stringify(input.goals) : null,
        platforms: JSON.stringify(input.platforms),
        budget: input.budget,
        startDate: input.startDate,
        endDate: input.endDate,
      };

      const result = await db.insert(campaigns).values(data);
      return { success: true, id: result.insertId };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const campaign = await db
        .select()
        .from(campaigns)
        .where(
          and(
            eq(campaigns.id, input.id),
            eq(campaigns.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);

      if (!campaign) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Campaign not found",
        });
      }

      return campaign;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "active", "paused", "completed"]).optional(),
        targetAudience: z.string().optional(),
        goals: z.array(z.string()).optional(),
        platforms: z.array(z.string()).optional(),
        budget: z.number().optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { id, ...updateData } = input;
      const updateObj: any = {};

      if (updateData.name !== undefined) updateObj.name = updateData.name;
      if (updateData.description !== undefined) updateObj.description = updateData.description;
      if (updateData.status !== undefined) updateObj.status = updateData.status;
      if (updateData.targetAudience !== undefined) updateObj.targetAudience = updateData.targetAudience;
      if (updateData.goals !== undefined) updateObj.goals = JSON.stringify(updateData.goals);
      if (updateData.platforms !== undefined) updateObj.platforms = JSON.stringify(updateData.platforms);
      if (updateData.budget !== undefined) updateObj.budget = updateData.budget;
      if (updateData.startDate !== undefined) updateObj.startDate = updateData.startDate;
      if (updateData.endDate !== undefined) updateObj.endDate = updateData.endDate;

      await db
        .update(campaigns)
        .set(updateObj)
        .where(
          and(
            eq(campaigns.id, id),
            eq(campaigns.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .delete(campaigns)
        .where(
          and(
            eq(campaigns.id, input.id),
            eq(campaigns.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});

// Content Router
export const contentRouter = router({
  list: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      return db
        .select()
        .from(content)
        .where(
          and(
            eq(content.campaignId, input.campaignId),
            eq(content.userId, ctx.user.id)
          )
        );
    }),

  create: protectedProcedure
    .input(
      z.object({
        campaignId: z.number(),
        type: z.enum(["image", "video", "text", "carousel", "meme"]),
        title: z.string().min(1),
        description: z.string().optional(),
        mediaUrl: z.string().optional(),
        textContent: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        mentions: z.array(z.string()).optional(),
        creativePrompt: z.string().optional(),
        aiGenerated: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data: InsertContent = {
        campaignId: input.campaignId,
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        description: input.description,
        mediaUrl: input.mediaUrl,
        textContent: input.textContent,
        hashtags: input.hashtags ? JSON.stringify(input.hashtags) : null,
        mentions: input.mentions ? JSON.stringify(input.mentions) : null,
        creativePrompt: input.creativePrompt,
        aiGenerated: input.aiGenerated ? 1 : 0,
      };

      const result = await db.insert(content).values(data);
      return { success: true, id: result.insertId };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const item = await db
        .select()
        .from(content)
        .where(
          and(
            eq(content.id, input.id),
            eq(content.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);

      if (!item) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Content not found",
        });
      }

      return item;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["draft", "approved", "scheduled", "published", "archived"]).optional(),
        textContent: z.string().optional(),
        hashtags: z.array(z.string()).optional(),
        trendingScore: z.number().optional(),
        engagementScore: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { id, ...updateData } = input;
      const updateObj: any = {};

      if (updateData.title !== undefined) updateObj.title = updateData.title;
      if (updateData.description !== undefined) updateObj.description = updateData.description;
      if (updateData.status !== undefined) updateObj.status = updateData.status;
      if (updateData.textContent !== undefined) updateObj.textContent = updateData.textContent;
      if (updateData.hashtags !== undefined) updateObj.hashtags = JSON.stringify(updateData.hashtags);
      if (updateData.trendingScore !== undefined) updateObj.trendingScore = updateData.trendingScore;
      if (updateData.engagementScore !== undefined) updateObj.engagementScore = updateData.engagementScore;

      await db
        .update(content)
        .set(updateObj)
        .where(
          and(
            eq(content.id, id),
            eq(content.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .delete(content)
        .where(
          and(
            eq(content.id, input.id),
            eq(content.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});

// Scheduling Router
export const schedulingRouter = router({
  list: protectedProcedure
    .input(z.object({ campaignId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      return db
        .select()
        .from(schedules)
        .where(eq(schedules.campaignId, input.campaignId));
    }),

  create: protectedProcedure
    .input(
      z.object({
        contentId: z.number(),
        campaignId: z.number(),
        platform: z.string(),
        scheduledTime: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data: InsertSchedule = {
        contentId: input.contentId,
        campaignId: input.campaignId,
        platform: input.platform,
        scheduledTime: input.scheduledTime,
      };

      const result = await db.insert(schedules).values(data);
      return { success: true, id: result.insertId };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        scheduledTime: z.date().optional(),
        status: z.enum(["scheduled", "published", "failed", "cancelled"]).optional(),
        metrics: z.any().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { id, ...updateData } = input;
      const updateObj: any = {};

      if (updateData.scheduledTime !== undefined) updateObj.scheduledTime = updateData.scheduledTime;
      if (updateData.status !== undefined) updateObj.status = updateData.status;
      if (updateData.metrics !== undefined) updateObj.metrics = JSON.stringify(updateData.metrics);

      await db.update(schedules).set(updateObj).where(eq(schedules.id, id));

      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db.delete(schedules).where(eq(schedules.id, input.id));

      return { success: true };
    }),
});

// Analytics Router
export const analyticsRouter = router({
  list: protectedProcedure
    .input(z.object({ campaignId: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      if (input.campaignId) {
        return db
          .select()
          .from(analytics)
          .where(
            and(
              eq(analytics.campaignId, input.campaignId),
              eq(analytics.userId, ctx.user.id)
            )
          );
      }

      return db
        .select()
        .from(analytics)
        .where(eq(analytics.userId, ctx.user.id));
    }),

  record: protectedProcedure
    .input(
      z.object({
        campaignId: z.number().optional(),
        contentId: z.number().optional(),
        scheduleId: z.number().optional(),
        platform: z.string().optional(),
        views: z.number().optional(),
        likes: z.number().optional(),
        comments: z.number().optional(),
        shares: z.number().optional(),
        clicks: z.number().optional(),
        impressions: z.number().optional(),
        conversions: z.number().optional(),
        conversionValue: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data: InsertAnalytics = {
        campaignId: input.campaignId,
        contentId: input.contentId,
        scheduleId: input.scheduleId,
        userId: ctx.user.id,
        platform: input.platform,
        views: input.views,
        likes: input.likes,
        comments: input.comments,
        shares: input.shares,
        clicks: input.clicks,
        impressions: input.impressions,
        conversions: input.conversions,
        conversionValue: input.conversionValue,
      };

      const result = await db.insert(analytics).values(data);
      return { success: true, id: result.insertId };
    }),
});

// Trends Router
export const trendsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return db
      .select()
      .from(trends)
      .orderBy((t) => t.momentum);
  }),

  getByPlatform: protectedProcedure
    .input(z.object({ platform: z.string() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      return db
        .select()
        .from(trends)
        .where(eq(trends.platform, input.platform));
    }),
});

// Predictions Router
export const predictionsRouter = router({
  get: protectedProcedure
    .input(z.object({ contentId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      return db
        .select()
        .from(predictions)
        .where(
          and(
            eq(predictions.contentId, input.contentId),
            eq(predictions.userId, ctx.user.id)
          )
        )
        .then((rows) => rows[0]);
    }),

  create: protectedProcedure
    .input(
      z.object({
        campaignId: z.number().optional(),
        contentId: z.number().optional(),
        predictedReach: z.number(),
        predictedEngagement: z.number(),
        growthPrediction: z.number(),
        viralityScore: z.number(),
        bestTimeToPost: z.date().optional(),
        recommendedPlatforms: z.array(z.string()).optional(),
        confidenceScore: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data: InsertPrediction = {
        campaignId: input.campaignId,
        contentId: input.contentId,
        userId: ctx.user.id,
        predictedReach: input.predictedReach,
        predictedEngagement: input.predictedEngagement,
        growthPrediction: input.growthPrediction,
        viralityScore: input.viralityScore,
        bestTimeToPost: input.bestTimeToPost,
        recommendedPlatforms: input.recommendedPlatforms ? JSON.stringify(input.recommendedPlatforms) : null,
        confidenceScore: input.confidenceScore,
      };

      const result = await db.insert(predictions).values(data);
      return { success: true, id: result.insertId };
    }),
});

// Channel Credentials Router
export const channelRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return db
      .select()
      .from(channelCredentials)
      .where(eq(channelCredentials.userId, ctx.user.id));
  }),

  create: protectedProcedure
    .input(
      z.object({
        platform: z.string(),
        accountName: z.string(),
        accountId: z.string().optional(),
        accessToken: z.string().optional(),
        refreshToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const data = {
        userId: ctx.user.id,
        platform: input.platform,
        accountName: input.accountName,
        accountId: input.accountId,
        accessToken: input.accessToken,
        refreshToken: input.refreshToken,
      };

      const result = await db.insert(channelCredentials).values(data);
      return { success: true, id: result.insertId };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .delete(channelCredentials)
        .where(
          and(
            eq(channelCredentials.id, input.id),
            eq(channelCredentials.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});

// Agent Metrics Router
export const agentMetricsRouter = router({
  get: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    return db
      .select()
      .from(agentMetrics)
      .where(eq(agentMetrics.userId, ctx.user.id))
      .then((rows) => rows[0] || null);
  }),

  update: protectedProcedure
    .input(
      z.object({
        campaignsCreated: z.number().optional(),
        contentGenerated: z.number().optional(),
        postsPublished: z.number().optional(),
        totalReach: z.number().optional(),
        totalEngagement: z.number().optional(),
        averageEngagementRate: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const existing = await db
        .select()
        .from(agentMetrics)
        .where(eq(agentMetrics.userId, ctx.user.id))
        .then((rows) => rows[0]);

      if (existing) {
        await db
          .update(agentMetrics)
          .set(input)
          .where(eq(agentMetrics.userId, ctx.user.id));
      } else {
        await db.insert(agentMetrics).values({
          userId: ctx.user.id,
          ...input,
        });
      }

      return { success: true };
    }),
});

// Marketing Router - Main Entry Point
export const marketingRouter = router({
  campaigns: campaignRouter,
  content: contentRouter,
  scheduling: schedulingRouter,
  analytics: analyticsRouter,
  trends: trendsRouter,
  predictions: predictionsRouter,
  channels: channelRouter,
  metrics: agentMetricsRouter,
});
