import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Home } from 'lucide-react';
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
  const t = await getTranslations('faq');

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

      <section className="py-14 lg:py-16 bg-bg border-t border-border" aria-labelledby="faq-home-cta">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 id="faq-home-cta" className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
            {t('homeSectionTitle')}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">{t('homeSectionSubtitle')}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
          >
            <Home className="w-4 h-4" aria-hidden />
            {t('homeSectionCta')}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
