import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, TrendingUp, Cpu, Sparkles } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function Home() {
  const [displayedText, setDisplayedText] = useState('');
  const fullText = 'Autonomous AI Marketing Intelligence';
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    if (!isAnimating) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsAnimating(false);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isAnimating]);

  const features = [
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Multi-Agent Automation',
      description: '10 specialized AI agents orchestrating campaigns across all channels'
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: 'On-Chain Intelligence',
      description: 'Real-time blockchain analytics and wallet-behavior targeting'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'Creative Studio',
      description: 'AI-powered cinematic content generation with Adobe integration'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Viral Prediction',
      description: 'Predictive engagement scoring and meme narrative tracking'
    }
  ];

  const agents = [
    'Trend Hunter',
    'Meme Intelligence',
    'Campaign Execution',
    'Community Growth',
    'Ad Optimization',
    'Wallet Analytics',
    'Influencer Outreach',
    'Creative Director',
    'Conversion Intelligence',
    'Sentiment Surveillance'
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Animated background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#00d9ff] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7c3aed] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 right-0 w-96 h-96 bg-[#ec4899] rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="container mx-auto px-4 text-center">
          {/* Main Headline */}
          <div className="mb-8 animate-slide-up">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">{displayedText}</span>
              <span className="animate-glow">_</span>
            </h1>
          </div>

          {/* Positioning Statement */}
          <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <p className="text-xl md:text-2xl text-[#a0aec0] max-w-3xl mx-auto leading-relaxed">
              An AI-powered autonomous marketing infrastructure combining Adobe creative intelligence, multi-agent automation, and blockchain analytics to execute hyper-personalized on-chain and off-chain growth campaigns at internet scale.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/agents">
              <Button className="bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)] text-lg px-8 py-6 rounded-lg font-semibold transition-all transform hover:scale-105">
                Launch Platform <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button variant="outline" className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)] text-lg px-8 py-6 rounded-lg font-semibold">
              View Documentation
            </Button>
          </div>

          {/* Agent Preview */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-sm text-[#718096] mb-4">Powered by 10 Autonomous AI Agents</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {agents.slice(0, 5).map((agent, i) => (
                <div
                  key={i}
                  className="px-3 py-1 rounded-full bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] text-xs text-[#00d9ff] font-mono"
                >
                  {agent}
                </div>
              ))}
              <div className="px-3 py-1 rounded-full bg-[rgba(0,217,255,0.1)] border border-[rgba(0,217,255,0.3)] text-xs text-[#00d9ff] font-mono">
                +5 more
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Core Capabilities
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="tech-card p-6 group hover:scale-105 transition-all"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-[#00d9ff] mb-4 group-hover:animate-pulse-glow">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 text-[#f0f4f8]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#a0aec0]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Navigation Section */}
      <section className="py-20 bg-[#0a0e27]">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 gradient-text">
            Explore the Ecosystem
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/agents">
              <div className="tech-card p-8 cursor-pointer group">
                <Cpu className="w-8 h-8 text-[#00d9ff] mb-4 group-hover:animate-spin" />
                <h3 className="text-xl font-bold mb-2">AI Agent Network</h3>
                <p className="text-[#a0aec0] mb-4">Monitor 10 specialized agents in real-time</p>
                <span className="text-[#00d9ff] text-sm font-mono">→ View Agents</span>
              </div>
            </Link>

            <Link href="/on-chain">
              <div className="tech-card p-8 cursor-pointer group">
                <TrendingUp className="w-8 h-8 text-[#7c3aed] mb-4 group-hover:animate-bounce" />
                <h3 className="text-xl font-bold mb-2">On-Chain Intelligence</h3>
                <p className="text-[#a0aec0] mb-4">Blockchain analytics and wallet targeting</p>
                <span className="text-[#7c3aed] text-sm font-mono">→ Explore</span>
              </div>
            </Link>

            <Link href="/off-chain">
              <div className="tech-card p-8 cursor-pointer group">
                <Sparkles className="w-8 h-8 text-[#ec4899] mb-4 group-hover:animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Off-Chain Marketing</h3>
                <p className="text-[#a0aec0] mb-4">Social growth and trend analysis</p>
                <span className="text-[#ec4899] text-sm font-mono">→ Discover</span>
              </div>
            </Link>

            <Link href="/adobe-creative">
              <div className="tech-card p-8 cursor-pointer group">
                <Sparkles className="w-8 h-8 text-[#f59e0b] mb-4 group-hover:animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Creative Studio</h3>
                <p className="text-[#a0aec0] mb-4">AI-generated cinematic content</p>
                <span className="text-[#f59e0b] text-sm font-mono">→ Create</span>
              </div>
            </Link>

            <Link href="/analytics">
              <div className="tech-card p-8 cursor-pointer group">
                <TrendingUp className="w-8 h-8 text-[#10b981] mb-4 group-hover:animate-bounce" />
                <h3 className="text-xl font-bold mb-2">Real-Time Analytics</h3>
                <p className="text-[#a0aec0] mb-4">Live campaign metrics and insights</p>
                <span className="text-[#10b981] text-sm font-mono">→ Dashboard</span>
              </div>
            </Link>

            <Link href="/campaigns">
              <div className="tech-card p-8 cursor-pointer group">
                <Zap className="w-8 h-8 text-[#3b82f6] mb-4 group-hover:animate-pulse" />
                <h3 className="text-xl font-bold mb-2">Campaign Control</h3>
                <p className="text-[#a0aec0] mb-4">Launch and orchestrate campaigns</p>
                <span className="text-[#3b82f6] text-sm font-mono">→ Manage</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)] py-12">
        <div className="container mx-auto px-4 text-center text-[#718096]">
          <p>© 2026 Autonomous Marketing AI. Powered by advanced multi-agent automation.</p>
          <p className="text-sm mt-2">Built with Adobe Creative Intelligence & Blockchain Analytics</p>
        </div>
      </footer>
    </div>
  );
}
