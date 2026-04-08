import { SITE_CONFIG, PLANS } from '@/lib/constants';
import { CITIES_DATA } from '@/lib/cities';
import { localeUrl } from '@/lib/utils';

// ─── Breadcrumb Schema ─────────────────────────────────────
interface BreadcrumbItem {
  name: string;
  url: string;
}

export function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// Hardcoded price validity end date — must be deterministic so SSR output is
// stable across requests. Non-deterministic JSON-LD breaks Vercel's edge cache
// and triggers Google "Temporary processing error" on structured data.
// Bump this date manually each quarter.
const PRICE_VALID_UNTIL = '2026-12-31';

// ─── Product Schema for Plan Detail ────────────────────────
export function PlanProductSchema({
  locale,
  slug,
}: {
  locale: string;
  slug: string;
}) {
  const plan = PLANS.find((p) => p.slug === slug);
  if (!plan) return null;

  const isFr = locale === 'fr';
  const name = isFr ? plan.name_fr : plan.name_de;
  const description = isFr ? plan.description_fr : plan.description_de;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      priceValidUntil: PRICE_VALID_UNTIL,
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      url: localeUrl(locale, `/plans/${slug}`),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── FAQ Schema ────────────────────────────────────────────
export function FAQSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── City LocalBusiness Schema ─────────────────────────────
const CITY_GEO: Record<string, { lat: string; lng: string }> = {
  geneve: { lat: '46.2044', lng: '6.1432' },
  zurich: { lat: '47.3769', lng: '8.5417' },
  lausanne: { lat: '46.5197', lng: '6.6323' },
  bern: { lat: '46.9480', lng: '7.4474' },
  basel: { lat: '47.5596', lng: '7.5886' },
  winterthur: { lat: '47.5006', lng: '8.7292' },
  'st-gallen': { lat: '47.4245', lng: '9.3767' },
  lugano: { lat: '46.0037', lng: '8.9511' },
  biel: { lat: '47.1368', lng: '7.2467' },
  luzern: { lat: '47.0502', lng: '8.3093' },
  fribourg: { lat: '46.8065', lng: '7.1620' },
  neuchatel: { lat: '46.9900', lng: '6.9293' },
  thun: { lat: '46.7580', lng: '7.6280' },
};

export function CitySchema({
  locale,
  citySlug,
}: {
  locale: string;
  citySlug: string;
}) {
  const city = CITIES_DATA[citySlug];
  const geo = CITY_GEO[citySlug];
  if (!city || !geo) return null;

  const isFr = locale === 'fr';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SITE_CONFIG.name} ${city.name}`,
    url: localeUrl(locale, `/iptv-${citySlug}`),
    telephone: SITE_CONFIG.phone,
    email: SITE_CONFIG.email,
    description: isFr ? city.meta_fr.description : city.meta_de.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.canton,
      addressCountry: 'CH',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: geo.lat,
      longitude: geo.lng,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange: 'CHF 35.99 - CHF 179.99',
    areaServed: {
      '@type': 'City',
      name: city.name,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ─── Multi-Ecrans Product Schema ───────────────────────────
export function MultiScreenSchema({ locale }: { locale: string }) {
  const isFr = locale === 'fr';
  const multiPlans = PLANS.filter((p) => p.devices > 1);

  const schemas = multiPlans.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isFr ? plan.name_fr : plan.name_de,
    description: isFr ? plan.description_fr : plan.description_de,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      priceValidUntil: PRICE_VALID_UNTIL,
      url: localeUrl(locale, `/plans/${plan.slug}`),
    },
  }));

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
