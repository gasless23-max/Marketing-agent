import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Sparkles, Zap, Eye } from 'lucide-react';

interface Trend {
  id: string;
  name: string;
  viralScore: number;
  momentum: number;
  reach: string;
  sentiment: string;
  status: 'emerging' | 'trending' | 'peak' | 'declining';
}

interface Meme {
  id: string;
  name: string;
  narrative: string;
  mentions: number;
  engagement: number;
  platforms: string[];
  trend: number;
}

export default function ViralPrediction() {
  const [trends] = useState<Trend[]>([
    {
      id: '1',
      name: '#Web3Marketing',
      viralScore: 9.2,
      momentum: 34.5,
      reach: '2.3M',
      sentiment: 'Positive',
      status: 'trending'
    },
    {
      id: '2',
      name: '#AICreativity',
      viralScore: 8.7,
      momentum: 28.3,
      reach: '1.8M',
      sentiment: 'Positive',
      status: 'trending'
    },
    {
      id: '3',
      name: '#CryptoGains',
      viralScore: 7.9,
      momentum: 15.2,
      reach: '1.2M',
      sentiment: 'Mixed',
      status: 'peak'
    },
    {
      id: '4',
      name: '#NFTCommunity',
      viralScore: 6.8,
      momentum: -8.5,
      reach: '890K',
      sentiment: 'Neutral',
      status: 'declining'
    }
  ]);

  const [memes] = useState<Meme[]>([
    {
      id: '1',
      name: 'Laser Eyes',
      narrative: 'Bullish market sentiment indicator',
      mentions: 12400,
      engagement: 8.9,
      platforms: ['Twitter', 'TikTok', 'Reddit'],
      trend: 45.2
    },
    {
      id: '2',
      name: 'HODL Gang',
      narrative: 'Long-term crypto holding culture',
      mentions: 9870,
      engagement: 7.2,
      platforms: ['Twitter', 'Discord'],
      trend: 28.7
    },
    {
      id: '3',
      name: 'Ape Together Strong',
      narrative: 'Community unity and collective action',
      mentions: 7650,
      engagement: 9.1,
      platforms: ['Twitter', 'Reddit', 'TikTok'],
      trend: 52.3
    },
    {
      id: '4',
      name: 'Diamond Hands',
      narrative: 'Resilience and conviction in holdings',
      mentions: 5420,
      engagement: 6.8,
      platforms: ['Twitter', 'Instagram'],
      trend: 12.4
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'emerging':
        return 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6]';
      case 'trending':
        return 'bg-[rgba(16,185,129,0.1)] text-[#10b981]';
      case 'peak':
        return 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]';
      case 'declining':
        return 'bg-[rgba(239,68,68,0.1)] text-[#ef4444]';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Viral Prediction Engine</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Real-time trend intelligence and meme narrative tracking for predictive engagement scoring
          </p>
        </div>
      </section>

      {/* Trend Intelligence Feed */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Trend Intelligence Feed</h2>
          <div className="space-y-4">
            {trends.map((trend) => (
              <div key={trend.id} className="tech-card p-6 hover:border-[#00d9ff] transition-all">
                <div className="grid md:grid-cols-6 gap-4 items-center">
                  <div className="md:col-span-2">
                    <h3 className="font-bold text-lg mb-1">{trend.name}</h3>
                    <p className="text-sm text-[#a0aec0]">Reach: {trend.reach}</p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Viral Score</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-2xl font-bold text-[#00d9ff]">{trend.viralScore}</p>
                      <span className="text-xs text-[#10b981]">/10</span>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Momentum</p>
                    <p className={`text-2xl font-bold ${trend.momentum > 0 ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {trend.momentum > 0 ? '+' : ''}{trend.momentum}%
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Sentiment</p>
                    <p className={`font-semibold ${trend.sentiment === 'Positive' ? 'text-[#10b981]' : trend.sentiment === 'Negative' ? 'text-[#ef4444]' : 'text-[#f59e0b]'}`}>
                      {trend.sentiment}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono ${getStatusColor(trend.status)}`}>
                      {trend.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[rgba(0,217,255,0.1)]">
                  <div className="w-full bg-[#0a0e27] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] h-2 rounded-full"
                      style={{ width: `${trend.viralScore * 10}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meme Narrative Tracking */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Meme Narrative Tracking</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {memes.map((meme) => (
              <div key={meme.id} className="tech-card p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{meme.name}</h3>
                    <p className="text-[#a0aec0] text-sm">{meme.narrative}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-[#7c3aed]">{meme.trend}%</p>
                    <p className="text-xs text-[#10b981]">↑ Trending</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Mentions</p>
                    <p className="text-lg font-bold text-[#00d9ff]">{meme.mentions.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Engagement Score</p>
                    <p className="text-lg font-bold text-[#ec4899]">{meme.engagement}/10</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-[#a0aec0] mb-2">Active Platforms</p>
                  <div className="flex flex-wrap gap-2">
                    {meme.platforms.map((platform) => (
                      <span key={platform} className="px-2 py-1 bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] rounded text-xs text-[#00d9ff]">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full border-[#7c3aed] text-[#7c3aed] hover:bg-[rgba(124,58,237,0.1)]">
                  <Sparkles className="w-4 h-4 mr-2" /> Use in Campaign
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Predictive Scoring */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Predictive Engagement Scoring</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-6">Engagement Prediction Model</h3>
              <div className="space-y-4">
                {[
                  { factor: 'Trend Momentum', score: 92, color: '#10b981' },
                  { factor: 'Audience Sentiment', score: 87, color: '#00d9ff' },
                  { factor: 'Platform Fit', score: 78, color: '#7c3aed' },
                  { factor: 'Content Relevance', score: 85, color: '#f59e0b' },
                  { factor: 'Timing Optimization', score: 91, color: '#ec4899' }
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold">{item.factor}</p>
                      <p className="text-sm font-bold" style={{ color: item.color }}>{item.score}%</p>
                    </div>
                    <div className="w-full bg-[#0a0e27] rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{ width: `${item.score}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-6">Predicted Outcomes</h3>
              <div className="space-y-4">
                {[
                  { metric: 'Expected Reach', value: '3.2M', icon: '👥' },
                  { metric: 'Predicted Engagement', value: '14.2%', icon: '💬' },
                  { metric: 'Viral Probability', value: '78%', icon: '🚀' },
                  { metric: 'Peak Time Window', value: '2-4 PM UTC', icon: '⏰' },
                  { metric: 'Recommended Channels', value: 'TikTok, X', icon: '📱' }
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)] rounded-lg">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-[#a0aec0]">{item.metric}</p>
                      <p className="text-lg font-bold text-[#00d9ff]">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Viral Content Templates */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Viral Content Templates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Challenge Format',
                description: 'Engagement-driving challenge campaigns',
                metrics: 'Avg 18.2% engagement'
              },
              {
                title: 'Storytelling Arc',
                description: 'Multi-part narrative series',
                metrics: 'Avg 12.7% engagement'
              },
              {
                title: 'Trend Hijacking',
                description: 'Real-time trend participation',
                metrics: 'Avg 15.4% engagement'
              },
              {
                title: 'User-Generated Content',
                description: 'Community participation campaigns',
                metrics: 'Avg 21.3% engagement'
              },
              {
                title: 'Behind-the-Scenes',
                description: 'Authentic brand storytelling',
                metrics: 'Avg 11.8% engagement'
              },
              {
                title: 'Viral Moments',
                description: 'Unexpected, shareable content',
                metrics: 'Avg 24.5% engagement'
              }
            ].map((template, i) => (
              <div key={i} className="tech-card p-6 hover:scale-105 transition-all">
                <h3 className="font-bold mb-2">{template.title}</h3>
                <p className="text-sm text-[#a0aec0] mb-4">{template.description}</p>
                <p className="text-xs text-[#00d9ff] font-mono mb-4">{template.metrics}</p>
                <Button size="sm" variant="outline" className="w-full border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(0,217,255,0.1)] to-[rgba(124,58,237,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Viral?</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Leverage AI-powered trend intelligence and meme narrative tracking to create campaigns with maximum viral potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
              <TrendingUp className="w-4 h-4 mr-2" /> Create Viral Campaign
            </Button>
            <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              View Trend Reports
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
