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

interface AgentMetrics {
  campaignsCreated: number;
  contentGenerated: number;
  postsPublished: number;
  totalReach: number;
  totalEngagement: number;
  averageEngagementRate: number;
}

interface Campaign {
  id: number;
  name: string;
  status: string;
  platforms: string;
  startDate: Date | null;
  endDate: Date | null;
}

export default function AgentDashboard() {
  const [selectedTab, setSelectedTab] = useState("overview");

  // Fetch agent metrics
  const { data: metrics } = useQuery<AgentMetrics | null>({
    queryKey: ["agent-metrics"],
    queryFn: async () => {
      try {
        const result = await trpc.marketing.metrics.get.query();
        return result;
      } catch (error) {
        console.error("Error fetching metrics:", error);
        return null;
      }
    },
  });

  // Fetch campaigns
  const { data: campaigns = [] } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      try {
        const result = await trpc.marketing.campaigns.list.query();
        return result;
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
      }
    },
  });

  // Format number with commas
  const formatNumber = (num: number | undefined) => {
    if (!num) return "0";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format percentage
  const formatPercent = (num: number | undefined) => {
    if (!num) return "0%";
    return `${(num / 100).toFixed(1)}%`;
  };

  return (
    <DashboardLayout title="AI Marketing Agent">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Campaigns Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics?.campaignsCreated)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Active campaigns</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Content Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics?.contentGenerated)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Total pieces created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Posts Published
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics?.postsPublished)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Across platforms</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics?.totalReach)}
              </div>
              <p className="text-xs text-gray-500 mt-1">People reached</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Total Engagement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(metrics?.totalEngagement)}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Likes, comments, shares
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                Avg Engagement Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPercent(metrics?.averageEngagementRate)}
              </div>
              <p className="text-xs text-gray-500 mt-1">Performance metric</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle>Campaigns</CardTitle>
            <CardDescription>
              Manage your AI-powered marketing campaigns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="mt-4">
                <div className="space-y-4">
                  {campaigns
                    .filter((c: Campaign) => c.status === "active")
                    .length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No active campaigns. Create one to get started!</p>
                      <Button className="mt-4">Create Campaign</Button>
                    </div>
                  ) : (
                    campaigns
                      .filter((c: Campaign) => c.status === "active")
                      .map((campaign: Campaign) => (
                        <div
                          key={campaign.id}
                          className="p-4 border rounded-lg hover:bg-gray-50"
                        >
                          <h3 className="font-semibold">{campaign.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Platforms:{" "}
                            {JSON.parse(campaign.platforms || "[]").join(", ")}
                          </p>
                          <div className="mt-2 flex gap-2">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="all" className="mt-4">
                <div className="space-y-4">
                  {campaigns.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No campaigns yet. Create your first campaign!</p>
                      <Button className="mt-4">Create Campaign</Button>
                    </div>
                  ) : (
                    campaigns.map((campaign: Campaign) => (
                      <div
                        key={campaign.id}
                        className="p-4 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{campaign.name}</h3>
                            <p className="text-sm text-gray-600 mt-1">
                              Status:{" "}
                              <span className="font-medium capitalize">
                                {campaign.status}
                              </span>
                            </p>
                            <p className="text-sm text-gray-600">
                              Platforms:{" "}
                              {JSON.parse(campaign.platforms || "[]").join(
                                ", "
                              )}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
