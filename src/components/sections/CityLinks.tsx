'use client';

import { motion } from 'framer-motion';
import { MapPin, ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { NL_CITY_SLUGS_ORDERED } from '@/lib/nl-city-slugs';
import { CITIES_DATA } from '@/lib/cities';

const FEATURED_CITIES = Array.from(NL_CITY_SLUGS_ORDERED).slice(0, 8);
const SECONDARY_CITIES = Array.from(NL_CITY_SLUGS_ORDERED).slice(8);

export default function CityLinks() {
  const t = useTranslations('cityLinks');

  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      <div
        className="absolute inset-0 bg-gradient-to-b from-bg via-white to-bg pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[min(90vw,720px)] h-40 bg-swiss-red/[0.06] blur-[80px] rounded-full pointer-events-none"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-swiss-red/10 border border-swiss-red/20 text-swiss-red text-xs font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-swiss-red animate-pulse" aria-hidden />
              {t('badge')}
            </span>
            <span className="text-xs text-text-muted font-medium hidden sm:inline">{t('badgeLong')}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-text tracking-tight mb-4 leading-tight">
            <span className="text-swiss-red">{t('titleBrand')}</span>
            <br className="sm:hidden" />
            <span className="text-text sm:ml-2">{t('titleAccent')}</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-5xl mx-auto">
          {FEATURED_CITIES.map((slug, i) => {
            const city = CITIES_DATA[slug];
            if (!city) return null;
            return (
              <motion.div
                key={slug}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/iptv-${slug}`}
                  className="group flex items-start gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-border shadow-sm hover:shadow-md hover:border-swiss-red/25 hover:-translate-y-0.5 transition-all duration-300 h-full"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-swiss-red/12 to-swiss-red/5 flex items-center justify-center shrink-0 group-hover:from-swiss-red/20 group-hover:to-swiss-red/10 transition-colors">
                    <MapPin className="w-5 h-5 text-swiss-red" strokeWidth={2} />
                  </div>
                  <div className="min-w-0 flex-1 text-left">
                    <div className="text-sm sm:text-base font-bold text-text group-hover:text-swiss-red transition-colors leading-snug">
                      {city.name}
                    </div>
                    <div className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wide mt-0.5">
                      {t('provinceLabel')} {city.canton}
                    </div>
                  </div>
                  <ArrowRight
                    className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block"
                    aria-hidden
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={false}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10 max-w-2xl mx-auto"
        >
          <p className="text-sm text-text-secondary leading-relaxed">
            <span className="font-medium text-text">{t('footerPrefix')}</span>{' '}
            {SECONDARY_CITIES.map((slug, idx) => {
              const city = CITIES_DATA[slug];
              if (!city) return null;
              return (
                <span key={slug}>
                  {idx > 0 && ', '}
                  <Link
                    href={`/iptv-${slug}`}
                    className="text-swiss-red font-semibold hover:underline underline-offset-2 decoration-swiss-red/30"
                  >
                    {city.name}
                  </Link>
                </span>
              );
            })}
            {' '}
            {t('footerSuffix')}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
