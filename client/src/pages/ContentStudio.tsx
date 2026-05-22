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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface ContentFormData {
  campaignId: number;
  type: "image" | "video" | "text" | "carousel" | "meme";
  title: string;
  description: string;
  textContent: string;
  creativePrompt: string;
  hashtags: string[];
  aiGenerated: boolean;
}

export default function ContentStudio() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [contentType, setContentType] = useState<
    "image" | "video" | "text" | "carousel" | "meme"
  >("text");
  const [formData, setFormData] = useState<ContentFormData>({
    campaignId: 0,
    type: "text",
    title: "",
    description: "",
    textContent: "",
    creativePrompt: "",
    hashtags: [],
    aiGenerated: false,
  });
  const [hashtagInput, setHashtagInput] = useState("");

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

  // Create content mutation
  const createContentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedCampaign) throw new Error("No campaign selected");
      return trpc.marketing.content.create.mutate({
        campaignId: selectedCampaign,
        type: contentType,
        title: formData.title,
        description: formData.description,
        textContent: formData.textContent,
        creativePrompt: formData.creativePrompt,
        hashtags: formData.hashtags,
        aiGenerated: formData.aiGenerated,
      });
    },
    onSuccess: () => {
      alert("Content created successfully!");
      setFormData({
        campaignId: selectedCampaign || 0,
        type: "text",
        title: "",
        description: "",
        textContent: "",
        creativePrompt: "",
        hashtags: [],
        aiGenerated: false,
      });
    },
    onError: (error) => {
      alert("Error creating content. Please try again.");
      console.error(error);
    },
  });

  const handleAddHashtag = () => {
    if (
      hashtagInput.trim() &&
      !formData.hashtags.includes(hashtagInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()],
      }));
      setHashtagInput("");
    }
  };

  const handleRemoveHashtag = (hashtag: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((h) => h !== hashtag),
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const canCreate =
    selectedCampaign &&
    formData.title.trim().length > 0 &&
    formData.textContent.trim().length > 0;

  return (
    <DashboardLayout title="Content Studio">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create Content</CardTitle>
              <CardDescription>
                Design and generate viral content for your campaigns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Selection */}
              <div>
                <Label>Select Campaign *</Label>
                <Select
                  value={selectedCampaign?.toString() || ""}
                  onValueChange={(val) => setSelectedCampaign(Number(val))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a campaign" />
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
                  {/* Content Type */}
                  <div>
                    <Label>Content Type *</Label>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text Post</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="meme">Meme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Title */}
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Content title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-2"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Brief description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={2}
                    />
                  </div>

                  {/* Main Content */}
                  <div>
                    <Label htmlFor="textContent">
                      {contentType === "text"
                        ? "Post Content"
                        : "Caption"}{" "}
                      *
                    </Label>
                    <Textarea
                      id="textContent"
                      name="textContent"
                      placeholder="Write your content here"
                      value={formData.textContent}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={6}
                    />
                  </div>

                  {/* Creative Prompt */}
                  <div>
                    <Label htmlFor="creativePrompt">
                      AI Creative Prompt
                    </Label>
                    <Textarea
                      id="creativePrompt"
                      name="creativePrompt"
                      placeholder="Describe what you want AI to generate (e.g., 'Create a viral meme about AI')
"
                      value={formData.creativePrompt}
                      onChange={handleInputChange}
                      className="mt-2"
                      rows={3}
                    />
                  </div>

                  {/* Hashtags */}
                  <div>
                    <Label htmlFor="hashtag">Add Hashtags</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        id="hashtag"
                        placeholder="e.g., #viral"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddHashtag();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddHashtag}
                      >
                        Add
                      </Button>
                    </div>
                    {formData.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.hashtags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                          >
                            {tag}
                            <button
                              onClick={() => handleRemoveHashtag(tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AI Generate */}
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="aiGenerated"
                      checked={formData.aiGenerated}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          aiGenerated: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <Label htmlFor="aiGenerated" className="cursor-pointer">
                      AI Generated Content
                    </Label>
                  </div>

                  {/* Create Button */}
                  <div className="flex gap-2 pt-4 border-t">
                    <Button
                      onClick={() => createContentMutation.mutate()}
                      disabled={
                        !canCreate || createContentMutation.isPending
                      }
                      className="flex-1"
                    >
                      {createContentMutation.isPending
                        ? "Creating..."
                        : "Create Content"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setFormData({
                          campaignId: selectedCampaign || 0,
                          type: "text",
                          title: "",
                          description: "",
                          textContent: "",
                          creativePrompt: "",
                          hashtags: [],
                          aiGenerated: false,
                        })
                      }
                    >
                      Clear
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Library</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm max-h-96 overflow-y-auto">
                {contentList.length === 0 ? (
                  <p className="text-gray-500">
                    No content yet. Create some!
                  </p>
                ) : (
                  contentList.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-2 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      <p className="font-medium text-xs text-gray-900">
                        {item.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        Type: {item.type}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          item.status === "draft"
                            ? "text-yellow-600"
                            : "text-green-600"
                        }`}
                      >
                        {item.status}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <p>
                • Use creative prompts to generate AI content automatically
              </p>
              <p>• Add relevant hashtags to increase discoverability</p>
              <p>• Mix content types for better engagement</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
