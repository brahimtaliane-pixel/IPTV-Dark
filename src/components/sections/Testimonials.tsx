'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const TESTIMONIALS = {
  fr: [
    { name: 'Marc D.', location: 'Genève', rating: 5, text: 'Excellent service ! La qualité d\'image est incroyable et le choix de chaînes est impressionnant. Le support client est très réactif.' },
    { name: 'Sophie L.', location: 'Lausanne', rating: 5, text: 'Utilisatrice depuis 6 mois, je suis très satisfaite. Le replay fonctionne parfaitement et l\'activation a été ultra rapide.' },
    { name: 'Thomas B.', location: 'Zürich', rating: 5, text: 'Meilleur service IPTV que j\'ai testé. Stable, fiable et le support en français est un vrai plus.' },
    { name: 'Laura M.', location: 'Bern', rating: 5, text: 'Service top ! Toute la famille est ravie. On regarde les chaînes suisses et françaises sans problème.' },
    { name: 'Pierre R.', location: 'Fribourg', rating: 5, text: 'Rapport qualité-prix imbattable. Plus de 15\'000 chaînes pour ce prix, c\'est vraiment exceptionnel.' },
    { name: 'Nathalie K.', location: 'Neuchâtel', rating: 5, text: 'Je recommande à 100%. Le VOD est complet et la qualité 4K est bluffante sur ma Smart TV.' },
  ],
  de: [
    { name: 'Marc D.', location: 'Genf', rating: 5, text: 'Hervorragender Service! Die Bildqualität ist unglaublich und die Kanalauswahl beeindruckend.' },
    { name: 'Sophie L.', location: 'Lausanne', rating: 5, text: 'Seit 6 Monaten Nutzerin, sehr zufrieden. Replay funktioniert perfekt und die Aktivierung war ultraschnell.' },
    { name: 'Thomas B.', location: 'Zürich', rating: 5, text: 'Bester IPTV-Service, den ich getestet habe. Stabil, zuverlässig und der Support auf Deutsch ist ein echter Pluspunkt.' },
    { name: 'Laura M.', location: 'Bern', rating: 5, text: 'Top Service! Die ganze Familie ist begeistert. Wir schauen Schweizer und deutsche Kanäle problemlos.' },
    { name: 'Pierre R.', location: 'Freiburg', rating: 5, text: 'Unschlagbares Preis-Leistungs-Verhältnis. Über 15\'000 Kanäle zu diesem Preis ist wirklich aussergewöhnlich.' },
    { name: 'Nathalie K.', location: 'Neuenburg', rating: 5, text: 'Ich empfehle 100%. Das VOD ist komplett und die 4K-Qualität ist auf meinem Smart TV verblüffend.' },
  ],
};

export default function Testimonials() {
  const t = useTranslations('testimonials');
  const locale = useLocale() as 'fr' | 'de';
  const reviews = TESTIMONIALS[locale];

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
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-bg rounded-xl border border-border p-5"
            >
              {/* Stars */}
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-warning fill-warning" />
                ))}
              </div>

              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                {/* Avatar circle with initial */}
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
