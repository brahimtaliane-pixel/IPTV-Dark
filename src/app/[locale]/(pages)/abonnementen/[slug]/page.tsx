import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { SITE_CONFIG, PRICE_CURRENCY_SYMBOL } from '@/lib/constants';
import { getPlans, getPlanBySlug, getPlanCheckoutSnapshot } from '@/lib/get-plans';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, PlanProductSchema } from '@/components/seo/SchemaMarkup';
import PlanPageClient from './PlanPageClient';

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const plans = await getPlans();
  return plans.map((plan) => ({ slug: plan.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const plan = await getPlanBySlug(slug);

  if (!plan) {
    return { title: `Pakket niet gevonden | ${SITE_CONFIG.name}` };
  }

  const name = plan.name_nl;
  const description = plan.description_nl;
  const deviceText =
    plan.devices > 1 ? ` — ${plan.devices} gelijktijdige schermen` : '';

  const planUrl = `${SITE_CONFIG.url}/abonnementen/${slug}`;
  const title = `${name} — IPTV Dark | ${plan.price} ${PRICE_CURRENCY_SYMBOL}`;

  const metaDescription = `${name}${deviceText}. ${description}. Meer dan 32.000 zenders HD/4K, meer dan 175.000 films en meer dan 175.000 series on demand, replay inbegrepen. Activering binnen 2 uur, support 24/7. ${plan.price} ${PRICE_CURRENCY_SYMBOL} voor ${plan.duration} maanden.`;

  return {
    title,
    description: metaDescription,
    keywords: [
      'IPTV Dark',
      'iptv abonnement',
      name,
      `iptv ${plan.duration} maanden`,
      'iptv premium nederland',
      'iptv 4k',
    ],
    openGraph: {
      title,
      description: metaDescription,
      url: planUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
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
      canonical: planUrl,
      languages: {
        'nl-NL': planUrl,
        'x-default': planUrl,
      },
    },
  };
}

export default async function PlanPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const plans = await getPlans();
  const plan = plans.find((p) => p.slug === slug);
  const planName = plan ? plan.name_nl : slug;
  const checkout = plan ? getPlanCheckoutSnapshot(plan) : { showDirect: false, directHref: '' };

  let webPageTitle = `Pakket | ${SITE_CONFIG.name}`;
  let webPageDescription = `IPTV Dark abonnementspakket — bekijk alle pakketten op ${SITE_CONFIG.domain}.`;
  if (plan) {
    const deviceText = plan.devices > 1 ? ` — ${plan.devices} gelijktijdige schermen` : '';
    webPageTitle = `${plan.name_nl} — IPTV Dark | ${plan.price} ${PRICE_CURRENCY_SYMBOL}`;
    webPageDescription = `${plan.name_nl}${deviceText}. ${plan.description_nl}. Meer dan 32.000 zenders HD/4K, meer dan 175.000 films en meer dan 175.000 series on demand, replay inbegrepen. Activering binnen 2 uur, support 24/7. ${plan.price} ${PRICE_CURRENCY_SYMBOL} voor ${plan.duration} maanden.`;
  }

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Abonnementen', url: localeUrl(locale, '/abonnementen') },
          { name: planName, url: localeUrl(locale, `/abonnementen/${slug}`) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={`/abonnementen/${slug}`}
        title={webPageTitle}
        description={webPageDescription}
      />
      {plan && <PlanProductSchema locale={locale} plan={plan} />}
      <PlanPageClient plans={plans} checkout={checkout} />
    </>
  );
}
