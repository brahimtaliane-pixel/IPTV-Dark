import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import IptvNederlandClient from './IptvNederlandClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/iptv-nederland';

const IPTV_NL_PAGE_TITLE = `IPTV Nederland | Premium internet-TV HD/4K — ${SITE_CONFIG.name}`;
const IPTV_NL_PAGE_DESCRIPTION = `IPTV Nederland bij ${SITE_CONFIG.name}: NPO, RTL, regionaal & Vlaams, 32.000+ zenders, 175.000+ films en series on demand, replay, Nederlandstalige support 24/7. Bestel veilig op ${SITE_CONFIG.domain}.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = IPTV_NL_PAGE_TITLE;
  const description = IPTV_NL_PAGE_DESCRIPTION;

  return {
    title,
    description,
    keywords: [
      'IPTV Nederland',
      'Nederlandse IPTV',
      SITE_CONFIG.name,
      SITE_CONFIG.domain,
      'IPTV HD 4K Nederland',
      'NPO RTL IPTV',
      'premium IPTV',
      'IPTV abonnement Nederland',
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

export default async function IptvNederlandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: 'Wat wordt er bedoeld met IPTV Nederland?',
      answer: `Vaak zoeken mensen daarmee internet-TV met Nederlandse zenders (NPO, RTL, regionaal) en goede kwaliteit. ${SITE_CONFIG.name} levert precies dat — met dezelfde premiumdienst als op ${SITE_CONFIG.domain}.`,
    },
    {
      question: `Is ${SITE_CONFIG.name} een betrouwbare IPTV Nederland-aanbieder?`,
      answer:
        'We werken met één duidelijk merk, Nederlandstalige support 24/7, vaste looptijden zonder automatische verlenging en snelle activering na betaling.',
    },
    {
      question: 'Zijn NPO en RTL inbegrepen?',
      answer:
        'Ons aanbod richt zich op volledige entertainment: Nederlandse en Vlaamse zenders, sport, nieuws en internationaal — inclusief grote VOD-bibliotheek en replay.',
    },
    {
      question: 'Kan ik in België kijken met hetzelfde abonnement?',
      answer:
        'Ja, veel klanten kijken vanuit Nederland en België. Je hebt een stabiele internetverbinding nodig; de service is daarop geoptimaliseerd.',
    },
    {
      question: 'Hoe snel kan ik kijken na bestellen?',
      answer: 'Meestal binnen circa 2 uur na betalingsbevestiging; je ontvangt je gegevens per e-mail.',
    },
    {
      question: 'Zijn er multi-scherm pakketten?',
      answer:
        'Ja — op de multi-schermen-pagina vind je pakketten voor 2, 3 of 4 gelijktijdige streams.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'IPTV Nederland', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={PAGE_PATH}
        title={IPTV_NL_PAGE_TITLE}
        description={IPTV_NL_PAGE_DESCRIPTION}
      />
      <FAQSchema faqs={faqs} />
      <IptvNederlandClient
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
