import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, STATS } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import PandoraIptvClient from './PandoraIptvClient';

type Props = {
  params: Promise<{ locale: string }>;
};

const PAGE_PATH = '/pandora-iptv';

const PANDORA_PAGE_TITLE = `Pandora IPTV alternatief | ${SITE_CONFIG.name} — 32.000+ zenders HD/4K`;
const PANDORA_PAGE_DESCRIPTION = `Zoek je Pandora IPTV of vergelijkbare apps? Ontdek ${SITE_CONFIG.name}: 32.000+ zenders, 175.000+ films en series on demand, replay, Nederlandstalige support 24/7 en activering binnen 2 uur.`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const pageUrl = `${SITE_CONFIG.url}${PAGE_PATH}`;
  const title = PANDORA_PAGE_TITLE;
  const description = PANDORA_PAGE_DESCRIPTION;

  return {
    title,
    description,
    keywords: [
      'Pandora IPTV',
      `Pandora IPTV ${SITE_CONFIG.name}`,
      'IPTV alternatief',
      SITE_CONFIG.name,
      'premium IPTV',
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

export default async function PandoraIptvPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();

  const faqs = [
    {
      question: `Is ${SITE_CONFIG.name} hetzelfde als Pandora IPTV?`,
      answer: `Nee. ${SITE_CONFIG.name} is een eigen premium IPTV-service. "Pandora IPTV" is een veelgebruikte zoekterm; onze pagina legt uit wat wij als betrouwbaar alternatief bieden.`,
    },
    {
      question: 'Waarom kiezen voor een premium IPTV-abonnement?',
      answer:
        'Je krijgt voorspelbare kwaliteit, updates, EPG, replay tot 7 dagen, grote VOD-bibliotheek en Nederlandstalige support — in plaats van onstabiele gratis apps.',
    },
    {
      question: 'Hoe snel wordt mijn abonnement actief?',
      answer:
        'Meestal binnen 2 uur na betalingsbevestiging. Je ontvangt je inloggegevens per e-mail en kunt direct aan de slag op je apparaten.',
    },
    {
      question: 'Waarom niet alleen een gratis app gebruiken?',
      answer:
        'Gratis of onduidelijke apps leveren vaak onstabiele streams en geen echte support. Met een betaald abonnement weet je wat je krijgt: updates, EPG, replay en hulp bij problemen.',
    },
    {
      question: 'Welke apparaten worden ondersteund?',
      answer:
        "Smart TV (o.a. Samsung, LG), Fire TV Stick, Apple TV, Android/iOS, Windows, Mac, MAG- en Formuler-boxen — dezelfde brede ondersteuning als op onze andere landingspagina's.",
    },
    {
      question: 'Kan ik op meerdere schermen tegelijk kijken?',
      answer:
        'Ja. Voor gezinnen bieden we multi-scherm pakketten met 2, 3 of 4 gelijktijdige streams. Zie de multi-schermen-pagina voor prijzen.',
    },
    {
      question: 'Wat als ik niet tevreden ben?',
      answer:
        'We hanteren een duidelijke service: niet tevreden — geld terug binnen 24 uur, conform onze algemene voorwaarden.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Pandora IPTV', url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={PAGE_PATH}
        title={PANDORA_PAGE_TITLE}
        description={PANDORA_PAGE_DESCRIPTION}
      />
      <FAQSchema faqs={faqs} />
      <PandoraIptvClient
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
