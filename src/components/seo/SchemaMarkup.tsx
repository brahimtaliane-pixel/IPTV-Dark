import { SITE_CONFIG, PRICE_CURRENCY, SCHEMA_PRICE_RANGE, SCHEMA_PRICE_VALID_UNTIL } from '@/lib/constants';
import { NL_CITY_SLUGS } from '@/lib/nl-city-slugs';
import type { SitePlan } from '@/lib/get-plans';
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

// ─── Product Schema for Plan Detail ────────────────────────
export function PlanProductSchema({
  locale,
  plan,
}: {
  locale: string;
  plan: SitePlan;
}) {
  const name = plan.name_nl;
  const description = plan.description_nl;
  const slug = plan.slug;

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
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      priceValidUntil: SCHEMA_PRICE_VALID_UNTIL,
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
  amsterdam: { lat: '52.3676', lng: '4.9041' },
  rotterdam: { lat: '51.9244', lng: '4.4777' },
  'den-haag': { lat: '52.0705', lng: '4.3007' },
  utrecht: { lat: '52.0907', lng: '5.1214' },
  eindhoven: { lat: '51.4416', lng: '5.4697' },
  groningen: { lat: '53.2194', lng: '6.5665' },
  tilburg: { lat: '51.5555', lng: '5.0913' },
  almere: { lat: '52.3508', lng: '5.2647' },
  maastricht: { lat: '50.8513', lng: '5.6909' },
  haarlem: { lat: '52.3874', lng: '4.6462' },
  arnhem: { lat: '51.9851', lng: '5.8987' },
  zwolle: { lat: '52.5168', lng: '6.0830' },
  breda: { lat: '51.5719', lng: '4.7683' },
};

export function CitySchema({
  locale,
  citySlug,
  telephone,
}: {
  locale: string;
  citySlug: string;
  telephone: string;
}) {
  const city = CITIES_DATA[citySlug];
  const geo = CITY_GEO[citySlug];
  if (!city || !geo) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${SITE_CONFIG.name} ${city.name}`,
    url: localeUrl(locale, `/iptv-${citySlug}`),
    telephone,
    email: SITE_CONFIG.email,
    description: city.meta_nl.description,
    address: {
      '@type': 'PostalAddress',
      addressLocality: city.name,
      addressRegion: city.canton,
      addressCountry: NL_CITY_SLUGS.has(citySlug) ? 'NL' : 'CH',
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
    priceRange: SCHEMA_PRICE_RANGE,
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
export function MultiScreenSchema({
  locale,
  plans,
}: {
  locale: string;
  plans: SitePlan[];
}) {
  const multiPlans = plans.filter((p) => p.devices > 1);

  const schemas = multiPlans.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plan.name_nl,
    description: plan.description_nl,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: {
      '@type': 'Brand',
      name: SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      priceValidUntil: SCHEMA_PRICE_VALID_UNTIL,
      url: localeUrl(locale, `/plans/${plan.slug}`),
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
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
