import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Search, User, Target, Zap } from 'lucide-react';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  metrics: string[];
}

export default function OffChainMarketing() {
  const features: Feature[] = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'TikTok/X/Instagram Growth Automation',
      description: 'Automate content distribution, engagement, and follower growth across major social platforms with AI-optimized posting.',
      metrics: ['3 major platforms', '2.3M reach potential', '12.1% engagement rate']
    },
    {
      icon: <Search className="w-8 h-8" />,
      title: 'Search Trend Analysis',
      description: 'Monitor search trends, keyword opportunities, and emerging search queries for SEO and SEM campaigns.',
      metrics: ['1,247 trends detected', '94.2% accuracy', '89 active signals']
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community Sentiment Tracking',
      description: 'Real-time monitoring of community discussions, sentiment shifts, and brand perception across platforms.',
      metrics: ['234K mentions tracked', '8.2/10 sentiment score', '12 min response time']
    },
    {
      icon: <User className="w-8 h-8" />,
      title: 'AI Influencer Discovery',
      description: 'Identify micro and macro influencers aligned with your brand using AI-powered audience analysis.',
      metrics: ['2,341 influencers connected', '187 active partnerships', '8.9% avg engagement']
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Predictive Engagement Scoring',
      description: 'Score content and audiences for engagement potential before publishing for maximum impact.',
      metrics: ['156K conversions tracked', '34.2% funnel optimization', '28.7% LTV increase']
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Conversion Funnel Optimization',
      description: 'Identify drop-off points in conversion funnels and automatically recommend optimizations.',
      metrics: ['5,234 ads optimized', '31.2% cost reduction', '45.8% CTR improvement']
    }
  ];

  const capabilities = [
    'Multi-platform content scheduling',
    'Hashtag optimization and trending',
    'Audience demographic analysis',
    'Competitor benchmarking',
    'Viral content prediction',
    'Influencer matching algorithm',
    'Automated response systems',
    'Performance attribution modeling'
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Off-Chain Marketing Intelligence</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            AI-powered social growth, trend analysis, and community engagement across Web2 platforms with real-time sentiment tracking and influencer discovery.
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
                <div className="text-[#ec4899] mb-4 group-hover:animate-pulse-glow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#a0aec0] mb-4 text-sm">{feature.description}</p>
                <div className="space-y-1">
                  {feature.metrics.map((metric, j) => (
                    <p key={j} className="text-xs text-[#ec4899] font-mono">
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
              <h2 className="text-3xl font-bold mb-8">Advanced Off-Chain Features</h2>
              <div className="space-y-4">
                {capabilities.map((capability, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#ec4899] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#ec4899]" />
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
                  <p className="text-[#a0aec0] text-sm mb-2">Platforms Integrated</p>
                  <p className="stat-value">3+</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Mentions Tracked</p>
                  <p className="stat-value">234K</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Avg Engagement Rate</p>
                  <p className="stat-value">12.1%</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Influencers Connected</p>
                  <p className="stat-value">2.3K</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Breakdown */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Platform-Specific Strategies</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">TikTok Growth</h3>
              <p className="text-[#a0aec0] mb-4">
                Viral content optimization with trending audio, hashtag analysis, and creator collaboration matching.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Trending sound integration</li>
                <li>✓ Optimal posting times</li>
                <li>✓ Creator partnerships</li>
                <li>✓ Viral prediction scoring</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">X/Twitter Engagement</h3>
              <p className="text-[#a0aec0] mb-4">
                Real-time trend participation, conversation threading, and community building with automated responses.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Trend monitoring</li>
                <li>✓ Thread optimization</li>
                <li>✓ Community management</li>
                <li>✓ Sentiment tracking</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Instagram Scaling</h3>
              <p className="text-[#a0aec0] mb-4">
                Visual content optimization, reels strategy, and influencer collaboration for maximum reach.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Reel optimization</li>
                <li>✓ Hashtag research</li>
                <li>✓ Story automation</li>
                <li>✓ Influencer matching</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Optimization */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Conversion Optimization</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Funnel Analysis</h3>
              <p className="text-[#a0aec0] mb-4">
                Identify drop-off points across your conversion funnel and receive AI-powered recommendations for optimization.
              </p>
              <div className="space-y-3 mt-6">
                <div className="flex items-center justify-between p-3 bg-[rgba(0,217,255,0.05)] rounded">
                  <span className="text-sm">Awareness → Interest</span>
                  <span className="text-[#10b981] font-mono">↑ 23.5%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[rgba(0,217,255,0.05)] rounded">
                  <span className="text-sm">Interest → Consideration</span>
                  <span className="text-[#ef4444] font-mono">↓ 12.3%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[rgba(0,217,255,0.05)] rounded">
                  <span className="text-sm">Consideration → Conversion</span>
                  <span className="text-[#10b981] font-mono">↑ 34.2%</span>
                </div>
              </div>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Behavioral Retargeting</h3>
              <p className="text-[#a0aec0] mb-4">
                Automatically retarget users based on their behavior patterns and engagement history across platforms.
              </p>
              <div className="space-y-3 mt-6">
                <div className="p-3 bg-[rgba(236,72,153,0.05)] border border-[rgba(236,72,153,0.2)] rounded">
                  <p className="text-sm font-semibold mb-1">Abandoned Cart</p>
                  <p className="text-xs text-[#a0aec0]">24-hour retarget with incentive</p>
                </div>
                <div className="p-3 bg-[rgba(236,72,153,0.05)] border border-[rgba(236,72,153,0.2)] rounded">
                  <p className="text-sm font-semibold mb-1">Browse History</p>
                  <p className="text-xs text-[#a0aec0]">Product recommendations</p>
                </div>
                <div className="p-3 bg-[rgba(236,72,153,0.05)] border border-[rgba(236,72,153,0.2)] rounded">
                  <p className="text-sm font-semibold mb-1">Engagement Scoring</p>
                  <p className="text-xs text-[#a0aec0]">Personalized messaging</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(236,72,153,0.1)] to-[rgba(0,217,255,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Scale Your Off-Chain Presence?</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Automate social growth, optimize conversions, and build engaged communities across all major platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#ec4899] to-[#00d9ff] text-white hover:shadow-lg hover:shadow-[rgba(236,72,153,0.5)]">
              Start Growth Campaign
            </Button>
            <Button variant="outline" className="border-[#ec4899] text-[#ec4899] hover:bg-[rgba(236,72,153,0.1)]">
              View Case Studies
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
