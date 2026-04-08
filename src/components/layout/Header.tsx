'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Header() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: t('home'), href: '/' },
    { label: t('plans'), href: '/plans' },
    { label: t('multiScreen'), href: '/multi-ecrans' },
    { label: t('faq'), href: '/faq' },
    { label: t('installation'), href: '/installation' },
    { label: t('contact'), href: '/contact' },
  ];

  const switchLocale = (newLocale: 'fr' | 'de') => {
    router.replace(pathname, { locale: newLocale });
    setLangOpen(false);
  };

  return (
    <>
      {/* Promo Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-swiss-red text-white text-center py-1.5 px-4">
        <p className="text-xs sm:text-sm font-medium truncate">
          <span className="sm:hidden">{t('promoBarShort')}</span>
          <span className="hidden sm:inline">{t('promoBar')}</span>
        </p>
      </div>

      <header
        className={cn(
          'fixed top-[28px] sm:top-[32px] left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border'
            : 'bg-white'
        )}
      >
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 bg-swiss-red rounded swiss-cross" />
            <span className="text-[22px] font-extrabold tracking-tight text-text">
              IPTV<span className="text-swiss-red">SUISSE</span>
            </span>
          </Link>

          {/* Desktop Nav */}
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

          {/* Right: Lang + CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text transition-colors rounded-md"
              >
                {locale === 'fr' ? '🇫🇷 FR' : '🇩🇪 DE'}
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', langOpen && 'rotate-180')} />
              </button>

              {langOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                  <div className="absolute right-0 mt-1 w-32 bg-white border border-border rounded-lg shadow-lg z-50 overflow-hidden">
                    <button
                      onClick={() => switchLocale('fr')}
                      className={cn(
                        'w-full px-3 py-2.5 text-[13px] text-left flex items-center gap-2 hover:bg-bg transition-colors',
                        locale === 'fr' ? 'text-swiss-red font-medium' : 'text-text-secondary'
                      )}
                    >
                      🇫🇷 Français
                    </button>
                    <button
                      onClick={() => switchLocale('de')}
                      className={cn(
                        'w-full px-3 py-2.5 text-[13px] text-left flex items-center gap-2 hover:bg-bg transition-colors',
                        locale === 'de' ? 'text-swiss-red font-medium' : 'text-text-secondary'
                      )}
                    >
                      🇩🇪 Deutsch
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* CTA */}
            <Link
              href="/#pricing"
              className="px-5 py-2.5 bg-swiss-red text-white text-[13px] font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors"
            >
              {t('cta')}
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-text-secondary hover:text-text"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-border">
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
            <div className="pt-3 mt-3 border-t border-border flex gap-2">
              <button
                onClick={() => { switchLocale('fr'); setIsOpen(false); }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg text-center transition-colors',
                  locale === 'fr'
                    ? 'bg-swiss-red/5 text-swiss-red border border-swiss-red/20'
                    : 'bg-bg-alt text-text-secondary'
                )}
              >
                🇫🇷 FR
              </button>
              <button
                onClick={() => { switchLocale('de'); setIsOpen(false); }}
                className={cn(
                  'flex-1 py-2.5 text-sm font-medium rounded-lg text-center transition-colors',
                  locale === 'de'
                    ? 'bg-swiss-red/5 text-swiss-red border border-swiss-red/20'
                    : 'bg-bg-alt text-text-secondary'
                )}
              >
                🇩🇪 DE
              </button>
            </div>
            <Link
              href="/#pricing"
              onClick={() => setIsOpen(false)}
              className="block text-center py-3 bg-swiss-red text-white text-sm font-semibold rounded-lg mt-2"
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
