'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  Users,
  Home,
  Monitor,
  ArrowLeft,
  ArrowRight,
  Tv,
  Smartphone,
  Laptop,
  Tablet,
  ChevronDown,
  ShoppingCart,
  Mail,
  Play,
} from 'lucide-react';
import { PRICE_CURRENCY_SYMBOL } from '@/lib/constants';
import type { SitePlan } from '@/lib/get-plans';
import { formatPrice, getMonthlyPrice, getDiscount, cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

// ─── FAQ Accordion ─────────────────────────────────────────
function FAQItem({
  question,
  answer,
  isOpen,
  onClick,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-swiss-red/20">
      <button
        onClick={onClick}
        className="w-full text-left p-5 font-medium flex justify-between items-center"
      >
        <span className={`text-sm sm:text-base transition-colors ${isOpen ? 'text-swiss-red' : 'text-text'}`}>
          {question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-swiss-red transition-transform duration-300 shrink-0 ml-4 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-0 text-sm text-text-secondary leading-relaxed border-t border-border/50 bg-bg">
              <div className="pt-4">{answer}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Device Tabs ───────────────────────────────────────────
const DEVICE_TABS = [
  { devices: 2, icon: Users },
  { devices: 3, icon: Home },
  { devices: 4, icon: Monitor },
] as const;

// ─── Main Page ─────────────────────────────────────────────
export default function MultiEcransClient({ plans }: { plans: SitePlan[] }) {
  const t = useTranslations('multiEcrans');
  const pt = useTranslations('pricing');
  const [selectedDevices, setSelectedDevices] = useState(2);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filtered = plans.filter((p) => p.devices === selectedDevices);
  const ordered = [
    filtered.find((p) => p.duration === 3)!,
    filtered.find((p) => p.duration === 12)!,
    filtered.find((p) => p.duration === 6)!,
  ].filter(Boolean);

  const whyItems = [
    { icon: Tv, title: t('why1Title'), desc: t('why1Desc') },
    { icon: Smartphone, title: t('why2Title'), desc: t('why2Desc') },
    { icon: Tablet, title: t('why3Title'), desc: t('why3Desc') },
    { icon: Laptop, title: t('why4Title'), desc: t('why4Desc') },
  ];

  const steps = [
    { icon: ShoppingCart, title: t('how1Title'), desc: t('how1Desc') },
    { icon: Mail, title: t('how2Title'), desc: t('how2Desc') },
    { icon: Play, title: t('how3Title'), desc: t('how3Desc') },
  ];

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
    { q: t('faq5Q'), a: t('faq5A') },
    { q: t('faq6Q'), a: t('faq6A') },
  ];

  return (
    <>
      {/* ── Back Link ────────────────────────────────────── */}
      <section className="pt-28 pb-4 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-swiss-red transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToPlans')}
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          1. PRICING SECTION
      ═══════════════════════════════════════════════════════ */}
      <section id="plans" className="py-16 lg:py-20 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
              {t('title')} <span className="text-swiss-red">{t('titleHighlight')}</span>
            </h1>
            <p className="text-text-secondary max-w-xl mx-auto">{t('subtitle')}</p>
          </motion.div>

          {/* Device tabs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex bg-surface border border-border rounded-xl p-1.5 shadow-sm">
              {DEVICE_TABS.map((tab) => {
                const isActive = selectedDevices === tab.devices;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.devices}
                    onClick={() => setSelectedDevices(tab.devices)}
                    className={cn(
                      'flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200',
                      isActive
                        ? 'bg-swiss-red text-black shadow-md shadow-swiss-red/20'
                        : 'text-text-muted hover:text-text hover:bg-bg'
                    )}
                  >
                    <TabIcon className="w-4 h-4" />
                    {t(`tab${tab.devices}`)}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Plan cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedDevices}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch"
            >
              {ordered.map((plan, i) => {
                const name = plan.name_nl;
                const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;
                const isBest = plan.duration === 12;

                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={cn(
                      'relative rounded-xl p-6 flex flex-col',
                      isBest
                        ? 'bg-swiss-red text-black ring-2 ring-swiss-red shadow-lg shadow-swiss-red/15 md:scale-[1.04]'
                        : 'bg-surface border border-border'
                    )}
                  >
                    {isBest && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-3 py-1 bg-black text-swiss-red text-[11px] font-bold rounded-full uppercase tracking-wide shadow-sm">
                          {t('bestValue')}
                        </span>
                      </div>
                    )}

                    <div className="mb-5">
                      <h3 className={cn('text-base font-bold mb-0.5', isBest ? 'text-black' : 'text-text')}>
                        {name}
                      </h3>
                      <p className={cn('text-xs', isBest ? 'text-black/70' : 'text-text-muted')}>
                        {pt('duration', { count: plan.duration })}
                      </p>
                    </div>

                    <div className="mb-5">
                      {plan.original_price && (
                        <div className="mb-0.5">
                          <span className={cn('text-sm line-through', isBest ? 'text-black/45' : 'text-text-muted')}>
                            {formatPrice(plan.original_price)} {PRICE_CURRENCY_SYMBOL}
                          </span>
                        </div>
                      )}
                      <div className="flex items-baseline gap-1.5">
                        <span className={cn('text-4xl font-extrabold', isBest ? 'text-black' : 'text-text')}>
                          {formatPrice(plan.price)}
                        </span>
                        <span className={cn('text-sm font-medium', isBest ? 'text-black/70' : 'text-text-muted')}>
                          {PRICE_CURRENCY_SYMBOL}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn('text-xs', isBest ? 'text-black/60' : 'text-text-muted')}>
                          {getMonthlyPrice(plan.price, plan.duration)} {PRICE_CURRENCY_SYMBOL}{pt('perMonth')}
                        </span>
                        {discount > 0 && (
                          <span className={cn(
                            'text-[10px] font-bold px-1.5 py-0.5 rounded',
                            isBest ? 'bg-black/10 text-black' : 'bg-success/10 text-success'
                          )}>
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-grow">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className={cn('w-4 h-4 mt-0.5 shrink-0', isBest ? 'text-black/75' : 'text-swiss-red')} />
                          <span className={cn('text-sm', isBest ? 'text-black/90' : 'text-text-secondary')}>
                            {pt(`features.${f}`)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/abonnementen/${plan.slug}`}
                      className={cn(
                        'block text-center py-3 rounded-lg font-semibold text-sm transition-colors',
                        isBest
                          ? 'bg-black text-swiss-red hover:bg-black/90'
                          : 'bg-swiss-red text-black hover:bg-swiss-red-dark'
                      )}
                    >
                      {pt('cta')}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center text-sm text-text-muted mt-8"
          >
            🔒 {pt('guarantee')}
          </motion.p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. WHY MULTI-SCREEN
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
              {t('whyTitle')} <span className="text-swiss-red">{t('whyTitleHighlight')}</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">{t('whySubtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {whyItems.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-start gap-4 p-5 bg-bg rounded-xl border border-border hover:border-swiss-red/20 transition-all group"
              >
                <div className="w-11 h-11 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0 group-hover:bg-swiss-red/12 transition-colors">
                  <item.icon className="w-5 h-5 text-swiss-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text mb-1">{item.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-bg">
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
              {t('howTitle')} <span className="text-swiss-red">{t('howTitleHighlight')}</span>
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">{t('howSubtitle')}</p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6 relative">
            {/* Connection line (desktop) */}
            <div className="hidden sm:block absolute top-12 left-[15%] right-[15%] h-px bg-border z-0" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-surface rounded-xl p-6 border border-border hover:border-swiss-red/20 transition-all duration-300 h-full flex flex-col items-center text-center group-hover:-translate-y-1">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-swiss-red flex items-center justify-center text-black font-bold text-xs shadow-sm z-10">
                    {i + 1}
                  </div>
                  <div className="w-14 h-14 rounded-full bg-swiss-red/8 flex items-center justify-center mb-4 mt-2 group-hover:bg-swiss-red/12 transition-colors">
                    <step.icon className="w-6 h-6 text-swiss-red" />
                  </div>
                  <h3 className="text-sm font-bold text-text mb-1.5 group-hover:text-swiss-red transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-bg">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
              {t('faqTitle')} <span className="text-swiss-red">{t('faqTitleHighlight')}</span>
            </h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.q}
                answer={faq.a}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. BOTTOM CTA
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 lg:py-20 bg-bg">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
              {t('ctaTitle')}
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              {t('ctaDesc')}
            </p>
            <a
              href="#plans"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-black font-bold text-sm rounded-lg hover:bg-swiss-red-dark transition-colors"
            >
              {t('ctaButton')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
