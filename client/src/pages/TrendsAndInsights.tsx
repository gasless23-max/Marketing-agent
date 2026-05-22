import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "../utils/trpc";
import DashboardLayout from "../components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

const PLATFORMS = ["X", "TikTok", "Instagram", "Telegram", "Discord"];

interface Trend {
  id: number;
  trendName: string;
  category: string;
  platform: string;
  momentum: number;
  volume: number;
  sentiment: string;
}

interface Analytics {
  id: number;
  campaignId?: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  engagementRate: number;
  platform: string;
}

export default function TrendsAndInsights() {
  const [selectedPlatform, setSelectedPlatform] = useState("X");
  const [selectedTab, setSelectedTab] = useState("trends");

  // Fetch trends
  const { data: trends = [] } = useQuery<Trend[]>({
    queryKey: ["trends", selectedPlatform],
    queryFn: async () => {
      try {
        return await trpc.marketing.trends.getByPlatform.query({
          platform: selectedPlatform,
        });
      } catch (error) {
        console.error("Error fetching trends:", error);
        return [];
      }
    },
  });

  // Fetch analytics
  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["analytics"],
    queryFn: async () => {
      try {
        return await trpc.marketing.analytics.list.query({});
      } catch (error) {
        console.error("Error fetching analytics:", error);
        return [];
      }
    },
  });

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 80) return "text-red-600";
    if (momentum >= 60) return "text-orange-600";
    if (momentum >= 40) return "text-yellow-600";
    return "text-gray-600";
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout title="Trends & Insights">
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="trends">Trending Topics</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          <TabsTrigger value="insights">AI Insights</TabsTrigger>
        </TabsList>

        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Platform:</label>
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLATFORMS.map((platform) => (
                  <SelectItem key={platform} value={platform}>
                    {platform}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {trends.length === 0 ? (
              <Card className="col-span-full">
                <CardContent className="pt-6">
                  <p className="text-center text-gray-500">
                    No trending topics found for {selectedPlatform}
                  </p>
                </CardContent>
              </Card>
            ) : (
              trends.map((trend) => (
                <Card key={trend.id} className="hover:shadow-lg transition">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-base">
                          {trend.trendName}
                        </CardTitle>
                        <CardDescription>{trend.category}</CardDescription>
                      </div>
                      <span
                        className={`text-2xl font-bold ${getMomentumColor(
                          trend.momentum
                        )}`}
                      >
                        {trend.momentum}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Momentum Score</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${trend.momentum}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Mentions</p>
                        <p className="font-semibold">
                          {trend.volume.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Sentiment</p>
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${getSentimentColor(
                            trend.sentiment
                          )}`}
                        >
                          {trend.sentiment}
                        </span>
                      </div>
                    </div>

                    {trend.sentiment === "positive" && (
                      <div className="bg-green-50 p-3 rounded border border-green-200">
                        <p className="text-xs text-green-800">
                          ✓ Great opportunity for viral content
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Metrics</CardTitle>
              <CardDescription>
                Real-time analytics across all platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No analytics data available yet. Publish content to see
                  metrics.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold">
                          {analytics
                            .reduce((sum, a) => sum + a.views, 0)
                            .toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Views</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold">
                          {analytics
                            .reduce((sum, a) => sum + a.likes, 0)
                            .toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">Total Likes</p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold">
                          {analytics
                            .reduce((sum, a) => sum + a.comments, 0)
                            .toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Total Comments
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-2xl font-bold">
                          {(
                            analytics.reduce((sum, a) => sum + a.engagementRate, 0) /
                            analytics.length || 0
                          ).toFixed(1)}
                          %
                        </p>
                        <p className="text-sm text-gray-600">
                          Avg Engagement Rate
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">By Platform</h4>
                    <div className="space-y-2 text-sm">
                      {PLATFORMS.map((platform) => {
                        const platformAnalytics = analytics.filter(
                          (a) => a.platform === platform
                        );
                        const totalEngagement = platformAnalytics.reduce(
                          (sum, a) => sum + a.likes + a.comments + a.shares,
                          0
                        );
                        return (
                          <div key={platform} className="flex justify-between">
                            <span>{platform}</span>
                            <span className="font-medium">
                              {totalEngagement} interactions
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Best Time to Post</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <p>Based on your audience activity:</p>
                <ul className="mt-3 space-y-1">
                  <li>• Weekdays: 9 AM - 11 AM EST</li>
                  <li>• Weekdays: 6 PM - 8 PM EST</li>
                  <li>• Weekends: 10 AM - 2 PM EST</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Top Performing Topics</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• AI & Automation</li>
                  <li>• Tech Innovation</li>
                  <li>• Sustainability</li>
                  <li>• Growth Hacks</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• Increase posting frequency to 2x daily</li>
                  <li>• Focus on video content (higher engagement)</li>
                  <li>• Engage with trending conversations</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Audience Insights</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                <ul className="space-y-1">
                  <li>• 65% Male, 35% Female</li>
                  <li>• Ages 18-35 (72%)</li>
                  <li>• Tech-savvy professionals</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
