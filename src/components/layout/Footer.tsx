'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { NL_CITY_SLUGS_ORDERED } from '@/lib/nl-city-slugs';
import { CITIES_DATA } from '@/lib/cities';

const FOOTER_CITIES: readonly string[] = Array.from(NL_CITY_SLUGS_ORDERED);

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-dark text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-7 h-7 nl-flag shrink-0"
                aria-hidden={true}
                suppressHydrationWarning
              />
              <span className="text-lg font-extrabold tracking-tight">
                IPTV<span className="text-swiss-red">NEDERLAND</span>
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed">
              {t('description')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{t('links')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/" className="text-sm text-white/60 hover:text-white transition-colors">{nav('home')}</Link></li>
              <li><Link href="/plans" className="text-sm text-white/60 hover:text-white transition-colors">{nav('plans')}</Link></li>
              <li><Link href="/multi-ecrans" className="text-sm text-white/60 hover:text-white transition-colors">{nav('multiScreen')}</Link></li>
              <li><Link href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">{nav('faq')}</Link></li>
              <li><Link href="/installation" className="text-sm text-white/60 hover:text-white transition-colors">{nav('installation')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{t('support')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors">{nav('contact')}</Link></li>
              <li><Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors">{nav('about')}</Link></li>
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className="text-sm text-white/60 hover:text-white transition-colors"
                  suppressHydrationWarning
                >
                  {SITE_CONFIG.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Cities (SEO internal links) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              {t('cities')}
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_CITIES.slice(0, 7).map((slug) => {
                const city = CITIES_DATA[slug];
                if (!city) return null;
                return (
                  <li key={slug}>
                    <Link href={`/iptv-${slug}`} className="text-sm text-white/60 hover:text-white transition-colors">
                      IPTV {city.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal + more cities */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">{t('legal')}</h3>
            <ul className="space-y-2.5">
              <li><Link href="/privacy" className="text-sm text-white/60 hover:text-white transition-colors">{t('privacy')}</Link></li>
              <li><Link href="/terms" className="text-sm text-white/60 hover:text-white transition-colors">{t('terms')}</Link></li>
            </ul>
            {/* Remaining cities */}
            <ul className="space-y-2.5 mt-5">
              {FOOTER_CITIES.slice(7).map((slug) => {
                const city = CITIES_DATA[slug];
                if (!city) return null;
                return (
                  <li key={slug}>
                    <Link href={`/iptv-${slug}`} className="text-sm text-white/60 hover:text-white transition-colors">
                      IPTV {city.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">{t('copyright', { year })}</p>
          <p className="text-xs text-white/30">{t('madeIn')}</p>
        </div>
      </div>
    </footer>
  );
}
