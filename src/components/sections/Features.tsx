'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Monitor, Zap, Clock } from 'lucide-react';

const FEATURES = [
  { key: 'quality', icon: Monitor },
  { key: 'noBuffering', icon: Zap },
  { key: 'replay', icon: Clock },
] as const;

export default function Features() {
  const t = useTranslations('features');

  return (
    <section className="py-14 lg:py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto">
          {FEATURES.map(({ key, icon: Icon }, i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-xl border border-border p-6 hover:border-swiss-red/20 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-lg bg-swiss-red/8 flex items-center justify-center mb-4 group-hover:bg-swiss-red/12 transition-colors">
                <Icon className="w-5 h-5 text-swiss-red" />
              </div>
              <h3 className="text-base font-bold text-text mb-1.5">{t(`${key}.title`)}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{t(`${key}.description`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
