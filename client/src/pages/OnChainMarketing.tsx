import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Wallet, Zap, Target, Eye, Activity } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: string[];
}

export default function OnChainMarketing() {
  const features: Feature[] = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Wallet-Behavior Targeting',
      description: 'Identify and target high-value wallets based on transaction patterns, holding duration, and trading behavior.',
      metrics: ['847K wallets tracked', '12.3M transactions analyzed', '91.7% prediction accuracy']
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Smart Contract Event-Triggered Campaigns',
      description: 'Automatically launch campaigns triggered by specific blockchain events like swaps, mints, staking, and governance actions.',
      metrics: ['Real-time event detection', '< 100ms response time', '99.9% uptime']
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'NFT Holder Segmentation',
      description: 'Segment audiences by NFT holdings, collection rarity, and holder reputation for precision targeting.',
      metrics: ['2.3M NFT holders mapped', '156 collections tracked', '89% engagement rate']
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: 'DeFi User Activity Analysis',
      description: 'Monitor DeFi protocol interactions, liquidity provision, yield farming, and governance participation.',
      metrics: ['34 protocols monitored', '2.1M active users', 'Real-time analytics']
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: 'Whale Movement Insights',
      description: 'Track large wallet movements and provide early warning signals for market-moving transactions.',
      metrics: ['Top 1K whales tracked', '< 30s alert latency', '94.2% accuracy']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Token Trend Monitoring',
      description: 'Monitor token price trends, volume spikes, and emerging opportunities across all major chains.',
      metrics: ['5,000+ tokens tracked', 'Multi-chain coverage', 'Predictive scoring']
    }
  ];

  const capabilities = [
    'Cross-chain wallet analysis',
    'Smart contract interaction tracking',
    'Gas optimization monitoring',
    'Liquidity pool analysis',
    'Token holder distribution mapping',
    'Governance participation tracking',
    'Yield opportunity detection',
    'Risk scoring and assessment'
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">On-Chain Marketing Intelligence</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Blockchain-powered targeting and real-time campaign orchestration based on wallet behavior, smart contract events, and on-chain analytics.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="tech-card p-8 group hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-[#7c3aed] mb-4 group-hover:animate-pulse-glow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#a0aec0] mb-4 text-sm">{feature.description}</p>
                <div className="space-y-1">
                  {feature.metrics.map((metric, j) => (
                    <p key={j} className="text-xs text-[#00d9ff] font-mono">
                      • {metric}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Capabilities */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Advanced On-Chain Features</h2>
              <div className="space-y-4">
                {capabilities.map((capability, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[rgba(0,217,255,0.2)] border border-[#00d9ff] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#00d9ff]" />
                    </div>
                    <p className="text-[#a0aec0]">{capability}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats Card */}
            <div className="tech-card p-8">
              <h3 className="text-2xl font-bold mb-8">Real-Time Metrics</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Wallets Under Analysis</p>
                  <p className="stat-value">847K</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Transactions Processed</p>
                  <p className="stat-value">12.3M</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Prediction Accuracy</p>
                  <p className="stat-value">91.7%</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Chains Monitored</p>
                  <p className="stat-value">8</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Token Launch Campaigns</h3>
              <p className="text-[#a0aec0] mb-4">
                Target early adopters and whale wallets with precision timing based on smart contract deployment events.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Automatic event detection</li>
                <li>✓ Whale notification system</li>
                <li>✓ Coordinated multi-chain launch</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">DeFi Protocol Growth</h3>
              <p className="text-[#a0aec0] mb-4">
                Identify high-potential liquidity providers and yield farmers for targeted partnership campaigns.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Yield opportunity matching</li>
                <li>✓ Risk profile segmentation</li>
                <li>✓ Performance-based incentives</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">NFT Community Building</h3>
              <p className="text-[#a0aec0] mb-4">
                Segment NFT holders by collection and engagement level for exclusive community campaigns.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Rarity-based targeting</li>
                <li>✓ Holder reputation scoring</li>
                <li>✓ Exclusive drop notifications</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Governance Engagement</h3>
              <p className="text-[#a0aec0] mb-4">
                Activate governance token holders for DAO proposals and voting campaigns with real-time alerts.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Voting power analysis</li>
                <li>✓ Proposal impact prediction</li>
                <li>✓ Engagement automation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(0,217,255,0.1)] to-[rgba(124,58,237,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Leverage On-Chain Intelligence?</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Start building blockchain-powered campaigns with real-time wallet targeting and smart contract event automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)]">
              Launch Campaign
            </Button>
            <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
              View Documentation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
