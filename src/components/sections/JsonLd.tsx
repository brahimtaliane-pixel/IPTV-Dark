import {
  SITE_CONFIG,
  PRICE_CURRENCY,
  PRICE_CURRENCY_SYMBOL,
  SCHEMA_PRICE_RANGE,
  SCHEMA_PRICE_VALID_UNTIL,
} from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import type { SitePlan } from '@/lib/get-plans';

interface JsonLdProps {
  locale: string;
  plans: SitePlan[];
  /** From admin_settings — keeps JSON-LD in sync with contact page */
  phone: string;
}

export default function JsonLd({ locale, plans, phone }: JsonLdProps) {
  const prices = plans.map((p) => p.price);
  const priceRange =
    prices.length > 0
      ? `${PRICE_CURRENCY_SYMBOL} ${Math.min(...prices)} - ${PRICE_CURRENCY_SYMBOL} ${Math.max(...prices)}`
      : SCHEMA_PRICE_RANGE;
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.svg`,
    description:
      'IPTV-service in Nederland — 30.000+ zenders HD/4K, 170.000+ films en series on demand en 7 dagen replay op al je apparaten.',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      availableLanguage: ['nl-NL', 'nl'],
      areaServed: 'NL',
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
    },
    sameAs: [],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    inLanguage: 'nl-NL',
  };

  const productSchemas = plans.map((plan) => ({
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
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
      url: localeUrl(locale, `/plans/${plan.slug}`),
    },
  }));

  const faqPairs = [
    { q: 'Wat is IPTV Nederland?', a: 'Een internettelevisiedienst met meer dan 30.000 live zenders en 170.000+ films en series on demand in HD en 4K.' },
    { q: 'Welke apparaten?', a: 'Smart TV, Android, iOS, Windows, Mac, Fire Stick en MAG.' },
    { q: 'Hoe lang duurt activering?', a: 'Meestal binnen 2 uur na betaling.' },
    { q: 'Is replay inbegrepen?', a: 'Ja, tot 7 dagen terug in alle pakketten.' },
    { q: 'Hoe bereik ik support?', a: '24/7 via WhatsApp, e-mail en telefoon.' },
    { q: 'Meerdere apparaten?', a: 'Standaard één gelijktijdig apparaat; multi-scherm pakketten voor meer.' },
    { q: 'VPN nodig?', a: 'Meestal niet; optioneel voor privacy.' },
    { q: 'Welke internetsnelheid?', a: 'Vanaf ca. 10 Mbps voor HD, 25 Mbps voor 4K.' },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqPairs.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a,
      },
    })),
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'IPTV-streamingabonnement',
    provider: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    areaServed: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    name: 'IPTV Nederland — zenders HD/4K, VOD en replay',
    description:
      'Internettelevisie in Nederland: 30.000+ zenders, 170.000+ films en series on demand en 7 dagen replay. Werkt op Smart TV, mobiel, PC en meer.',
    offers: plans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name_nl,
      price: plan.price,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      url: localeUrl(locale, `/plans/${plan.slug}`),
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: SITE_CONFIG.url,
      availableLanguage: ['nl-NL'],
    },
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    telephone: phone,
    email: SITE_CONFIG.email,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '52.3676',
      longitude: '4.9041',
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
    priceRange,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  );
}
