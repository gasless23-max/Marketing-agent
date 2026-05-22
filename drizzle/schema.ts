import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Marketing Agent Tables
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "active", "paused", "completed"]).default("draft").notNull(),
  targetAudience: text("targetAudience"),
  goals: text("goals"), // JSON array of campaign goals
  platforms: text("platforms"), // JSON array of platforms (X, TikTok, Instagram, etc)
  budget: int("budget"), // in cents
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["image", "video", "text", "carousel", "meme"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mediaUrl: varchar("mediaUrl", { length: 2048 }),
  textContent: text("textContent"),
  hashtags: text("hashtags"), // JSON array
  mentions: text("mentions"), // JSON array
  aiGenerated: int("aiGenerated").default(0), // boolean: 0 or 1
  creativePrompt: text("creativePrompt"),
  trendingScore: int("trendingScore").default(0),
  engagementScore: int("engagementScore").default(0),
  status: mysqlEnum("status", ["draft", "approved", "scheduled", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

export const schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull(),
  campaignId: int("campaignId").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // X, TikTok, Instagram, etc
  scheduledTime: timestamp("scheduledTime").notNull(),
  published: int("published").default(0), // boolean
  publishedTime: timestamp("publishedTime"),
  status: mysqlEnum("status", ["scheduled", "published", "failed", "cancelled"]).default("scheduled").notNull(),
  postId: varchar("postId", { length: 255 }),
  metrics: text("metrics"), // JSON object of platform-specific metrics
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;

export const trends = mysqlTable("trends", {
  id: int("id").autoincrement().primaryKey(),
  trendName: varchar("trendName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  platform: varchar("platform", { length: 50 }),
  momentum: int("momentum").default(0), // 0-100 score
  volume: int("volume").default(0), // number of mentions
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).default("neutral"),
  description: text("description"),
  relatedHashtags: text("relatedHashtags"), // JSON array
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Trend = typeof trends.$inferSelect;
export type InsertTrend = typeof trends.$inferInsert;

export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  scheduleId: int("scheduleId"),
  userId: int("userId").notNull(),
  platform: varchar("platform", { length: 50 }),
  views: int("views").default(0),
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  clicks: int("clicks").default(0),
  impressions: int("impressions").default(0),
  conversions: int("conversions").default(0),
  conversionValue: int("conversionValue").default(0), // in cents
  engagementRate: int("engagementRate").default(0), // percentage * 100
  sentiment: text("sentiment"), // JSON breakdown of sentiment
  demographics: text("demographics"), // JSON of audience demographics
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  userId: int("userId").notNull(),
  predictedReach: int("predictedReach").default(0),
  predictedEngagement: int("predictedEngagement").default(0),
  growthPrediction: int("growthPrediction").default(0), // percentage
  viralityScore: int("viralityScore").default(0), // 0-100
  bestTimeToPost: timestamp("bestTimeToPost"),
  recommendedPlatforms: text("recommendedPlatforms"), // JSON array
  confidenceScore: int("confidenceScore").default(0), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

export const channelCredentials = mysqlTable("channelCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // X, TikTok, Instagram, Telegram, Discord, etc
  accountName: varchar("accountName", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  accountId: varchar("accountId", { length: 255 }),
  isActive: int("isActive").default(1), // boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChannelCredential = typeof channelCredentials.$inferSelect;
export type InsertChannelCredential = typeof channelCredentials.$inferInsert;

export const agentMetrics = mysqlTable("agentMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignsCreated: int("campaignsCreated").default(0),
  contentGenerated: int("contentGenerated").default(0),
  postsPublished: int("postsPublished").default(0),
  totalReach: int("totalReach").default(0),
  totalEngagement: int("totalEngagement").default(0),
  averageEngagementRate: int("averageEngagementRate").default(0), // percentage * 100
  topPerformingContent: varchar("topPerformingContent", { length: 255 }),
  lastOptimizationRun: timestamp("lastOptimizationRun"),
  optimizationIterations: int("optimizationIterations").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentMetric = typeof agentMetrics.$inferSelect;
export type InsertAgentMetric = typeof agentMetrics.$inferInsert;
