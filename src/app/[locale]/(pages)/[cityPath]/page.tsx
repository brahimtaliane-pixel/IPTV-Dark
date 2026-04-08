import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { CITIES_DATA, ALL_CITY_SLUGS } from '@/lib/cities';
import { BreadcrumbSchema, CitySchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import CityPageClient from './CityPageClient';

type Props = {
  params: Promise<{ locale: string; cityPath: string }>;
};

// Parse "iptv-geneve" → "geneve"
function parseCitySlug(cityPath: string): string | null {
  if (cityPath.startsWith('iptv-')) {
    return cityPath.slice(5); // Remove "iptv-" prefix
  }
  return null;
}

export async function generateStaticParams() {
  return ALL_CITY_SLUGS.map((city) => ({ cityPath: `iptv-${city}` }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, cityPath } = await params;
  const citySlug = parseCitySlug(cityPath);
  const city = citySlug ? CITIES_DATA[citySlug] : null;

  if (!city || !citySlug) {
    return { title: 'City Not Found' };
  }

  const isFr = locale === 'fr';
  const meta = isFr ? city.meta_fr : city.meta_de;

  return {
    title: meta.title,
    description: meta.description,
    keywords: isFr
      ? [`IPTV ${city.name}`, 'IPTV Suisse', `abonnement IPTV ${city.name}`, `meilleur IPTV ${city.name}`, `IPTV ${city.canton}`]
      : [`IPTV ${city.name}`, 'IPTV Schweiz', `IPTV Abo ${city.name}`, `bestes IPTV ${city.name}`, `IPTV ${city.canton}`],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: locale === 'fr' ? `${SITE_CONFIG.url}/iptv-${citySlug}` : `${SITE_CONFIG.url}/de/iptv-${citySlug}`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: locale === 'fr' ? `${SITE_CONFIG.url}/iptv-${citySlug}` : `${SITE_CONFIG.url}/de/iptv-${citySlug}`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/iptv-${citySlug}`,
        'de-CH': `${SITE_CONFIG.url}/de/iptv-${citySlug}`,
        'x-default': `${SITE_CONFIG.url}/iptv-${citySlug}`,
      },
    },
  };
}

export default async function CityPage({ params }: Props) {
  const { locale, cityPath } = await params;
  setRequestLocale(locale);

  const citySlug = parseCitySlug(cityPath);

  // If the path doesn't start with "iptv-" or city doesn't exist, show 404
  if (!citySlug || !CITIES_DATA[citySlug]) {
    notFound();
  }

  const isFr = locale === 'fr';
  const city = CITIES_DATA[citySlug];
  const cityName = city.name;

  const cityFaqs = isFr
    ? [
        { question: `Comment fonctionne IPTV Suisse à ${cityName} ?`, answer: `Notre service IPTV est disponible partout à ${cityName}. Il vous suffit d'une connexion internet de 10 Mbps minimum pour profiter de +37'000 chaînes HD/4K. Activation en moins de 2 heures.` },
        { question: `Quels fournisseurs internet sont compatibles à ${cityName} ?`, answer: `Notre service fonctionne avec tous les FAI de ${cityName} : Swisscom, Sunrise, Salt, UPC et tous les autres. Aucune configuration spéciale requise.` },
        { question: `Le replay et la VOD sont-ils inclus à ${cityName} ?`, answer: `Oui, tous nos abonnements incluent le replay jusqu'à 7 jours, +40'000 films et +17'000 séries en VOD, le guide des programmes et les mises à jour automatiques.` },
      ]
    : [
        { question: `Wie funktioniert IPTV Schweiz in ${cityName}?`, answer: `Unser IPTV-Service ist überall in ${cityName} verfügbar. Sie benötigen lediglich eine Internetverbindung ab 10 Mbit/s für +37'000 HD/4K-Kanäle. Aktivierung in weniger als 2 Stunden.` },
        { question: `Welche Internetanbieter sind in ${cityName} kompatibel?`, answer: `Unser Service funktioniert mit allen ISPs in ${cityName}: Swisscom, Sunrise, Salt, UPC und allen anderen. Keine spezielle Konfiguration erforderlich.` },
        { question: `Sind Replay und VOD in ${cityName} enthalten?`, answer: `Ja, alle Abonnements beinhalten Replay bis 7 Tage, +40'000 Filme und +17'000 Serien als VOD, Programmführer und automatische Updates.` },
      ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: `IPTV ${cityName}`, url: localeUrl(locale, `/iptv-${citySlug}`) },
        ]}
      />
      <CitySchema locale={locale} citySlug={citySlug} />
      <FAQSchema faqs={cityFaqs} />
      <CityPageClient citySlug={citySlug} />
    </>
  );
}
