import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Wallet, Activity, Shield, Zap } from 'lucide-react';

export default function GrowthAnalytics() {
  const metrics = [
    {
      label: 'Community Members',
      value: '847K',
      change: '+23.5%',
      icon: <Users className="w-6 h-6" />,
      color: '#00d9ff'
    },
    {
      label: 'Wallet Targets',
      value: '1.2M',
      change: '+34.2%',
      icon: <Wallet className="w-6 h-6" />,
      color: '#7c3aed'
    },
    {
      label: 'Avg Engagement',
      value: '12.1%',
      change: '+8.7%',
      icon: <Activity className="w-6 h-6" />,
      color: '#ec4899'
    },
    {
      label: 'Reputation Score',
      value: '8.7/10',
      change: '+2.3%',
      icon: <Shield className="w-6 h-6" />,
      color: '#10b981'
    }
  ];

  const audienceSegments = [
    {
      name: 'Whale Wallets',
      count: '2.3K',
      avgHolding: '$2.4M',
      influence: 'Very High',
      engagement: '18.2%'
    },
    {
      name: 'Active Traders',
      count: '45.2K',
      avgHolding: '$125K',
      influence: 'High',
      engagement: '12.7%'
    },
    {
      name: 'Community Members',
      count: '847K',
      avgHolding: '$5.2K',
      influence: 'Medium',
      engagement: '8.3%'
    },
    {
      name: 'Newcomers',
      count: '234K',
      avgHolding: '$500',
      influence: 'Low',
      engagement: '5.1%'
    }
  ];

  const crossChainMetrics = [
    { chain: 'Ethereum', users: '234K', tvl: '$1.2B', growth: '+15.3%' },
    { chain: 'Polygon', users: '156K', tvl: '$450M', growth: '+22.1%' },
    { chain: 'Arbitrum', users: '89K', tvl: '$280M', growth: '+34.5%' },
    { chain: 'Optimism', users: '67K', tvl: '$195M', growth: '+28.7%' },
    { chain: 'Base', users: '45K', tvl: '$120M', growth: '+45.2%' }
  ];

  const communityGrowthChannels = [
    { channel: 'Discord', members: '234K', growth: '+12.3%', engagement: '8.9%' },
    { channel: 'Twitter', followers: '567K', growth: '+18.5%', engagement: '6.2%' },
    { channel: 'Telegram', members: '145K', growth: '+9.7%', engagement: '12.1%' },
    { channel: 'Reddit', subscribers: '89K', growth: '+14.2%', engagement: '7.8%' }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Decentralized Growth Analytics</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Behavioral audience intelligence, wallet reputation scoring, and cross-chain community growth metrics
          </p>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Growth Overview</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {metrics.map((metric, i) => (
              <div key={i} className="stat-card group hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="flex items-start justify-between mb-4">
                  <div style={{ color: metric.color }} className="group-hover:animate-pulse-glow">
                    {metric.icon}
                  </div>
                  <span className="text-xs font-mono text-[#10b981]">↑ {metric.change}</span>
                </div>
                <p className="text-[#a0aec0] text-sm mb-2">{metric.label}</p>
                <p className="stat-value">{metric.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Behavioral Audience Intelligence */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Behavioral Audience Intelligence</h2>
          <div className="space-y-4">
            {audienceSegments.map((segment, i) => (
              <div key={i} className="tech-card p-6 hover:border-[#00d9ff] transition-all">
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{segment.name}</h3>
                    <p className="text-sm text-[#a0aec0]">{segment.count} users</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Avg Holding</p>
                    <p className="font-bold text-[#00d9ff]">{segment.avgHolding}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Influence</p>
                    <p className="font-bold text-[#7c3aed]">{segment.influence}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Engagement</p>
                    <p className="font-bold text-[#ec4899]">{segment.engagement}</p>
                  </div>
                  <div className="text-right">
                    <Button size="sm" variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
                      Target Segment
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wallet Reputation Scoring */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Wallet Reputation Scoring</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-6">Scoring Factors</h3>
              <div className="space-y-4">
                {[
                  { factor: 'Transaction History', score: 92, color: '#00d9ff' },
                  { factor: 'Holding Duration', score: 87, color: '#7c3aed' },
                  { factor: 'Community Participation', score: 78, color: '#ec4899' },
                  { factor: 'Risk Profile', score: 85, color: '#10b981' },
                  { factor: 'Influence Score', score: 91, color: '#f59e0b' }
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
              <h3 className="text-xl font-bold mb-6">Reputation Tiers</h3>
              <div className="space-y-3">
                {[
                  { tier: 'Platinum', range: '90-100', benefits: 'VIP access, exclusive drops, priority support' },
                  { tier: 'Gold', range: '75-89', benefits: 'Early access, special events, dedicated manager' },
                  { tier: 'Silver', range: '60-74', benefits: 'Standard access, community events, support' },
                  { tier: 'Bronze', range: '40-59', benefits: 'Basic access, public events, help desk' },
                  { tier: 'Pending', range: '0-39', benefits: 'Limited access, onboarding support' }
                ].map((item, i) => (
                  <div key={i} className="p-3 bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold">{item.tier}</p>
                      <p className="text-xs text-[#00d9ff] font-mono">{item.range}</p>
                    </div>
                    <p className="text-xs text-[#a0aec0]">{item.benefits}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Chain Growth */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Cross-Chain Community Growth</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {crossChainMetrics.map((metric, i) => (
              <div key={i} className="tech-card p-6 text-center hover:scale-105 transition-all">
                <h3 className="font-bold mb-4">{metric.chain}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Users</p>
                    <p className="text-lg font-bold text-[#00d9ff]">{metric.users}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">TVL</p>
                    <p className="text-lg font-bold text-[#7c3aed]">{metric.tvl}</p>
                  </div>
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-1">Growth</p>
                    <p className="text-lg font-bold text-[#10b981]">{metric.growth}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Growth Channels */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Community Growth Channels</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {communityGrowthChannels.map((channel, i) => (
              <div key={i} className="tech-card p-8">
                <h3 className="text-xl font-bold mb-6">{channel.channel}</h3>
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs text-[#a0aec0] mb-2">Members/Followers</p>
                    <p className="text-3xl font-bold text-[#00d9ff]">{channel.members || channel.followers}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#a0aec0] mb-1">Growth</p>
                      <p className="text-lg font-bold text-[#10b981]">{channel.growth}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#a0aec0] mb-1">Engagement</p>
                      <p className="text-lg font-bold text-[#ec4899]">{channel.engagement}</p>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
                  <Zap className="w-4 h-4 mr-2" /> Boost Growth
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Strategies */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">AI-Recommended Growth Strategies</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Immediate Actions</h3>
              <ul className="space-y-3">
                {[
                  'Target whale wallets with exclusive benefits',
                  'Launch community ambassador program',
                  'Create incentivized referral system',
                  'Host weekly community events',
                  'Develop tier-based reward system'
                ].map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(0,217,255,0.2)] border border-[#00d9ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#00d9ff]" />
                    </div>
                    <span className="text-[#a0aec0]">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Long-Term Growth</h3>
              <ul className="space-y-3">
                {[
                  'Expand to new blockchain ecosystems',
                  'Build strategic partnerships',
                  'Develop governance framework',
                  'Create content creator program',
                  'Establish regional communities'
                ].map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(124,58,237,0.2)] border border-[#7c3aed] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                    </div>
                    <span className="text-[#a0aec0]">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(0,217,255,0.1)] to-[rgba(124,58,237,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Accelerate Your Growth</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Leverage behavioral intelligence, wallet reputation scoring, and cross-chain analytics to scale your community exponentially.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
              <TrendingUp className="w-4 h-4 mr-2" /> Launch Growth Campaign
            </Button>
            <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              View Analytics Dashboard
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
