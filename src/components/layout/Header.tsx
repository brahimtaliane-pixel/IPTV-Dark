'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import BrandMark from '@/components/ui/BrandMark';

/** Inline SVGs avoid Turbopack HMR bugs with lucide-react chunk graphs on Header. */
function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setIsScrolled(window.scrollY > 10);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('plans'), href: '/abonnementen' },
    { label: t('multiScreen'), href: '/multi-scherm' },
    { label: t('faq'), href: '/faq' },
    { label: t('installation'), href: '/installation' },
    { label: t('contact'), href: '/contact' },
  ];

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 bg-swiss-red text-black text-center py-1.5 px-4">
        <p className="text-xs sm:text-sm font-medium truncate">
          <span className="sm:hidden">{t('promoBarShort')}</span>
          <span className="hidden sm:inline">{t('promoBar')}</span>
        </p>
      </div>

      <header
        className={cn(
          'fixed top-[28px] sm:top-[32px] left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-surface/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-surface'
        )}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <BrandMark className="w-8 h-8 shrink-0" />
              <span className="text-[22px] font-extrabold tracking-tight text-text">
                IPTV<span className="text-swiss-red">DARK</span>
              </span>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 text-[13px] font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'text-swiss-red'
                      : 'text-text-secondary hover:text-text'
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                href="/#pricing"
                className="px-5 py-2.5 bg-swiss-red text-black text-[13px] font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors"
              >
                {t('cta')}
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-text-secondary hover:text-text"
              aria-label="Menu"
            >
              {isOpen ? <IconClose className="w-5 h-5" /> : <IconMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden bg-surface border-t border-border">
            <div className="max-w-6xl mx-auto px-5 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'text-swiss-red bg-swiss-red/5'
                      : 'text-text-secondary hover:text-text hover:bg-bg-alt'
                  )}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/#pricing"
                onClick={() => setIsOpen(false)}
                className="block text-center py-3 bg-swiss-red text-black text-sm font-semibold rounded-lg mt-2"
              >
                {t('cta')}
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
