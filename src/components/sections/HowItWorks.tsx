'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { ShoppingCart, Mail, ShieldCheck, CirclePlay } from 'lucide-react';
import { Link } from '@/i18n/navigation';

const STEPS = [
  { key: 'step1', icon: ShoppingCart },
  { key: 'step2', icon: Mail },
  { key: 'step3', icon: ShieldCheck },
  { key: 'step4', icon: CirclePlay },
] as const;

export default function HowItWorks() {
  const t = useTranslations('howItWorks');

  return (
    <section className="py-14 lg:py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="inline-block px-3 py-1 bg-swiss-red text-black text-xs font-semibold rounded mb-4">
            {t('badge')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            {t('title')}{' '}
            <span className="text-swiss-red">{t('titleHighlight')}</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
          {STEPS.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative bg-surface rounded-xl border border-border p-6 hover:border-swiss-red/20 hover:shadow-sm transition-all group flex flex-col items-center text-center"
            >
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-swiss-red flex items-center justify-center text-black text-xs font-bold shadow-sm">
                {i + 1}
              </div>

              <div className="w-14 h-14 rounded-full bg-swiss-red/8 flex items-center justify-center mb-4 mt-2 group-hover:bg-swiss-red/12 transition-colors">
                <Icon className="w-6 h-6 text-swiss-red" />
              </div>

              <h3 className="text-base font-bold text-text mb-1.5">{t(`${key}.title`)}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{t(`${key}.description`)}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/abonnementen"
            className="inline-flex items-center px-6 py-3 bg-swiss-red hover:bg-swiss-red/90 text-black font-semibold rounded-lg transition-colors shadow-sm"
          >
            {t('cta')}
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
