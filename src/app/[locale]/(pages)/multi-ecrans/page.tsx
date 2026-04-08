import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, MultiScreenSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import MultiEcransClient from './MultiEcransClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Forfaits Multi-Écrans IPTV Suisse — 2, 3 ou 4 Écrans Simultanés'
    : 'Multi-Bildschirm IPTV Schweiz Pakete — 2, 3 oder 4 Bildschirme';

  const description = isFr
    ? 'Abonnements IPTV multi-écrans en Suisse. Regardez sur 2, 3 ou 4 appareils simultanément. +15\'000 chaînes HD/4K, replay et VOD inclus. Dès 53.99 CHF.'
    : 'Multi-Bildschirm IPTV-Abos in der Schweiz. Schauen Sie auf 2, 3 oder 4 Geräten gleichzeitig. +15\'000 HD/4K-Kanäle, Replay und VOD inklusive. Ab 53.99 CHF.';

  return {
    title,
    description,
    keywords: isFr
      ? ['IPTV multi-écrans', 'IPTV Suisse multi-écrans', 'IPTV famille Suisse', 'abonnement IPTV 2 écrans', 'IPTV 4 écrans']
      : ['IPTV Multi-Bildschirm', 'IPTV Schweiz Multi-Bildschirm', 'IPTV Familie Schweiz', 'IPTV Abo 2 Bildschirme', 'IPTV 4 Bildschirme'],
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? `${SITE_CONFIG.url}/multi-ecrans` : `${SITE_CONFIG.url}/de/multi-ecrans`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: locale === 'fr' ? `${SITE_CONFIG.url}/multi-ecrans` : `${SITE_CONFIG.url}/de/multi-ecrans`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/multi-ecrans`,
        'de-CH': `${SITE_CONFIG.url}/de/multi-ecrans`,
        'x-default': `${SITE_CONFIG.url}/multi-ecrans`,
      },
    },
  };
}

export default async function MultiEcransPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const isFr = locale === 'fr';

  const multiEcransFaqs = isFr
    ? [
        { question: 'Comment fonctionne le multi-écrans ?', answer: 'Avec un forfait multi-écrans, vous recevez un abonnement qui permet de se connecter simultanément sur 2, 3 ou 4 appareils. Chaque écran peut regarder un programme différent en même temps.' },
        { question: 'Puis-je utiliser différents types d\'appareils ?', answer: 'Oui, vous pouvez mélanger les appareils : Smart TV, smartphone, tablette, ordinateur, Fire Stick, MAG — sans restriction.' },
        { question: 'La qualité est-elle la même sur tous les écrans ?', answer: 'Oui, chaque écran bénéficie de la même qualité HD et 4K, du même catalogue de 15\'000+ chaînes, VOD et replay.' },
        { question: 'Le multi-écrans inclut-il le replay et la VOD ?', answer: 'Oui, toutes les fonctionnalités sont incluses sur chaque écran : replay jusqu\'à 7 jours, VOD avec 40\'000+ films et 17\'000+ séries.' },
      ]
    : [
        { question: 'Wie funktioniert Multi-Bildschirm?', answer: 'Mit einem Multi-Bildschirm-Paket erhalten Sie ein Abonnement für gleichzeitige Verbindungen auf 2, 3 oder 4 Geräten.' },
        { question: 'Kann ich verschiedene Gerätetypen verwenden?', answer: 'Ja, Sie können Geräte beliebig mischen: Smart TV, Smartphone, Tablet, Computer, Fire Stick, MAG — ohne Einschränkung.' },
        { question: 'Ist die Qualität auf allen Bildschirmen gleich?', answer: 'Ja, jeder Bildschirm profitiert von HD- und 4K-Qualität, dem gleichen Katalog mit 15\'000+ Kanälen, VOD und Replay.' },
        { question: 'Sind Replay und VOD bei Multi-Bildschirm enthalten?', answer: 'Ja, alle Funktionen sind auf jedem Bildschirm enthalten: Replay bis 7 Tage, VOD mit 40\'000+ Filmen und 17\'000+ Serien.' },
      ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: isFr ? 'Multi-Écrans' : 'Multi-Bildschirm', url: localeUrl(locale, '/multi-ecrans') },
        ]}
      />
      <MultiScreenSchema locale={locale} />
      <FAQSchema faqs={multiEcransFaqs} />
      <MultiEcransClient />
    </>
  );
}
