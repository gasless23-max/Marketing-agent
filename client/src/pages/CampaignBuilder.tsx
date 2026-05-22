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
import { Textarea } from "../components/ui/textarea";
import { Checkbox } from "../components/ui/checkbox";

const PLATFORMS = [
  { id: "X", label: "X (Twitter)" },
  { id: "TikTok", label: "TikTok" },
  { id: "Instagram", label: "Instagram" },
  { id: "Telegram", label: "Telegram" },
  { id: "Discord", label: "Discord" },
  { id: "Web", label: "Web" },
];

interface FormData {
  name: string;
  description: string;
  targetAudience: string;
  platforms: string[];
  budget: number;
}

export default function CampaignBuilder() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    targetAudience: "",
    platforms: [],
    budget: 0,
  });

  const [step, setStep] = useState(1);

  // Fetch recent campaigns
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

  // Create campaign mutation
  const createCampaignMutation = useMutation({
    mutationFn: async () => {
      return trpc.marketing.campaigns.create.mutate({
        name: formData.name,
        description: formData.description,
        targetAudience: formData.targetAudience,
        platforms: formData.platforms,
        budget: formData.budget * 100, // Convert to cents
      });
    },
    onSuccess: () => {
      alert("Campaign created successfully!");
      setFormData({
        name: "",
        description: "",
        targetAudience: "",
        platforms: [],
        budget: 0,
      });
      setStep(1);
    },
    onError: (error) => {
      alert("Error creating campaign. Please try again.");
      console.error(error);
    },
  });

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || 0 : value,
    }));
  };

  const isStepValid = () => {
    if (step === 1) {
      return formData.name.trim().length > 0;
    }
    if (step === 2) {
      return formData.platforms.length > 0;
    }
    return true;
  };

  return (
    <DashboardLayout title="Campaign Builder">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Create New Campaign</CardTitle>
              <CardDescription>
                Step {step} of 3: Configure your campaign
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Campaign Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g., Summer Product Launch"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Describe your campaign goals and approach"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Textarea
                      id="targetAudience"
                      name="targetAudience"
                      placeholder="e.g., Tech-savvy millennials interested in sustainability"
                      value={formData.targetAudience}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label>Select Platforms *</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {PLATFORMS.map((platform) => (
                        <div
                          key={platform.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={platform.id}
                            checked={formData.platforms.includes(platform.id)}
                            onCheckedChange={() =>
                              handlePlatformToggle(platform.id)
                            }
                          />
                          <Label htmlFor={platform.id}>
                            {platform.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="budget">Budget (USD)</Label>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      placeholder="0"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="mt-2"
                      min="0"
                      step="100"
                    />
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">
                      Campaign Summary
                    </h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>
                        <strong>Name:</strong> {formData.name}
                      </li>
                      <li>
                        <strong>Platforms:</strong>{" "}
                        {formData.platforms.join(", ")}
                      </li>
                      <li>
                        <strong>Budget:</strong> ${formData.budget.toFixed(2)}
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={() => setStep(Math.max(1, step - 1))}
                  disabled={step === 1}
                >
                  Back
                </Button>

                <div className="flex gap-2">
                  {step < 3 && (
                    <Button
                      onClick={() => setStep(step + 1)}
                      disabled={!isStepValid()}
                    >
                      Next
                    </Button>
                  )}
                  {step === 3 && (
                    <Button
                      onClick={() =>
                        createCampaignMutation.mutate()
                      }
                      disabled={
                        createCampaignMutation.isPending ||
                        !isStepValid()
                      }
                    >
                      {createCampaignMutation.isPending
                        ? "Creating..."
                        : "Create Campaign"}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Start</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="text-gray-600">
                Create a campaign to start planning and publishing content
                across multiple platforms.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Name your campaign</li>
                <li>Select target platforms</li>
                <li>Set your budget</li>
                <li>AI creates content</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Recent Campaigns ({campaigns.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm max-h-64 overflow-y-auto">
                {campaigns.slice(0, 5).map((campaign: any) => (
                  <div
                    key={campaign.id}
                    className="p-2 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <p className="font-medium truncate">{campaign.name}</p>
                    <p className="text-xs text-gray-500">
                      {campaign.status}
                    </p>
                  </div>
                ))}
                {campaigns.length === 0 && (
                  <p className="text-gray-500">No campaigns yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
