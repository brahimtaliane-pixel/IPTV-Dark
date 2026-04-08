'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';

interface FAQProps {
  showAll?: boolean;
}

export default function FAQ({ showAll = false }: FAQProps) {
  const t = useTranslations('faq');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = Array.from({ length: 6 }, (_, i) => ({
    question: t(`items.${i}.question`),
    answer: t(`items.${i}.answer`),
  }));

  const displayItems = showAll ? items : items.slice(0, 4);

  return (
    <section className="py-14 lg:py-20 bg-bg">
      <div className="max-w-2xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            {t('title')} <span className="text-swiss-red">{t('titleHighlight')}</span>
          </h2>
          <p className="text-text-secondary">{t('subtitle')}</p>
        </motion.div>

        <div className="space-y-2">
          {displayItems.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-lg border border-border overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className={cn('text-sm font-semibold pr-4', isOpen ? 'text-swiss-red' : 'text-text')}>
                    {item.question}
                  </span>
                  {isOpen
                    ? <Minus className="w-4 h-4 text-swiss-red shrink-0" />
                    : <Plus className="w-4 h-4 text-text-muted shrink-0" />
                  }
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-4">
                        <p className="text-sm text-text-muted leading-relaxed">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {!showAll && (
          <div className="text-center mt-8">
            <Link href="/faq" className="text-sm font-medium text-swiss-red hover:underline">
              {t('viewAll')} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
