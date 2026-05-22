import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Activity, Target, Zap, Eye, BarChart3 } from 'lucide-react';

interface Metric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  trend: number;
  unit: string;
}

export default function Analytics() {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [animatedValues, setAnimatedValues] = useState<Record<string, number>>({});

  useEffect(() => {
    const metricsData: Metric[] = [
      {
        label: 'Campaigns Launched',
        value: 342,
        icon: <Zap className="w-6 h-6" />,
        color: '#00d9ff',
        trend: 12.5,
        unit: ''
      },
      {
        label: 'Engagement Score',
        value: 8.7,
        icon: <Activity className="w-6 h-6" />,
        color: '#7c3aed',
        trend: 5.2,
        unit: '/10'
      },
      {
        label: 'Wallet Targets',
        value: 847000,
        icon: <Target className="w-6 h-6" />,
        color: '#ec4899',
        trend: 23.8,
        unit: ''
      },
      {
        label: 'Trend Signals',
        value: 1247,
        icon: <TrendingUp className="w-6 h-6" />,
        color: '#10b981',
        trend: 34.2,
        unit: ''
      },
      {
        label: 'Ad Impressions',
        value: 12300000,
        icon: <Eye className="w-6 h-6" />,
        color: '#f59e0b',
        trend: 45.8,
        unit: ''
      },
      {
        label: 'Conversion Rate',
        value: 4.2,
        icon: <BarChart3 className="w-6 h-6" />,
        color: '#3b82f6',
        trend: 18.3,
        unit: '%'
      }
    ];

    setMetrics(metricsData);

    // Animate values
    metricsData.forEach((metric) => {
      let current = 0;
      const increment = metric.value / 30;
      const interval = setInterval(() => {
        current += increment;
        if (current >= metric.value) {
          current = metric.value;
          clearInterval(interval);
        }
        setAnimatedValues((prev) => ({
          ...prev,
          [metric.label]: Math.floor(current)
        }));
      }, 30);
    });
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const chartData = [
    { name: 'Mon', value: 65 },
    { name: 'Tue', value: 78 },
    { name: 'Wed', value: 92 },
    { name: 'Thu', value: 85 },
    { name: 'Fri', value: 110 },
    { name: 'Sat', value: 95 },
    { name: 'Sun', value: 88 }
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Real-Time Analytics Dashboard</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Live campaign metrics, engagement tracking, and performance intelligence across all channels
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Live Metrics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric, i) => (
              <div
                key={i}
                className="stat-card group hover:scale-105 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div style={{ color: metric.color }} className="group-hover:animate-pulse-glow">
                    {metric.icon}
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono" style={{ color: metric.color }}>
                      ↑ {metric.trend}%
                    </span>
                  </div>
                </div>
                <p className="text-[#a0aec0] text-sm mb-2">{metric.label}</p>
                <p className="stat-value">
                  {formatNumber(animatedValues[metric.label] || 0)}{metric.unit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Weekly Performance</h2>
          <div className="tech-card p-8">
            <div className="h-64 flex items-end justify-between gap-4 px-4">
              {chartData.map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gradient-to-t from-[#00d9ff] to-[#7c3aed] rounded-t-lg transition-all hover:opacity-80" style={{ height: `${(item.value / maxValue) * 100}%` }} />
                  <p className="text-xs text-[#a0aec0] mt-4">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Performance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Top Campaigns</h2>
          <div className="space-y-4">
            {[
              { name: 'Q1 Product Launch', reach: '2.3M', engagement: '12.1%', roi: '4.2x', status: 'Active' },
              { name: 'Summer Promotion', reach: '1.8M', engagement: '9.7%', roi: '3.8x', status: 'Active' },
              { name: 'Community Growth', reach: '1.2M', engagement: '14.3%', roi: '5.1x', status: 'Active' },
              { name: 'Brand Awareness', reach: '890K', engagement: '7.2%', roi: '2.9x', status: 'Completed' }
            ].map((campaign, i) => (
              <div key={i} className="tech-card p-6 flex items-center justify-between hover:border-[#00d9ff] transition-all">
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{campaign.name}</h3>
                  <div className="flex gap-6 text-sm text-[#a0aec0]">
                    <span>Reach: <span className="text-[#00d9ff] font-mono">{campaign.reach}</span></span>
                    <span>Engagement: <span className="text-[#7c3aed] font-mono">{campaign.engagement}</span></span>
                    <span>ROI: <span className="text-[#10b981] font-mono">{campaign.roi}</span></span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-mono ${campaign.status === 'Active' ? 'bg-[rgba(16,185,129,0.1)] text-[#10b981]' : 'bg-[rgba(113,128,150,0.1)] text-[#718096]'}`}>
                  {campaign.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Channel Breakdown */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Channel Performance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { channel: 'TikTok', reach: '3.2M', engagement: '15.2%', color: '#00d9ff' },
              { channel: 'Instagram', reach: '2.8M', engagement: '12.1%', color: '#ec4899' },
              { channel: 'X/Twitter', reach: '1.9M', engagement: '8.7%', color: '#3b82f6' },
              { channel: 'Web', reach: '1.2M', engagement: '6.3%', color: '#10b981' }
            ].map((item, i) => (
              <div key={i} className="tech-card p-6">
                <h3 className="font-bold mb-4">{item.channel}</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Reach</p>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>{item.reach}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Engagement</p>
                    <p className="text-2xl font-bold" style={{ color: item.color }}>{item.engagement}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Events */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Real-Time Events</h2>
          <div className="tech-card p-8">
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {[
                { time: '2 min ago', event: 'Campaign #342 reached 1M impressions', type: 'milestone' },
                { time: '5 min ago', event: 'Trend signal detected: #Web3Marketing trending', type: 'trend' },
                { time: '8 min ago', event: 'Wallet target group expanded by 45K', type: 'update' },
                { time: '12 min ago', event: 'Ad optimization improved CTR by 12.3%', type: 'success' },
                { time: '15 min ago', event: 'New influencer partnership activated', type: 'partnership' },
                { time: '18 min ago', event: 'Sentiment score improved to 8.7/10', type: 'success' },
                { time: '22 min ago', event: 'Smart contract event detected: 234 mints', type: 'blockchain' },
                { time: '25 min ago', event: 'Community growth +23.5% this week', type: 'growth' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 pb-4 border-b border-[rgba(0,217,255,0.1)] last:border-b-0">
                  <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{
                    backgroundColor: item.type === 'success' ? '#10b981' : item.type === 'trend' ? '#f59e0b' : item.type === 'blockchain' ? '#7c3aed' : '#00d9ff'
                  }} />
                  <div className="flex-1">
                    <p className="text-sm text-[#f0f4f8]">{item.event}</p>
                    <p className="text-xs text-[#718096] mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(0,217,255,0.1)] to-[rgba(124,58,237,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Export Analytics & Reports</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Generate custom reports, export data, and share insights with your team in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
              Export Report
            </Button>
            <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              Schedule Report
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
