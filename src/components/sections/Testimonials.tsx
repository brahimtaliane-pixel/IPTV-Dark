'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck, Users, Headphones } from 'lucide-react';
import { STATS } from '@/lib/constants';

const REVIEWS = [
  {
    name: 'Michel D.',
    location: 'Amsterdam',
    rating: 5,
    text: 'Onberispelijke service: scherp beeld, eerlijke prijs en een enorme keuze. IPTV Dark raad ik zeker aan.',
  },
  {
    name: 'Sarah M.',
    location: 'Rotterdam',
    rating: 5,
    text: 'Zes maanden klant — replay werkt perfect en support antwoordt binnen no-time. Precies wat ik zocht.',
  },
  {
    name: 'Thomas G.',
    location: 'Utrecht',
    rating: 5,
    text: 'Nederlandse én internationale zenders, installatie kinderspel en streaming blijft stabiel.',
  },
  {
    name: 'Laura M.',
    location: 'Eindhoven',
    rating: 5,
    text: 'Hele gezin blij. Geen buffering en op de Smart TV ziet het er top uit.',
  },
  {
    name: 'Pierre R.',
    location: 'Den Haag',
    rating: 5,
    text: 'Meer dan 32.000 zenders en een VOD-bibliotheek die niet ophoudt — prijs-kwaliteit klopt.',
  },
  {
    name: 'Nathalie K.',
    location: 'Groningen',
    rating: 5,
    text: '4K op de TV is indrukwekkend. Geen gedoe met activering; binnen een paar uur klaar.',
  },
] as const;

export default function Testimonials() {
  const t = useTranslations('testimonials');

  const trustStats = [
    {
      icon: Star,
      label: t('ratingLabel'),
      value: t('ratingValue'),
      accent: true,
      fillIcon: true,
    },
    {
      icon: Users,
      label: t('statCustomers'),
      value: STATS.customers,
      accent: false,
      fillIcon: false,
    },
    {
      icon: Headphones,
      label: t('statSupport'),
      value: STATS.supportHours,
      accent: false,
      fillIcon: false,
    },
  ] as const;

  return (
    <section className="relative py-16 lg:py-24 bg-bg overflow-hidden border-t border-border">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 left-1/4 w-[420px] h-[420px] bg-swiss-red/[0.06] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[min(480px,90vw)] h-[380px] bg-swiss-red/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-swiss-red/20 rounded-full mb-5">
            <ShieldCheck className="w-4 h-4 text-swiss-red shrink-0" aria-hidden />
            <span className="text-[11px] sm:text-xs font-semibold text-swiss-red tracking-wide uppercase">
              {t('badge')}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold text-text tracking-tight mb-4 leading-[1.1]">
            {t('title')}{' '}
            <span className="text-swiss-red">{t('titleHighlight')}</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 lg:mb-14"
        >
          {trustStats.map(({ icon: Icon, label, value, accent, fillIcon }) => (
            <div
              key={label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border min-w-[140px] sm:min-w-0 ${
                accent
                  ? 'bg-swiss-red/10 border-swiss-red/25 shadow-[0_0_0_1px_rgba(198,255,63,0.08)]'
                  : 'bg-surface border-border'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  accent ? 'bg-swiss-red/15' : 'bg-bg-alt'
                }`}
              >
                <Icon
                  className={`w-5 h-5 text-swiss-red ${fillIcon ? 'fill-swiss-red' : ''}`}
                  aria-hidden
                />
              </div>
              <div className="text-left min-w-0">
                <div className="text-lg sm:text-xl font-extrabold text-text tabular-nums leading-tight">{value}</div>
                <div className="text-[11px] sm:text-xs text-text-muted uppercase tracking-wide font-medium">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {REVIEWS.map((review, i) => (
            <motion.article
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-swiss-red/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative h-full rounded-2xl border border-border bg-surface p-5 sm:p-6 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:border-swiss-red/20">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <Quote
                    className="w-9 h-9 text-swiss-red/25 shrink-0 -mt-1 -ml-1"
                    strokeWidth={1.25}
                    aria-hidden
                  />
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-text-muted bg-bg-alt border border-border px-2 py-1 rounded-md">
                    <ShieldCheck className="w-3 h-3 text-swiss-red" aria-hidden />
                    {t('verified')}
                  </span>
                </div>

                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: review.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-swiss-red fill-swiss-red" aria-hidden />
                  ))}
                </div>

                <p className="text-sm sm:text-[15px] text-text-secondary leading-relaxed mb-6">
                  <span className="text-text/90">&ldquo;</span>
                  {review.text}
                  <span className="text-text/90">&rdquo;</span>
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-swiss-red/25 to-swiss-red/5 text-swiss-red flex items-center justify-center text-base font-bold ring-2 ring-swiss-red/15">
                    {review.name[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text truncate">{review.name}</div>
                    <div className="text-xs text-text-muted">{review.location}</div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
