import { generateText, streamText } from "ai";
import { xai } from "@ai-sdk/xai";
import { TRPCError } from "@trpc/server";

const GROK_MODEL = "grok-4";

export type GrokTask =
  | "content_generation"
  | "trend_analysis"
  | "audience_insight"
  | "creative_optimization"
  | "engagement_prediction"
  | "virality_scoring"
  | "narrative_generation"
  | "caption_writing"
  | "hashtag_generation"
  | "sentiment_analysis";

/**
 * Generate content using Grok for marketing campaigns
 */
export async function generateMarketingContent(
  task: GrokTask,
  prompt: string,
  context?: Record<string, unknown>
): Promise<string> {
  try {
    const systemPrompt = buildSystemPrompt(task);
    const fullPrompt = context
      ? `${prompt}\n\nContext: ${JSON.stringify(context)}`
      : prompt;

    const result = await generateText({
      model: xai(GROK_MODEL, {
        apiKey: process.env.XAI_API_KEY,
      }),
      system: systemPrompt,
      prompt: fullPrompt,
      temperature: getTemperatureForTask(task),
      maxTokens: getMaxTokensForTask(task),
    });

    return result.text;
  } catch (error) {
    console.error(`[Grok] Error in ${task}:`, error);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Failed to generate content using Grok: ${String(error)}`,
    });
  }
}

/**
 * Stream content generation from Grok
 */
export async function streamMarketingContent(
  task: GrokTask,
  prompt: string,
  context?: Record<string, unknown>
) {
  const systemPrompt = buildSystemPrompt(task);
  const fullPrompt = context
    ? `${prompt}\n\nContext: ${JSON.stringify(context)}`
    : prompt;

  return streamText({
    model: xai(GROK_MODEL, {
      apiKey: process.env.XAI_API_KEY,
    }),
    system: systemPrompt,
    prompt: fullPrompt,
    temperature: getTemperatureForTask(task),
    maxTokens: getMaxTokensForTask(task),
  });
}

/**
 * Generate multiple content variants
 */
export async function generateContentVariants(
  task: GrokTask,
  basePrompt: string,
  variantCount: number = 3,
  context?: Record<string, unknown>
): Promise<string[]> {
  const variants: string[] = [];
  const systemPrompt = buildSystemPrompt(task);

  for (let i = 0; i < variantCount; i++) {
    const variantPrompt = `${basePrompt}\n\nGenerate variation ${i + 1}/${variantCount} with a different approach or angle.`;
    const fullPrompt = context
      ? `${variantPrompt}\n\nContext: ${JSON.stringify(context)}`
      : variantPrompt;

    try {
      const result = await generateText({
        model: xai(GROK_MODEL, {
          apiKey: process.env.XAI_API_KEY,
        }),
        system: systemPrompt,
        prompt: fullPrompt,
        temperature: getTemperatureForTask(task) + 0.1, // Slightly higher for variety
        maxTokens: getMaxTokensForTask(task),
      });

      variants.push(result.text);
    } catch (error) {
      console.error(`[Grok] Error generating variant ${i + 1}:`, error);
    }
  }

  return variants;
}

/**
 * Analyze trends and generate insights using Grok
 */
export async function analyzeTrendsWithGrok(
  trendData: Array<{
    name: string;
    momentum: number;
    sentiment: string;
    volume: number;
  }>
): Promise<{
  insights: string;
  opportunities: string[];
  warnings: string[];
  recommendations: string[];
}> {
  const prompt = `Analyze these trending topics and provide strategic marketing insights:
${JSON.stringify(trendData, null, 2)}

Provide:
1. Key insights about these trends
2. Opportunities for marketing campaigns (list 3-5)
3. Warnings or risks to avoid (list 2-3)
4. Specific recommendations for each trend`;

  const analysis = await generateText({
    model: xai(GROK_MODEL, {
      apiKey: process.env.XAI_API_KEY,
    }),
    system:
      "You are a viral marketing expert and trend analyst. Provide actionable insights and strategic recommendations.",
    prompt,
    temperature: 0.7,
    maxTokens: 2000,
  });

  // Parse the response to extract structured data
  const text = analysis.text;
  const sections = text.split("\n\n");

  return {
    insights: sections[0] || text,
    opportunities: extractBulletPoints(sections[1] || ""),
    warnings: extractBulletPoints(sections[2] || ""),
    recommendations: extractBulletPoints(sections[3] || ""),
  };
}

/**
 * Generate campaign narratives and story arcs
 */
export async function generateCampaignNarrative(
  campaignName: string,
  targetAudience: string,
  productOrService: string,
  tone: string
): Promise<{
  narrative: string;
  storyArcs: string[];
  keyMessages: string[];
}> {
  const prompt = `Create a compelling marketing narrative for:
Campaign: ${campaignName}
Target Audience: ${targetAudience}
Product/Service: ${productOrService}
Tone: ${tone}

Generate:
1. A cohesive campaign narrative (2-3 paragraphs)
2. 3-4 distinct story arcs for different content pieces
3. 5 key messages to repeat throughout the campaign`;

  const response = await generateText({
    model: xai(GROK_MODEL, {
      apiKey: process.env.XAI_API_KEY,
    }),
    system:
      "You are a master storyteller and narrative strategist for brands. Create emotionally resonant stories that drive engagement and conversions.",
    prompt,
    temperature: 0.8,
    maxTokens: 2500,
  });

  const sections = response.text.split("\n\n");

  return {
    narrative: sections[0] || response.text,
    storyArcs: extractBulletPoints(sections[1] || ""),
    keyMessages: extractBulletPoints(sections[2] || ""),
  };
}

/**
 * Predict engagement and virality potential
 */
export async function predictEngagementWithGrok(
  contentDescription: string,
  platform: string,
  targetAudience: string,
  recentTrends?: string[]
): Promise<{
  viralityScore: number;
  engagementPrediction: number;
  reasoning: string;
  improvements: string[];
}> {
  const trendContext = recentTrends
    ? `\nRecent trends: ${recentTrends.join(", ")}`
    : "";

  const prompt = `Predict the viral and engagement potential of this content:

Content: ${contentDescription}
Platform: ${platform}
Target Audience: ${targetAudience}${trendContext}

Provide:
1. Virality score (0-100)
2. Engagement prediction (0-100)
3. Detailed reasoning
4. Specific improvements to increase virality (3-5 suggestions)`;

  const response = await generateText({
    model: xai(GROK_MODEL, {
      apiKey: process.env.XAI_API_KEY,
    }),
    system:
      "You are a viral marketing expert who can predict content performance. Be specific and data-driven in your predictions.",
    prompt,
    temperature: 0.7,
    maxTokens: 1500,
  });

  const text = response.text;
  const viralityMatch = text.match(/Virality\s+score[:\s]*(\d+)/i);
  const engagementMatch = text.match(/Engagement\s+prediction[:\s]*(\d+)/i);

  return {
    viralityScore: viralityMatch ? parseInt(viralityMatch[1]) : 50,
    engagementPrediction: engagementMatch ? parseInt(engagementMatch[1]) : 50,
    reasoning: text.split("\n\n")[2] || text,
    improvements: extractBulletPoints(text.split("\n\n")[3] || ""),
  };
}

/**
 * Generate captions with hashtags and mentions
 */
export async function generateCaption(
  contentType: string,
  contentDescription: string,
  platform: string,
  tone: string,
  includeHashtags: boolean = true,
  includeMentions?: string[]
): Promise<{
  caption: string;
  hashtags: string[];
  mentions: string[];
}> {
  const mentionContext = includeMentions
    ? `\nInclude mentions: ${includeMentions.join(", ")}`
    : "";
  const hashtagInstruction = includeHashtags
    ? "Include 5-8 relevant hashtags."
    : "Do not include hashtags.";

  const prompt = `Generate a compelling social media caption:
Content Type: ${contentType}
Description: ${contentDescription}
Platform: ${platform}
Tone: ${tone}${mentionContext}

Requirements:
- Write engaging caption that drives engagement
- ${hashtagInstruction}
- Format for maximum reach
- Be platform-aware`;

  const response = await generateText({
    model: xai(GROK_MODEL, {
      apiKey: process.env.XAI_API_KEY,
    }),
    system:
      "You are a master social media copywriter. Create captions that drive engagement, shares, and conversions.",
    prompt,
    temperature: 0.8,
    maxTokens: 500,
  });

  const text = response.text;
  const hashtags = (text.match(/#\w+/g) || []).slice(0, 8);
  const mentions = (text.match(/@\w+/g) || []).slice(0, 3);

  return {
    caption: text.split("\n").slice(0, 1).join("\n"), // Take first paragraph as caption
    hashtags,
    mentions,
  };
}

// Helper functions

function buildSystemPrompt(task: GrokTask): string {
  const prompts: Record<GrokTask, string> = {
    content_generation:
      "You are an expert content creator for viral marketing campaigns. Generate engaging, shareable content that resonates with audiences across platforms.",
    trend_analysis:
      "You are a viral marketing expert and trend analyst. Analyze trends and provide actionable insights for marketing campaigns.",
    audience_insight:
      "You are a behavioral psychology expert and audience researcher. Provide deep insights into audience behaviors, preferences, and motivations.",
    creative_optimization:
      "You are a creative director and marketing strategist. Optimize creative assets for maximum impact and engagement.",
    engagement_prediction:
      "You are a data analyst expert in social media engagement. Predict content performance with accuracy and provide optimization strategies.",
    virality_scoring:
      "You are a virality expert. Score content for viral potential and explain what makes content shareable.",
    narrative_generation:
      "You are a master storyteller and brand narrative strategist. Create compelling stories that drive emotional connections and conversions.",
    caption_writing:
      "You are a master social media copywriter. Write captions that maximize engagement, shares, and follower growth.",
    hashtag_generation:
      "You are a social media optimization expert. Generate hashtags that maximize reach and discoverability.",
    sentiment_analysis:
      "You are a sentiment analysis expert. Analyze and provide insights on audience sentiment and emotional responses.",
  };

  return (
    prompts[task] ||
    "You are an expert AI marketing assistant. Provide high-quality marketing content and insights."
  );
}

function getTemperatureForTask(task: GrokTask): number {
  const temperatures: Record<GrokTask, number> = {
    content_generation: 0.8,
    trend_analysis: 0.6,
    audience_insight: 0.7,
    creative_optimization: 0.7,
    engagement_prediction: 0.5,
    virality_scoring: 0.6,
    narrative_generation: 0.85,
    caption_writing: 0.8,
    hashtag_generation: 0.6,
    sentiment_analysis: 0.5,
  };

  return temperatures[task] || 0.7;
}

function getMaxTokensForTask(task: GrokTask): number {
  const tokenLimits: Record<GrokTask, number> = {
    content_generation: 2000,
    trend_analysis: 1500,
    audience_insight: 1500,
    creative_optimization: 1200,
    engagement_prediction: 1000,
    virality_scoring: 1000,
    narrative_generation: 2500,
    caption_writing: 500,
    hashtag_generation: 300,
    sentiment_analysis: 1000,
  };

  return tokenLimits[task] || 1500;
}

function extractBulletPoints(text: string): string[] {
  return text
    .split("\n")
    .filter((line) => line.trim().match(/^[-•*]|\d+\./))
    .map((line) => line.replace(/^[-•*]|\d+\.\s*/, "").trim())
    .filter((line) => line.length > 0);
}
