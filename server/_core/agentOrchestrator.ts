import { getDb } from "../db";
import {
  campaigns,
  content,
  schedules,
  trends,
  analytics,
  predictions,
  agentMetrics,
  type InsertContent,
  type InsertSchedule,
  type InsertAnalytics,
  type InsertPrediction,
  type InsertTrend,
} from "../../drizzle/schema";
import { eq, and, gte, lte } from "drizzle-orm";

/**
 * AI Marketing Agent Orchestrator
 * Manages the autonomous loop:
 * 1. Plan: Analyze trends and create campaign strategy
 * 2. Create: Generate content based on trends
 * 3. Schedule: Plan publishing across platforms
 * 4. Analyze: Monitor performance metrics
 * 5. Optimize: Adjust strategy based on results
 */

interface CampaignContext {
  campaignId: number;
  userId: number;
  platforms: string[];
  targetAudience?: string;
  goals?: string[];
}

interface ContentGenerationRequest {
  campaignId: number;
  userId: number;
  platforms: string[];
  trendingTopics: string[];
  contentType: "text" | "image" | "video" | "carousel" | "meme";
  count?: number;
}

interface SchedulingStrategy {
  contentId: number;
  campaignId: number;
  platforms: string[];
  timing: "optimal" | "distributed" | "aggressive";
}

/**
 * Step 1: Plan - Analyze trends and create strategy
 */
export async function planCampaignStrategy(
  context: CampaignContext
): Promise<{
  trendingTopics: string[];
  recommendedPlatforms: string[];
  contentStrategy: string[];
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Fetch trending topics
    const trendingData = await db
      .select()
      .from(trends)
      .where(
        context.platforms.length > 0
          ? undefined
          : eq(trends.sentiment, "positive")
      )
      .orderBy((t) => ({ desc: t.momentum }))
      .limit(10);

    const trendingTopics = trendingData.map((t) => t.trendName);
    const platformTrends: Record<string, number> = {};

    // Score platforms by trend relevance
    trendingData.forEach((trend) => {
      if (trend.platform) {
        platformTrends[trend.platform] =
          (platformTrends[trend.platform] || 0) + trend.momentum;
      }
    });

    const recommendedPlatforms = Object.entries(platformTrends)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([platform]) => platform);

    // Generate content strategy recommendations
    const contentStrategy = [
      `Create content around trending topics: ${trendingTopics.slice(0, 3).join(", ")}`,
      `Focus on platforms with highest engagement: ${recommendedPlatforms.join(", ")}`,
      `Mix content types: ${Math.random() > 0.5 ? "videos and memes" : "text posts and images"}`,
      `Leverage positive sentiment topics for maximum engagement`,
      `Post during peak hours for each platform (9 AM - 11 AM, 6 PM - 8 PM EST)`,
    ];

    return {
      trendingTopics,
      recommendedPlatforms,
      contentStrategy,
    };
  } catch (error) {
    console.error("[Agent] Error planning campaign:", error);
    throw error;
  }
}

/**
 * Step 2: Create - Generate content based on trends
 */
export async function generateCampaignContent(
  request: ContentGenerationRequest
): Promise<{ generatedContentIds: number[] }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    const count = request.count || 3;
    const contentIds: number[] = [];

    for (let i = 0; i < count; i++) {
      // Get random trending topic
      const randomTopic =
        request.trendingTopics[
          Math.floor(Math.random() * request.trendingTopics.length)
        ];

      // Generate content prompt based on topic and platforms
      const platforms = request.platforms.join(", ");
      const creativePrompt = `Create viral ${request.contentType} content about "${randomTopic}" for ${platforms} audience. 
Focus on: engagement, shareability, and current trends. 
Target audience: ${request.platforms.includes("TikTok") ? "Gen Z" : "millennial professionals"}.`;

      // Create content record
      const contentData: InsertContent = {
        campaignId: request.campaignId,
        userId: request.userId,
        type: request.contentType,
        title: `${randomTopic} - ${request.contentType.toUpperCase()} #${i + 1}`,
        description: `AI-generated ${request.contentType} content leveraging trending topic: ${randomTopic}`,
        textContent: generateMockContent(randomTopic, request.contentType),
        creativePrompt: creativePrompt,
        aiGenerated: 1,
        hashtags: JSON.stringify(
          generateHashtags(randomTopic, request.platforms)
        ),
      };

      const result = await db.insert(content).values(contentData);
      contentIds.push(result.insertId);

      // Generate predictions for this content
      const prediction = generateContentPrediction(
        result.insertId,
        request.campaignId,
        request.userId,
        randomTopic,
        request.platforms
      );
      await db.insert(predictions).values(prediction);
    }

    return { generatedContentIds: contentIds };
  } catch (error) {
    console.error("[Agent] Error generating content:", error);
    throw error;
  }
}

/**
 * Step 3: Schedule - Distribute content across platforms and time
 */
export async function scheduleContent(
  strategy: SchedulingStrategy
): Promise<{ scheduledCount: number }> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    let scheduledCount = 0;
    const now = new Date();

    for (const platform of strategy.platforms) {
      // Calculate optimal posting time for platform
      const scheduledTime = calculateOptimalPostingTime(
        platform,
        strategy.timing
      );

      // Create schedule
      const scheduleData: InsertSchedule = {
        contentId: strategy.contentId,
        campaignId: strategy.campaignId,
        platform: platform,
        scheduledTime: scheduledTime,
      };

      await db.insert(schedules).values(scheduleData);
      scheduledCount++;
    }

    return { scheduledCount };
  } catch (error) {
    console.error("[Agent] Error scheduling content:", error);
    throw error;
  }
}

/**
 * Step 4: Analyze - Monitor and collect analytics
 */
export async function analyzePerformance(
  campaignId: number,
  userId: number
): Promise<{
  totalViews: number;
  totalEngagement: number;
  avgEngagementRate: number;
  bestPerformingContent: string;
  insights: string[];
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Fetch analytics for campaign
    const campaignAnalytics = await db
      .select()
      .from(analytics)
      .where(
        and(
          eq(analytics.campaignId, campaignId),
          eq(analytics.userId, userId)
        )
      );

    const totalViews = campaignAnalytics.reduce((sum, a) => sum + a.views, 0);
    const totalEngagement = campaignAnalytics.reduce(
      (sum, a) =>
        sum +
        (a.likes + a.comments + a.shares) * 1 +
        (a.conversions || 0) * 10,
      0
    );
    const avgEngagementRate =
      campaignAnalytics.length > 0
        ? campaignAnalytics.reduce((sum, a) => sum + a.engagementRate, 0) /
          campaignAnalytics.length
        : 0;

    // Find best performing content
    const bestContent =
      campaignAnalytics.length > 0
        ? campaignAnalytics.reduce((best, current) =>
            current.likes + current.comments + current.shares >
            best.likes + best.comments + best.shares
              ? current
              : best
          )
        : null;

    // Generate insights
    const insights = [
      totalViews > 10000
        ? "High reach achieved! Continue this content strategy."
        : "Expand reach by optimizing posting times and content mix.",
      avgEngagementRate > 5
        ? "Excellent engagement rate. Your content resonates with audience."
        : "Consider increasing content variety and native platform features.",
      bestContent
        ? "Focus on similar content types and topics as your top performer."
        : "Continue testing different content formats.",
    ];

    return {
      totalViews,
      totalEngagement,
      avgEngagementRate,
      bestPerformingContent: bestContent?.id?.toString() || "N/A",
      insights,
    };
  } catch (error) {
    console.error("[Agent] Error analyzing performance:", error);
    throw error;
  }
}

/**
 * Step 5: Optimize - Adjust strategy based on results
 */
export async function optimizeStrategy(
  campaignId: number,
  userId: number
): Promise<{
  optimizationRun: number;
  recommendations: string[];
  nextActions: string[];
}> {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  try {
    // Get current campaign metrics
    const campaign = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, campaignId))
      .then((rows) => rows[0]);

    if (!campaign) {
      throw new Error("Campaign not found");
    }

    // Analyze performance
    const performance = await analyzePerformance(campaignId, userId);

    // Get agent metrics
    const agentMetric = await db
      .select()
      .from(agentMetrics)
      .where(eq(agentMetrics.userId, userId))
      .then((rows) => rows[0]);

    const optimizationRun = (agentMetric?.optimizationIterations || 0) + 1;

    // Generate recommendations based on performance
    const recommendations: string[] = [];
    const nextActions: string[] = [];

    if (performance.avgEngagementRate > 5) {
      recommendations.push("Increase posting frequency by 50%");
      nextActions.push("Create 2 additional pieces of similar content");
    } else if (performance.avgEngagementRate < 2) {
      recommendations.push("Revise content strategy");
      nextActions.push("Test new content formats and topics");
    }

    if (performance.totalViews > 50000) {
      recommendations.push("Allocate more budget to top-performing platforms");
      nextActions.push("Increase paid promotion on best platforms");
    }

    if (performance.totalEngagement > 5000) {
      recommendations.push("Engage with community through replies and comments");
      nextActions.push("Schedule 2-3 community engagement posts daily");
    }

    // Update agent metrics
    if (agentMetric) {
      await db
        .update(agentMetrics)
        .set({
          optimizationIterations: optimizationRun,
          lastOptimizationRun: new Date(),
          totalReach: (agentMetric.totalReach || 0) + performance.totalViews,
          totalEngagement:
            (agentMetric.totalEngagement || 0) + performance.totalEngagement,
        })
        .where(eq(agentMetrics.userId, userId));
    } else {
      await db.insert(agentMetrics).values({
        userId,
        optimizationIterations: optimizationRun,
        lastOptimizationRun: new Date(),
        totalReach: performance.totalViews,
        totalEngagement: performance.totalEngagement,
      });
    }

    return {
      optimizationRun,
      recommendations,
      nextActions,
    };
  } catch (error) {
    console.error("[Agent] Error optimizing strategy:", error);
    throw error;
  }
}

/**
 * Helper: Generate mock content (simulates AI generation)
 */
function generateMockContent(topic: string, type: string): string {
  const templates: Record<string, string[]> = {
    text: [
      `Just discovered the newest trend in ${topic}! 🚀 Everyone's talking about this. Have you tried it yet?`,
      `${topic} is absolutely taking over right now. The best part? It's totally worth the hype. #Trending`,
      `Can we talk about how amazing ${topic} is? 🔥 Not just me, right?`,
    ],
    image: `[IMAGE: ${topic} visual content]`,
    video: `[VIDEO: Dynamic ${topic} content with trending music]`,
    carousel: `[CAROUSEL: 5-image carousel about ${topic}]`,
    meme: `[MEME: ${topic} humor - relatable format]`,
  };

  const contentList = templates[type] || templates.text;
  return contentList[Math.floor(Math.random() * contentList.length)];
}

/**
 * Helper: Generate relevant hashtags
 */
function generateHashtags(topic: string, platforms: string[]): string[] {
  const baseHashtags = [
    `#${topic.toLowerCase().replace(/\s+/g, "")}`,
    `#${topic.split(" ")[0].toLowerCase()}`,
    "#FYP",
    "#Viral",
    "#Trending",
  ];

  const platformHashtags: Record<string, string[]> = {
    TikTok: ["#FYP", "#FYP", "#ForYouPage", "#Viral"],
    X: ["#Trending", "#Tech", "#News"],
    Instagram: ["#Explore", "#Discover", "#Instagood"],
  };

  const selectedTags = [...baseHashtags];
  platforms.forEach((platform) => {
    if (platformHashtags[platform]) {
      selectedTags.push(...platformHashtags[platform].slice(0, 2));
    }
  });

  return [...new Set(selectedTags)].slice(0, 8);
}

/**
 * Helper: Calculate optimal posting time for platform
 */
function calculateOptimalPostingTime(
  platform: string,
  timing: "optimal" | "distributed" | "aggressive"
): Date {
  const now = new Date();
  const dates: Date[] = [];

  // Different optimal times per platform
  const platformTimes: Record<string, number[]> = {
    X: [9, 18], // 9 AM, 6 PM
    TikTok: [6, 19], // 6 AM, 7 PM
    Instagram: [11, 18], // 11 AM, 6 PM
    Telegram: [9, 20], // 9 AM, 8 PM
    Discord: [14, 21], // 2 PM, 9 PM
  };

  const optimalHours = platformTimes[platform] || [12, 18];

  for (const hour of optimalHours) {
    const date = new Date(now);
    date.setDate(date.getDate() + (timing === "aggressive" ? 0 : 1));
    date.setHours(hour, 0, 0, 0);
    if (date.getTime() > now.getTime()) {
      dates.push(date);
    }
  }

  if (timing === "distributed") {
    // Spread out over multiple days
    dates.push(new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000));
    dates.push(new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000));
  }

  return dates[0] || new Date(now.getTime() + 24 * 60 * 60 * 1000);
}

/**
 * Helper: Generate prediction for content
 */
function generateContentPrediction(
  contentId: number,
  campaignId: number,
  userId: number,
  topic: string,
  platforms: string[]
): InsertPrediction {
  // Simulate prediction based on topic and platform
  const baseScore = Math.floor(Math.random() * 40) + 50; // 50-90

  return {
    contentId,
    campaignId,
    userId,
    predictedReach: Math.floor(Math.random() * 50000) + 10000,
    predictedEngagement: Math.floor(Math.random() * 5000) + 500,
    growthPrediction: Math.floor(Math.random() * 200) + 50,
    viralityScore: baseScore,
    recommendedPlatforms: JSON.stringify(
      platforms.slice(0, Math.floor(platforms.length * 0.8) + 1)
    ),
    confidenceScore: Math.floor(Math.random() * 30) + 70,
  };
}

/**
 * Execute full optimization loop
 */
export async function runFullOptimizationLoop(
  campaignId: number,
  userId: number,
  platforms: string[]
): Promise<any> {
  try {
    console.log(
      `[Agent] Starting optimization loop for campaign ${campaignId}`
    );

    // Step 1: Plan
    const plan = await planCampaignStrategy({
      campaignId,
      userId,
      platforms,
    });

    // Step 2: Generate content
    const content = await generateCampaignContent({
      campaignId,
      userId,
      platforms,
      trendingTopics: plan.trendingTopics,
      contentType: "text",
      count: 2,
    });

    // Step 3: Schedule (first generated content)
    if (content.generatedContentIds.length > 0) {
      await scheduleContent({
        contentId: content.generatedContentIds[0],
        campaignId,
        platforms,
        timing: "optimal",
      });
    }

    // Step 4: Analyze
    const analysis = await analyzePerformance(campaignId, userId);

    // Step 5: Optimize
    const optimization = await optimizeStrategy(campaignId, userId);

    return {
      success: true,
      plan,
      content,
      analysis,
      optimization,
      message: "Optimization loop completed successfully",
    };
  } catch (error) {
    console.error("[Agent] Error running optimization loop:", error);
    throw error;
  }
}
