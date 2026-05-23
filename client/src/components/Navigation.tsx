import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Agents', href: '/agents' },
    { label: 'On-Chain', href: '/on-chain' },
    { label: 'Off-Chain', href: '/off-chain' },
    { label: 'Creative Studio', href: '/adobe-creative' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Viral Prediction', href: '/viral-prediction' },
    { label: 'Growth Analytics', href: '/growth-analytics' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-[#0a0e27] via-[#0a0e27] to-transparent backdrop-blur-sm border-b border-[rgba(0,217,255,0.1)]">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00d9ff] to-[#7c3aed] flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="font-bold text-lg gradient-text hidden sm:inline">
              Autonomous Marketing
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className="text-sm text-[#a0aec0] hover:text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)] transition-all"
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 hover:bg-[rgba(0,217,255,0.1)] rounded-lg transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <X className="w-5 h-5 text-[#00d9ff]" />
          ) : (
            <Menu className="w-5 h-5 text-[#a0aec0]" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="lg:hidden bg-[#1a1f3a] border-t border-[rgba(0,217,255,0.1)]">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-[#a0aec0] hover:text-[#00d9ff] hover:bg-[rgba(0,217,255,0.1)]"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
