import { setRequestLocale } from 'next-intl/server';
import FAQ from '@/components/sections/FAQ';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import type { Metadata } from 'next';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  const faqUrl = `${SITE_CONFIG.url}/faq`;
  const title = 'Veelgestelde vragen — IPTV Nederland';
  const description =
    'Antwoorden op veelgestelde vragen over IPTV Nederland: apparaten, activering binnen 2 uur, replay, VOD met 170.000+ films en series, support 24/7 en meer.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: faqUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: faqUrl,
      languages: {
        'nl-NL': faqUrl,
        'x-default': faqUrl,
      },
    },
  };
}

export default async function FAQPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const allFaqs = [
    {
      question: 'Wat is IPTV Nederland?',
      answer:
        'IPTV Nederland is een internettelevisiedienst met meer dan 30.000 live TV-zenders en 170.000+ films en series on demand in HD en 4K. Geoptimaliseerd voor kijkers in Nederland.',
    },
    {
      question: 'Welke apparaten worden ondersteund?',
      answer:
        'Smart TV (Samsung, LG, Sony), Android TV, Fire Stick, Apple TV, Android- en iOS-telefoons, tablets, Windows- en Mac-computers, en MAG-boxen.',
    },
    {
      question: 'Hoe lang duurt de activering?',
      answer:
        'Na betaling wordt je account meestal binnen 2 uur geactiveerd. Je ontvangt je inloggegevens per e-mail.',
    },
    {
      question: 'Is replay inbegrepen?',
      answer:
        'Ja, replay zit in alle pakketten. Bekijk uitzendingen tot 7 dagen terug zonder extra kosten.',
    },
    {
      question: 'Hoe bereik ik de support?',
      answer:
        'Ons team is 24/7 bereikbaar via WhatsApp, e-mail en telefoon. We reageren doorgaans binnen 2 uur.',
    },
    {
      question: 'Kan ik op meerdere apparaten kijken?',
      answer:
        'Standaardpakketten zijn voor 1 gelijktijdig apparaat. Voor meerdere schermen tegelijk: zie onze multi-scherm pakketten.',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'FAQ', url: localeUrl(locale, '/faq') },
        ]}
      />
      <FAQSchema faqs={allFaqs} />
      <div className="pt-20">
        <FAQ showAll />
      </div>
    </>
  );
}
