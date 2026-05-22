import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Film, Volume2, Zap, Palette, Shield } from 'lucide-react';

interface Capability {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

export default function AdobeCreative() {
  const capabilities: Capability[] = [
    {
      icon: <Film className="w-8 h-8" />,
      title: 'AI-Generated Cinematic Ad Visuals',
      description: 'Create stunning, cinematic-quality ad visuals powered by Adobe Firefly and advanced generative AI.',
      features: ['4K resolution', 'Brand-aligned aesthetics', 'Multi-style generation', 'Real-time preview']
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Dynamic Ad Asset Generation',
      description: 'Automatically generate multiple ad variations optimized for different platforms and audiences.',
      features: ['Multi-format output', 'Platform optimization', 'A/B testing variants', 'Batch generation']
    },
    {
      icon: <Volume2 className="w-8 h-8" />,
      title: 'AI Voiceovers & Narration',
      description: 'Generate professional voiceovers in multiple languages with natural-sounding AI voices.',
      features: ['30+ languages', 'Custom voice cloning', 'Emotion control', 'Real-time sync']
    },
    {
      icon: <Film className="w-8 h-8" />,
      title: 'Branded Motion Graphics',
      description: 'Create animated graphics with consistent brand identity and dynamic transitions.',
      features: ['Brand template library', 'Animation presets', 'Smooth transitions', 'Export optimization']
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: 'Multi-Format Campaign Production',
      description: 'Produce assets for all platforms: social, web, email, display ads, and more.',
      features: ['Format auto-adaptation', 'Aspect ratio optimization', 'Platform specs', 'Batch export']
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Smart Brand Consistency Engine',
      description: 'Maintain consistent brand identity across all generated creative assets.',
      features: ['Color palette enforcement', 'Typography consistency', 'Logo integration', 'Style guidelines']
    }
  ];

  const features = [
    'Real-time creative preview',
    'AI-powered design suggestions',
    'Template library management',
    'Version control and history',
    'Collaboration tools',
    'Asset management system',
    'Performance analytics',
    'Brand guideline enforcement'
  ];

  const workflow = [
    {
      step: '1',
      title: 'Define Campaign Brief',
      description: 'Input campaign goals, target audience, and brand guidelines'
    },
    {
      step: '2',
      title: 'Generate Creative Concepts',
      description: 'AI generates multiple creative directions and visual concepts'
    },
    {
      step: '3',
      title: 'Customize & Refine',
      description: 'Fine-tune designs with real-time adjustments and variations'
    },
    {
      step: '4',
      title: 'Multi-Format Export',
      description: 'Automatically optimize and export for all platforms'
    },
    {
      step: '5',
      title: 'Deploy & Monitor',
      description: 'Launch campaigns and track creative performance metrics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">Adobe Creative Intelligence Layer</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Enterprise-grade creative production powered by Adobe's generative AI, cinematic content generation, and intelligent brand consistency.
          </p>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Core Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, i) => (
              <div key={i} className="tech-card p-8 group hover:scale-105 transition-all animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-[#f59e0b] mb-4 group-hover:animate-pulse-glow">
                  {capability.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{capability.title}</h3>
                <p className="text-[#a0aec0] mb-4 text-sm">{capability.description}</p>
                <div className="space-y-1">
                  {capability.features.map((feature, j) => (
                    <p key={j} className="text-xs text-[#f59e0b] font-mono">
                      • {feature}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Creative Workflow */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Creative Production Workflow</h2>
          <div className="grid md:grid-cols-5 gap-4">
            {workflow.map((item, i) => (
              <div key={i} className="relative">
                <div className="tech-card p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#f59e0b] to-[#ec4899] flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-xs text-[#a0aec0]">{item.description}</p>
                </div>
                {i < workflow.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-4 h-0.5 bg-gradient-to-r from-[#f59e0b] to-transparent transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-8">Advanced Creative Features</h2>
              <div className="space-y-4">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[rgba(245,158,11,0.2)] border border-[#f59e0b] flex items-center justify-center flex-shrink-0 mt-1">
                      <div className="w-2 h-2 rounded-full bg-[#f59e0b]" />
                    </div>
                    <p className="text-[#a0aec0]">{feature}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Stats */}
            <div className="tech-card p-8">
              <h3 className="text-2xl font-bold mb-8">Adobe Integration</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Connected Services</p>
                  <p className="stat-value">8</p>
                  <p className="text-xs text-[#718096] mt-2">Firefly, Express, Stock, Fonts, and more</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Creative Assets Generated</p>
                  <p className="stat-value">8.9K</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Avg Generation Time</p>
                  <p className="stat-value">2.3s</p>
                </div>
                <div>
                  <p className="text-[#a0aec0] text-sm mb-2">Brand Consistency Score</p>
                  <p className="stat-value">96.4%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center gradient-text">Creative Use Cases</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Social Media Campaigns</h3>
              <p className="text-[#a0aec0] mb-4">
                Generate platform-optimized creative for TikTok, Instagram, X, and more with automatic aspect ratio and format adaptation.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Multi-platform optimization</li>
                <li>✓ Trending audio integration</li>
                <li>✓ Automated captions</li>
                <li>✓ Performance analytics</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Email & Display Ads</h3>
              <p className="text-[#a0aec0] mb-4">
                Create responsive email templates and display ads that maintain brand consistency across all sizes and formats.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Responsive templates</li>
                <li>✓ Dynamic personalization</li>
                <li>✓ A/B testing variants</li>
                <li>✓ Compliance checking</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Video Production</h3>
              <p className="text-[#a0aec0] mb-4">
                Generate cinematic video content with AI voiceovers, motion graphics, and professional editing in minutes.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Cinematic editing</li>
                <li>✓ AI voiceovers</li>
                <li>✓ Motion graphics</li>
                <li>✓ Multi-language support</li>
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Brand Asset Library</h3>
              <p className="text-[#a0aec0] mb-4">
                Maintain a centralized library of brand-approved assets with version control and consistency enforcement.
              </p>
              <ul className="space-y-2 text-sm text-[#a0aec0]">
                <li>✓ Centralized management</li>
                <li>✓ Version control</li>
                <li>✓ Usage analytics</li>
                <li>✓ Approval workflows</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Creative Studio Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Creative Studio Interface</h2>
          <div className="tech-card p-12 h-96 flex items-center justify-center">
            <div className="text-center">
              <Sparkles className="w-16 h-16 text-[#f59e0b] mx-auto mb-4 animate-pulse" />
              <p className="text-[#a0aec0]">AI-Powered Creative Studio</p>
              <p className="text-sm text-[#718096] mt-2">Generate, customize, and deploy creative assets in real-time</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(245,158,11,0.1)] to-[rgba(236,72,153,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Power Your Creative Production?</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Access enterprise-grade creative generation powered by Adobe's generative AI and intelligent brand consistency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-gradient-to-r from-[#f59e0b] to-[#ec4899] text-white hover:shadow-lg hover:shadow-[rgba(245,158,11,0.5)]">
              Launch Creative Studio
            </Button>
            <Button variant="outline" className="border-[#f59e0b] text-[#f59e0b] hover:bg-[rgba(245,158,11,0.1)]">
              View Templates
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
