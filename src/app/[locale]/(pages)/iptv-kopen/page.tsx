import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import IptvKopenClient from './IptvKopenClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/iptv-kopen';

const IPTV_KOPEN_PAGE_TITLE = `IPTV kopen | Premium abonnement — ${SITE_CONFIG.name} | ${SITE_CONFIG.domain}`;
const IPTV_KOPEN_PAGE_DESCRIPTION = `IPTV kopen bij ${SITE_CONFIG.name}: 32.000+ zenders HD/4K, 175.000+ films en series on demand, replay, activering binnen 2 uur, Nederlandstalige support 24/7. Veilig abonnement op ${SITE_CONFIG.domain}.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = IPTV_KOPEN_PAGE_TITLE;
  const description = IPTV_KOPEN_PAGE_DESCRIPTION;

  return {
    title,
    description,
    keywords: [
      'IPTV kopen',
      'IPTV abonnement kopen',
      SITE_CONFIG.name,
      SITE_CONFIG.domain,
      'IPTV kopen Nederland',
      'premium IPTV',
      'IPTV bestellen',
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

export default async function IptvKopenPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: 'Waar kan ik veilig IPTV kopen?',
      answer: `Bij een aanbieder met duidelijke website, voorwaarden en bereikbare support — zoals ${SITE_CONFIG.name} op ${SITE_CONFIG.domain}.`,
    },
    {
      question: 'Hoe betaal ik mijn IPTV-abonnement?',
      answer:
        'Je volgt het bestelproces op de site en ontvangt een bevestiging per e-mail. Betaalopties zie je tijdens het afrekenen.',
    },
    {
      question: `Wat krijg ik als ik IPTV koop bij ${SITE_CONFIG.name}?`,
      answer:
        'Toegang tot 32.000+ zenders, grote VOD-bibliotheek, replay tot 7 dagen, EPG en updates, plus Nederlandstalige support.',
    },
    {
      question: 'Hoe snel na betalen kan ik kijken?',
      answer: 'Meestal binnen ongeveer 2 uur na bevestiging van je betaling. Je ontvangt je gegevens per e-mail.',
    },
    {
      question: 'Kan ik multi-scherm erbij kopen?',
      answer: 'Ja. Voor meerdere gelijktijdige streams hebben we aparte multi-scherm pakketten op de multi-scherm pagina.',
    },
    {
      question: 'Wat als ik spijt krijg van mijn aankoop?',
      answer: 'Niet tevreden — geld terug binnen 24 uur, conform onze algemene voorwaarden.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'IPTV kopen', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={PAGE_PATH}
        title={IPTV_KOPEN_PAGE_TITLE}
        description={IPTV_KOPEN_PAGE_DESCRIPTION}
      />
      <FAQSchema faqs={faqs} />
      <IptvKopenClient
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
