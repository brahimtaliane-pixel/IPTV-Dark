'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { CITIES_DATA } from '@/lib/cities';

const FEATURED_CITIES = ['geneve', 'zurich', 'lausanne', 'bern', 'basel', 'luzern', 'winterthur', 'st-gallen'];
const SECONDARY_CITIES = ['lugano', 'biel', 'fribourg', 'neuchatel', 'thun'];

export default function CityLinks() {
  const locale = useLocale();

  return (
    <section className="py-16 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
            {locale === 'fr' ? 'IPTV Suisse dans' : 'IPTV Schweiz in'}{' '}
            <span className="text-swiss-red">
              {locale === 'fr' ? 'votre ville' : 'Ihrer Stadt'}
            </span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            {locale === 'fr'
              ? 'Notre service IPTV premium est disponible dans toutes les grandes villes suisses avec activation rapide et support local.'
              : 'Unser Premium-IPTV-Service ist in allen grossen Schweizer Städten mit schneller Aktivierung und lokalem Support verfügbar.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {FEATURED_CITIES.map((slug, i) => {
            const city = CITIES_DATA[slug];
            if (!city) return null;
            return (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/iptv-${slug}`}
                  className="flex items-center gap-2.5 p-4 bg-white rounded-xl border border-border hover:border-swiss-red/20 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-9 h-9 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0 group-hover:bg-swiss-red/12 transition-colors">
                    <MapPin className="w-4 h-4 text-swiss-red" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-text group-hover:text-swiss-red transition-colors truncate">
                      {city.name}
                    </div>
                    <div className="text-[11px] text-text-muted">
                      {locale === 'fr' ? `Canton ${city.canton}` : `Kanton ${city.canton}`}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6"
        >
          <p className="text-xs text-text-muted">
            {locale === 'fr' ? 'Disponible aussi à ' : 'Auch verfügbar in '}
            {SECONDARY_CITIES.map((slug, idx) => {
              const city = CITIES_DATA[slug];
              if (!city) return null;
              return (
                <span key={slug}>
                  {idx > 0 && ', '}
                  <Link
                    href={`/iptv-${slug}`}
                    className="text-text-secondary hover:text-swiss-red underline decoration-dotted underline-offset-2 transition-colors"
                  >
                    {city.name}
                  </Link>
                </span>
              );
            })}
            {locale === 'fr' ? ' et dans toute la Suisse.' : ' und in der gesamten Schweiz.'}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
