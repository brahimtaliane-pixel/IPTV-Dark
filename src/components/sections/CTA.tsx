'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';

export default function CTA() {
  const t = useTranslations('cta');

  return (
    <section className="py-14 lg:py-20 bg-swiss-red relative overflow-hidden">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }} />

      <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-black/75 max-w-xl mx-auto mb-8">
            {t('subtitle')}
          </p>

          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-black text-swiss-red font-bold rounded-lg hover:bg-black/90 transition-colors text-sm"
          >
            {t('button')}
            <ArrowRight className="w-4 h-4" />
          </Link>

          <p className="text-sm text-black/50 mt-5">{t('guarantee')}</p>
        </motion.div>
      </div>
    </section>
  );
}
