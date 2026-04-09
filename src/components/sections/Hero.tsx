'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import type { SiteStatsSnapshot } from '@/lib/constants';

export default function Hero({ statValues }: { statValues: SiteStatsSnapshot }) {
  const t = useTranslations('hero');
  const stats = useTranslations('stats');

  return (
    <section className="relative bg-white pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
      {/* Subtle red gradient blob top-right */}
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-swiss-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — Text content */}
          <div>
            {/* Badge — logo mark stays outside motion to avoid SSR/client tree drift with Framer */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/5 border border-swiss-red/15 rounded-full mb-6">
              <div
                className="w-6 h-6 nl-flag shrink-0"
                aria-hidden={true}
                suppressHydrationWarning
              />
              <motion.span
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-xs font-semibold text-swiss-red tracking-wide uppercase"
              >
                {t('badge')}
              </motion.span>
            </div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text mb-6"
            >
              {t('title')}{' '}
              <span className="text-swiss-red">{t('titleHighlight')}</span>{' '}
              {t('titleEnd')}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-8"
            >
              {t('subtitle')}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
              >
                {t('ctaPrimary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg-alt transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                {t('ctaSecondary')}
              </Link>
            </motion.div>

            {/* Trust line */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <CheckCircle className="w-4 h-4 text-success" />
              {t('trust')}
            </motion.div>
          </div>

          {/* Right — Hero device image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative group">
              {/* Soft tint behind cutout */}
              <div
                className="absolute inset-0 bg-swiss-red/[0.04] rounded-[2rem] blur-3xl scale-95 opacity-70 pointer-events-none"
                aria-hidden
              />

              {/* unoptimized: serve raw PNG so alpha is preserved (Next AVIF/WebP pipeline can show black where transparent). */}
              <div className="relative bg-transparent">
                <Image
                  src="/images/hero-devices.png"
                  alt={t('imageAlt')}
                  width={612}
                  height={408}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="relative w-full h-auto object-contain bg-transparent transition-transform duration-500 group-hover:scale-[1.01]"
                  priority
                  unoptimized
                />
              </div>

              {/* Floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 }}
                className="absolute -top-3 -right-3 bg-swiss-red text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg"
              >
                {t('deviceBadge')}
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border"
        >
          {[
            { value: statValues.channels, label: stats('channels') },
            { value: statValues.movies, label: stats('movies') },
            { value: statValues.uptime, label: stats('uptime') },
            { value: statValues.supportHours, label: stats('support') },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
