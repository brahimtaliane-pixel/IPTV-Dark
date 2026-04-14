'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Check, ArrowRight, Tv, Zap, Headphones, Wifi, Globe } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import BrandMark from '@/components/ui/BrandMark';
import { PRICE_CURRENCY_SYMBOL, SITE_CONFIG, type SiteStatsSnapshot } from '@/lib/constants';
import type { SitePlan } from '@/lib/get-plans';
import { formatPrice, getDiscount } from '@/lib/utils';
import { NL_CITY_SLUGS_ORDERED } from '@/lib/nl-city-slugs';
import { CITIES_DATA } from '@/lib/cities';
import { CITY_PAGE_SECTIONS_NL } from '@/lib/city-page-content-nl';

const ISP_NL = ['KPN', 'Ziggo', 'T-Mobile', 'Odido'] as const;

export default function CityPageClient({
  citySlug,
  plans,
  stats,
}: {
  citySlug: string;
  plans: SitePlan[];
  stats: SiteStatsSnapshot;
}) {
  const t = useTranslations('pricing');

  const city = CITIES_DATA[citySlug];
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-swiss-red mb-2">{SITE_CONFIG.name}</p>
          <h1 className="text-2xl font-bold text-text mb-4">Stad niet gevonden</h1>
          <p className="text-text-secondary text-sm mb-6">Deze locatie staat niet op onze lijst.</p>
          <Link href="/" className="text-swiss-red hover:underline font-medium">
            ← Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const meta = city.meta_nl;
  const sections = CITY_PAGE_SECTIONS_NL[citySlug];
  if (!sections) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-swiss-red mb-2">{SITE_CONFIG.name}</p>
          <h1 className="text-2xl font-bold text-text mb-4">Pagina-inhoud ontbreekt</h1>
          <p className="text-text-secondary text-sm mb-6">Deze stad heeft nog geen volledige content.</p>
          <Link href="/" className="text-swiss-red hover:underline font-medium">
            ← Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const ispList = ISP_NL;

  const featureCards = [
    { icon: Tv, ...sections.highlights[0] },
    { icon: Zap, ...sections.highlights[1] },
    { icon: Headphones, ...sections.highlights[2] },
  ];

  const neighborhoodLabels = city.neighborhoods_nl;

  return (
    <section className="relative pt-28 pb-20 bg-bg overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-32 right-0 w-[min(480px,85vw)] h-[480px] bg-swiss-red/[0.06] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[280px] h-[280px] bg-swiss-red/[0.03] rounded-full blur-[80px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 bg-surface rounded-full border border-swiss-red/20 mb-5 shadow-sm shadow-black/20"
          >
            <BrandMark className="w-6 h-6 shrink-0" />
            <MapPin className="w-3.5 h-3.5 text-swiss-red shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold text-swiss-red uppercase tracking-wide">
              IPTV Dark · {city.name}
              {city.canton ? ` · ${city.canton}` : ''}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-[52px] font-extrabold text-text leading-[1.08] tracking-tight mb-5"
          >
            {meta.h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8"
          >
            {meta.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/abonnementen"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-black font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              Bekijk alle abonnementen
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-surface transition-colors text-sm"
            >
              Neem contact op
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
          {[
            { value: stats.channels, label: 'Zenders' },
            { value: stats.movies, label: 'Films en series' },
            { value: stats.uptime, label: 'Beschikbaarheid' },
            { value: stats.supportHours, label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-extrabold text-text mb-6">{sections.whyHeading}</h2>
            <ul className="space-y-3.5">
              {sections.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-swiss-red/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-swiss-red" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {featureCards.map((item, idx) => (
              <div key={`${citySlug}-hl-${idx}`} className="bg-bg rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-swiss-red" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text">{item.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-text mb-2">{sections.plansTitle}</h2>
          <p className="text-text-secondary mb-8">{sections.plansLead}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...plans].sort((a, b) => a.duration - b.duration).map((plan) => {
              const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-6 transition-all ${
                    plan.is_popular
                      ? 'bg-swiss-red border-swiss-red text-black relative'
                      : 'bg-surface border-border hover:border-swiss-red/20'
                  }`}
                >
                  {plan.is_popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-swiss-red text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {t('popular')}
                    </span>
                  )}
                  <div className="text-sm font-semibold mb-3">{plan.name_nl}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold">{formatPrice(plan.price)}</span>
                    <span className="text-sm opacity-80">{PRICE_CURRENCY_SYMBOL}</span>
                    {discount > 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ml-1 ${plan.is_popular ? 'bg-white/20' : 'bg-success text-white'}`}
                      >
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {plan.original_price && (
                    <div className={`text-xs line-through mb-3 ${plan.is_popular ? 'text-white/60' : 'text-text-muted'}`}>
                      {formatPrice(plan.original_price)} {PRICE_CURRENCY_SYMBOL}
                    </div>
                  )}
                  <Link
                    href={`/abonnementen/${plan.slug}`}
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      plan.is_popular
                        ? 'bg-black text-swiss-red hover:bg-black/90'
                        : 'bg-swiss-red text-black hover:bg-swiss-red-dark'
                    }`}
                  >
                    {t('cta')}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-swiss-red" />
            </div>
            {sections.internet.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{sections.internet.body}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ispList.map((isp) => (
              <div key={isp} className="bg-surface rounded-lg border border-border p-3 text-center">
                <div className="text-sm font-semibold text-text">{isp}</div>
                <div className="text-xs text-success mt-0.5 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  Geschikt
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Globe className="w-4 h-4 text-swiss-red" />
            </div>
            {sections.coverage.title}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">{sections.coverage.body}</p>
          <div className="flex flex-wrap gap-2">
            {neighborhoodLabels.map((n) => (
              <span key={n} className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-6">{sections.faqSectionTitle}</h2>
          <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
            {sections.faq.map((item, i) => (
              <div key={`${citySlug}-faq-${i}`}>
                <h3 className="font-semibold text-text mb-1">{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-text mb-4">{sections.nearbyTitle}</h2>
          <div className="flex flex-wrap gap-2">
            {NL_CITY_SLUGS_ORDERED.filter((s) => s !== citySlug)
              .slice(0, 8)
              .map((slug) => {
                const other = CITIES_DATA[slug];
                if (!other) return null;
                return (
                  <Link
                    key={slug}
                    href={`/iptv-${slug}`}
                    className="px-4 py-2 bg-bg border border-border rounded-lg text-sm text-text-secondary hover:border-swiss-red/20 hover:text-swiss-red transition-all"
                  >
                    IPTV {other.name}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
