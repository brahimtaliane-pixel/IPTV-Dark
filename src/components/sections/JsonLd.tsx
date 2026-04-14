import {
  SITE_CONFIG,
  PRICE_CURRENCY,
  SCHEMA_PRICE_RANGE,
  SCHEMA_PRICE_VALID_UNTIL,
} from '@/lib/constants';
import { schemaKernel, schemaOrigin } from '@/lib/schema-brand';
import { localeUrl } from '@/lib/utils';
import type { SitePlan } from '@/lib/get-plans';

interface JsonLdProps {
  locale: string;
  plans: SitePlan[];
  /** From admin_settings — keeps JSON-LD in sync with contact page */
  phone: string;
  /** First 4 FAQ items — must match what is visible on the home FAQ section */
  homeFaqs: { question: string; answer: string }[];
  /** From `metadata` namespace — aligns WebPage with document title and meta description */
  pageTitle: string;
  pageDescription: string;
}

/**
 * Home page structured data: branded Organization / WebSite / WebPage graph,
 * Product + Offer (per active plan), Service, FAQPage — all @id-linked where useful.
 */
export default function JsonLd({ locale, plans, phone, homeFaqs, pageTitle, pageDescription }: JsonLdProps) {
  const base = schemaOrigin();
  const { logoId, brandId, orgId, logo, brand } = schemaKernel();
  const webSiteId = `${base}/#website`;
  const webPageId = `${base}/#homepage`;
  const serviceId = `${base}/#iptv-streaming-service`;

  const activePlans = plans.filter((p) => p.is_active);

  const organizationNode = {
    '@type': 'Organization',
    '@id': orgId,
    name: SITE_CONFIG.name,
    alternateName: [...new Set([SITE_CONFIG.domain, 'iptvdark4k.nl'])],
    legalName: SITE_CONFIG.name,
    url: base,
    logo: { '@id': logoId },
    image: [`${base}/logo.svg`, `${base}/favicon.svg`],
    brand: { '@id': brandId },
    description: pageDescription,
    email: SITE_CONFIG.email,
    telephone: phone,
    priceRange: SCHEMA_PRICE_RANGE,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
    },
    areaServed: [
      { '@type': 'Country', name: 'NL' },
      { '@type': 'Country', name: 'BE' },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      email: SITE_CONFIG.email,
      contactType: 'customer service',
      availableLanguage: ['nl-NL', 'Dutch'],
      areaServed: ['NL', 'BE'],
    },
  };

  const webSiteNode = {
    '@type': 'WebSite',
    '@id': webSiteId,
    name: SITE_CONFIG.name,
    alternateName: [...new Set([SITE_CONFIG.domain, 'iptvdark4k.nl'])],
    url: base,
    publisher: { '@id': orgId },
    copyrightHolder: { '@id': orgId },
    inLanguage: 'nl-NL',
    description: pageDescription,
  };

  const webPageNode = {
    '@type': 'WebPage',
    '@id': webPageId,
    name: pageTitle,
    description: pageDescription,
    url: localeUrl(locale, '/'),
    isPartOf: { '@id': webSiteId },
    about: { '@id': orgId },
    publisher: { '@id': orgId },
    inLanguage: 'nl-NL',
  };

  const productNodes = activePlans.map((plan) => ({
    '@type': 'Product',
    '@id': `${base}/abonnementen/${plan.slug}#product`,
    name: plan.name_nl,
    description: plan.description_nl,
    image: `${base}${plan.image}`,
    sku: plan.slug,
    category: 'IPTV-abonnement',
    brand: { '@id': brandId },
    offers: {
      '@type': 'Offer',
      url: localeUrl(locale, `/abonnementen/${plan.slug}`),
      price: plan.price,
      priceCurrency: PRICE_CURRENCY,
      priceValidUntil: SCHEMA_PRICE_VALID_UNTIL,
      availability: 'https://schema.org/InStock',
      seller: { '@id': orgId },
    },
  }));

  const serviceNode = {
    '@type': 'Service',
    '@id': serviceId,
    name: 'IPTV Dark — premium IPTV streaming (Nederland & België)',
    serviceType: 'IPTV-streamingabonnement',
    provider: { '@id': orgId },
    brand: { '@id': brandId },
    areaServed: [
      { '@type': 'Country', name: 'Netherlands' },
      { '@type': 'Country', name: 'Belgium' },
    ],
    description: pageDescription,
    offers: activePlans.map((plan) => ({
      '@type': 'Offer',
      name: plan.name_nl,
      price: plan.price,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      url: localeUrl(locale, `/abonnementen/${plan.slug}`),
    })),
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: base,
      availableLanguage: ['nl-NL'],
    },
  };

  const faqPageNode = {
    '@type': 'FAQPage',
    '@id': `${base}/#home-faq`,
    isPartOf: { '@id': webSiteId },
    mainEntity: homeFaqs.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer,
      },
    })),
  };

  const graph = [
    logo,
    brand,
    organizationNode,
    webSiteNode,
    webPageNode,
    ...productNodes,
    serviceNode,
    faqPageNode,
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@graph': graph,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
