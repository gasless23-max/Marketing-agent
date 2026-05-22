import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Sparkles, Send, Copy, Download, Zap } from 'lucide-react';

interface GeneratedContent {
  id: string;
  type: 'copy' | 'headline' | 'description';
  content: string;
  platform: string;
  score: number;
}

export default function CreativeStudio() {
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('all');

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    // Simulate API call
    setTimeout(() => {
      const newContent: GeneratedContent[] = [
        {
          id: '1',
          type: 'headline',
          content: 'Revolutionize Your Marketing with AI-Powered Autonomous Campaigns',
          platform: 'Twitter',
          score: 9.2
        },
        {
          id: '2',
          type: 'copy',
          content: 'Experience the future of marketing. Our autonomous AI agents orchestrate campaigns across all channels, delivering results at internet scale. From on-chain wallet targeting to viral meme narratives, we handle it all.',
          platform: 'LinkedIn',
          score: 8.7
        },
        {
          id: '3',
          type: 'description',
          content: 'Transform your brand with AI-generated cinematic content, real-time analytics, and multi-agent automation. Launch, scale, and dominate digital markets.',
          platform: 'Instagram',
          score: 8.9
        },
        {
          id: '4',
          type: 'headline',
          content: '🚀 Autonomous AI Marketing at Internet Scale',
          platform: 'TikTok',
          score: 9.1
        }
      ];
      setGeneratedContent(newContent);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0e27] text-[#f0f4f8]">
      <Navigation />

      {/* Header */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-[#1a1f3a] to-[#0a0e27] border-b border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4 gradient-text">AI-Powered Creative Studio</h1>
          <p className="text-xl text-[#a0aec0] max-w-2xl">
            Generate cinematic promo content, ad copy, and multi-format creative assets using advanced LLM integration
          </p>
        </div>
      </section>

      {/* Creative Generator */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Prompt Builder */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <h2 className="text-2xl font-bold mb-6">Creative Brief</h2>
                <div className="tech-card p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Campaign Type</label>
                    <select className="w-full px-3 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] focus:border-[#00d9ff] focus:outline-none">
                      <option>Product Launch</option>
                      <option>Brand Awareness</option>
                      <option>Community Growth</option>
                      <option>Viral Campaign</option>
                      <option>Conversion Focus</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Target Audience</label>
                    <select className="w-full px-3 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] focus:border-[#00d9ff] focus:outline-none">
                      <option>Web3 Enthusiasts</option>
                      <option>Crypto Traders</option>
                      <option>NFT Collectors</option>
                      <option>DeFi Users</option>
                      <option>General Audience</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Tone</label>
                    <select className="w-full px-3 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] focus:border-[#00d9ff] focus:outline-none">
                      <option>Professional</option>
                      <option>Casual</option>
                      <option>Humorous</option>
                      <option>Urgent</option>
                      <option>Inspirational</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Platforms</label>
                    <div className="space-y-2">
                      {['Twitter', 'Instagram', 'TikTok', 'LinkedIn', 'Email'].map((platform) => (
                        <label key={platform} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4" defaultChecked={platform !== 'Email'} />
                          <span className="text-sm">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">Brand Keywords</label>
                    <input
                      type="text"
                      placeholder="e.g., AI, Marketing, Web3"
                      className="w-full px-3 py-2 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] placeholder-[#718096] focus:border-[#00d9ff] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Input & Generation */}
            <div className="lg:col-span-2">
              <div className="tech-card p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4">Describe Your Creative Vision</h2>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the campaign you want to create. Include key messages, desired outcomes, and any specific requirements..."
                  className="w-full h-32 px-4 py-3 bg-[#0a0e27] border border-[rgba(0,217,255,0.2)] rounded-lg text-[#f0f4f8] placeholder-[#718096] focus:border-[#00d9ff] focus:outline-none resize-none"
                />
                <div className="flex gap-3 mt-4">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex-1 bg-gradient-to-r from-[#00d9ff] to-[#7c3aed] text-[#0a0e27] hover:shadow-lg hover:shadow-[rgba(0,217,255,0.5)] disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Creative'}
                  </Button>
                  <Button variant="outline" className="border-[#a0aec0] text-[#a0aec0]">
                    <Zap className="w-4 h-4 mr-2" /> Templates
                  </Button>
                </div>
              </div>

              {/* Generated Content */}
              {generatedContent.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Generated Content</h2>
                  <div className="space-y-4">
                    {generatedContent.map((item) => (
                      <div key={item.id} className="tech-card p-6 hover:border-[#00d9ff] transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-xs text-[#a0aec0] mb-1 font-mono uppercase">{item.type} • {item.platform}</p>
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
                              <span className="text-xs text-[#10b981] font-mono">Score: {item.score}/10</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-[#f0f4f8] mb-4 leading-relaxed">{item.content}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]"
                            onClick={() => copyToClipboard(item.content)}
                          >
                            <Copy className="w-4 h-4 mr-1" /> Copy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#7c3aed] text-[#7c3aed] hover:bg-[rgba(124,58,237,0.1)]"
                          >
                            <Download className="w-4 h-4 mr-1" /> Export
                          </Button>
                          <Button
                            size="sm"
                            className="bg-[#10b981] text-white hover:bg-[#059669]"
                          >
                            <Send className="w-4 h-4 mr-1" /> Use
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {generatedContent.length === 0 && !isGenerating && (
                <div className="tech-card p-12 text-center">
                  <Sparkles className="w-16 h-16 text-[#7c3aed] mx-auto mb-4 opacity-50" />
                  <p className="text-[#a0aec0]">Describe your creative vision to generate AI-powered content</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Creative Templates */}
      <section className="py-16 bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Creative Templates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Cinematic Promo',
                description: 'High-production value promotional content',
                features: ['4K visuals', 'AI voiceover', 'Motion graphics']
              },
              {
                title: 'Social Media Series',
                description: 'Multi-part content series for engagement',
                features: ['Platform-optimized', 'Consistent branding', 'Scheduled posting']
              },
              {
                title: 'Email Campaign',
                description: 'Personalized email sequences',
                features: ['Dynamic content', 'A/B variants', 'Performance tracking']
              },
              {
                title: 'Ad Copy Variants',
                description: 'Multiple ad variations for testing',
                features: ['Headline options', 'CTA variations', 'Tone adjustments']
              },
              {
                title: 'Landing Page',
                description: 'Conversion-optimized landing pages',
                features: ['Responsive design', 'Form optimization', 'Analytics ready']
              },
              {
                title: 'Product Showcase',
                description: 'Feature-focused product content',
                features: ['360 views', 'Benefit highlights', 'Social proof']
              }
            ].map((template, i) => (
              <div key={i} className="tech-card p-6 hover:scale-105 transition-all">
                <h3 className="font-bold mb-2">{template.title}</h3>
                <p className="text-sm text-[#a0aec0] mb-4">{template.description}</p>
                <div className="space-y-1 mb-4">
                  {template.features.map((feature, j) => (
                    <p key={j} className="text-xs text-[#00d9ff] font-mono">• {feature}</p>
                  ))}
                </div>
                <Button size="sm" variant="outline" className="w-full border-[#00d9ff] text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]">
                  Use Template
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Creative Best Practices</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Copywriting Tips</h3>
              <ul className="space-y-3">
                {[
                  'Lead with benefit, not features',
                  'Use power words and emotional triggers',
                  'Keep headlines under 60 characters',
                  'Include clear call-to-action',
                  'Test multiple variations',
                  'Personalize for target audience'
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(0,217,255,0.2)] border border-[#00d9ff] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#00d9ff]" />
                    </div>
                    <span className="text-[#a0aec0]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tech-card p-8">
              <h3 className="text-xl font-bold mb-4">Platform Optimization</h3>
              <ul className="space-y-3">
                {[
                  'Twitter: Concise, trending topics, emojis',
                  'Instagram: Visual focus, hashtags, captions',
                  'TikTok: Trendy audio, quick cuts, authenticity',
                  'LinkedIn: Professional, insights, thought leadership',
                  'Email: Personalization, subject lines, CTA clarity',
                  'Web: SEO keywords, scannable format, mobile-first'
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[rgba(236,72,153,0.2)] border border-[#ec4899] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[#ec4899]" />
                    </div>
                    <span className="text-[#a0aec0]">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[rgba(124,58,237,0.1)] to-[rgba(236,72,153,0.1)] border-t border-[rgba(0,217,255,0.1)]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Creating Stunning Content</h2>
          <p className="text-[#a0aec0] mb-8 max-w-2xl mx-auto">
            Leverage AI-powered creative generation to produce high-quality marketing content at scale.
          </p>
          <Button className="bg-gradient-to-r from-[#7c3aed] to-[#ec4899] text-white hover:shadow-lg hover:shadow-[rgba(124,58,237,0.5)]">
            <Sparkles className="w-4 h-4 mr-2" /> Start Creating Now
          </Button>
        </div>
      </section>
    </div>
  );
}
