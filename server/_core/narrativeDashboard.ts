import { db } from "../db";
import { narrativeDashboards, InsertNarrativeDashboard } from "../../drizzle/schema";

/**
 * Narrative Dashboard Service
 * Provides story-centric visualization of campaigns with timelines and meme evolution
 */

export interface CampaignTimeline {
  events: Array<{
    timestamp: number;
    type: string;
    title: string;
    description: string;
    metrics?: Record<string, number>;
    impact?: "high" | "medium" | "low";
  }>;
}

export interface MemeLifecycle {
  phaseName: string;
  startDate: number;
  endDate: number;
  characteristics: string[];
  reach: number;
  engagement: number;
  sentiment: number; // -100 to 100
}

export interface AudienceEvolution {
  timePoint: number;
  totalAudience: number;
  newFollowers: number;
  lostFollowers: number;
  engagementRate: number;
  demographics: Record<string, number>;
}

export interface NarrativeArc {
  arcName: string;
  startContent: number; // contentId
  endContent: number;
  theme: string;
  chapters: Array<{
    chapterNumber: number;
    contentId: number;
    title: string;
    sentiment: number;
    reach: number;
  }>;
  overallImpact: number;
}

export class NarrativeDashboard {
  /**
   * Create a narrative dashboard for a campaign
   */
  static async createDashboard(
    userId: number,
    campaignId: number,
    dashboardName: string
  ): Promise<InsertNarrativeDashboard> {
    const dashboard: InsertNarrativeDashboard = {
      userId,
      campaignId,
      dashboardName,
      timelineData: JSON.stringify({ events: [] }),
      memeSpreadData: JSON.stringify([]),
      audienceEvolutionData: JSON.stringify([]),
      sentimentTrajectory: JSON.stringify([]),
      keyMilestones: JSON.stringify([]),
      narrativeArcs: JSON.stringify([]),
    };

    const result = await db.insert(narrativeDashboards).values(dashboard);
    return dashboard;
  }

  /**
   * Build campaign timeline
   */
  static buildTimeline(
    campaignEvents: Array<{
      timestamp: number;
      type: string;
      title: string;
      description: string;
      metrics?: Record<string, number>;
    }>
  ): CampaignTimeline {
    const events = campaignEvents.map((event) => {
      // Determine impact based on metrics
      let impact: "high" | "medium" | "low" = "low";
      if (event.metrics) {
        const avgMetric = Object.values(event.metrics).reduce((a, b) => a + b, 0) / Object.values(event.metrics).length;
        if (avgMetric > 1000) impact = "high";
        else if (avgMetric > 500) impact = "medium";
      }

      return {
        ...event,
        impact,
      };
    });

    return {
      events: events.sort((a, b) => a.timestamp - b.timestamp),
    };
  }

  /**
   * Track meme spread across timeline
   */
  static buildMemeSpreadVisualization(
    memeData: Array<{
      phaseName: string;
      startDate: number;
      endDate: number;
      reach: number;
      engagement: number;
      sentiment: number;
    }>
  ): Array<{
    phase: string;
    duration: number;
    trajectoryType: string;
    curves: Array<{ time: number; value: number }>;
  }> {
    return memeData.map((meme) => {
      const duration = meme.endDate - meme.startDate;
      const trajectoryType =
        meme.sentiment > 70 ? "positive_viral" : meme.sentiment < 30 ? "negative_drift" : "neutral_growth";

      // Generate curve points
      const curves: Array<{ time: number; value: number }> = [];
      const steps = 10;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const value = Math.sin(t * Math.PI) * meme.reach; // Bell curve
        curves.push({
          time: meme.startDate + t * duration,
          value: Math.round(value),
        });
      }

      return {
        phase: meme.phaseName,
        duration,
        trajectoryType,
        curves,
      };
    });
  }

  /**
   * Track audience evolution
   */
  static buildAudienceEvolution(
    snapshots: AudienceEvolution[]
  ): {
    totalGrowth: number;
    averageGrowthRate: number;
    peakAudience: number;
    growthPhases: Array<{
      phase: string;
      duration: number;
      growthRate: number;
    }>;
  } {
    if (snapshots.length === 0) {
      return {
        totalGrowth: 0,
        averageGrowthRate: 0,
        peakAudience: 0,
        growthPhases: [],
      };
    }

    const sortedSnapshots = snapshots.sort((a, b) => a.timePoint - b.timePoint);

    // Calculate growth metrics
    const totalGrowth = sortedSnapshots[sortedSnapshots.length - 1].totalAudience - sortedSnapshots[0].totalAudience;
    const duration = sortedSnapshots[sortedSnapshots.length - 1].timePoint - sortedSnapshots[0].timePoint;
    const averageGrowthRate = duration > 0 ? (totalGrowth / sortedSnapshots[0].totalAudience) * (86400000 / duration) : 0; // Per day
    const peakAudience = Math.max(...sortedSnapshots.map((s) => s.totalAudience));

    // Identify growth phases
    const growthPhases = [];
    for (let i = 1; i < sortedSnapshots.length; i++) {
      const prev = sortedSnapshots[i - 1];
      const current = sortedSnapshots[i];
      const growth = current.totalAudience - prev.totalAudience;
      const duration = current.timePoint - prev.timePoint;
      const growthRate = duration > 0 ? growth / prev.totalAudience : 0;

      growthPhases.push({
        phase: `Day ${i}`,
        duration,
        growthRate: Math.round(growthRate * 10000) / 100, // percentage
      });
    }

    return {
      totalGrowth,
      averageGrowthRate: Math.round(averageGrowthRate * 100) / 100,
      peakAudience,
      growthPhases,
    };
  }

  /**
   * Build sentiment trajectory
   */
  static buildSentimentTrajectory(
    sentimentData: Array<{ timestamp: number; sentiment: number }>
  ): {
    averageSentiment: number;
    sentimentShifts: Array<{ fromSentiment: string; toSentiment: string; timestamp: number }>;
    dominantSentiment: string;
  } {
    if (sentimentData.length === 0) {
      return {
        averageSentiment: 0,
        sentimentShifts: [],
        dominantSentiment: "neutral",
      };
    }

    const avg = sentimentData.reduce((sum, d) => sum + d.sentiment, 0) / sentimentData.length;

    // Identify sentiment shifts
    const shifts = [];
    for (let i = 1; i < sentimentData.length; i++) {
      const prev = sentimentData[i - 1];
      const current = sentimentData[i];
      const sentimentChangeThreshold = 20;

      if (Math.abs(current.sentiment - prev.sentiment) > sentimentChangeThreshold) {
        const fromSentiment = this.categorizeSentiment(prev.sentiment);
        const toSentiment = this.categorizeSentiment(current.sentiment);

        if (fromSentiment !== toSentiment) {
          shifts.push({
            fromSentiment,
            toSentiment,
            timestamp: current.timestamp,
          });
        }
      }
    }

    const dominantSentiment = this.categorizeSentiment(avg);

    return {
      averageSentiment: Math.round(avg),
      sentimentShifts: shifts,
      dominantSentiment,
    };
  }

  /**
   * Build key milestones
   */
  static buildKeyMilestones(
    campaignData: {
      events: Array<{ type: string; metrics?: Record<string, number>; timestamp: number }>;
      memePhases: Array<{ phaseName: string; reach: number }>;
      audienceSnapshots: AudienceEvolution[];
    }
  ): Array<{
    milestoneType: string;
    title: string;
    description: string;
    timestamp: number;
    impact: number;
  }> {
    const milestones: Array<{
      milestoneType: string;
      title: string;
      description: string;
      timestamp: number;
      impact: number;
    }> = [];

    // Milestone: First 1000 reach
    const firstThousand = campaignData.audienceSnapshots.find((s) => s.totalAudience >= 1000);
    if (firstThousand) {
      milestones.push({
        milestoneType: "audience",
        title: "1K Audience Reached",
        description: "Achieved first thousand audience members",
        timestamp: firstThousand.timePoint,
        impact: 50,
      });
    }

    // Milestone: Peak meme phase
    const peakMeme = campaignData.memePhases.reduce((max, m) => (m.reach > max.reach ? m : max));
    milestones.push({
      milestoneType: "virality",
      title: `Peak: ${peakMeme.phaseName}`,
      description: `Highest reach phase with ${peakMeme.reach} impressions`,
      timestamp: Date.now(),
      impact: 100,
    });

    // Milestone: High engagement event
    const highEngagementEvent = campaignData.events.find(
      (e) => e.metrics && Object.values(e.metrics).some((v) => v > 5000)
    );
    if (highEngagementEvent) {
      milestones.push({
        milestoneType: "engagement",
        title: "High Engagement Spike",
        description: `Strong audience interaction detected`,
        timestamp: highEngagementEvent.timestamp,
        impact: 75,
      });
    }

    return milestones.sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Build narrative arcs
   */
  static buildNarrativeArcs(
    contentSequence: Array<{
      contentId: number;
      sentiment: number;
      reach: number;
      title: string;
      theme: string;
    }>
  ): NarrativeArc[] {
    const arcs: NarrativeArc[] = [];
    let currentArc: Partial<NarrativeArc> | null = null;
    let currentChapters: NarrativeArc["chapters"] = [];

    for (let i = 0; i < contentSequence.length; i++) {
      const content = contentSequence[i];

      if (!currentArc) {
        currentArc = {
          arcName: content.theme,
          startContent: content.contentId,
          theme: content.theme,
          chapters: [],
        };
        currentChapters = [];
      }

      // Add chapter to current arc
      currentChapters.push({
        chapterNumber: currentChapters.length + 1,
        contentId: content.contentId,
        title: content.title,
        sentiment: content.sentiment,
        reach: content.reach,
      });

      // Check if arc should end (sentiment shift or new theme)
      if (
        i === contentSequence.length - 1 ||
        contentSequence[i + 1].theme !== content.theme ||
        Math.abs(contentSequence[i + 1].sentiment - content.sentiment) > 40
      ) {
        if (currentArc) {
          currentArc.chapters = currentChapters;
          currentArc.endContent = content.contentId;
          currentArc.overallImpact = Math.round(
            currentChapters.reduce((sum, c) => sum + c.reach, 0) / currentChapters.length
          );
          arcs.push(currentArc as NarrativeArc);
        }
        currentArc = null;
        currentChapters = [];
      }
    }

    return arcs;
  }

  /**
   * Categorize sentiment
   */
  private static categorizeSentiment(sentiment: number): string {
    if (sentiment > 60) return "very_positive";
    if (sentiment > 30) return "positive";
    if (sentiment > -30) return "neutral";
    if (sentiment > -60) return "negative";
    return "very_negative";
  }
}
