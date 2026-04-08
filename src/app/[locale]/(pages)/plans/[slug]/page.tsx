import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { PLANS, SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, PlanProductSchema } from '@/components/seo/SchemaMarkup';
import PlanPageClient from './PlanPageClient';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return PLANS.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const plan = PLANS.find((p) => p.slug === slug);

  if (!plan) {
    return { title: 'Plan Not Found' };
  }

  const isFr = locale === 'fr';
  const name = isFr ? plan.name_fr : plan.name_de;
  const description = isFr ? plan.description_fr : plan.description_de;
  const deviceText = plan.devices > 1
    ? (isFr ? ` — ${plan.devices} écrans simultanés` : ` — ${plan.devices} gleichzeitige Bildschirme`)
    : '';

  const title = isFr
    ? `${name} - Abonnement IPTV Suisse | ${plan.price} CHF`
    : `${name} - IPTV Abo Schweiz | ${plan.price} CHF`;

  const metaDescription = isFr
    ? `${name}${deviceText}. ${description}. +37'000 chaînes HD/4K, replay et VOD inclus. Activation en 2h, support 24/7. ${plan.price} CHF pour ${plan.duration} mois.`
    : `${name}${deviceText}. ${description}. +37'000 HD/4K-Kanäle, Replay und VOD inklusive. Aktivierung in 2h, 24/7 Support. ${plan.price} CHF für ${plan.duration} Monate.`;

  return {
    title,
    description: metaDescription,
    keywords: isFr
      ? ['IPTV Suisse', 'abonnement IPTV', name, `IPTV ${plan.duration} mois`, 'IPTV Suisse pas cher']
      : ['IPTV Schweiz', 'IPTV Abo', name, `IPTV ${plan.duration} Monate`, 'IPTV Schweiz günstig'],
    openGraph: {
      title,
      description: metaDescription,
      url: locale === 'fr' ? `${SITE_CONFIG.url}/plans/${slug}` : `${SITE_CONFIG.url}/de/plans/${slug}`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
      images: [
        {
          url: `${SITE_CONFIG.url}${plan.image}`,
          width: 1024,
          height: 683,
          alt: name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [`${SITE_CONFIG.url}${plan.image}`],
    },
    alternates: {
      canonical: locale === 'fr' ? `${SITE_CONFIG.url}/plans/${slug}` : `${SITE_CONFIG.url}/de/plans/${slug}`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/plans/${slug}`,
        'de-CH': `${SITE_CONFIG.url}/de/plans/${slug}`,
        'x-default': `${SITE_CONFIG.url}/plans/${slug}`,
      },
    },
  };
}

export default async function PlanPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const plan = PLANS.find((p) => p.slug === slug);
  const isFr = locale === 'fr';
  const planName = plan ? (isFr ? plan.name_fr : plan.name_de) : slug;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: isFr ? 'Nos Offres' : 'Angebote', url: localeUrl(locale, '/#pricing') },
          { name: planName, url: localeUrl(locale, `/plans/${slug}`) },
        ]}
      />
      <PlanProductSchema locale={locale} slug={slug} />
      <PlanPageClient />
    </>
  );
}
