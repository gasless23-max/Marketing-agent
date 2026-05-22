import { useState } from "react";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles, Copy, Download } from "lucide-react";
import { toast } from "sonner";

export default function GrokAIStudio() {
  const [activeTab, setActiveTab] = useState("content");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  
  // Content generation state
  const [contentTask, setContentTask] = useState<string>("caption_writing");
  const [contentPrompt, setContentPrompt] = useState<string>("");
  
  // Variants state
  const [variantsTask, setVariantsTask] = useState<string>("caption_writing");
  const [variantsPrompt, setVariantsPrompt] = useState<string>("");
  const [variantCount, setVariantCount] = useState<number>(3);
  const [variants, setVariants] = useState<string[]>([]);
  
  // Trend analysis state
  const [trendInput, setTrendInput] = useState<string>("");
  const [trendAnalysis, setTrendAnalysis] = useState<any>(null);
  
  // Narrative state
  const [campaignName, setCampaignName] = useState<string>("");
  const [targetAudience, setTargetAudience] = useState<string>("");
  const [productService, setProductService] = useState<string>("");
  const [tone, setTone] = useState<string>("professional");
  const [narrative, setNarrative] = useState<any>(null);
  
  // Engagement prediction state
  const [contentDesc, setContentDesc] = useState<string>("");
  const [platform, setPlatform] = useState<string>("twitter");
  const [audience, setAudience] = useState<string>("");
  const [trends, setTrends] = useState<string>("");
  const [prediction, setPrediction] = useState<any>(null);
  
  // Caption state
  const [captionType, setCaptionType] = useState<string>("image");
  const [captionDesc, setCaptionDesc] = useState<string>("");
  const [captionPlatform, setCaptionPlatform] = useState<string>("instagram");
  const [captionTone, setCaptionTone] = useState<string>("casual");
  const [caption, setCaption] = useState<any>(null);

  // Grok mutations
  const generateContentMutation = trpc.marketing.ai.generateContent.useMutation();
  const generateVariantsMutation = trpc.marketing.ai.generateVariants.useMutation();
  const analyzeTrendsMutation = trpc.marketing.ai.analyzeTrends.useMutation();
  const generateNarrativeMutation = trpc.marketing.ai.generateNarrative.useMutation();
  const predictEngagementMutation = trpc.marketing.ai.predictEngagement.useMutation();
  const generateCaptionMutation = trpc.marketing.ai.generateCaption.useMutation();

  // Handlers
  const handleGenerateContent = async () => {
    if (!contentPrompt) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const response = await generateContentMutation.mutateAsync({
        task: contentTask as any,
        prompt: contentPrompt,
      });
      setResult(response.content);
      toast.success("Content generated!");
    } catch (error) {
      toast.error("Failed to generate content");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVariants = async () => {
    if (!variantsPrompt) {
      toast.error("Please enter a prompt");
      return;
    }
    setLoading(true);
    try {
      const response = await generateVariantsMutation.mutateAsync({
        task: variantsTask as any,
        basePrompt: variantsPrompt,
        variantCount,
      });
      setVariants(response.variants);
      toast.success(`Generated ${response.variants.length} variants!`);
    } catch (error) {
      toast.error("Failed to generate variants");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeTrends = async () => {
    if (!trendInput) {
      toast.error("Please enter trends data");
      return;
    }
    setLoading(true);
    try {
      const trendsData = JSON.parse(trendInput);
      const response = await analyzeTrendsMutation.mutateAsync({
        trends: trendsData,
      });
      setTrendAnalysis(response);
      toast.success("Trends analyzed!");
    } catch (error) {
      toast.error("Failed to analyze trends");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNarrative = async () => {
    if (!campaignName || !targetAudience || !productService) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const response = await generateNarrativeMutation.mutateAsync({
        campaignName,
        targetAudience,
        productOrService: productService,
        tone,
      });
      setNarrative(response);
      toast.success("Narrative generated!");
    } catch (error) {
      toast.error("Failed to generate narrative");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictEngagement = async () => {
    if (!contentDesc || !audience) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      const response = await predictEngagementMutation.mutateAsync({
        contentDescription: contentDesc,
        platform,
        targetAudience: audience,
        recentTrends: trends ? trends.split(",").map(t => t.trim()) : undefined,
      });
      setPrediction(response);
      toast.success("Engagement predicted!");
    } catch (error) {
      toast.error("Failed to predict engagement");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCaption = async () => {
    if (!captionDesc) {
      toast.error("Please describe the content");
      return;
    }
    setLoading(true);
    try {
      const response = await generateCaptionMutation.mutateAsync({
        contentType: captionType,
        contentDescription: captionDesc,
        platform: captionPlatform,
        tone: captionTone,
        includeHashtags: true,
      });
      setCaption(response);
      toast.success("Caption generated!");
    } catch (error) {
      toast.error("Failed to generate caption");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="w-8 h-8 text-amber-400" />
            <h1 className="text-4xl font-bold text-white">Grok AI Studio</h1>
          </div>
          <p className="text-slate-400">
            Powered by xAI Grok - Generate viral content, analyze trends, and predict engagement
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-slate-800">
            <TabsTrigger value="content">Generate</TabsTrigger>
            <TabsTrigger value="variants">Variants</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="narrative">Narrative</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="caption">Captions</TabsTrigger>
          </TabsList>

          {/* Generate Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Generate Content with Grok</CardTitle>
                <CardDescription>Create marketing content for any purpose</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="task">Content Task</Label>
                  <Select value={contentTask} onValueChange={setContentTask}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="content_generation">Content Generation</SelectItem>
                      <SelectItem value="caption_writing">Caption Writing</SelectItem>
                      <SelectItem value="narrative_generation">Narrative Generation</SelectItem>
                      <SelectItem value="creative_optimization">Creative Optimization</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what content you want to generate..."
                    value={contentPrompt}
                    onChange={(e) => setContentPrompt(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-32"
                  />
                </div>

                <Button
                  onClick={handleGenerateContent}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate Content
                </Button>

                {result && (
                  <Card className="border-slate-600 bg-slate-700">
                    <CardHeader>
                      <CardTitle className="text-sm text-white">Generated Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4 whitespace-pre-wrap">{result}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(result)}
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Generate Variants Tab */}
          <TabsContent value="variants" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Generate Content Variants</CardTitle>
                <CardDescription>Create multiple variations of your content</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="variantsTask">Content Type</Label>
                  <Select value={variantsTask} onValueChange={setVariantsTask}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="content_generation">Content Generation</SelectItem>
                      <SelectItem value="caption_writing">Caption Writing</SelectItem>
                      <SelectItem value="narrative_generation">Narrative Generation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variantsPrompt">Base Prompt</Label>
                  <Textarea
                    id="variantsPrompt"
                    placeholder="Describe the base content..."
                    value={variantsPrompt}
                    onChange={(e) => setVariantsPrompt(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-32"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variantCount">Number of Variants</Label>
                  <Input
                    id="variantCount"
                    type="number"
                    min={1}
                    max={10}
                    value={variantCount}
                    onChange={(e) => setVariantCount(parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <Button
                  onClick={handleGenerateVariants}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate Variants
                </Button>

                {variants.length > 0 && (
                  <div className="space-y-3">
                    {variants.map((variant, idx) => (
                      <Card key={idx} className="border-slate-600 bg-slate-700">
                        <CardHeader>
                          <CardTitle className="text-sm text-white">Variant {idx + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300 mb-3 whitespace-pre-wrap">{variant}</p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(variant)}
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Analysis Tab */}
          <TabsContent value="trends" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Analyze Trends with Grok</CardTitle>
                <CardDescription>Get insights on trending topics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="trendInput">Trends Data (JSON)</Label>
                  <Textarea
                    id="trendInput"
                    placeholder={`[{"name": "trend1", "momentum": 85, "sentiment": "positive", "volume": 5000}]`}
                    value={trendInput}
                    onChange={(e) => setTrendInput(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-32 font-mono text-sm"
                  />
                </div>

                <Button
                  onClick={handleAnalyzeTrends}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Analyze Trends
                </Button>

                {trendAnalysis && (
                  <div className="space-y-4">
                    <Card className="border-slate-600 bg-slate-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300">{trendAnalysis.insights}</p>
                      </CardContent>
                    </Card>

                    {trendAnalysis.opportunities.length > 0 && (
                      <Card className="border-slate-600 bg-slate-700">
                        <CardHeader>
                          <CardTitle className="text-sm text-white">Opportunities</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-2">
                            {trendAnalysis.opportunities.map((opp: string, idx: number) => (
                              <li key={idx} className="text-slate-300">{opp}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign Narrative Tab */}
          <TabsContent value="narrative" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Generate Campaign Narrative</CardTitle>
                <CardDescription>Create compelling campaign stories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">Campaign Name</Label>
                    <Input
                      id="campaignName"
                      placeholder="My Campaign"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="productService">Product/Service</Label>
                    <Input
                      id="productService"
                      placeholder="What are you promoting?"
                      value={productService}
                      onChange={(e) => setProductService(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="Describe your audience"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tone">Campaign Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerateNarrative}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate Narrative
                </Button>

                {narrative && (
                  <div className="space-y-4">
                    <Card className="border-slate-600 bg-slate-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Campaign Narrative</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 whitespace-pre-wrap">{narrative.narrative}</p>
                      </CardContent>
                    </Card>

                    {narrative.storyArcs.length > 0 && (
                      <Card className="border-slate-600 bg-slate-700">
                        <CardHeader>
                          <CardTitle className="text-sm text-white">Story Arcs</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-2">
                            {narrative.storyArcs.map((arc: string, idx: number) => (
                              <li key={idx} className="text-slate-300">{arc}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engagement Prediction Tab */}
          <TabsContent value="engagement" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Predict Engagement Potential</CardTitle>
                <CardDescription>Analyze content virality and engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="contentDesc">Content Description</Label>
                  <Textarea
                    id="contentDesc"
                    placeholder="Describe your content..."
                    value={contentDesc}
                    onChange={(e) => setContentDesc(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-24"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select value={platform} onValueChange={setPlatform}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="twitter">X (Twitter)</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="telegram">Telegram</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="audience2">Target Audience</Label>
                    <Input
                      id="audience2"
                      placeholder="Audience description"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="trends">Recent Trends (comma-separated)</Label>
                  <Input
                    id="trends"
                    placeholder="trend1, trend2, trend3"
                    value={trends}
                    onChange={(e) => setTrends(e.target.value)}
                    className="bg-slate-700 border-slate-600"
                  />
                </div>

                <Button
                  onClick={handlePredictEngagement}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Predict Engagement
                </Button>

                {prediction && (
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border-slate-600 bg-slate-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Virality Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-400">{prediction.viralityScore}/100</div>
                      </CardContent>
                    </Card>

                    <Card className="border-slate-600 bg-slate-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Engagement Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-amber-400">{prediction.engagementPrediction}/100</div>
                      </CardContent>
                    </Card>

                    <div className="col-span-2">
                      <Card className="border-slate-600 bg-slate-700">
                        <CardHeader>
                          <CardTitle className="text-sm text-white">Improvements</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <ul className="list-disc pl-5 space-y-2">
                            {prediction.improvements.map((imp: string, idx: number) => (
                              <li key={idx} className="text-slate-300">{imp}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Caption Generation Tab */}
          <TabsContent value="caption" className="space-y-6">
            <Card className="border-slate-700 bg-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Generate Social Media Captions</CardTitle>
                <CardDescription>Create captions with hashtags and mentions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captionType">Content Type</Label>
                    <Select value={captionType} onValueChange={setCaptionType}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="image">Image</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                        <SelectItem value="reels">Reels</SelectItem>
                        <SelectItem value="story">Story</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="captionPlatform">Platform</Label>
                    <Select value={captionPlatform} onValueChange={setCaptionPlatform}>
                      <SelectTrigger className="bg-slate-700 border-slate-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-700 border-slate-600">
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="twitter">X (Twitter)</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captionDesc">Content Description</Label>
                  <Textarea
                    id="captionDesc"
                    placeholder="Describe what's in the image or video..."
                    value={captionDesc}
                    onChange={(e) => setCaptionDesc(e.target.value)}
                    className="bg-slate-700 border-slate-600 min-h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captionTone">Tone</Label>
                  <Select value={captionTone} onValueChange={setCaptionTone}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-700 border-slate-600">
                      <SelectItem value="casual">Casual</SelectItem>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="humorous">Humorous</SelectItem>
                      <SelectItem value="inspirational">Inspirational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={handleGenerateCaption}
                  disabled={loading}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Generate Caption
                </Button>

                {caption && (
                  <div className="space-y-4">
                    <Card className="border-slate-600 bg-slate-700">
                      <CardHeader>
                        <CardTitle className="text-sm text-white">Caption</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-300 whitespace-pre-wrap mb-4">{caption.caption}</p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(caption.caption)}
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Caption
                        </Button>
                      </CardContent>
                    </Card>

                    {caption.hashtags.length > 0 && (
                      <Card className="border-slate-600 bg-slate-700">
                        <CardHeader>
                          <CardTitle className="text-sm text-white">Hashtags</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-2">
                            {caption.hashtags.map((tag: string, idx: number) => (
                              <button
                                key={idx}
                                onClick={() => copyToClipboard(tag)}
                                className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded hover:bg-amber-500/30 transition-colors"
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
