import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { getSiteContact } from '@/lib/get-site-contact';
import { localeUrl } from '@/lib/utils';
import { CITIES_DATA, ALL_CITY_SLUGS } from '@/lib/cities';
import { CITY_PAGE_SECTIONS_NL } from '@/lib/city-page-content-nl';
import { BreadcrumbSchema, CitySchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import CityPageClient from './CityPageClient';

type Props = {
  params: Promise<{ locale: string; cityPath: string }>;
};

export const dynamic = 'force-dynamic';

// Parse "iptv-amsterdam" → "amsterdam"
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
  const { cityPath } = await params;
  const citySlug = parseCitySlug(cityPath);
  const city = citySlug ? CITIES_DATA[citySlug] : null;

  if (!city || !citySlug) {
    return { title: `Stad niet gevonden | ${SITE_CONFIG.name}` };
  }

  const meta = city.meta_nl;
  const cityUrl = `${SITE_CONFIG.url}/iptv-${citySlug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      `IPTV ${city.name}`,
      'IPTV Dark',
      `iptv ${city.name}`,
      `iptv abonnement ${city.name}`,
      `IPTV ${city.canton}`,
      'iptv hd 4k',
    ],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: cityUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: cityUrl,
      languages: {
        'nl-NL': cityUrl,
        'x-default': cityUrl,
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

  const city = CITIES_DATA[citySlug];
  const cityName = city.name;
  const [plans, contact] = await Promise.all([getPlans(), getSiteContact()]);

  const sectionCopy = CITY_PAGE_SECTIONS_NL[citySlug];
  const cityFaqs = sectionCopy
    ? sectionCopy.faq.map(({ q, a }) => ({ question: q, answer: a }))
    : [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: `IPTV Dark ${cityName}`, url: localeUrl(locale, `/iptv-${citySlug}`) },
        ]}
      />
      <CitySchema locale={locale} citySlug={citySlug} telephone={contact.phone} />
      <FAQSchema faqs={cityFaqs} />
      <CityPageClient
        citySlug={citySlug}
        plans={plans}
        stats={{
          channels: STATS.channels,
          movies: STATS.movies,
          uptime: STATS.uptime,
          supportHours: STATS.supportHours,
        }}
      />
    </>
  );
}
