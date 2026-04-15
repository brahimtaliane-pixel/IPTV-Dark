import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import DutchIptvClient from './DutchIptvClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/dutch-iptv';

const DUTCH_IPTV_PAGE_TITLE = `Dutch IPTV | Nederlandse IPTV HD/4K — ${SITE_CONFIG.domain}`;
const DUTCH_IPTV_PAGE_DESCRIPTION = `Dutch IPTV & Nederlandse IPTV bij ${SITE_CONFIG.name}: NPO, RTL, Vlaams aanbod, 32.000+ zenders, replay, VOD, Nederlandstalige support 24/7. Premium streaming voor NL & BE op ${SITE_CONFIG.domain}.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = DUTCH_IPTV_PAGE_TITLE;
  const description = DUTCH_IPTV_PAGE_DESCRIPTION;

  return {
    title,
    description,
    keywords: [
      'Dutch IPTV',
      'Nederlandse IPTV',
      SITE_CONFIG.name,
      'IPTV België',
      'NPO RTL IPTV',
      SITE_CONFIG.domain,
      'IPTV HD 4K',
    ],
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: pageUrl,
      languages: {
        'nl-NL': pageUrl,
        'x-default': pageUrl,
      },
    },
  };
}

export default async function DutchIptvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: `Wat is Dutch IPTV bij ${SITE_CONFIG.name}?`,
      answer: `"Dutch IPTV" is een veelgezochte term. ${SITE_CONFIG.name} biedt een premium IPTV-service met Nederlandse en Belgische zenders, internationaal aanbod en Nederlandstalige support op ${SITE_CONFIG.domain}.`,
    },
    {
      question: 'Zijn Nederlandse zenders zoals NPO en RTL inbegrepen?',
      answer:
        'Ja, ons aanbod richt zich op volledige entertainment met Nederlandse en Vlaamse zenders, sport, nieuws en een grote VOD-bibliotheek.',
    },
    {
      question: 'Kan ik Dutch IPTV in België gebruiken?',
      answer: 'Ja, veel klanten kijken vanuit Nederland en België met een stabiele internetverbinding.',
    },
    {
      question: 'In welke taal is de klantenservice?',
      answer: 'Primair Nederlands; waar nodig is Engels mogelijk voor internationale klanten.',
    },
    {
      question: 'Hoe snel kan ik kijken na bestellen?',
      answer: 'Meestal binnen circa 2 uur na betalingsbevestiging; je ontvangt je gegevens per e-mail.',
    },
    {
      question: 'Zijn er multi-scherm pakketten?',
      answer: 'Ja — zie de multi-schermen-pagina voor pakketten met meerdere gelijktijdige streams.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Dutch IPTV', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={PAGE_PATH}
        title={DUTCH_IPTV_PAGE_TITLE}
        description={DUTCH_IPTV_PAGE_DESCRIPTION}
      />
      <FAQSchema faqs={faqs} />
      <DutchIptvClient
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
