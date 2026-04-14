import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema, BrandedWebPageSchema, FAQSchema } from '@/components/seo/SchemaMarkup';
import InstallationClient from './InstallationClient';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

const PAGE_PATH = '/installation';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'installation' });
  const title = t('metaTitle');
  const description = t('metaDescription');
  const url = `${SITE_CONFIG.url}${PAGE_PATH}`;
  return {
    title,
    description,
    keywords: [
      'IPTV Dark installatie',
      'IPTV Smart TV',
      'IPTV Fire Stick',
      'M3U playlist',
      SITE_CONFIG.domain,
    ],
    openGraph: {
      title,
      description,
      url,
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
      canonical: url,
      languages: {
        'nl-NL': url,
        'x-default': url,
      },
    },
  };
}

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'installation' });

  const rawFaq = t.raw('faqItems') as { question: string; answer: string }[];
  const faqs = rawFaq.map(({ question, answer }) => ({ question, answer }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: t('breadcrumbLabel'), url: localeUrl(locale, PAGE_PATH) },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path={PAGE_PATH}
        title={t('metaTitle')}
        description={t('metaDescription')}
      />
      <FAQSchema faqs={faqs} />
      <InstallationClient />
    </>
  );
}
