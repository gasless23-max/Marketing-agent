import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Activity, Zap, TrendingUp, Users, Cpu, Wallet, User, Sparkles, Target, Eye } from 'lucide-react';

interface Agent {
  name: string;
  icon: React.ReactNode;
  status: 'active' | 'idle' | 'processing';
  description: string;
  capabilities: string[];
  metrics: {
    label: string;
    value: string;
  }[];
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  useEffect(() => {
    const agentsList: Agent[] = [
      {
        name: 'Trend Hunter',
        icon: <TrendingUp className="w-6 h-6" />,
        status: 'active',
        description: 'Identifies emerging trends and market opportunities across all platforms',
        capabilities: ['Trend Detection', 'Market Analysis', 'Opportunity Scoring', 'Predictive Modeling'],
        metrics: [
          { label: 'Trends Detected', value: '1,247' },
          { label: 'Accuracy', value: '94.2%' },
          { label: 'Active Signals', value: '89' }
        ]
      },
      {
        name: 'Meme Intelligence',
        icon: <Sparkles className="w-6 h-6" />,
        status: 'active',
        description: 'Tracks meme narratives and cultural moments for viral amplification',
        capabilities: ['Meme Tracking', 'Narrative Analysis', 'Viral Scoring', 'Community Sentiment'],
        metrics: [
          { label: 'Memes Tracked', value: '3,891' },
          { label: 'Viral Score Avg', value: '7.8/10' },
          { label: 'Reach Potential', value: '2.3M' }
        ]
      },
      {
        name: 'Campaign Execution',
        icon: <Zap className="w-6 h-6" />,
        status: 'processing',
        description: 'Orchestrates and executes multi-channel campaigns with precision timing',
        capabilities: ['Campaign Launch', 'Channel Orchestration', 'Timing Optimization', 'A/B Testing'],
        metrics: [
          { label: 'Campaigns Launched', value: '342' },
          { label: 'Success Rate', value: '87.3%' },
          { label: 'Avg ROI', value: '4.2x' }
        ]
      },
      {
        name: 'Community Growth',
        icon: <Users className="w-6 h-6" />,
        status: 'active',
        description: 'Manages community engagement and organic growth strategies',
        capabilities: ['Community Building', 'Engagement Automation', 'Retention Optimization', 'Growth Hacking'],
        metrics: [
          { label: 'Communities Managed', value: '156' },
          { label: 'Avg Growth Rate', value: '23.5%' },
          { label: 'Engagement Rate', value: '12.1%' }
        ]
      },
      {
        name: 'Ad Optimization',
        icon: <Target className="w-6 h-6" />,
        status: 'active',
        description: 'Continuously optimizes ad spend and creative performance',
        capabilities: ['Bid Optimization', 'Creative Testing', 'Audience Refinement', 'Performance Analysis'],
        metrics: [
          { label: 'Ads Optimized', value: '5,234' },
          { label: 'Cost Reduction', value: '31.2%' },
          { label: 'CTR Improvement', value: '45.8%' }
        ]
      },
      {
        name: 'Wallet Analytics',
        icon: <Wallet className="w-6 h-6" />,
        status: 'active',
        description: 'Analyzes on-chain wallet behavior and transaction patterns',
        capabilities: ['Wallet Tracking', 'Behavior Analysis', 'Risk Scoring', 'Opportunity Detection'],
        metrics: [
          { label: 'Wallets Tracked', value: '847K' },
          { label: 'Transactions Analyzed', value: '12.3M' },
          { label: 'Prediction Accuracy', value: '91.7%' }
        ]
      },
      {
        name: 'Influencer Outreach',
        icon: <User className="w-6 h-6" />,
        status: 'idle',
        description: 'Identifies and manages influencer partnerships and collaborations',
        capabilities: ['Influencer Discovery', 'Partnership Matching', 'Negotiation Automation', 'Performance Tracking'],
        metrics: [
          { label: 'Influencers Connected', value: '2,341' },
          { label: 'Partnerships Active', value: '187' },
          { label: 'Avg Engagement', value: '8.9%' }
        ]
      },
      {
        name: 'Creative Director',
        icon: <Sparkles className="w-6 h-6" />,
        status: 'processing',
        description: 'Generates and directs AI-powered creative content production',
        capabilities: ['Content Generation', 'Creative Optimization', 'Brand Consistency', 'Multi-Format Production'],
        metrics: [
          { label: 'Creatives Generated', value: '8,923' },
          { label: 'Approval Rate', value: '76.4%' },
          { label: 'Production Speed', value: '2.3h avg' }
        ]
      },
      {
        name: 'Conversion Intelligence',
        icon: <Activity className="w-6 h-6" />,
        status: 'active',
        description: 'Optimizes conversion funnels and customer journey paths',
        capabilities: ['Funnel Analysis', 'Drop-off Detection', 'Optimization Recommendations', 'Cohort Analysis'],
        metrics: [
          { label: 'Conversions Tracked', value: '156K' },
          { label: 'Funnel Optimization', value: '34.2%' },
          { label: 'Avg LTV Increase', value: '28.7%' }
        ]
      },
      {
        name: 'Sentiment Surveillance',
        icon: <Eye className="w-6 h-6" />,
        status: 'active',
        description: 'Monitors brand sentiment and community perception in real-time',
        capabilities: ['Sentiment Analysis', 'Crisis Detection', 'Reputation Monitoring', 'Response Automation'],
        metrics: [
          { label: 'Mentions Tracked', value: '234K' },
          { label: 'Sentiment Score', value: '8.2/10' },
          { label: 'Response Time', value: '12 min avg' }
        ]
      }
    ];

    setAgents(agentsList);
    setSelectedAgent(agentsList[0]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'agent-status-active';
      case 'processing':
        return 'agent-status-processing';
      case 'idle':
        return 'agent-status-idle';
      default:
        return '';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)]';
      case 'processing':
        return 'bg-[rgba(59,130,246,0.1)] border-[rgba(59,130,246,0.3)]';
      case 'idle':
        return 'bg-[rgba(245,158,11,0.1)] border-[rgba(245,158,11,0.3)]';
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
          <h1 className="text-5xl font-bold mb-4 gradient-text">AI Agent Network</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            10 specialized autonomous agents orchestrating your marketing ecosystem in real-time
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Agent List */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <h2 className="text-xl font-bold mb-4 text-[#f0f4f8]">Active Agents</h2>
                <div className="space-y-2">
                  {agents.map((agent) => (
                    <button
                      key={agent.name}
                      onClick={() => setSelectedAgent(agent)}
                      className={`w-full text-left p-4 rounded-lg transition-all border ${
                        selectedAgent?.name === agent.name
                          ? 'tech-card border-[#00d9ff] bg-[rgba(0,217,255,0.1)]'
                          : 'tech-card border-[rgba(0,217,255,0.2)] hover:border-[#00d9ff]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-[#00d9ff]">{agent.icon}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{agent.name}</p>
                          <div className={`text-xs font-mono mt-1 ${getStatusColor(agent.status)}`}>
                            {agent.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Details */}
            <div className="lg:col-span-2">
              {selectedAgent && (
                <div className="animate-fade-in">
                  {/* Header */}
                  <div className="tech-card p-8 mb-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#00d9ff] to-[#7c3aed] flex items-center justify-center text-2xl">
                          {selectedAgent.icon}
                        </div>
                        <div>
                          <h2 className="text-3xl font-bold mb-2">{selectedAgent.name}</h2>
                          <div className={`inline-block px-3 py-1 rounded-full border text-xs font-mono ${getStatusBg(selectedAgent.status)}`}>
                            <span className={getStatusColor(selectedAgent.status)}>
                              ● {selectedAgent.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-[#a0aec0] text-lg">{selectedAgent.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {selectedAgent.metrics.map((metric, i) => (
                      <div key={i} className="stat-card">
                        <p className="text-[#a0aec0] text-sm mb-2">{metric.label}</p>
                        <p className="stat-value">{metric.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Capabilities */}
                  <div className="tech-card p-8">
                    <h3 className="text-xl font-bold mb-4">Core Capabilities</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedAgent.capabilities.map((capability, i) => (
                        <div key={i} className="p-4 bg-[rgba(0,217,255,0.05)] border border-[rgba(0,217,255,0.2)] rounded-lg">
                          <p className="text-[#00d9ff] font-semibold text-sm">{capability}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 mt-8">
                    <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
                      View Details
                    </Button>
                    <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
                      Configure Agent
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Network Visualization Section */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 gradient-text">Agent Collaboration Network</h2>
          <div className="tech-card p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <Cpu className="w-16 h-16 text-[#00d9ff] mx-auto mb-4 animate-pulse" />
              <p className="text-[#a0aec0]">Real-time agent network visualization</p>
              <p className="text-sm text-[#718096] mt-2">Showing 10 agents with 47 active connections</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
