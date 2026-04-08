'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { PLANS } from '@/lib/constants';
import { formatPrice, getMonthlyPrice, getDiscount, cn } from '@/lib/utils';
import { Link } from '@/i18n/navigation';

export default function Pricing() {
  const t = useTranslations('pricing');
  const locale = useLocale();

  // Only show single-device plans on homepage, ordered: 3mo, 12mo (popular), 6mo
  const singlePlans = PLANS.filter((p) => p.devices === 1);
  const ordered = [
    singlePlans.find((p) => p.duration === 3)!,
    singlePlans.find((p) => p.is_popular)!,
    singlePlans.find((p) => p.duration === 6)!,
  ];

  return (
    <section id="pricing" className="py-14 lg:py-20 bg-bg">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            {t('title')} <span className="text-swiss-red">{t('titleHighlight')}</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-5 max-w-4xl mx-auto items-stretch">
          {ordered.map((plan, i) => {
            const name = locale === 'fr' ? plan.name_fr : plan.name_de;
            const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={cn(
                  'relative rounded-xl p-6 flex flex-col',
                  plan.is_popular
                    ? 'bg-swiss-red text-white ring-2 ring-swiss-red shadow-lg shadow-swiss-red/15 md:scale-[1.04]'
                    : 'bg-white border border-border'
                )}
              >
                {/* Popular tag */}
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-1 bg-white text-swiss-red text-[11px] font-bold rounded-full uppercase tracking-wide shadow-sm">
                      {t('popular')}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <h3 className={cn('text-base font-bold mb-0.5', plan.is_popular ? 'text-white' : 'text-text')}>
                    {name}
                  </h3>
                  <p className={cn('text-xs', plan.is_popular ? 'text-white/70' : 'text-text-muted')}>
                    {t('duration', { count: plan.duration })}
                  </p>
                </div>

                {/* Price */}
                <div className="mb-5">
                  {plan.original_price && (
                    <div className="mb-0.5">
                      <span className={cn('text-sm line-through', plan.is_popular ? 'text-white/50' : 'text-text-muted')}>
                        {formatPrice(plan.original_price)} CHF
                      </span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className={cn('text-4xl font-extrabold', plan.is_popular ? 'text-white' : 'text-text')}>
                      {formatPrice(plan.price)}
                    </span>
                    <span className={cn('text-sm font-medium', plan.is_popular ? 'text-white/70' : 'text-text-muted')}>
                      CHF
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn('text-xs', plan.is_popular ? 'text-white/60' : 'text-text-muted')}>
                      {getMonthlyPrice(plan.price, plan.duration)} CHF{t('perMonth')}
                    </span>
                    {discount > 0 && (
                      <span className={cn(
                        'text-[10px] font-bold px-1.5 py-0.5 rounded',
                        plan.is_popular ? 'bg-white/20 text-white' : 'bg-success/10 text-success'
                      )}>
                        -{discount}%
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-2.5 mb-6 flex-grow">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className={cn('w-4 h-4 mt-0.5 shrink-0', plan.is_popular ? 'text-white/80' : 'text-swiss-red')} />
                      <span className={cn('text-sm', plan.is_popular ? 'text-white/90' : 'text-text-secondary')}>
                        {t(`features.${f}`)}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={`/plans/${plan.slug}`}
                  className={cn(
                    'block text-center py-3 rounded-lg font-semibold text-sm transition-colors',
                    plan.is_popular
                      ? 'bg-white text-swiss-red hover:bg-white/90'
                      : 'bg-swiss-red text-white hover:bg-swiss-red-dark'
                  )}
                >
                  {t('cta')}
                </Link>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-text-muted mt-8"
        >
          🔒 {t('guarantee')}
        </motion.p>
      </div>
    </section>
  );
}
