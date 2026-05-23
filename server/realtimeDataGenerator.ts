import { Server as SocketIOServer } from 'socket.io';
import {
  RealtimeMetrics,
  AgentStatus,
  broadcastMetricsUpdate,
  broadcastAgentStatus,
  broadcastCampaignEvent,
  broadcastAlert,
} from './websocket';

// Simulated real-time data state
let metricsState: RealtimeMetrics = {
  campaignsLaunched: 342,
  engagementScore: 8.7,
  walletTargets: 847000,
  trendSignals: 1247,
  adImpressions: 12300000,
  conversionRate: 4.2,
};

let agentStates: Map<string, AgentStatus> = new Map([
  ['trend-hunter', { id: 'trend-hunter', name: 'Trend Hunter', status: 'active', lastUpdate: Date.now(), tasksCompleted: 1247 }],
  ['meme-intelligence', { id: 'meme-intelligence', name: 'Meme Intelligence', status: 'active', lastUpdate: Date.now(), tasksCompleted: 892 }],
  ['campaign-execution', { id: 'campaign-execution', name: 'Campaign Execution', status: 'processing', lastUpdate: Date.now(), tasksCompleted: 2156, currentTask: 'Launching TikTok campaign' }],
  ['community-growth', { id: 'community-growth', name: 'Community Growth', status: 'active', lastUpdate: Date.now(), tasksCompleted: 1834 }],
  ['ad-optimization', { id: 'ad-optimization', name: 'Ad Optimization', status: 'idle', lastUpdate: Date.now(), tasksCompleted: 3421 }],
  ['wallet-analytics', { id: 'wallet-analytics', name: 'Wallet Analytics', status: 'active', lastUpdate: Date.now(), tasksCompleted: 2847 }],
  ['influencer-outreach', { id: 'influencer-outreach', name: 'Influencer Outreach', status: 'processing', lastUpdate: Date.now(), tasksCompleted: 756, currentTask: 'Analyzing influencer profiles' }],
  ['creative-director', { id: 'creative-director', name: 'Creative Director', status: 'active', lastUpdate: Date.now(), tasksCompleted: 1923 }],
  ['conversion-intelligence', { id: 'conversion-intelligence', name: 'Conversion Intelligence', status: 'active', lastUpdate: Date.now(), tasksCompleted: 2564 }],
  ['sentiment-surveillance', { id: 'sentiment-surveillance', name: 'Sentiment Surveillance', status: 'active', lastUpdate: Date.now(), tasksCompleted: 3892 }],
]);

const campaignEvents = [
  'Campaign launched on TikTok',
  'Instagram engagement spike detected',
  'Wallet movement alert: Large transaction',
  'Trend signal: #AIMarketing trending',
  'NFT holder engagement increased',
  'DeFi protocol activity detected',
  'Influencer collaboration initiated',
  'Creative asset generated',
  'Conversion funnel optimized',
  'Community sentiment positive',
];

// Generate random metric updates
export function generateMetricUpdate(): RealtimeMetrics {
  const variance = 0.05; // 5% variance
  
  return {
    campaignsLaunched: Math.floor(metricsState.campaignsLaunched + (Math.random() - 0.5) * metricsState.campaignsLaunched * variance),
    engagementScore: Math.max(0, Math.min(10, metricsState.engagementScore + (Math.random() - 0.5) * 0.5)),
    walletTargets: Math.floor(metricsState.walletTargets + (Math.random() - 0.5) * metricsState.walletTargets * variance),
    trendSignals: Math.floor(metricsState.trendSignals + (Math.random() - 0.5) * metricsState.trendSignals * variance),
    adImpressions: Math.floor(metricsState.adImpressions + (Math.random() - 0.5) * metricsState.adImpressions * variance),
    conversionRate: Math.max(0, Math.min(10, metricsState.conversionRate + (Math.random() - 0.5) * 0.3)),
  };
}

// Generate random agent status updates
export function generateAgentStatusUpdate(): AgentStatus {
  const agents = Array.from(agentStates.values());
  const agent = agents[Math.floor(Math.random() * agents.length)];
  
  const statuses: Array<'active' | 'idle' | 'processing'> = ['active', 'idle', 'processing'];
  const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
  
  const tasks = [
    'Analyzing trends',
    'Processing data',
    'Generating content',
    'Optimizing campaigns',
    'Tracking metrics',
    'Monitoring sentiment',
    'Discovering influencers',
    'Analyzing wallets',
  ];
  
  return {
    ...agent,
    status: newStatus,
    lastUpdate: Date.now(),
    tasksCompleted: agent.tasksCompleted + Math.floor(Math.random() * 5),
    currentTask: newStatus === 'processing' ? tasks[Math.floor(Math.random() * tasks.length)] : undefined,
  };
}

// Generate campaign events
export function generateCampaignEvent(): any {
  return {
    id: Math.random().toString(36).substr(2, 9),
    event: campaignEvents[Math.floor(Math.random() * campaignEvents.length)],
    timestamp: Date.now(),
    severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
    channel: ['TikTok', 'Instagram', 'X', 'Discord', 'Telegram'][Math.floor(Math.random() * 5)],
    impact: Math.floor(Math.random() * 100),
  };
}

// Start real-time data streaming
export function startRealtimeDataStream(io: SocketIOServer) {
  console.log('[Realtime] Starting real-time data stream...');

  // Broadcast metrics every 2 seconds
  const metricsInterval = setInterval(() => {
    const metrics = generateMetricUpdate();
    metricsState = metrics;
    broadcastMetricsUpdate(io, metrics);
  }, 2000);

  // Broadcast agent status every 3 seconds
  const agentInterval = setInterval(() => {
    const agent = generateAgentStatusUpdate();
    agentStates.set(agent.id, agent);
    broadcastAgentStatus(io, agent);
  }, 3000);

  // Broadcast campaign events every 5 seconds
  const campaignInterval = setInterval(() => {
    const event = generateCampaignEvent();
    broadcastCampaignEvent(io, event);
  }, 5000);

  // Broadcast alerts occasionally
  const alertInterval = setInterval(() => {
    if (Math.random() > 0.7) {
      const alerts = [
        { title: 'High Engagement Detected', message: 'Campaign engagement exceeded threshold', severity: 'info' },
        { title: 'Wallet Alert', message: 'Large transaction detected', severity: 'warning' },
        { title: 'Trend Spike', message: 'Trending topic detected in your niche', severity: 'info' },
        { title: 'Performance Milestone', message: 'Campaign reached 1M impressions', severity: 'success' },
      ];
      const alert = alerts[Math.floor(Math.random() * alerts.length)];
      broadcastAlert(io, alert);
    }
  }, 8000);

  // Return cleanup function
  return () => {
    clearInterval(metricsInterval);
    clearInterval(agentInterval);
    clearInterval(campaignInterval);
    clearInterval(alertInterval);
    console.log('[Realtime] Stopped real-time data stream');
  };
}

// Get current metrics state
export function getCurrentMetrics(): RealtimeMetrics {
  return { ...metricsState };
}

// Get all agent states
export function getAllAgentStates(): AgentStatus[] {
  return Array.from(agentStates.values());
}

// Update metrics state manually
export function updateMetricsState(updates: Partial<RealtimeMetrics>) {
  metricsState = { ...metricsState, ...updates };
}
