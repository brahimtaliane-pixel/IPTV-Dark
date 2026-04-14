import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import IptvAbonnementClient from './IptvAbonnementClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/iptv-abonnement';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = `IPTV abonnement | 3, 6 of 12 maanden — ${SITE_CONFIG.name} | ${SITE_CONFIG.domain}`;
  const description = `IPTV abonnement bij ${SITE_CONFIG.name}: kies 3, 6 of 12 maanden, 32.000+ zenders, 175.000+ films en series on demand, replay, Nederlandstalige support 24/7. Transparante prijzen op ${SITE_CONFIG.domain}.`;

  return {
    title,
    description,
    keywords: [
      'IPTV abonnement',
      'IPTV abonnement Nederland',
      'maandabonnement IPTV',
      'IPTV 12 maanden',
      SITE_CONFIG.name,
      SITE_CONFIG.domain,
      'premium IPTV',
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

export default async function IptvAbonnementPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: `Wat is een IPTV-abonnement bij ${SITE_CONFIG.name}?`,
      answer: `Een abonnement met vaste looptijd (3, 6 of 12 maanden) inclusief toegang tot 32.000+ zenders, grote VOD-bibliotheek, replay en Nederlandstalige support — zoals beschreven op ${SITE_CONFIG.url}.`,
    },
    {
      question: 'Verschillen de looptijden qua zenders?',
      answer:
        'Nee. Alle standaard abonnementen hebben dezelfde inhoud; je kiest alleen hoe lang je wilt intekenen. Langere periodes zijn vaak voordeliger per maand.',
    },
    {
      question: 'Kan ik verlengen na afloop?',
      answer:
        'Ja. Je kunt opnieuw een abonnement nemen; neem contact op voor verlenging of overstap naar multi-scherm.',
    },
    {
      question: 'Is er een multi-scherm-abonnement?',
      answer: 'Ja — aparte pakketten voor meerdere gelijktijdige streams staan op de multi-scherm pagina.',
    },
    {
      question: 'Hoe snel is mijn abonnement actief?',
      answer: 'Meestal binnen circa 2 uur na betalingsbevestiging; je ontvangt je gegevens per e-mail.',
    },
    {
      question: 'Wat als ik niet tevreden ben?',
      answer: 'Niet tevreden — geld terug binnen 24 uur, conform onze algemene voorwaarden.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'IPTV abonnement', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <FAQSchema faqs={faqs} />
      <IptvAbonnementClient
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
