import { setRequestLocale } from 'next-intl/server';
import FAQ from '@/components/sections/FAQ';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'FAQ IPTV Suisse — Réponses à Toutes Vos Questions'
    : 'FAQ IPTV Schweiz — Antworten auf Alle Ihre Fragen';
  const description = isFr
    ? 'Trouvez les réponses à toutes vos questions sur IPTV Suisse : appareils compatibles, activation, replay, support 24/7 et plus encore.'
    : 'Finden Sie Antworten auf alle Ihre Fragen zu IPTV Schweiz: kompatible Geräte, Aktivierung, Replay, 24/7 Support und mehr.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: isFr ? `${SITE_CONFIG.url}/faq` : `${SITE_CONFIG.url}/de/faq`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: isFr ? `${SITE_CONFIG.url}/faq` : `${SITE_CONFIG.url}/de/faq`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/faq`,
        'de-CH': `${SITE_CONFIG.url}/de/faq`,
        'x-default': `${SITE_CONFIG.url}/faq`,
      },
    },
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isFr = locale === 'fr';

  const allFaqs = isFr
    ? [
        { question: 'Qu\'est-ce que IPTV Suisse ?', answer: 'IPTV Suisse est un service de télévision par internet avec +37\'000 chaînes TV en direct, 40\'000+ films et 17\'000+ séries en HD et 4K.' },
        { question: 'Quels appareils sont compatibles ?', answer: 'Smart TV, Android, iOS, Windows, Mac, Fire Stick, MAG et bien plus.' },
        { question: 'Combien de temps prend l\'activation ?', answer: 'L\'activation se fait en moins de 2 heures après confirmation du paiement.' },
        { question: 'Est-ce que le replay est inclus ?', answer: 'Oui, replay jusqu\'à 7 jours en arrière sans frais supplémentaires.' },
        { question: 'Comment contacter le support ?', answer: 'Notre équipe est disponible 24/7 par WhatsApp, email et téléphone.' },
        { question: 'Puis-je utiliser le service sur plusieurs appareils ?', answer: 'Les abonnements standard permettent 1 appareil. Pour plusieurs écrans, consultez nos offres multi-écrans.' },
      ]
    : [
        { question: 'Was ist IPTV Schweiz?', answer: 'IPTV Schweiz ist ein Internet-TV-Service mit +37\'000 Live-Kanälen, 40\'000+ Filmen und 17\'000+ Serien in HD und 4K.' },
        { question: 'Welche Geräte sind kompatibel?', answer: 'Smart TV, Android, iOS, Windows, Mac, Fire Stick, MAG und mehr.' },
        { question: 'Wie lange dauert die Aktivierung?', answer: 'Die Aktivierung erfolgt in weniger als 2 Stunden nach Zahlungsbestätigung.' },
        { question: 'Ist Replay enthalten?', answer: 'Ja, Replay bis zu 7 Tage zurück ohne zusätzliche Kosten.' },
        { question: 'Wie erreiche ich den Support?', answer: 'Unser Team ist 24/7 per WhatsApp, E-Mail und Telefon erreichbar.' },
        { question: 'Kann ich den Service auf mehreren Geräten nutzen?', answer: 'Standard-Abos erlauben 1 Gerät. Für mehrere Bildschirme siehe unsere Multi-Screen-Angebote.' },
      ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: 'FAQ', url: localeUrl(locale, '/faq') },
        ]}
      />
      <FAQSchema faqs={allFaqs} />
      <div className="pt-20">
        <FAQ showAll />
      </div>
    </>
  );
}
