import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Marketing Agent Tables
export const campaigns = mysqlTable("campaigns", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: mysqlEnum("status", ["draft", "active", "paused", "completed"]).default("draft").notNull(),
  targetAudience: text("targetAudience"),
  goals: text("goals"), // JSON array of campaign goals
  platforms: text("platforms"), // JSON array of platforms (X, TikTok, Instagram, etc)
  budget: int("budget"), // in cents
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type InsertCampaign = typeof campaigns.$inferInsert;

export const content = mysqlTable("content", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["image", "video", "text", "carousel", "meme"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  mediaUrl: varchar("mediaUrl", { length: 2048 }),
  textContent: text("textContent"),
  hashtags: text("hashtags"), // JSON array
  mentions: text("mentions"), // JSON array
  aiGenerated: int("aiGenerated").default(0), // boolean: 0 or 1
  creativePrompt: text("creativePrompt"),
  trendingScore: int("trendingScore").default(0),
  engagementScore: int("engagementScore").default(0),
  status: mysqlEnum("status", ["draft", "approved", "scheduled", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Content = typeof content.$inferSelect;
export type InsertContent = typeof content.$inferInsert;

export const schedules = mysqlTable("schedules", {
  id: int("id").autoincrement().primaryKey(),
  contentId: int("contentId").notNull(),
  campaignId: int("campaignId").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // X, TikTok, Instagram, etc
  scheduledTime: timestamp("scheduledTime").notNull(),
  published: int("published").default(0), // boolean
  publishedTime: timestamp("publishedTime"),
  status: mysqlEnum("status", ["scheduled", "published", "failed", "cancelled"]).default("scheduled").notNull(),
  postId: varchar("postId", { length: 255 }),
  metrics: text("metrics"), // JSON object of platform-specific metrics
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Schedule = typeof schedules.$inferSelect;
export type InsertSchedule = typeof schedules.$inferInsert;

export const trends = mysqlTable("trends", {
  id: int("id").autoincrement().primaryKey(),
  trendName: varchar("trendName", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  platform: varchar("platform", { length: 50 }),
  momentum: int("momentum").default(0), // 0-100 score
  volume: int("volume").default(0), // number of mentions
  sentiment: mysqlEnum("sentiment", ["positive", "neutral", "negative"]).default("neutral"),
  description: text("description"),
  relatedHashtags: text("relatedHashtags"), // JSON array
  lastUpdated: timestamp("lastUpdated").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Trend = typeof trends.$inferSelect;
export type InsertTrend = typeof trends.$inferInsert;

export const analytics = mysqlTable("analytics", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  scheduleId: int("scheduleId"),
  userId: int("userId").notNull(),
  platform: varchar("platform", { length: 50 }),
  views: int("views").default(0),
  likes: int("likes").default(0),
  comments: int("comments").default(0),
  shares: int("shares").default(0),
  clicks: int("clicks").default(0),
  impressions: int("impressions").default(0),
  conversions: int("conversions").default(0),
  conversionValue: int("conversionValue").default(0), // in cents
  engagementRate: int("engagementRate").default(0), // percentage * 100
  sentiment: text("sentiment"), // JSON breakdown of sentiment
  demographics: text("demographics"), // JSON of audience demographics
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = typeof analytics.$inferInsert;

export const predictions = mysqlTable("predictions", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  userId: int("userId").notNull(),
  predictedReach: int("predictedReach").default(0),
  predictedEngagement: int("predictedEngagement").default(0),
  growthPrediction: int("growthPrediction").default(0), // percentage
  viralityScore: int("viralityScore").default(0), // 0-100
  bestTimeToPost: timestamp("bestTimeToPost"),
  recommendedPlatforms: text("recommendedPlatforms"), // JSON array
  confidenceScore: int("confidenceScore").default(0), // percentage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = typeof predictions.$inferInsert;

export const channelCredentials = mysqlTable("channelCredentials", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  platform: varchar("platform", { length: 50 }).notNull(), // X, TikTok, Instagram, Telegram, Discord, etc
  accountName: varchar("accountName", { length: 255 }).notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  expiresAt: timestamp("expiresAt"),
  accountId: varchar("accountId", { length: 255 }),
  isActive: int("isActive").default(1), // boolean
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ChannelCredential = typeof channelCredentials.$inferSelect;
export type InsertChannelCredential = typeof channelCredentials.$inferInsert;

export const agentMetrics = mysqlTable("agentMetrics", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignsCreated: int("campaignsCreated").default(0),
  contentGenerated: int("contentGenerated").default(0),
  postsPublished: int("postsPublished").default(0),
  totalReach: int("totalReach").default(0),
  totalEngagement: int("totalEngagement").default(0),
  averageEngagementRate: int("averageEngagementRate").default(0), // percentage * 100
  topPerformingContent: varchar("topPerformingContent", { length: 255 }),
  lastOptimizationRun: timestamp("lastOptimizationRun"),
  optimizationIterations: int("optimizationIterations").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AgentMetric = typeof agentMetrics.$inferSelect;
export type InsertAgentMetric = typeof agentMetrics.$inferInsert;

// Phase 1: Enhanced Data Layer and Explainability
export const explainabilityLogs = mysqlTable("explainabilityLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  agentActionType: varchar("agentActionType", { length: 100 }).notNull(), // "creative_generation", "audience_targeting", "scheduling", "optimization", etc
  decision: text("decision").notNull(), // JSON object describing the decision made
  reasoning: text("reasoning").notNull(), // Human-readable explanation of WHY the decision was made
  confidence: int("confidence").default(0), // 0-100 confidence score
  factors: text("factors"), // JSON array of factors that influenced decision
  alternatives: text("alternatives"), // JSON array of alternative decisions considered
  outcome: text("outcome"), // JSON object with actual results after decision execution
  outcomeDifference: int("outcomeDifference").default(0), // percentage deviation from prediction
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ExplainabilityLog = typeof explainabilityLogs.$inferSelect;
export type InsertExplainabilityLog = typeof explainabilityLogs.$inferInsert;

export const unifiedDataGraph = mysqlTable("unifiedDataGraph", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  entityType: varchar("entityType", { length: 50 }).notNull(), // "audience_segment", "behavioral_cluster", "conversion_funnel", etc
  entityId: varchar("entityId", { length: 255 }).notNull(),
  data: text("data").notNull(), // JSON blob of unified data
  onChainData: text("onChainData"), // JSON blockchain data (wallet history, NFT holdings, etc)
  offChainData: text("offChainData"), // JSON social/traditional data
  crmData: text("crmData"), // JSON CRM integration data
  campaignTelemetry: text("campaignTelemetry"), // JSON campaign performance data
  crossDomainScore: int("crossDomainScore").default(0), // 0-100 score of relevance across domains
  lastSync: timestamp("lastSync").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type UnifiedDataGraph = typeof unifiedDataGraph.$inferSelect;
export type InsertUnifiedDataGraph = typeof unifiedDataGraph.$inferInsert;

export const audienceSegments = mysqlTable("audienceSegments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId"),
  segmentName: varchar("segmentName", { length: 255 }).notNull(),
  description: text("description"),
  segmentType: mysqlEnum("segmentType", ["behavioral", "demographic", "psychographic", "wallet_based", "nft_based", "meme_affinity"]).notNull(),
  criteria: text("criteria"), // JSON object of segmentation criteria
  size: int("size").default(0), // estimated segment size
  reach: int("reach").default(0), // estimated reach
  engagementPotential: int("engagementPotential").default(0), // 0-100 score
  walletData: text("walletData"), // JSON blockchain wallet metrics
  nftHoldings: text("nftHoldings"), // JSON of NFT ownership patterns
  memeInteractions: text("memeInteractions"), // JSON of meme engagement history
  socialSentiment: text("socialSentiment"), // JSON sentiment analysis
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AudienceSegment = typeof audienceSegments.$inferSelect;
export type InsertAudienceSegment = typeof audienceSegments.$inferInsert;

export const brandProfiles = mysqlTable("brandProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  brandName: varchar("brandName", { length: 255 }).notNull(),
  tone: text("tone"), // JSON description of brand tone/voice
  personality: text("personality"), // JSON description of brand personality traits
  creativeEthos: text("creativeEthos"), // JSON of creative style guidelines
  brandTrainingData: text("brandTrainingData"), // JSON URLs/samples of brand content
  llmFineTuningId: varchar("llmFineTuningId", { length: 255 }), // ID of fine-tuned LLM model
  creativeStyle: text("creativeStyle"), // JSON visual and copy style guidelines
  targetAudienceProfile: text("targetAudienceProfile"), // JSON primary audience description
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BrandProfile = typeof brandProfiles.$inferSelect;
export type InsertBrandProfile = typeof brandProfiles.$inferInsert;

export const closedLoopOptimizations = mysqlTable("closedLoopOptimizations", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  iterationNumber: int("iterationNumber").default(1),
  optimizationTarget: varchar("optimizationTarget", { length: 100 }).notNull(), // "ctr", "engagement", "conversion", "reach", "virality"
  previousMetrics: text("previousMetrics"), // JSON of metrics before optimization
  optimizationApplied: text("optimizationApplied"), // JSON describing what was changed
  newMetrics: text("newMetrics"), // JSON of metrics after optimization
  improvement: int("improvement").default(0), // percentage improvement
  automationLevel: mysqlEnum("automationLevel", ["manual", "ai_suggested", "fully_autonomous"]).default("manual"),
  status: mysqlEnum("status", ["pending", "active", "completed", "reverted"]).default("pending"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type ClosedLoopOptimization = typeof closedLoopOptimizations.$inferSelect;
export type InsertClosedLoopOptimization = typeof closedLoopOptimizations.$inferInsert;

// Phase 2: Multi-agent Collaboration
export const agents = mysqlTable("agents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  agentName: varchar("agentName", { length: 255 }).notNull(),
  agentType: mysqlEnum("agentType", ["planner", "creator", "scheduler", "analyzer", "optimizer", "coordinator"]).notNull(),
  systemPrompt: text("systemPrompt"),
  capabilities: text("capabilities"), // JSON array of capabilities
  sharedInsights: text("sharedInsights"), // JSON object of shared knowledge
  collaborationMode: mysqlEnum("collaborationMode", ["autonomous", "collaborative", "supervised"]).default("supervised"),
  status: mysqlEnum("status", ["active", "paused", "inactive"]).default("active"),
  lastAction: timestamp("lastAction"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

export const agentInteractions = mysqlTable("agentInteractions", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  agentId: int("agentId").notNull(),
  actionSequence: int("actionSequence"),
  action: varchar("action", { length: 255 }).notNull(),
  decision: text("decision"), // JSON of decision made
  sharedInsights: text("sharedInsights"), // JSON insights shared with other agents
  feedback: text("feedback"), // JSON feedback received from users/other agents
  status: mysqlEnum("status", ["initiated", "executing", "completed", "failed"]).default("initiated"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AgentInteraction = typeof agentInteractions.$inferSelect;
export type InsertAgentInteraction = typeof agentInteractions.$inferInsert;

// Phase 4: Web3 Integration
export const blockchainCampaigns = mysqlTable("blockchainCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  chainId: int("chainId"), // Ethereum chain ID
  contractAddress: varchar("contractAddress", { length: 255 }),
  triggerType: mysqlEnum("triggerType", ["token_launch", "nft_mint", "governance_proposal", "liquidity_event", "custom"]).default("custom"),
  triggerConditions: text("triggerConditions"), // JSON smart contract conditions
  automationStatus: mysqlEnum("automationStatus", ["pending", "active", "executed", "failed"]).default("pending"),
  nftRewardId: varchar("nftRewardId", { length: 255 }), // Dynamic NFT ID for engagement rewards
  nftMetadata: text("nftMetadata"), // JSON of NFT metadata
  onChainMetrics: text("onChainMetrics"), // JSON transaction/wallet metrics
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlockchainCampaign = typeof blockchainCampaigns.$inferSelect;
export type InsertBlockchainCampaign = typeof blockchainCampaigns.$inferInsert;

// Phase 5: Virality Engine and Narrative Tracking
export const memeAnalytics = mysqlTable("memeAnalytics", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId"),
  contentId: int("contentId"),
  userId: int("userId").notNull(),
  memeName: varchar("memeName", { length: 255 }),
  trendPhase: mysqlEnum("trendPhase", ["emerging", "growing", "peak", "declining", "dead"]).default("emerging"),
  viralityScore: int("viralityScore").default(0), // 0-100
  shareability: int("shareability").default(0), // 0-100
  momentum: int("momentum").default(0), // rate of spread
  crossPlatformSpread: text("crossPlatformSpread"), // JSON of spread across platforms
  narrativeVariations: text("narrativeVariations"), // JSON of different meme variations
  sentiment: text("sentiment"), // JSON sentiment breakdown
  participationRate: int("participationRate").default(0),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MemeAnalytic = typeof memeAnalytics.$inferSelect;
export type InsertMemeAnalytic = typeof memeAnalytics.$inferInsert;

export const narrativeTracking = mysqlTable("narrativeTracking", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  narrativeTheme: varchar("narrativeTheme", { length: 255 }).notNull(),
  originatingContent: int("originatingContent"), // contentId where narrative started
  lifecyclePhase: mysqlEnum("lifecyclePhase", ["launch", "amplification", "peak", "saturation", "decline", "archived"]).default("launch"),
  relatedTrends: text("relatedTrends"), // JSON array of related trends
  adaptations: text("adaptations"), // JSON array of creative adaptations
  sentimentTrajectory: text("sentimentTrajectory"), // JSON array of sentiment over time
  crossPlatformMetrics: text("crossPlatformMetrics"), // JSON metrics per platform
  vitality: int("vitality").default(0), // 0-100 current narrative health
  reachCumulative: int("reachCumulative").default(0),
  engagementCumulative: int("engagementCumulative").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NarrativeTracking = typeof narrativeTracking.$inferSelect;
export type InsertNarrativeTracking = typeof narrativeTracking.$inferInsert;

// Phase 3: Creative Ecosystem
export const creativeAssets = mysqlTable("creativeAssets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId"),
  assetType: mysqlEnum("assetType", ["image", "video", "audio", "text", "template", "scene"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  adobeProjectId: varchar("adobeProjectId", { length: 255 }), // Adobe Creative Cloud project ID
  adobeAssetId: varchar("adobeAssetId", { length: 255 }), // Adobe asset ID
  fireflySrc: varchar("fireflySrc", { length: 2048 }), // Firefly generation source URL
  generationPrompt: text("generationPrompt"),
  mediaUrl: varchar("mediaUrl", { length: 2048 }),
  variantUrls: text("variantUrls"), // JSON array of variant URLs
  dimensions: varchar("dimensions", { length: 50 }), // e.g., "1920x1080"
  format: varchar("format", { length: 50 }), // "jpg", "mp4", "png", etc
  duration: int("duration"), // in seconds for video/audio
  performanceMetrics: text("performanceMetrics"), // JSON of performance data
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CreativeAsset = typeof creativeAssets.$inferSelect;
export type InsertCreativeAsset = typeof creativeAssets.$inferInsert;

export const cinematicWorkflows = mysqlTable("cinematicWorkflows", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId").notNull(),
  workflowName: varchar("workflowName", { length: 255 }).notNull(),
  storyboard: text("storyboard"), // JSON array of scenes
  sceneCount: int("sceneCount").default(0),
  generatedScenes: text("generatedScenes"), // JSON array of generated scene IDs
  voiceOverScript: text("voiceOverScript"),
  voiceOverAudioUrl: varchar("voiceOverAudioUrl", { length: 2048 }),
  musicBed: varchar("musicBed", { length: 2048 }),
  brandingElements: text("brandingElements"), // JSON of brand elements applied
  outputStatus: mysqlEnum("outputStatus", ["planning", "generating", "rendering", "completed", "failed"]).default("planning"),
  outputVideoUrl: varchar("outputVideoUrl", { length: 2048 }),
  estimatedProductionTime: int("estimatedProductionTime"), // in minutes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CinematicWorkflow = typeof cinematicWorkflows.$inferSelect;
export type InsertCinematicWorkflow = typeof cinematicWorkflows.$inferInsert;

// Phase 6: API-first Architecture
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 100 }).notNull(), // "campaign.created", "content.published", "optimization.completed", etc
  targetUrl: varchar("targetUrl", { length: 2048 }).notNull(),
  isActive: int("isActive").default(1), // boolean
  retryPolicy: text("retryPolicy"), // JSON retry configuration
  headers: text("headers"), // JSON custom headers
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

export const apiExtensions = mysqlTable("apiExtensions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  extensionName: varchar("extensionName", { length: 255 }).notNull(),
  description: text("description"),
  extensionCode: text("extensionCode"), // Custom extension code
  apiEndpoint: varchar("apiEndpoint", { length: 2048 }),
  status: mysqlEnum("status", ["draft", "published", "disabled"]).default("draft"),
  permissions: text("permissions"), // JSON array of required permissions
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ApiExtension = typeof apiExtensions.$inferSelect;
export type InsertApiExtension = typeof apiExtensions.$inferInsert;

// Phase 7: No-code Enterprise UX
export const workflowBuilders = mysqlTable("workflowBuilders", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId"),
  workflowName: varchar("workflowName", { length: 255 }).notNull(),
  description: text("description"),
  flowDefinition: text("flowDefinition"), // JSON DAG of workflow steps
  nodes: text("nodes"), // JSON array of workflow nodes
  edges: text("edges"), // JSON array of connections between nodes
  status: mysqlEnum("status", ["draft", "active", "paused", "completed"]).default("draft"),
  executionCount: int("executionCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WorkflowBuilder = typeof workflowBuilders.$inferSelect;
export type InsertWorkflowBuilder = typeof workflowBuilders.$inferInsert;

export const narrativeDashboards = mysqlTable("narrativeDashboards", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  campaignId: int("campaignId").notNull(),
  dashboardName: varchar("dashboardName", { length: 255 }).notNull(),
  timelineData: text("timelineData"), // JSON timeline of campaign events
  memeSpreadData: text("memeSpreadData"), // JSON meme lifecycle visualization
  audienceEvolutionData: text("audienceEvolutionData"), // JSON audience growth over time
  sentimentTrajectory: text("sentimentTrajectory"), // JSON sentiment timeline
  keyMilestones: text("keyMilestones"), // JSON array of important events
  narrativeArcs: text("narrativeArcs"), // JSON array of narrative story arcs
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NarrativeDashboard = typeof narrativeDashboards.$inferSelect;
export type InsertNarrativeDashboard = typeof narrativeDashboards.$inferInsert;

// Phase 8: Multi-modal Automation
export const multimodalCampaigns = mysqlTable("multimodalCampaigns", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  testingMode: mysqlEnum("testingMode", ["ab", "abc", "abx", "multivariate"]).default("ab"),
  variants: text("variants"), // JSON array of content variants being tested
  testStatus: mysqlEnum("testStatus", ["planning", "running", "analyzing", "completed"]).default("planning"),
  winnerContentId: int("winnerContentId"),
  autoPromoteWinner: int("autoPromoteWinner").default(0), // boolean
  budgetOptimization: text("budgetOptimization"), // JSON budget allocation strategy
  performanceMetrics: text("performanceMetrics"), // JSON aggregated test metrics
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type MultimodalCampaign = typeof multimodalCampaigns.$inferSelect;
export type InsertMultimodalCampaign = typeof multimodalCampaigns.$inferInsert;

export const adBudgetOptimizations = mysqlTable("adBudgetOptimizations", {
  id: int("id").autoincrement().primaryKey(),
  campaignId: int("campaignId").notNull(),
  userId: int("userId").notNull(),
  totalBudget: int("totalBudget"), // in cents
  allocatedBudget: int("allocatedBudget"), // currently allocated
  platformAllocations: text("platformAllocations"), // JSON per-platform budget allocation
  optimizationIteration: int("optimizationIteration").default(1),
  lastOptimizationTime: timestamp("lastOptimizationTime"),
  optimizationStrategy: text("optimizationStrategy"), // JSON algorithm strategy used
  expectedRoi: int("expectedRoi").default(0), // expected return on investment percentage
  actualRoi: int("actualRoi").default(0),
  status: mysqlEnum("status", ["planning", "active", "optimizing", "completed"]).default("planning"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdBudgetOptimization = typeof adBudgetOptimizations.$inferSelect;
export type InsertAdBudgetOptimization = typeof adBudgetOptimizations.$inferInsert;
