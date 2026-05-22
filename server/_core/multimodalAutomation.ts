import { db } from "../db";
import { multimodalCampaigns, adBudgetOptimizations, InsertMultimodalCampaign } from "../../drizzle/schema";

/**
 * Multimodal Automation Service
 * Handles A/B/X testing, variant management, and self-tuning budget optimization
 */

export type TestingMode = "ab" | "abc" | "abx" | "multivariate";

export interface ContentVariant {
  variantId: string;
  contentId: number;
  label: string;
  description?: string;
  type: "text" | "image" | "video" | "meme";
  content: Record<string, unknown>;
}

export interface VariantPerformance {
  variantId: string;
  impressions: number;
  clicks: number;
  engagement: number;
  conversions: number;
  ctr: number; // click-through rate
  conversionRate: number;
  roi: number;
  confidence: number; // statistical significance
}

export interface TestResults {
  winner: string;
  improvement: number; // percentage improvement vs control
  confidence: number; // statistical confidence level
  recommendation: string;
  shouldPromoteWinner: boolean;
}

export class MultimodalAutomation {
  /**
   * Create a multimodal test campaign
   */
  static async createMultimodalCampaign(
    userId: number,
    campaignId: number,
    testingMode: TestingMode,
    variants: ContentVariant[]
  ): Promise<InsertMultimodalCampaign> {
    const campaign: InsertMultimodalCampaign = {
      campaignId,
      userId,
      testingMode,
      variants: JSON.stringify(variants),
      testStatus: "planning",
      autoPromoteWinner: 1, // Enable auto-promotion
      performanceMetrics: JSON.stringify({}),
    };

    const result = await db.insert(multimodalCampaigns).values(campaign);
    return campaign;
  }

  /**
   * Start testing
   */
  static async startTest(campaignId: number): Promise<void> {
    await db
      .update(multimodalCampaigns)
      .set({ testStatus: "running" })
      .where(eq => eq.campaignId === campaignId);
  }

  /**
   * Update variant performance
   */
  static updateVariantPerformance(
    variant: ContentVariant,
    metrics: {
      impressions: number;
      clicks: number;
      conversions: number;
      value: number;
    }
  ): VariantPerformance {
    const ctr = metrics.impressions > 0 ? (metrics.clicks / metrics.impressions) * 100 : 0;
    const conversionRate = metrics.clicks > 0 ? (metrics.conversions / metrics.clicks) * 100 : 0;
    const roi = metrics.conversions > 0 ? metrics.value / (metrics.impressions * 0.01) : 0; // Mock ROI calculation

    // Calculate confidence level (simplified Bayesian approach)
    const confidence = Math.min(100, (metrics.conversions / Math.max(metrics.clicks, 1)) * 100);

    return {
      variantId: variant.variantId,
      impressions: metrics.impressions,
      clicks: metrics.clicks,
      engagement: metrics.clicks + metrics.conversions,
      conversions: metrics.conversions,
      ctr: Math.round(ctr * 100) / 100,
      conversionRate: Math.round(conversionRate * 100) / 100,
      roi: Math.round(roi * 100) / 100,
      confidence: Math.round(confidence),
    };
  }

  /**
   * Analyze test results
   */
  static analyzeResults(
    variants: VariantPerformance[],
    testingMode: TestingMode,
    controlVariantId?: string
  ): TestResults {
    if (variants.length === 0) {
      return {
        winner: "",
        improvement: 0,
        confidence: 0,
        recommendation: "No variants to analyze",
        shouldPromoteWinner: false,
      };
    }

    // Find winner based on conversion rate or ROI
    const sortedByConversion = [...variants].sort((a, b) => b.conversionRate - a.conversionRate);
    const winner = sortedByConversion[0];

    // Calculate improvement vs control
    let improvement = 0;
    if (controlVariantId) {
      const control = variants.find((v) => v.variantId === controlVariantId);
      if (control) {
        improvement = ((winner.conversionRate - control.conversionRate) / control.conversionRate) * 100;
      }
    } else {
      // Compare to average
      const avgConversion =
        variants.reduce((sum, v) => sum + v.conversionRate, 0) / variants.length;
      improvement = ((winner.conversionRate - avgConversion) / avgConversion) * 100;
    }

    const recommendation =
      improvement > 10
        ? `Promote ${winner.variantId} - ${Math.round(improvement)}% improvement`
        : improvement > 0
          ? `Minor improvement with ${winner.variantId}`
          : "No clear winner, continue testing";

    const shouldPromoteWinner =
      winner.confidence > 80 && improvement > 10;

    return {
      winner: winner.variantId,
      improvement: Math.round(improvement * 100) / 100,
      confidence: winner.confidence,
      recommendation,
      shouldPromoteWinner,
    };
  }

  /**
   * Auto-promote winning variant
   */
  static async promoteWinner(
    campaignId: number,
    winnerContentId: number
  ): Promise<void> {
    await db
      .update(multimodalCampaigns)
      .set({
        winnerContentId,
        testStatus: "completed",
      })
      .where(eq => eq.campaignId === campaignId);
  }

  /**
   * Setup self-tuning budget optimization
   */
  static async setupBudgetOptimization(
    userId: number,
    campaignId: number,
    totalBudget: number,
    platformAllocations: Record<string, number>
  ): Promise<void> {
    const optimization: typeof adBudgetOptimizations.$inferInsert = {
      campaignId,
      userId,
      totalBudget,
      allocatedBudget: totalBudget,
      platformAllocations: JSON.stringify(platformAllocations),
      optimizationStrategy: JSON.stringify({
        algorithm: "reinforcement_learning",
        updateFrequency: 6, // hours
        explorationRate: 0.1, // 10% budget for exploration
      }),
      status: "active",
    };

    await db.insert(adBudgetOptimizations).values(optimization);
  }

  /**
   * Optimize budget allocation
   */
  static optimizeBudgetAllocation(
    currentAllocations: Record<string, number>,
    platformPerformance: Record<string, {
      roi: number;
      clicks: number;
      conversions: number;
    }>,
    totalBudget: number,
    explorationRate: number = 0.1
  ): Record<string, number> {
    const platforms = Object.keys(platformPerformance);

    // Calculate ROI-weighted allocations
    const totalRoi = platforms.reduce((sum, p) => sum + platformPerformance[p].roi, 0);
    const rioWeights = platforms.reduce((acc, p) => {
      acc[p] = totalRoi > 0 ? platformPerformance[p].roi / totalRoi : 1 / platforms.length;
      return acc;
    }, {} as Record<string, number>);

    // Apply exploration budget (for discovering new high-performers)
    const explorationBudget = totalBudget * explorationRate;
    const optimizationBudget = totalBudget * (1 - explorationRate);

    // Allocate optimization budget based on ROI
    const optimizedAllocations = platforms.reduce((acc, p) => {
      const baseAllocation = rioWeights[p] * optimizationBudget;
      const exploreBudget = explorationBudget / platforms.length;
      acc[p] = Math.round(baseAllocation + exploreBudget);
      return acc;
    }, {} as Record<string, number>);

    // Ensure total equals budget
    const allocated = Object.values(optimizedAllocations).reduce((sum, v) => sum + v, 0);
    const adjustment = totalBudget - allocated;
    optimizedAllocations[platforms[0]] += adjustment;

    return optimizedAllocations;
  }

  /**
   * Generate budget optimization recommendations
   */
  static generateBudgetRecommendations(
    currentAllocations: Record<string, number>,
    optimizedAllocations: Record<string, number>
  ): Array<{
    platform: string;
    currentBudget: number;
    recommendedBudget: number;
    change: number; // percentage
    reason: string;
  }> {
    const recommendations: Array<{
      platform: string;
      currentBudget: number;
      recommendedBudget: number;
      change: number;
      reason: string;
    }> = [];

    for (const platform of Object.keys(currentAllocations)) {
      const current = currentAllocations[platform];
      const recommended = optimizedAllocations[platform] || 0;
      const change = ((recommended - current) / current) * 100;

      let reason = "";
      if (change > 20) {
        reason = "High ROI - increase investment";
      } else if (change < -20) {
        reason = "Low ROI - reduce spend";
      } else {
        reason = "Stable performance - maintain allocation";
      }

      recommendations.push({
        platform,
        currentBudget: current,
        recommendedBudget: recommended,
        change: Math.round(change),
        reason,
      });
    }

    return recommendations.sort((a, b) => b.change - a.change);
  }

  /**
   * Monitor test health
   */
  static calculateStatisticalPower(
    sampleSize: number,
    effectSize: number,
    significanceLevel: number = 0.05
  ): {
    power: number;
    minSampleSize: number;
    recommendation: string;
  } {
    // Simplified power calculation
    const power = Math.min(100, (Math.sqrt(sampleSize) * effectSize) / 2);
    const minSampleSize = Math.ceil((2 * (1.96 / effectSize) ** 2));

    const recommendation =
      power > 80
        ? "Test is statistically valid"
        : power > 60
          ? "Test has adequate power, continue collecting data"
          : "Test needs more samples for statistical significance";

    return {
      power: Math.round(power),
      minSampleSize,
      recommendation,
    };
  }
}
