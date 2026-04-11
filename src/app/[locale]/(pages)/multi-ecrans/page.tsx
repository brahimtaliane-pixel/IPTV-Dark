import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { getSiteContact } from '@/lib/get-site-contact';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, MultiScreenSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import HomeContact from '@/components/sections/HomeContact';
import MultiEcransClient from './MultiEcransClient';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  const multiUrl = `${SITE_CONFIG.url}/multi-ecrans`;
  const title =
    'IPTV multi-scherm — 2, 3 of 4 schermen tegelijk | IPTV Nederland';
  const description =
    'IPTV Nederland multi-scherm pakketten: kijk op 2, 3 of 4 apparaten tegelijk. Meer dan 30.000 zenders HD/4K, 170.000+ films en series on demand, 7 dagen replay. Vanaf 53,99 €.';

  return {
    title,
    description,
    keywords: [
      'iptv multi scherm',
      'IPTV Nederland multi scherm',
      'iptv gezin',
      'iptv 2 schermen',
      'iptv 4 schermen',
      'iptv meerdere apparaten',
    ],
    openGraph: {
      title,
      description,
      url: multiUrl,
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
      canonical: multiUrl,
      languages: {
        'nl-NL': multiUrl,
        'x-default': multiUrl,
      },
    },
  };
}

export default async function MultiEcransPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [plans, contact] = await Promise.all([getPlans(), getSiteContact()]);

  const multiEcransFaqs = [
    {
      question: 'Hoe werkt multi-scherm?',
      answer:
        'Met een multi-scherm pakket mag je tegelijk inloggen op 2, 3 of 4 apparaten. Elk scherm kan iets anders tonen, zonder kwaliteitsverlies.',
    },
    {
      question: 'Kan ik verschillende soorten apparaten gebruiken?',
      answer:
        'Ja: mix Smart TV, telefoon, tablet en pc zoals je wilt — Fire Stick, MAG en meer worden ondersteund.',
    },
    {
      question: 'Is de kwaliteit op elk scherm hetzelfde?',
      answer:
        'Ja: overal HD en 4K, hetzelfde aanbod van meer dan 30.000 zenders, 170.000+ films en series on demand en replay.',
    },
    {
      question: 'Zijn replay en VOD op elk scherm inbegrepen?',
      answer:
        'Ja op elk scherm: replay tot 7 dagen terug, grote VOD-bibliotheek, EPG en updates.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Multi-scherm', url: localeUrl(locale, '/multi-ecrans') },
        ]}
      />
      <MultiScreenSchema locale={locale} plans={plans} />
      <FAQSchema faqs={multiEcransFaqs} />
      <MultiEcransClient plans={plans} />
      <HomeContact contact={contact} />
    </>
  );
}
