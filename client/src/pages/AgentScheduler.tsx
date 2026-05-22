import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const PLATFORMS = ["X", "TikTok", "Instagram", "Telegram", "Discord"];

interface ScheduleItem {
  id: number;
  contentId: number;
  platform: string;
  scheduledTime: Date;
  status: string;
  published: number;
}

export default function AgentScheduler() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [selectedContent, setSelectedContent] = useState<number | null>(null);
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("schedule");

  // Fetch campaigns
  const { data: campaigns = [] } = useQuery({
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

  // Fetch content for selected campaign
  const { data: contentList = [] } = useQuery({
    queryKey: ["content", selectedCampaign],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      try {
        return await trpc.marketing.content.list.query({
          campaignId: selectedCampaign,
        });
      } catch (error) {
        console.error("Error fetching content:", error);
        return [];
      }
    },
    enabled: !!selectedCampaign,
  });

  // Fetch schedules for campaign
  const { data: schedules = [] } = useQuery<ScheduleItem[]>({
    queryKey: ["schedules", selectedCampaign],
    queryFn: async () => {
      if (!selectedCampaign) return [];
      try {
        return await trpc.marketing.scheduling.list.query({
          campaignId: selectedCampaign,
        });
      } catch (error) {
        console.error("Error fetching schedules:", error);
        return [];
      }
    },
    enabled: !!selectedCampaign,
  });

  // Schedule content mutation
  const scheduleContentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCampaign || !selectedContent || !scheduledTime) {
        throw new Error("Missing required fields");
      }

      // Schedule for each selected platform
      const promises = selectedPlatforms.map((platform) =>
        trpc.marketing.scheduling.create.mutate({
          contentId: selectedContent,
          campaignId: selectedCampaign,
          platform,
          scheduledTime: new Date(scheduledTime),
        })
      );

      return Promise.all(promises);
    },
    onSuccess: () => {
      alert("Content scheduled successfully!");
      setSelectedContent(null);
      setScheduledTime("");
      setSelectedPlatforms([]);
    },
    onError: (error) => {
      alert("Error scheduling content. Please try again.");
      console.error(error);
    },
  });

  const handlePlatformToggle = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm("Are you sure you want to delete this schedule?")) return;

    try {
      await trpc.marketing.scheduling.delete.mutate({ id: scheduleId });
      alert("Schedule deleted successfully!");
    } catch (error) {
      alert("Error deleting schedule. Please try again.");
      console.error(error);
    }
  };

  const canSchedule =
    selectedCampaign &&
    selectedContent &&
    scheduledTime &&
    selectedPlatforms.length > 0;

  const publishedSchedules = schedules.filter((s) => s.status === "published");
  const upcomingSchedules = schedules.filter((s) => s.status === "scheduled");
  const failedSchedules = schedules.filter((s) => s.status === "failed");

  return (
    <DashboardLayout title="Content Scheduler">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scheduling Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Schedule Content</CardTitle>
              <CardDescription>
                Plan when and where to publish your content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <Label>Campaign *</Label>
                <Select
                  value={selectedCampaign?.toString() || ""}
                  onValueChange={(val) => {
                    setSelectedCampaign(Number(val));
                    setSelectedContent(null);
                  }}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    {campaigns.map((campaign: any) => (
                      <SelectItem
                        key={campaign.id}
                        value={campaign.id.toString()}
                      >
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedCampaign && (
                <>
                  {/* Content Selection */}
                  <div>
                    <Label>Content *</Label>
                    <Select
                      value={selectedContent?.toString() || ""}
                      onValueChange={(val) => setSelectedContent(Number(val))}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select content to schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentList.map((content: any) => (
                          <SelectItem
                            key={content.id}
                            value={content.id.toString()}
                          >
                            {content.title} ({content.type})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Scheduled Time */}
                  <div>
                    <Label htmlFor="scheduledTime">Scheduled Time *</Label>
                    <Input
                      id="scheduledTime"
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  {/* Platform Selection */}
                  <div>
                    <Label>Platforms * (Select one or more)</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {PLATFORMS.map((platform) => (
                        <div
                          key={platform}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={platform}
                            checked={selectedPlatforms.includes(platform)}
                            onChange={() => handlePlatformToggle(platform)}
                            className="rounded"
                          />
                          <Label htmlFor={platform} className="cursor-pointer">
                            {platform}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule Button */}
                  <Button
                    onClick={() => scheduleContentMutation.mutate()}
                    disabled={!canSchedule || scheduleContentMutation.isPending}
                    className="w-full"
                  >
                    {scheduleContentMutation.isPending
                      ? "Scheduling..."
                      : "Schedule Content"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Schedule Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">
                  {upcomingSchedules.length}
                </p>
                <p className="text-sm text-gray-600">Upcoming Posts</p>
              </div>
              <div className="text-center border-t pt-3">
                <p className="text-2xl font-bold text-green-600">
                  {publishedSchedules.length}
                </p>
                <p className="text-sm text-gray-600">Published</p>
              </div>
              <div className="text-center border-t pt-3">
                <p className="text-2xl font-bold text-red-600">
                  {failedSchedules.length}
                </p>
                <p className="text-sm text-gray-600">Failed</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Next Scheduled Post</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingSchedules.length > 0 ? (
                <div className="text-sm">
                  <p className="font-medium">
                    {new Date(
                      upcomingSchedules[0].scheduledTime
                    ).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    on {upcomingSchedules[0].platform}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No upcoming posts scheduled
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Schedule List */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scheduled Posts</CardTitle>
          <CardDescription>Manage your scheduled content</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingSchedules.length})
              </TabsTrigger>
              <TabsTrigger value="published">
                Published ({publishedSchedules.length})
              </TabsTrigger>
              <TabsTrigger value="failed">
                Failed ({failedSchedules.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              <div className="space-y-2">
                {upcomingSchedules.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No upcoming posts
                  </p>
                ) : (
                  upcomingSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          {schedule.platform}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(schedule.scheduledTime).toLocaleString()}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="published">
              <div className="space-y-2">
                {publishedSchedules.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No published posts
                  </p>
                ) : (
                  publishedSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border rounded-lg bg-green-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {schedule.platform}
                          </p>
                          <p className="text-xs text-gray-600">
                            Published:{" "}
                            {schedule.publishedTime
                              ? new Date(schedule.publishedTime).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                        <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">
                          Published
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="failed">
              <div className="space-y-2">
                {failedSchedules.length === 0 ? (
                  <p className="text-center text-gray-500 py-4">
                    No failed posts
                  </p>
                ) : (
                  failedSchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-4 border rounded-lg bg-red-50"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">
                            {schedule.platform}
                          </p>
                          <p className="text-xs text-gray-600">
                            Scheduled:{" "}
                            {new Date(schedule.scheduledTime).toLocaleString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          Retry
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
    </DashboardLayout>
  );
}
