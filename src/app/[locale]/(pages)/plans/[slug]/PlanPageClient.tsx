'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  Zap,
  Clock,
  Tv,
  Monitor,
  Film,
  Shield,
  RefreshCw,
  Headphones,
  ShoppingCart,
  Mail,
  Play,
  ChevronDown,
  Star,
  MessageCircle,
} from 'lucide-react';
import { PLANS } from '@/lib/constants';
import { formatPrice, getMonthlyPrice, getDiscount } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import LeadForm from '@/components/ui/LeadForm';

// ─── Sticky CTA Bar ─────────────────────────────────────────
function StickyCTA({
  planName,
  price,
  onSubscribe,
  ctaLabel,
}: {
  planName: string;
  price: number;
  onSubscribe: () => void;
  ctaLabel: string;
}) {
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const priceSection = document.getElementById('plan-price-card');
    const otherPlans = document.getElementById('other-plans');

    const handleScroll = () => {
      if (!priceSection || !otherPlans) return;
      const priceBottom = priceSection.getBoundingClientRect().bottom;
      const otherTop = otherPlans.getBoundingClientRect().top;
      setVisible(priceBottom < -50 && otherTop > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-border z-50 shadow-lg"
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h3 className="text-text font-bold text-sm sm:text-base hidden sm:block">{planName}</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-extrabold text-text">{formatPrice(price)}</span>
                <span className="text-sm font-bold text-text-muted">CHF</span>
              </div>
            </div>
            <button
              onClick={onSubscribe}
              className="px-6 py-2.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              {ctaLabel}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── FAQ Accordion Item ──────────────────────────────────────
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
    <div className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:border-swiss-red/20">
      <button
        onClick={onClick}
        className="w-full text-left p-5 font-medium flex justify-between items-center group"
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

// ─── Main Page ───────────────────────────────────────────────
export default function PlanPageClient() {
  const t = useTranslations('planPage');
  const pt = useTranslations('pricing');
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const plan = PLANS.find((p) => p.slug === slug);
  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">Plan not found</h1>
          <Link href="/" className="text-swiss-red hover:underline">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const name = locale === 'fr' ? plan.name_fr : plan.name_de;
  const description = locale === 'fr' ? plan.description_fr : plan.description_de;
  const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;
  const savings = plan.original_price ? (plan.original_price - plan.price).toFixed(2) : '0';
  // Show other plans from same device group first, then other groups
  const sameDevicePlans = PLANS.filter((p) => p.slug !== slug && p.devices === plan.devices);
  const otherDevicePlans = PLANS.filter((p) => p.slug !== slug && p.devices !== plan.devices);
  const otherPlans = [...sameDevicePlans, ...otherDevicePlans].slice(0, 4);

  const keyFeatures = [
    { icon: Tv, label: t('feat_channels'), desc: t('feat_channelsDesc') },
    { icon: Monitor, label: t('feat_4k'), desc: t('feat_4kDesc') },
    { icon: Film, label: t('feat_vod'), desc: t('feat_vodDesc') },
    { icon: Zap, label: t('feat_multiDevice'), desc: t('feat_multiDeviceDesc') },
    { icon: Headphones, label: t('feat_support'), desc: t('feat_supportDesc') },
    { icon: RefreshCw, label: t('feat_updates'), desc: t('feat_updatesDesc') },
  ];

  const steps = [
    { icon: ShoppingCart, title: t('step1Title'), desc: t('step1Desc') },
    { icon: Mail, title: t('step2Title'), desc: t('step2Desc') },
    { icon: Shield, title: t('step3Title'), desc: t('step3Desc') },
    { icon: Play, title: t('step4Title'), desc: t('step4Desc') },
  ];

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') },
  ];

  const reviews = [
    {
      title: t('review1Title'),
      text: t('review1Text'),
      name: t('review1Name'),
      since: t('review1Since'),
      initial: 'M',
    },
    {
      title: t('review2Title'),
      text: t('review2Text'),
      name: t('review2Name'),
      since: t('review2Since'),
      initial: 'L',
    },
    {
      title: t('review3Title'),
      text: t('review3Text'),
      name: t('review3Name'),
      since: t('review3Since'),
      initial: 'T',
    },
  ];

  return (
    <>
      {/* ═══════════════════════════════════════════════════════
          1. PREMIUM HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="pt-28 pb-16 bg-white relative overflow-hidden">
        {/* Subtle background accents */}
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] bg-swiss-red/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-swiss-red/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          {/* Back link */}
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-swiss-red transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToPlans')}
          </Link>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg rounded-2xl border border-border overflow-hidden"
          >
            <div className="p-6 sm:p-8 lg:p-12">
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex flex-wrap items-center gap-2 mb-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/8 rounded-full border border-swiss-red/15">
                  <div className="w-2 h-2 rounded-full bg-swiss-red animate-pulse" />
                  <span className="text-xs font-semibold text-swiss-red uppercase tracking-wide">
                    {t('premiumPlan')}
                  </span>
                </div>
                {plan.devices > 1 && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 rounded-full border border-blue-200">
                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-xs font-semibold text-blue-700">
                      {plan.devices} {locale === 'fr' ? 'écrans simultanés' : 'gleichzeitige Bildschirme'}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Title + Price row */}
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                {/* Title */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight tracking-tight mb-3">
                    {name}
                  </h1>
                  <p className="text-base sm:text-lg text-text-secondary max-w-xl">{description}</p>
                </motion.div>

                {/* Price Card */}
                <motion.div
                  id="plan-price-card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="bg-white p-5 sm:p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col items-center sm:items-start min-w-[260px]"
                >
                  <div className="text-xs text-text-muted font-medium tracking-wide mb-1">{t('totalPrice')}</div>

                  {/* Before price */}
                  {plan.original_price && (
                    <div className="mb-1">
                      <span className="text-base text-text-muted line-through">
                        {formatPrice(plan.original_price)} CHF
                      </span>
                    </div>
                  )}

                  {/* Current price */}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-text">{formatPrice(plan.price)}</span>
                    <span className="text-lg font-bold text-text-muted">CHF</span>
                    {discount > 0 && (
                      <span className="ml-2 bg-success text-white text-xs font-bold px-2 py-0.5 rounded">
                        -{discount}%
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-text-muted mt-2">
                    {t('forDuration', { count: plan.duration })}
                    {plan.original_price && (
                      <span className="text-success ml-2 font-medium">• {t('savings', { amount: savings })}</span>
                    )}
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setIsLeadFormOpen(true)}
                    className="mt-4 w-full py-3 bg-swiss-red text-white font-bold text-sm rounded-lg hover:bg-swiss-red-dark transition-colors tracking-wide"
                  >
                    {t('subscribeNow')}
                  </button>
                </motion.div>
              </div>

              {/* Trust indicators */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="flex flex-wrap gap-6 sm:gap-8 mt-8 sm:mt-10"
              >
                {[
                  { icon: Shield, title: t('guarantee24h'), desc: t('guaranteeDesc') },
                  { icon: Zap, title: t('instantActivation'), desc: t('instantActivationDesc') },
                  { icon: Headphones, title: t('support247'), desc: t('support247Desc') },
                ].map((item) => (
                  <div key={item.title} className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-swiss-red/8 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-swiss-red" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text">{item.title}</div>
                      <div className="text-xs text-text-muted">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. MAIN CONTENT GRID
      ═══════════════════════════════════════════════════════ */}
      <section className="pb-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column (2/3) */}
            <div className="lg:col-span-2 space-y-8">
              {/* About this plan */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-bg rounded-xl border border-border p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
                    <MessageCircle className="w-4 h-4 text-swiss-red" />
                  </div>
                  {t('aboutPlan')}
                </h2>
                <p className="text-text-secondary leading-relaxed">{t('aboutPlanText')}</p>
              </motion.div>

              {/* Key Features Grid */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-bg rounded-xl border border-border p-6 sm:p-8"
              >
                <h2 className="text-xl font-bold text-text mb-6 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
                    <Star className="w-4 h-4 text-swiss-red" />
                  </div>
                  {t('keyFeatures')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {keyFeatures.map((feat) => (
                    <div
                      key={feat.label}
                      className="flex items-start gap-3 p-4 bg-white rounded-lg border border-border hover:border-swiss-red/20 transition-all group"
                    >
                      <div className="w-10 h-10 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0 group-hover:bg-swiss-red/12 transition-colors">
                        <feat.icon className="w-5 h-5 text-swiss-red" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-text">{feat.label}</div>
                        <div className="text-xs text-text-muted mt-0.5">{feat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right column — Sidebar (1/3) */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-bg rounded-xl border border-border overflow-hidden lg:sticky lg:top-24"
              >
                {/* Sidebar header */}
                <div className="p-5 bg-white border-b border-border">
                  <h2 className="text-lg font-bold text-text">{t('planDetails')}</h2>
                  <p className="text-xs text-text-muted mt-0.5">{t('allFeaturesIncluded')}</p>
                </div>

                {/* Features list */}
                <div className="p-5">
                  <ul className="space-y-2.5 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-white transition-colors group">
                        <div className="w-5 h-5 rounded-full bg-swiss-red/10 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-swiss-red/15 transition-colors">
                          <Check className="w-3 h-3 text-swiss-red" />
                        </div>
                        <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
                          {pt(`features.${f}`)}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Additional info */}
                  <div className="bg-white p-4 rounded-lg border border-border">
                    <h3 className="text-sm font-bold text-text mb-3">{t('additionalInfo')}</h3>
                    <ul className="space-y-2.5">
                      {[
                        { icon: Clock, label: t('infoDuration'), value: t('infoDurationValue', { count: plan.duration }) },
                        { icon: Monitor, label: t('infoConnections'), value: t('infoConnectionsValue', { count: plan.devices }) },
                        { icon: Zap, label: t('infoActivation'), value: t('infoActivationValue') },
                        { icon: RefreshCw, label: t('infoRenewal'), value: t('infoRenewalValue') },
                      ].map((item) => (
                        <li key={item.label} className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0">
                            <item.icon className="w-3.5 h-3.5 text-swiss-red" />
                          </div>
                          <span className="text-xs text-text-muted">
                            {item.label}: <span className="text-text font-medium">{item.value}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => setIsLeadFormOpen(true)}
                    className="mt-5 w-full py-3 bg-swiss-red text-white font-bold text-sm rounded-lg hover:bg-swiss-red-dark transition-colors tracking-wide"
                  >
                    {t('subscribeNow')}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. TESTIMONIALS WITH RATING SUMMARY
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          {/* Section heading */}
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-swiss-red text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
              Trustpilot
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">
              {t('reviewsTitle')} <span className="text-swiss-red">{t('reviewsTitleHighlight')}</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t('reviewsSubtitle')}</p>
          </div>

          {/* Rating summary card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl border border-border p-6 sm:p-8 max-w-5xl mx-auto mb-10"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              {/* Overall rating */}
              <div className="text-center md:text-left">
                <div className="text-xs text-text-muted mb-1 uppercase tracking-wide">{t('overallRating')}</div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <span className="text-4xl font-extrabold text-text">4.8</span>
                  <div className="flex text-swiss-red">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                </div>
                <div className="text-xs text-text-muted mt-1">{t('basedOnReviews')}</div>
              </div>

              {/* Rating breakdown */}
              <div className="flex-grow max-w-sm w-full">
                <div className="space-y-1.5">
                  {[
                    { stars: 5, pct: 85 },
                    { stars: 4, pct: 12 },
                    { stars: 3, pct: 2 },
                    { stars: 2, pct: 1 },
                    { stars: 1, pct: 0 },
                  ].map((row) => (
                    <div key={row.stars} className="flex items-center gap-3">
                      <div className="text-xs text-text-muted w-14">
                        {row.stars} {t('stars')}
                      </div>
                      <div className="flex-grow bg-bg rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-swiss-red h-full rounded-full transition-all duration-700"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-text-muted w-8 text-right">{row.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trustpilot */}
              <div className="flex flex-col items-center md:items-end">
                <div className="text-xs text-text-muted mb-2">{t('verifiedBy')}</div>
                <div className="bg-[#00b67a] text-white px-4 py-2 rounded-md font-bold flex items-center text-sm">
                  <Star className="w-4 h-4 mr-1.5 fill-current" />
                  Trustpilot
                </div>
              </div>
            </div>
          </motion.div>

          {/* Testimonial cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {reviews.map((review, i) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-border p-5 hover:border-swiss-red/20 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-center mb-3">
                  <div className="flex text-swiss-red">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-text text-xs font-medium ml-2">5.0</span>
                </div>
                <h3 className="text-text font-semibold text-sm mb-2">{review.title}</h3>
                <p className="text-text-muted text-xs leading-relaxed mb-4">&ldquo;{review.text}&rdquo;</p>
                <div className="flex items-center mt-auto">
                  <div className="w-8 h-8 bg-swiss-red/10 rounded-full flex items-center justify-center text-swiss-red font-semibold text-sm">
                    {review.initial}
                  </div>
                  <div className="ml-2.5">
                    <div className="text-text text-xs font-semibold">{review.name}</div>
                    <div className="text-text-muted text-[10px]">{review.since}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trustpilot link */}
          <div className="text-center mt-8">
            <a
              href="#"
              className="inline-flex items-center gap-2 text-text-muted hover:text-swiss-red transition-colors text-sm"
            >
              {t('seeAllReviews')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. OTHER PLANS
      ═══════════════════════════════════════════════════════ */}
      <section id="other-plans" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <h2 className="text-2xl font-extrabold text-text mb-8">{t('otherPlans')}</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {otherPlans.map((p, i) => {
              const otherName = locale === 'fr' ? p.name_fr : p.name_de;
              const otherDiscount = p.original_price ? getDiscount(p.original_price, p.price) : 0;
              const otherSavings = p.original_price ? (p.original_price - p.price).toFixed(2) : '0';

              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-bg rounded-xl border border-border hover:border-swiss-red/20 p-6 transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-lg font-bold text-text">{otherName}</h3>
                    {p.devices > 1 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded text-[10px] font-semibold text-blue-700 border border-blue-200">
                        <Monitor className="w-3 h-3" />
                        {p.devices}
                      </span>
                    )}
                  </div>
                  <div className="mb-4">
                    {p.original_price && (
                      <div className="text-sm text-text-muted line-through mb-0.5">
                        {formatPrice(p.original_price)} CHF
                      </div>
                    )}
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-extrabold text-text">{formatPrice(p.price)} CHF</span>
                      {otherDiscount > 0 && (
                        <span className="bg-success text-white text-xs font-bold px-2 py-0.5 rounded">
                          -{otherDiscount}%
                        </span>
                      )}
                    </div>
                    {p.original_price && (
                      <div className="text-xs text-success mt-0.5 font-medium">
                        {t('savings', { amount: otherSavings })}
                      </div>
                    )}
                  </div>
                  <Link
                    href={`/plans/${p.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-swiss-red text-white font-semibold rounded-lg text-sm hover:bg-swiss-red-dark transition-colors"
                  >
                    {t('viewDetails')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-swiss-red/[0.04] rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-swiss-red/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-5xl mx-auto px-5 sm:px-8 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-swiss-red text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
              {t('simpleAndFast')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">{t('howItWorks')}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection line (desktop) */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-border z-0" />

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-xl p-5 border border-border hover:border-swiss-red/20 transition-all duration-300 h-full flex flex-col items-center text-center group-hover:-translate-y-1">
                  {/* Step number */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-swiss-red flex items-center justify-center text-white font-bold text-xs shadow-sm z-10">
                    {i + 1}
                  </div>

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-full bg-swiss-red/8 flex items-center justify-center mb-4 mt-2 group-hover:bg-swiss-red/12 transition-colors">
                    <step.icon className="w-6 h-6 text-swiss-red" />
                  </div>

                  <h3 className="text-sm font-bold text-text mb-1.5 group-hover:text-swiss-red transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-muted leading-relaxed flex-grow">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          6. PRODUCT FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute -bottom-24 left-1/4 w-48 h-48 bg-swiss-red/[0.04] rounded-full blur-[80px] pointer-events-none" />

        <div className="max-w-3xl mx-auto px-5 sm:px-8 relative z-10">
          {/* Section heading */}
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-swiss-red text-white text-xs font-semibold rounded-full mb-3 uppercase tracking-wide">
              {t('frequentQuestions')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-2">
              {t('faqTitle')} <span className="text-swiss-red">{t('faqTitleHighlight')}</span>
            </h2>
            <p className="text-text-secondary">{t('faqSubtitle')}</p>
          </div>

          {/* FAQ Items */}
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

          {/* More questions */}
          <div className="text-center mt-10">
            <p className="text-text-muted text-sm mb-3">{t('moreQuestions')}</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg border border-border text-text font-semibold rounded-lg text-sm hover:border-swiss-red/20 transition-colors"
            >
              <Headphones className="w-4 h-4 text-swiss-red" />
              {t('contactSupport')}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          7. STICKY BOTTOM CTA
      ═══════════════════════════════════════════════════════ */}
      <StickyCTA
        planName={name}
        price={plan.price}
        onSubscribe={() => setIsLeadFormOpen(true)}
        ctaLabel={t('subscribeNow')}
      />

      {/* Lead Form Modal */}
      <LeadForm planId={plan.id} planName={name} isOpen={isLeadFormOpen} onClose={() => setIsLeadFormOpen(false)} />
    </>
  );
}
