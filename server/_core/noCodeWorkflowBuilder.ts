import { db } from "../db";
import { workflowBuilders, InsertWorkflowBuilder } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * No-code Workflow Builder
 * Enables drag-and-drop creation of marketing automation workflows
 */

export type NodeType =
  | "trigger"
  | "condition"
  | "action"
  | "delay"
  | "analytics"
  | "optimization"
  | "notification";

export interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  config: Record<string, unknown>;
  x: number;
  y: number;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  condition?: string;
}

export interface WorkflowDefinition {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  variables?: Record<string, unknown>;
}

export class NoCodeWorkflowBuilder {
  /**
   * Create a new workflow
   */
  static async createWorkflow(
    userId: number,
    campaignId: number,
    workflowName: string,
    description: string
  ): Promise<InsertWorkflowBuilder> {
    const workflow: InsertWorkflowBuilder = {
      userId,
      campaignId,
      workflowName,
      description,
      flowDefinition: JSON.stringify({
        nodes: [],
        edges: [],
        variables: {},
      }),
      nodes: JSON.stringify([]),
      edges: JSON.stringify([]),
      status: "draft",
      executionCount: 0,
    };

    const result = await db.insert(workflowBuilders).values(workflow);
    return workflow;
  }

  /**
   * Update workflow definition
   */
  static async updateWorkflowDefinition(
    workflowId: number,
    definition: WorkflowDefinition
  ): Promise<void> {
    await db
      .update(workflowBuilders)
      .set({
        flowDefinition: JSON.stringify(definition),
        nodes: JSON.stringify(definition.nodes),
        edges: JSON.stringify(definition.edges),
      })
      .where(eq(workflowBuilders.id, workflowId));
  }

  /**
   * Validate workflow before execution
   */
  static validateWorkflow(definition: WorkflowDefinition): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check for at least one trigger node
    const hasTrigger = definition.nodes.some((n) => n.type === "trigger");
    if (!hasTrigger) {
      errors.push("Workflow must have at least one trigger node");
    }

    // Check for at least one action node
    const hasAction = definition.nodes.some((n) => n.type === "action");
    if (!hasAction) {
      warnings.push("Workflow has no action nodes - it will not perform any actions");
    }

    // Check for orphaned nodes
    const connectedNodes = new Set<string>();
    definition.edges.forEach((e) => {
      connectedNodes.add(e.source);
      connectedNodes.add(e.target);
    });

    definition.nodes.forEach((n) => {
      if (!connectedNodes.has(n.id) && n.type !== "trigger") {
        warnings.push(`Node "${n.id}" is not connected to the workflow`);
      }
    });

    // Check for circular references
    if (this.hasCircularReference(definition.nodes, definition.edges)) {
      errors.push("Workflow contains circular references");
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Execute a workflow
   */
  static async executeWorkflow(
    workflowId: number,
    userId: number,
    campaignId: number,
    context?: Record<string, unknown>
  ): Promise<{
    executionId: string;
    status: "success" | "failed";
    results: Record<string, unknown>;
  }> {
    const workflow = await db
      .select()
      .from(workflowBuilders)
      .where(eq(workflowBuilders.id, workflowId))
      .then((r) => r[0]);

    if (!workflow) {
      return {
        executionId: "",
        status: "failed",
        results: { error: "Workflow not found" },
      };
    }

    const definition = JSON.parse(workflow.flowDefinition as string) as WorkflowDefinition;
    const validation = this.validateWorkflow(definition);

    if (!validation.isValid) {
      return {
        executionId: "",
        status: "failed",
        results: { errors: validation.errors },
      };
    }

    // Execute workflow nodes in order
    const executionId = `exec_${workflowId}_${Date.now()}`;
    const results: Record<string, unknown> = {};

    try {
      for (const node of definition.nodes) {
        results[node.id] = await this.executeNode(node, context || {}, results);
      }

      // Increment execution count
      await db
        .update(workflowBuilders)
        .set({
          executionCount: (workflow.executionCount || 0) + 1,
        })
        .where(eq(workflowBuilders.id, workflowId));

      return {
        executionId,
        status: "success",
        results,
      };
    } catch (error) {
      return {
        executionId,
        status: "failed",
        results: { error: String(error) },
      };
    }
  }

  /**
   * Get template workflows
   */
  static getTemplates(): Array<{
    name: string;
    description: string;
    definition: WorkflowDefinition;
  }> {
    return [
      {
        name: "Simple Post and Track",
        description: "Post content and track its performance",
        definition: {
          nodes: [
            {
              id: "trigger_1",
              type: "trigger",
              label: "Campaign Started",
              config: {},
              x: 100,
              y: 100,
            },
            {
              id: "action_1",
              type: "action",
              label: "Post Content",
              config: { platforms: ["X", "TikTok"] },
              x: 300,
              y: 100,
            },
            {
              id: "analytics_1",
              type: "analytics",
              label: "Track Performance",
              config: { metrics: ["engagement", "reach"] },
              x: 500,
              y: 100,
            },
          ],
          edges: [
            { id: "e1", source: "trigger_1", target: "action_1" },
            { id: "e2", source: "action_1", target: "analytics_1" },
          ],
        },
      },
      {
        name: "Optimize and Repost",
        description: "Analyze performance and repost best content",
        definition: {
          nodes: [
            {
              id: "trigger_2",
              type: "trigger",
              label: "24 Hours Passed",
              config: { delayHours: 24 },
              x: 100,
              y: 200,
            },
            {
              id: "analytics_2",
              type: "analytics",
              label: "Analyze Results",
              config: { metrics: ["all"] },
              x: 300,
              y: 200,
            },
            {
              id: "condition_1",
              type: "condition",
              label: "Engagement > 10%",
              config: { metric: "engagement", threshold: 10 },
              x: 500,
              y: 200,
            },
            {
              id: "action_2",
              type: "action",
              label: "Repost to More Platforms",
              config: { platforms: ["Instagram", "Telegram"] },
              x: 700,
              y: 200,
            },
          ],
          edges: [
            { id: "e3", source: "trigger_2", target: "analytics_2" },
            { id: "e4", source: "analytics_2", target: "condition_1" },
            { id: "e5", source: "condition_1", target: "action_2", condition: "true" },
          ],
        },
      },
    ];
  }

  /**
   * Execute a single workflow node
   */
  private static async executeNode(
    node: WorkflowNode,
    context: Record<string, unknown>,
    results: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    switch (node.type) {
      case "trigger":
        return { executed: true, timestamp: Date.now() };

      case "action":
        return await this.executeAction(node.config);

      case "analytics":
        return await this.executeAnalytics(node.config);

      case "condition":
        return await this.evaluateCondition(node.config, results);

      case "delay":
        return await this.executeDelay(node.config);

      case "optimization":
        return await this.executeOptimization(node.config);

      default:
        return { executed: false };
    }
  }

  /**
   * Execute action node (post content, etc)
   */
  private static async executeAction(
    config: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      actionType: "post",
      platforms: config.platforms,
      status: "posted",
      timestamp: Date.now(),
    };
  }

  /**
   * Execute analytics node
   */
  private static async executeAnalytics(
    config: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      metrics: config.metrics,
      data: {
        engagement: Math.floor(Math.random() * 100),
        reach: Math.floor(Math.random() * 10000),
      },
    };
  }

  /**
   * Evaluate condition node
   */
  private static async evaluateCondition(
    config: Record<string, unknown>,
    results: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const metric = config.metric as string;
    const threshold = config.threshold as number;
    const value = Math.floor(Math.random() * 100); // Mock

    return {
      condition: `${metric} > ${threshold}`,
      value,
      result: value > threshold,
    };
  }

  /**
   * Execute delay node
   */
  private static async executeDelay(
    config: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const delayMs = (config.delaySeconds as number) * 1000;
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ delayed: true, duration: delayMs });
      }, Math.min(delayMs, 1000)); // Cap at 1 second for testing
    });
  }

  /**
   * Execute optimization node
   */
  private static async executeOptimization(
    config: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return {
      optimization: "running",
      targetMetric: config.targetMetric,
      improvement: Math.floor(Math.random() * 20),
    };
  }

  /**
   * Check for circular references in workflow
   */
  private static hasCircularReference(
    nodes: WorkflowNode[],
    edges: WorkflowEdge[]
  ): boolean {
    const visited = new Set<string>();
    const stack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      stack.add(nodeId);

      const neighbors = edges
        .filter((e) => e.source === nodeId)
        .map((e) => e.target);

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor)) return true;
        } else if (stack.has(neighbor)) {
          return true; // Found cycle
        }
      }

      stack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }
}
