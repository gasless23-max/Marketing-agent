import { useEffect, useState } from 'react';
import { useRealtimeData } from '@/hooks/useRealtimeData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, AlertCircle, TrendingUp, Zap, Users, Target } from 'lucide-react';
import { toast } from 'sonner';

interface ChartDataPoint {
  time: string;
  value: number;
}

export default function RealtimeDashboard() {
  const { metrics, agents, campaigns, alerts, isConnected, connectionError, clearAlerts } = useRealtimeData({
    subscribeToMetrics: true,
    subscribeToAgents: true,
    subscribeToCampaigns: true,
  });

  const [metricsHistory, setMetricsHistory] = useState<ChartDataPoint[]>([]);
  const [engagementHistory, setEngagementHistory] = useState<ChartDataPoint[]>([]);
  const [conversionHistory, setConversionHistory] = useState<ChartDataPoint[]>([]);

  // Update chart history
  useEffect(() => {
    if (metrics) {
      const time = new Date().toLocaleTimeString();

      setMetricsHistory((prev) => {
        const updated = [...prev, { time, value: metrics.adImpressions / 1000000 }];
        return updated.slice(-20); // Keep last 20 points
      });

      setEngagementHistory((prev) => {
        const updated = [...prev, { time, value: Math.round(metrics.engagementScore * 10) }];
        return updated.slice(-20);
      });

      setConversionHistory((prev) => {
        const updated = [...prev, { time, value: metrics.conversionRate }];
        return updated.slice(-20);
      });
    }
  }, [metrics]);

  // Show alerts as toasts
  useEffect(() => {
    if (alerts.length > 0) {
      const latestAlert = alerts[0];
      const severity = latestAlert.severity as 'success' | 'error' | 'warning' | 'info';
      if (severity === 'success') {
        toast.success(latestAlert.title, { description: latestAlert.message });
      } else if (severity === 'error') {
        toast.error(latestAlert.title, { description: latestAlert.message });
      } else if (severity === 'warning') {
        toast.warning(latestAlert.title, { description: latestAlert.message });
      } else {
        toast(latestAlert.title, { description: latestAlert.message });
      }
    }
  }, [alerts]);

  const agentStatusCounts = {
    active: agents.filter((a) => a.status === 'active').length,
    processing: agents.filter((a) => a.status === 'processing').length,
    idle: agents.filter((a) => a.status === 'idle').length,
  };

  const agentStatusData = [
    { name: 'Active', value: agentStatusCounts.active, color: '#10b981' },
    { name: 'Processing', value: agentStatusCounts.processing, color: '#3b82f6' },
    { name: 'Idle', value: agentStatusCounts.idle, color: '#f59e0b' },
  ];

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b'];

  return (
    <div className="min-h-screen bg-background text-foreground py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold gradient-text">Real-Time Dashboard</h1>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-sm text-text-secondary">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          {connectionError && (
            <div className="text-sm text-red-400 bg-red-950 bg-opacity-20 p-3 rounded-lg">
              Connection error: {connectionError}
            </div>
          )}
        </div>

        {/* Key Metrics */}
        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Campaigns Launched
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{metrics.campaignsLaunched.toLocaleString()}</div>
                <p className="text-xs text-text-secondary mt-2">+12.5% from last week</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Engagement Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{metrics.engagementScore.toFixed(1)}/10</div>
                <p className="text-xs text-text-secondary mt-2">Excellent performance</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Wallet Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{(metrics.walletTargets / 1000).toFixed(0)}K</div>
                <p className="text-xs text-text-secondary mt-2">+8.3% active wallets</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" />
                  Trend Signals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{metrics.trendSignals.toLocaleString()}</div>
                <p className="text-xs text-text-secondary mt-2">Emerging trends detected</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Ad Impressions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{(metrics.adImpressions / 1000000).toFixed(1)}M</div>
                <p className="text-xs text-text-secondary mt-2">+15.2% reach</p>
              </CardContent>
            </Card>

            <Card className="stat-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  Conversion Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="stat-value">{metrics.conversionRate.toFixed(1)}%</div>
                <p className="text-xs text-text-secondary mt-2">+2.1% improvement</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Ad Impressions Chart */}
          <Card className="tech-card">
            <CardHeader>
              <CardTitle>Ad Impressions Trend</CardTitle>
              <CardDescription>Last 20 updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metricsHistory}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00d9ff" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#00d9ff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                  <XAxis dataKey="time" stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #00d9ff',
                      borderRadius: '8px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#00d9ff"
                    fillOpacity={1}
                    fill="url(#colorImpressions)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement Score Chart */}
          <Card className="tech-card">
            <CardHeader>
              <CardTitle>Engagement Score Trend</CardTitle>
              <CardDescription>Last 20 updates (x10)</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={engagementHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                  <XAxis dataKey="time" stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #7c3aed',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#7c3aed"
                    strokeWidth={2}
                    dot={{ fill: '#7c3aed', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Conversion Rate Chart */}
          <Card className="tech-card">
            <CardHeader>
              <CardTitle>Conversion Rate Trend</CardTitle>
              <CardDescription>Last 20 updates</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={conversionHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 217, 255, 0.1)" />
                  <XAxis dataKey="time" stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#a0aec0" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #ec4899',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="value" fill="#ec4899" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Status Distribution */}
          <Card className="tech-card">
            <CardHeader>
              <CardTitle>Agent Status Distribution</CardTitle>
              <CardDescription>{agents.length} agents active</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {agentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1a1f3a',
                      border: '1px solid #00d9ff',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Agent Status Cards */}
        <Card className="tech-card mb-8">
          <CardHeader>
            <CardTitle>Agent Status</CardTitle>
            <CardDescription>Real-time agent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {agents.map((agent) => (
                <div key={agent.id} className="p-4 rounded-lg border border-primary border-opacity-20 bg-background-secondary">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{agent.name}</span>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        agent.status === 'active'
                          ? 'agent-status-active'
                          : agent.status === 'processing'
                            ? 'agent-status-processing'
                            : 'agent-status-idle'
                      }`}
                    >
                      {agent.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-text-secondary">
                    <p>Tasks: {agent.tasksCompleted}</p>
                    {agent.currentTask && <p className="text-primary mt-1">{agent.currentTask}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Campaign Events */}
        <Card className="tech-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Campaign Events</CardTitle>
              <CardDescription>Live activity feed</CardDescription>
            </div>
            {campaigns.length > 0 && (
              <button
                onClick={() => clearAlerts()}
                className="text-xs text-primary hover:text-primary-dark transition"
              >
                Clear
              </button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {campaigns.length === 0 ? (
                <p className="text-sm text-text-secondary text-center py-8">No events yet</p>
              ) : (
                campaigns.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background-secondary hover:bg-background-tertiary transition">
                    <AlertCircle
                      className={`w-4 h-4 mt-1 flex-shrink-0 ${
                        event.severity === 'high'
                          ? 'text-error'
                          : event.severity === 'medium'
                            ? 'text-warning'
                            : 'text-info'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{event.event}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                        <span>{event.channel}</span>
                        <span>•</span>
                        <span>Impact: {event.impact}%</span>
                        <span>•</span>
                        <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
