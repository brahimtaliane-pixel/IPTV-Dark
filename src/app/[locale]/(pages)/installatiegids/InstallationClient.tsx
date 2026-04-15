'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import BrandMark from '@/components/ui/BrandMark';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import {
  Tv,
  Smartphone,
  Monitor,
  Download,
  Tablet,
  Wifi,
  ChevronRight,
  Check,
  Lightbulb,
  Package,
  ArrowRight,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';

const DEVICE_ORDER = ['smartTv', 'androidIos', 'windowsMac', 'fireStick', 'magBox', 'formuler'] as const;

const DEVICE_ICONS = {
  smartTv: Tv,
  androidIos: Smartphone,
  windowsMac: Monitor,
  fireStick: Download,
  magBox: Tablet,
  formuler: Wifi,
} as const;

export default function InstallationClient() {
  const t = useTranslations('installation');

  const checklist = t.raw('checklist') as string[];
  const tips = t.raw('tips') as { title: string; body: string }[];
  const faqItems = t.raw('faqItems') as { question: string; answer: string }[];

  const devices = DEVICE_ORDER.map((key) => {
    const Icon = DEVICE_ICONS[key];
    const steps = t.raw(`devices.${key}.steps`) as string[];
    return {
      key,
      Icon,
      name: t(`devices.${key}.name`),
      brands: t(`devices.${key}.brands`),
      steps,
    };
  });

  return (
    <section className="relative pt-28 pb-20 bg-bg overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(100vw,900px)] h-64 bg-gradient-to-b from-swiss-red/[0.07] to-transparent blur-3xl rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-0 w-[min(420px,85vw)] h-[420px] bg-swiss-red/[0.04] rounded-full blur-[100px]"
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
        <nav
          aria-label="Broodkruimel"
          className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted mb-6"
        >
          <Link href="/" className="hover:text-swiss-red transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" aria-hidden />
          <span className="text-text font-medium">{t('breadcrumbLabel')}</span>
          <span className="hidden sm:inline text-border">·</span>
          <time dateTime="2026-04-14" className="hidden sm:inline text-text-muted/80">
            {t('updated')}
          </time>
        </nav>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <BrandMark className="w-10 h-10 sm:w-11 shrink-0" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-swiss-red">{SITE_CONFIG.name}</p>
              <p className="text-xs text-text-muted">iptvdark4k.nl · {t('badge')}</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-swiss-red/25 shadow-sm shadow-black/25">
            <HelpCircle className="w-3.5 h-3.5 text-swiss-red shrink-0" />
            <span className="text-[11px] font-semibold text-swiss-red uppercase tracking-wide">{t('badge')}</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-[2.5rem] font-extrabold text-text tracking-tight mb-4">
            {t('title')}
          </h1>
          <p className="text-text-secondary text-base sm:text-lg leading-relaxed">{t('subtitle')}</p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-12">
          {[
            { value: STATS.channels, label: 'Zenders' },
            { value: STATS.movies, label: 'Films & series' },
            { value: STATS.uptime, label: 'Beschikbaarheid' },
            { value: STATS.supportHours, label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-4 sm:px-6 py-4 sm:py-5 text-center">
              <div className="text-xl sm:text-2xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-[10px] sm:text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        <div id="checklist" className="mb-10 rounded-xl border border-dashed border-swiss-red/25 bg-swiss-red/[0.03] p-5 sm:p-6 scroll-mt-28">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-9 h-9 rounded-lg bg-swiss-red/10 flex items-center justify-center shrink-0">
              <Package className="w-4 h-4 text-swiss-red" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">{t('introTitle')}</h2>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">{t('introBody')}</p>
            </div>
          </div>
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t('checklistTitle')}</p>
          <ul className="space-y-2">
            {checklist.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm text-text-secondary">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-swiss-red/10 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-swiss-red" aria-hidden />
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-10">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">{t('navLabel')}</p>
          <div className="flex flex-wrap gap-2">
            <a
              href="#checklist"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface text-text-secondary hover:border-swiss-red/35 hover:text-swiss-red transition-colors scroll-mt-28"
            >
              {t('navChecklist')}
            </a>
            <a
              href="#apparaten"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface text-text-secondary hover:border-swiss-red/35 hover:text-swiss-red transition-colors scroll-mt-28"
            >
              {t('navDevices')}
            </a>
            <a
              href="#tips"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface text-text-secondary hover:border-swiss-red/35 hover:text-swiss-red transition-colors scroll-mt-28"
            >
              {t('navTips')}
            </a>
            <a
              href="#faq"
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface text-text-secondary hover:border-swiss-red/35 hover:text-swiss-red transition-colors scroll-mt-28"
            >
              {t('navFaq')}
            </a>
          </div>
        </div>

        <div id="apparaten" className="mb-16 scroll-mt-28">
          <div className="text-center mb-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-2">{t('devicesSectionTitle')}</h2>
            <p className="text-text-secondary text-sm sm:text-base">{t('devicesSectionSubtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {devices.map(({ key, Icon, name, brands, steps }, i) => (
              <motion.article
                key={key}
                id={`device-${key}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.04, 0.2) }}
                className="rounded-xl border border-border bg-surface p-5 sm:p-6 hover:border-swiss-red/25 hover:shadow-lg hover:shadow-black/20 transition-all scroll-mt-28"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-swiss-red/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-swiss-red" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-text">{name}</h3>
                    <p className="text-[11px] text-text-muted">{brands}</p>
                  </div>
                </div>
                <ol className="space-y-2.5">
                  {steps.map((step, si) => (
                    <li key={si} className="flex items-start gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-swiss-red/10 text-swiss-red text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {si + 1}
                      </span>
                      <span className="text-sm text-text-secondary leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.article>
            ))}
          </div>
        </div>

        <div id="tips" className="mb-16 scroll-mt-28">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-swiss-red/10 flex items-center justify-center">
              <Lightbulb className="w-4 h-4 text-swiss-red" aria-hidden />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-text">{t('tipsTitle')}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {tips.map((tip, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-gradient-to-br from-bg to-surface p-5 shadow-sm shadow-black/15"
              >
                <h3 className="text-sm font-bold text-text mb-1.5">{tip.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{tip.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div id="faq" className="mb-16 rounded-2xl border border-border bg-surface p-6 sm:p-8 scroll-mt-28">
          <h2 className="text-xl font-extrabold text-text mb-6">{t('faqTitle')}</h2>
          <div className="space-y-5">
            {faqItems.map((item, i) => (
              <div key={i} className="border-b border-border last:border-0 pb-5 last:pb-0">
                <h3 className="text-sm font-semibold text-text mb-1.5">{item.question}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-semibold text-swiss-red hover:underline"
            >
              <HelpCircle className="w-4 h-4 shrink-0" aria-hidden />
              {t('faqCta')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-swiss-red to-swiss-red-dark p-8 sm:p-10 text-center text-black shadow-lg shadow-swiss-red/20">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">{t('plansSectionTitle')}</h2>
          <p className="text-black/80 text-sm sm:text-base max-w-lg mx-auto mb-6">{t('plansSectionSubtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/abonnementen"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-swiss-red font-bold rounded-lg text-sm hover:bg-black/90 transition-colors"
            >
              <Package className="w-4 h-4" aria-hidden />
              {t('plansSectionCta')}
              <ArrowRight className="w-4 h-4" aria-hidden />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-black/25 text-black font-semibold rounded-lg text-sm hover:bg-black/10 transition-colors"
            >
              <MessageCircle className="w-4 h-4" aria-hidden />
              {t('contactCta')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
