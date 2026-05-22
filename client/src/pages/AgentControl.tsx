import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

interface Campaign {
  id: number;
  name: string;
  status: string;
  platforms: string;
}

interface AgentTask {
  id: string;
  name: string;
  status: "pending" | "running" | "completed" | "failed";
  progress: number;
  startTime?: Date;
  endTime?: Date;
  result?: any;
}

export default function AgentControl() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [agentStatus, setAgentStatus] = useState<"idle" | "running">("idle");
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch campaigns
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      try {
        return await trpc.marketing.campaigns.list.query();
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
      }
    },
  });

  // Fetch agent metrics
  const { data: metrics } = useQuery({
    queryKey: ["agent-metrics"],
    queryFn: async () => {
      try {
        return await trpc.marketing.metrics.get.query();
      } catch (error) {
        console.error("Error fetching metrics:", error);
        return null;
      }
    },
  });

  // Simulate running optimization loop
  const runOptimizationMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCampaign) throw new Error("No campaign selected");

      setAgentStatus("running");
      const newTasks: AgentTask[] = [
        {
          id: "1",
          name: "Analyzing Trends",
          status: "running",
          progress: 0,
          startTime: new Date(),
        },
        {
          id: "2",
          name: "Generating Content",
          status: "pending",
          progress: 0,
        },
        {
          id: "3",
          name: "Scheduling Posts",
          status: "pending",
          progress: 0,
        },
        {
          id: "4",
          name: "Analyzing Performance",
          status: "pending",
          progress: 0,
        },
        {
          id: "5",
          name: "Optimizing Strategy",
          status: "pending",
          progress: 0,
        },
      ];

      setTasks(newTasks);

      // Simulate task execution
      try {
        // In a real app, this would call the backend orchestrator
        // For now, we simulate the process

        // Step 1: Analyze trends
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTasks((prev) =>
          prev.map((t) =>
            t.id === "1"
              ? { ...t, status: "completed", progress: 100 }
              : t.id === "2"
                ? { ...t, status: "running", progress: 0 }
                : t
          )
        );

        // Step 2: Generate content
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTasks((prev) =>
          prev.map((t) =>
            t.id === "2"
              ? { ...t, status: "completed", progress: 100 }
              : t.id === "3"
                ? { ...t, status: "running", progress: 0 }
                : t
          )
        );

        // Step 3: Schedule posts
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setTasks((prev) =>
          prev.map((t) =>
            t.id === "3"
              ? { ...t, status: "completed", progress: 100 }
              : t.id === "4"
                ? { ...t, status: "running", progress: 0 }
                : t
          )
        );

        // Step 4: Analyze performance
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setTasks((prev) =>
          prev.map((t) =>
            t.id === "4"
              ? { ...t, status: "completed", progress: 100 }
              : t.id === "5"
                ? { ...t, status: "running", progress: 0 }
                : t
          )
        );

        // Step 5: Optimize strategy
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setTasks((prev) =>
          prev.map((t) =>
            t.id === "5" ? { ...t, status: "completed", progress: 100 } : t
          )
        );

        setAgentStatus("idle");
        alert("Optimization loop completed successfully!");
      } catch (error) {
        setTasks((prev) =>
          prev.map((t) =>
            t.status === "running"
              ? { ...t, status: "failed", progress: 0 }
              : t
          )
        );
        setAgentStatus("idle");
        throw error;
      }
    },
    onError: (error) => {
      alert("Error running optimization loop. Please try again.");
      console.error(error);
      setAgentStatus("idle");
    },
  });

  const getStatusColor = (
    status: "pending" | "running" | "completed" | "failed"
  ) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "running":
        return "text-blue-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusBgColor = (
    status: "pending" | "running" | "completed" | "failed"
  ) => {
    switch (status) {
      case "completed":
        return "bg-green-100";
      case "running":
        return "bg-blue-100";
      case "failed":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <DashboardLayout title="AI Agent Control">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="execution">Execution</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {metrics?.campaignsCreated || 0}
                </p>
                <p className="text-sm text-gray-600">Campaigns Created</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {metrics?.contentGenerated || 0}
                </p>
                <p className="text-sm text-gray-600">Content Pieces</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {metrics?.postsPublished || 0}
                </p>
                <p className="text-sm text-gray-600">Posts Published</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <p className="text-3xl font-bold">
                  {(metrics?.averageEngagementRate || 0) / 100 | 0}%
                </p>
                <p className="text-sm text-gray-600">Avg Engagement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Agent Status</CardTitle>
              <CardDescription>
                Real-time information about your AI marketing agent
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Agent Status</p>
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      agentStatus === "running"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {agentStatus === "running" ? "⏳" : "✓"} {agentStatus}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Last Optimization Run
                  </p>
                  <p className="text-sm font-medium">
                    {metrics?.lastOptimizationRun
                      ? new Date(
                          metrics.lastOptimizationRun
                        ).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Execution Tab */}
        <TabsContent value="execution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Run Optimization Loop</CardTitle>
              <CardDescription>
                Automatically plan, create, schedule, analyze, and optimize your
                campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <label className="text-sm font-medium block mb-2">
                  Select Campaign *
                </label>
                <select
                  value={selectedCampaign?.toString() || ""}
                  onChange={(e) => setSelectedCampaign(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a campaign</option>
                  {campaigns.map((campaign) => (
                    <option key={campaign.id} value={campaign.id.toString()}>
                      {campaign.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCampaign && (
                <>
                  {/* Info Box */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      What will the agent do?
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>✓ Analyze current trends and sentiment</li>
                      <li>✓ Generate 2-3 pieces of AI content</li>
                      <li>✓ Schedule content across selected platforms</li>
                      <li>✓ Monitor performance metrics</li>
                      <li>✓ Provide optimization recommendations</li>
                    </ul>
                  </div>

                  {/* Run Button */}
                  <Button
                    onClick={() => runOptimizationMutation.mutate()}
                    disabled={
                      agentStatus === "running" ||
                      runOptimizationMutation.isPending ||
                      !selectedCampaign
                    }
                    className="w-full py-6 text-lg"
                    size="lg"
                  >
                    {agentStatus === "running"
                      ? "⏳ Running Optimization Loop..."
                      : "▶ Start Optimization Loop"}
                  </Button>
                </>
              )}

              {/* Task Execution Log */}
              {tasks.length > 0 && (
                <div className="space-y-3 border-t pt-6">
                  <h4 className="font-semibold">Execution Log</h4>
                  {tasks.map((task) => (
                    <div key={task.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${getStatusBgColor(
                              task.status
                            )} ${getStatusColor(task.status)}`}
                          >
                            {task.status === "completed"
                              ? "✓"
                              : task.status === "running"
                                ? "⏳"
                                : task.status === "failed"
                                  ? "✕"
                                  : "○"}
                          </span>
                          <span className="font-medium">{task.name}</span>
                        </div>
                        <span
                          className={`text-sm font-medium ${getStatusColor(
                            task.status
                          )}`}
                        >
                          {task.progress}%
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden ml-9">
                        <div
                          className={`h-full transition-all duration-300 ${
                            task.status === "completed"
                              ? "bg-green-500"
                              : task.status === "running"
                                ? "bg-blue-500"
                                : task.status === "failed"
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                          }`}
                          style={{ width: `${task.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimization History</CardTitle>
              <CardDescription>
                Previous optimization runs and their results
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8 text-gray-500">
                  <p>No optimization history yet</p>
                  <p className="text-sm mt-2">
                    Run the optimization loop to see results here
                  </p>
                </div>

                {/* Example History Item (would be populated from data) */}
                <div className="border rounded-lg p-4 hidden">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold">Campaign: Summer Launch</h4>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Completed
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                    <div>
                      <p className="text-gray-600">Content Generated</p>
                      <p className="font-semibold">3 pieces</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Posts Scheduled</p>
                      <p className="font-semibold">15</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Predicted Reach</p>
                      <p className="font-semibold">25K+</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">
                    Run: May 22, 2024 at 2:30 PM
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
