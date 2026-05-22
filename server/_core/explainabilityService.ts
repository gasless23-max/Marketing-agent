import { db } from "../db";
import { explainabilityLogs, ExplainabilityLog, InsertExplainabilityLog } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Explainability Service
 * Provides transparent, auditable logging of all agent decisions
 */

export interface DecisionContext {
  userId: number;
  campaignId?: number;
  contentId?: number;
  actionType: string;
  decision: Record<string, unknown>;
  confidence: number;
  factors: Record<string, unknown>[];
  alternatives: Record<string, unknown>[];
}

export interface DecisionOutcome {
  success: boolean;
  results: Record<string, unknown>;
  deviationFromPrediction?: number;
}

export class ExplainabilityService {
  /**
   * Log an agent decision with full reasoning chain
   */
  static async logDecision(
    context: DecisionContext,
    reasoning: string,
    outcome?: DecisionOutcome
  ): Promise<ExplainabilityLog> {
    const log: InsertExplainabilityLog = {
      userId: context.userId,
      campaignId: context.campaignId,
      contentId: context.contentId,
      agentActionType: context.actionType,
      decision: JSON.stringify(context.decision),
      reasoning,
      confidence: context.confidence,
      factors: JSON.stringify(context.factors),
      alternatives: JSON.stringify(context.alternatives),
      outcome: outcome ? JSON.stringify(outcome.results) : null,
      outcomeDifference: outcome?.deviationFromPrediction || 0,
    };

    const result = await db.insert(explainabilityLogs).values(log);
    return this.getLog(Number(result.insertId));
  }

  /**
   * Get decision history for a campaign or content
   */
  static async getDecisionHistory(
    userId: number,
    campaignId?: number,
    limit: number = 50
  ): Promise<ExplainabilityLog[]> {
    let query = db
      .select()
      .from(explainabilityLogs)
      .where(eq(explainabilityLogs.userId, userId));

    if (campaignId) {
      query = query.where(eq(explainabilityLogs.campaignId, campaignId));
    }

    return query.limit(limit).orderBy((t) => [t.createdAt]);
  }

  /**
   * Get a specific decision log
   */
  static async getLog(logId: number): Promise<ExplainabilityLog> {
    const result = await db
      .select()
      .from(explainabilityLogs)
      .where(eq(explainabilityLogs.id, logId));
    return result[0];
  }

  /**
   * Generate human-readable explanation of decision
   */
  static generateExplanation(log: ExplainabilityLog): string {
    const decision = JSON.parse(log.decision as string);
    const factors = JSON.parse(log.factors as string);

    const factorText = factors
      .map((f: Record<string, unknown>) => `• ${f.name}: ${f.weight}% influence`)
      .join("\n");

    return `
Decision: ${log.agentActionType}
Reasoning: ${log.reasoning}
Confidence: ${log.confidence}%

Key Factors:
${factorText}

Decision Details:
${JSON.stringify(decision, null, 2)}
    `.trim();
  }

  /**
   * Analyze decision accuracy over time
   */
  static async analyzeAccuracy(userId: number, campaignId?: number): Promise<{
    averageConfidence: number;
    averageDeviation: number;
    decisionCount: number;
    successRate: number;
  }> {
    const logs = await this.getDecisionHistory(userId, campaignId, 1000);

    if (logs.length === 0) {
      return { averageConfidence: 0, averageDeviation: 0, decisionCount: 0, successRate: 0 };
    }

    const avgConfidence =
      logs.reduce((sum, l) => sum + (l.confidence || 0), 0) / logs.length;
    const avgDeviation =
      logs.reduce((sum, l) => sum + (l.outcomeDifference || 0), 0) / logs.length;
    const successRate = logs.filter((l) => l.outcomeDifference !== null && l.outcomeDifference < 20).length / logs.length;

    return {
      averageConfidence: Math.round(avgConfidence),
      averageDeviation: Math.round(avgDeviation),
      decisionCount: logs.length,
      successRate: Math.round(successRate * 100),
    };
  }
}
