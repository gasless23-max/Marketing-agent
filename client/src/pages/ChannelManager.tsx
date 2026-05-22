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

const PLATFORMS = [
  { id: "X", label: "X (Twitter)", icon: "𝕏" },
  { id: "TikTok", label: "TikTok", icon: "♪" },
  { id: "Instagram", label: "Instagram", icon: "📷" },
  { id: "Telegram", label: "Telegram", icon: "✈" },
  { id: "Discord", label: "Discord", icon: "💬" },
];

interface ChannelCredential {
  id: number;
  platform: string;
  accountName: string;
  isActive: number;
  accountId?: string;
}

interface FormData {
  platform: string;
  accountName: string;
  accountId: string;
}

export default function ChannelManager() {
  const [formData, setFormData] = useState<FormData>({
    platform: "X",
    accountName: "",
    accountId: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Fetch channels
  const { data: channels = [] } = useQuery<ChannelCredential[]>({
    queryKey: ["channels"],
    queryFn: async () => {
      try {
        return await trpc.marketing.channels.list.query();
      } catch (error) {
        console.error("Error fetching channels:", error);
        return [];
      }
    },
  });

  // Add channel mutation
  const addChannelMutation = useMutation({
    mutationFn: async () => {
      return trpc.marketing.channels.create.mutate({
        platform: formData.platform,
        accountName: formData.accountName,
        accountId: formData.accountId,
      });
    },
    onSuccess: () => {
      alert("Channel added successfully!");
      setFormData({
        platform: "X",
        accountName: "",
        accountId: "",
      });
      setShowForm(false);
    },
    onError: (error) => {
      alert("Error adding channel. Please try again.");
      console.error(error);
    },
  });

  // Delete channel mutation
  const deleteChannelMutation = useMutation({
    mutationFn: async (id: number) => {
      return trpc.marketing.channels.delete.mutate({ id });
    },
    onSuccess: () => {
      alert("Channel removed successfully!");
    },
    onError: (error) => {
      alert("Error removing channel. Please try again.");
      console.error(error);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteChannel = (id: number) => {
    if (confirm("Are you sure you want to remove this channel?")) {
      deleteChannelMutation.mutate(id);
    }
  };

  const canAddChannel =
    formData.platform.trim() &&
    formData.accountName.trim() &&
    formData.accountId.trim();

  const connectedPlatforms = channels.map((c) => c.platform);
  const availablePlatforms = PLATFORMS.filter(
    (p) => !connectedPlatforms.includes(p.id)
  );

  return (
    <DashboardLayout title="Channel Manager">
      <div className="space-y-6">
        {/* Connected Channels */}
        <Card>
          <CardHeader>
            <CardTitle>Connected Channels</CardTitle>
            <CardDescription>
              Manage your accounts across social platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            {channels.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">
                  No channels connected yet
                </p>
                <Button onClick={() => setShowForm(true)}>
                  Connect Your First Channel
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channels.map((channel) => {
                  const platform = PLATFORMS.find(
                    (p) => p.id === channel.platform
                  );
                  return (
                    <Card key={channel.id} className="bg-gradient-to-br from-gray-50 to-white">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">
                              {platform?.icon}
                            </span>
                            <div>
                              <h3 className="font-semibold">
                                {platform?.label}
                              </h3>
                              <p className="text-sm text-gray-600">
                                @{channel.accountName}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              channel.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {channel.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <div className="space-y-2 text-sm mb-4 pb-4 border-b">
                          {channel.accountId && (
                            <p className="text-gray-600">
                              <span className="font-medium">ID:</span>{" "}
                              {channel.accountId}
                            </p>
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteChannel(channel.id)}
                          disabled={deleteChannelMutation.isPending}
                        >
                          {deleteChannelMutation.isPending
                            ? "Removing..."
                            : "Remove Channel"}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Channel Form */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Add New Channel</CardTitle>
              <CardDescription>
                Connect an account to start publishing content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Platform Selection */}
              <div>
                <Label htmlFor="platform">Platform *</Label>
                <Select value={formData.platform} onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    platform: value,
                  }))
                }>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.length > 0 ? (
                      availablePlatforms.map((platform) => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>
                        All platforms connected
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Account Name */}
              <div>
                <Label htmlFor="accountName">Account Name / Handle *</Label>
                <Input
                  id="accountName"
                  name="accountName"
                  placeholder="e.g., @yourhandle"
                  value={formData.accountName}
                  onChange={handleInputChange}
                  className="mt-2"
                />
              </div>

              {/* Account ID */}
              <div>
                <Label htmlFor="accountId">Account ID / Username *</Label>
                <Input
                  id="accountId"
                  name="accountId"
                  placeholder="Your account ID or username"
                  value={formData.accountId}
                  onChange={handleInputChange}
                  className="mt-2"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is used to authenticate publishing to this platform
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">
                  How to find your Account ID:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• <strong>X (Twitter):</strong> Go to Settings & Privacy → Your Account</li>
                  <li>• <strong>TikTok:</strong> Tap Profile → Settings → Account</li>
                  <li>• <strong>Instagram:</strong> Tap profile → Settings → Account Info</li>
                  <li>• <strong>Telegram:</strong> Settings → Username</li>
                  <li>• <strong>Discord:</strong> Right-click username → Copy User ID</li>
                </ul>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => addChannelMutation.mutate()}
                  disabled={!canAddChannel || addChannelMutation.isPending}
                  className="flex-1"
                >
                  {addChannelMutation.isPending
                    ? "Adding..."
                    : "Connect Channel"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({
                      platform: "X",
                      accountName: "",
                      accountId: "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {!showForm && channels.length < PLATFORMS.length && (
          <div className="flex justify-center">
            <Button onClick={() => setShowForm(true)} variant="outline">
              Connect Another Channel
            </Button>
          </div>
        )}

        {/* Platform Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Platform Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {PLATFORMS.map((platform) => {
                const isConnected = channels.some(
                  (c) => c.platform === platform.id
                );
                return (
                  <div
                    key={platform.id}
                    className={`p-4 rounded-lg border text-center ${
                      isConnected
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <span className="text-2xl block mb-2">
                      {platform.icon}
                    </span>
                    <p className="text-sm font-medium">{platform.label}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isConnected
                          ? "text-green-700 font-semibold"
                          : "text-gray-600"
                      }`}
                    >
                      {isConnected ? "Connected" : "Not Connected"}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
