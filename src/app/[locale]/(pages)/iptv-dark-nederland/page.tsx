import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import IptvDarkNederlandClient from './IptvDarkNederlandClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/iptv-dark-nederland';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = `IPTV Dark Nederland | Premium IPTV voor heel NL — ${SITE_CONFIG.domain}`;
  const description = `IPTV Dark Nederland: het officiële merk ${SITE_CONFIG.name} voor kijkers in Nederland en België. NPO, RTL, 32.000+ zenders, VOD, replay, NL-support 24/7 op ${SITE_CONFIG.domain}.`;

  return {
    title,
    description,
    keywords: [
      'IPTV Dark Nederland',
      SITE_CONFIG.name,
      SITE_CONFIG.domain,
      'Nederlandse IPTV',
      'premium IPTV',
      'NPO RTL IPTV',
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

export default async function IptvDarkNederlandPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: 'Wat is IPTV Dark Nederland?',
      answer: `"IPTV Dark Nederland" is hoe we onze premium IPTV-service beschrijven voor kijkers in Nederland: het merk is ${SITE_CONFIG.name}, met dezelfde pakketten en support als op ${SITE_CONFIG.domain}.`,
    },
    {
      question: `Is dit dezelfde service als op ${SITE_CONFIG.domain}?`,
      answer: 'Ja. Je bestelt dezelfde abonnementen met dezelfde inhoud, activering en klantenservice.',
    },
    {
      question: 'Kan ik IPTV Dark in heel Nederland gebruiken?',
      answer:
        'Ja, op een stabiele internetverbinding — geschikt voor glasvezel, kabel en DSL bij gangbare providers.',
    },
    {
      question: 'Zijn Nederlandse zenders zoals NPO en RTL inbegrepen?',
      answer:
        'Ons aanbod richt zich op volledige entertainment met Nederlandse en Vlaamse zenders, sport, nieuws en internationaal aanbod.',
    },
    {
      question: 'Hoe snel kan ik kijken na bestellen?',
      answer: 'Meestal binnen circa 2 uur na betalingsbevestiging; je ontvangt je gegevens per e-mail.',
    },
    {
      question: 'Zijn er multi-scherm pakketten?',
      answer: 'Ja — zie de multi-scherm pagina voor pakketten met meerdere gelijktijdige streams.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'IPTV Dark Nederland', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <FAQSchema faqs={faqs} />
      <IptvDarkNederlandClient
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
