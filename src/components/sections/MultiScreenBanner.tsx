'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { BarChart3, Tv, Smartphone, Tablet, Laptop, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const DEVICES = [
  { key: 'smartTv', icon: Tv },
  { key: 'smartphone', icon: Smartphone },
  { key: 'tablet', icon: Tablet },
  { key: 'computer', icon: Laptop },
] as const;

export default function MultiScreenBanner() {
  const t = useTranslations('multiScreenBanner');

  return (
    <section className="py-14 lg:py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-bg rounded-2xl border border-border p-8 sm:p-10 lg:p-12"
        >
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            {/* Left: icon + text + devices */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-swiss-red/8 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-swiss-red" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                  {t('title')} {t('titleHighlight')}
                </h2>
              </div>

              <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-6 max-w-lg">
                {t('description')}
              </p>

              {/* Device grid 2x2 */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 max-w-xs">
                {DEVICES.map(({ key, icon: Icon }) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-swiss-red" />
                    <span className="text-sm text-text font-medium">{t(`devices.${key}`)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: CTA */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <Link
                href="/multi-scherm"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold text-sm rounded-lg hover:bg-swiss-red-dark transition-colors"
              >
                {t('cta')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-xs text-text-muted">{t('familyNote')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
