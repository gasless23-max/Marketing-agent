import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Zap, Plus, Play, Pause, Settings, TrendingUp } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'scheduled' | 'completed';
  reach: string;
  engagement: string;
  roi: string;
  channels: string[];
  targets: string;
  budget: string;
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: '1',
      name: 'Q1 Product Launch',
      status: 'active',
      reach: '2.3M',
      engagement: '12.1%',
      roi: '4.2x',
      channels: ['TikTok', 'Instagram', 'X'],
      targets: 'Web3 Enthusiasts',
      budget: '$50K'
    },
    {
      id: '2',
      name: 'Summer Promotion',
      status: 'active',
      reach: '1.8M',
      engagement: '9.7%',
      roi: '3.8x',
      channels: ['Instagram', 'Web'],
      targets: 'E-commerce Buyers',
      budget: '$35K'
    },
    {
      id: '3',
      name: 'Community Growth',
      status: 'active',
      reach: '1.2M',
      engagement: '14.3%',
      roi: '5.1x',
      channels: ['Discord', 'Twitter'],
      targets: 'Community Members',
      budget: '$25K'
    },
    {
      id: '4',
      name: 'NFT Collection Drop',
      status: 'scheduled',
      reach: '890K',
      engagement: '7.2%',
      roi: '2.9x',
      channels: ['Twitter', 'Discord'],
      targets: 'NFT Collectors',
      budget: '$20K'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[rgba(16,185,129,0.1)] text-[#10b981]';
      case 'paused':
        return 'bg-[rgba(245,158,11,0.1)] text-[#f59e0b]';
      case 'scheduled':
        return 'bg-[rgba(59,130,246,0.1)] text-[#3b82f6]';
      case 'completed':
        return 'bg-[rgba(113,128,150,0.1)] text-[#718096]';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-4 gradient-text">Campaign Control Panel</h1>
            <p className="text-xl text-[#a0aec0] max-w-2xl">
              Create, launch, and monitor cross-platform campaigns with on-chain and off-chain targeting
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]"
          >
            <Plus className="w-4 h-4 mr-2" /> New Campaign
          </Button>
        </div>
      </section>

      {/* Create Campaign Form */}
      {showCreateForm && (
        <section className="py-12 bg-[#1a1f3a] border-b border-[rgba(0,217,255,0.1)]">
          <div className="container mx-auto px-4">
            <div className="tech-card p-8 max-w-2xl">
              <h2 className="text-2xl font-bold mb-6">Create New Campaign</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Campaign Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Q2 Product Launch"
                    className="w-full px-4 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] placeholder-[#718096] focus:border-[#00d9ff] focus:outline-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Budget</label>
                    <input
                      type="text"
                      placeholder="$50,000"
                      className="w-full px-4 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] placeholder-[#718096] focus:border-[#00d9ff] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Duration</label>
                    <input
                      type="text"
                      placeholder="30 days"
                      className="w-full px-4 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] placeholder-[#718096] focus:border-[#00d9ff] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Target Audience</label>
                  <select className="w-full px-4 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] focus:border-[#00d9ff] focus:outline-none">
                    <option>Web3 Enthusiasts</option>
                    <option>E-commerce Buyers</option>
                    <option>Community Members</option>
                    <option>NFT Collectors</option>
                    <option>DeFi Users</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Channels</label>
                  <div className="flex flex-wrap gap-2">
                    {['TikTok', 'Instagram', 'X', 'Discord', 'Web', 'Email'].map((channel) => (
                      <label key={channel} className="flex items-center gap-2 px-3 py-2 bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] rounded-lg cursor-pointer hover:border-[#00d9ff]">
                        <input type="checkbox" className="w-4 h-4" />
                        <span className="text-sm">{channel}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 pt-4">
                  <Button variant="outline" className="border-[#a0aec0] text-[#a0aec0]" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27]">
                    Create Campaign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Active Campaigns */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Active Campaigns</h2>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="tech-card p-6 hover:border-[#00d9ff] transition-all">
                <div className="grid md:grid-cols-5 gap-4 items-center mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{campaign.name}</h3>
                    <p className="text-sm text-[#a0aec0]">{campaign.targets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Reach</p>
                    <p className="font-bold text-[#00d9ff]">{campaign.reach}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">Engagement</p>
                    <p className="font-bold text-[#7c3aed]">{campaign.engagement}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-[#a0aec0] mb-1">ROI</p>
                    <p className="font-bold text-[#10b981]">{campaign.roi}</p>
                  </div>
                  <div className="text-right">
                    <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono mb-2 ${getStatusColor(campaign.status)}`}>
                      {campaign.status.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {campaign.channels.map((channel) => (
                    <span key={channel} className="px-2 py-1 bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] rounded text-xs text-[#00d9ff]">
                      {channel}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#a0aec0]">
                    Budget: <span className="text-[#f0f4f8] font-mono">{campaign.budget}</span>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === 'active' ? (
                      <>
                        <Button size="sm" variant="outline" className="border-[#f59e0b] text-[#f59e0b] hover:bg-[rgba(245,158,11,0.1)]">
                          <Pause className="w-4 h-4 mr-1" /> Pause
                        </Button>
                        <Button size="sm" variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
                          <Settings className="w-4 h-4 mr-1" /> Edit
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="bg-[#10b981] text-white hover:bg-[#059669]">
                        <Play className="w-4 h-4 mr-1" /> Launch
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Targeting Options */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Targeting Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">On-Chain Targeting</h3>
              <div className="space-y-3">
                {[
                  'Wallet-behavior targeting',
                  'Smart contract event triggers',
                  'NFT holder segmentation',
                  'DeFi user activity',
                  'Whale movement alerts',
                  'Token trend monitoring'
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-[rgba(124,58,237,0.1)] border border-[rgba(124,58,237,0.2)] rounded-lg cursor-pointer hover:border-[#7c3aed]">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Off-Chain Targeting</h3>
              <div className="space-y-3">
                {[
                  'Social platform audiences',
                  'Search trend analysis',
                  'Community sentiment',
                  'AI influencer matching',
                  'Engagement prediction',
                  'Behavioral retargeting'
                ].map((item, i) => (
                  <label key={i} className="flex items-center gap-3 p-3 bg-[rgba(236,72,153,0.1)] border border-[rgba(236,72,153,0.2)] rounded-lg cursor-pointer hover:border-[#ec4899]">
                    <input type="checkbox" className="w-4 h-4" />
                    <span className="text-sm">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Campaign Performance */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Campaign Performance Summary</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Total Reach', value: '7.3M', color: '#00d9ff' },
              { label: 'Avg Engagement', value: '11.1%', color: '#7c3aed' },
              { label: 'Avg ROI', value: '4.0x', color: '#10b981' },
              { label: 'Total Spend', value: '$130K', color: '#f59e0b' }
            ].map((stat, i) => (
              <div key={i} className="stat-card">
                <p className="text-[#a0aec0] text-sm mb-2">{stat.label}</p>
                <p className="stat-value" style={{ color: stat.color }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(0,217,255,0.1)] to-[rgba(124,58,237,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Launch Your Campaign?</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Create sophisticated multi-channel campaigns with advanced on-chain and off-chain targeting in minutes.
          </p>
          <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
            <Zap className="w-4 h-4 mr-2" /> Launch New Campaign
          </Button>
        </div>
      </section>
    </div>
  );
}
