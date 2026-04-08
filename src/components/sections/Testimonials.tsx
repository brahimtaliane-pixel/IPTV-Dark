'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const REVIEWS = [
  { name: 'Marc D.', location: 'Amsterdam', rating: 5, text: 'Top service! Scherp beeld en een enorme keuze aan zenders. Support reageert snel.' },
  { name: 'Sophie L.', location: 'Rotterdam', rating: 5, text: 'Al een half jaar klant — heel tevreden. Replay werkt perfect en activering was razendsnel.' },
  { name: 'Thomas B.', location: 'Utrecht', rating: 5, text: 'De beste IPTV die ik heb geprobeid. Stabiel en betrouwbaar.' },
  { name: 'Laura M.', location: 'Eindhoven', rating: 5, text: 'Hele gezin blij. Nederlandse en internationale zenders zonder problemen.' },
  { name: 'Pierre R.', location: 'Den Haag', rating: 5, text: 'Uitstekende prijs-kwaliteit. Zoveel zenders voor deze prijs is zeldzaam.' },
  { name: 'Nathalie K.', location: 'Groningen', rating: 5, text: 'Ik raad het 100% aan. VOD is compleet en 4K op mijn Smart TV is indrukwekkend.' },
];

export default function Testimonials() {
  const t = useTranslations('testimonials');

  return (
    <section className="py-14 lg:py-20 bg-white">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {REVIEWS.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-bg rounded-xl border border-border p-5"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-swiss-red/10 text-swiss-red flex items-center justify-center text-sm font-bold">
                  {review.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-text">{review.name}</div>
                  <div className="text-xs text-text-muted">{review.location}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
