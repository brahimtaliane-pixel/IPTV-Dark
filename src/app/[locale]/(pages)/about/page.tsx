import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Shield, Headphones, Award, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

const ABOUT_URL = `${SITE_CONFIG.url}/about`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const title = t('title');
  const description = t('subtitle');
  return {
    title,
    description,
    keywords: [
      'IPTV Dark',
      'over iptv nederland',
      'iptv provider nederland',
      'iptv streaming nederland',
      'iptv support nederland',
    ],
    openGraph: {
      title,
      description,
      url: ABOUT_URL,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: ABOUT_URL,
      languages: {
        'nl-NL': ABOUT_URL,
        'x-default': ABOUT_URL,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });

  const values = [
    { icon: Shield, title: t('valueReliabilityTitle'), desc: t('valueReliabilityDesc') },
    { icon: MapPin, title: t('valueCommunityTitle'), desc: t('valueCommunityDesc') },
    { icon: Headphones, title: t('valueSupportTitle'), desc: t('valueSupportDesc') },
    { icon: Award, title: t('valueQualityTitle'), desc: t('valueQualityDesc') },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: t('breadcrumb'), url: localeUrl(locale, '/about') },
        ]}
      />
      <div className="pt-28 pb-20 bg-bg">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/8 rounded-full border border-swiss-red/15 mb-5">
              <span className="text-xs font-semibold text-swiss-red uppercase tracking-wide">{t('badge')}</span>
            </div>
            <p className="text-sm font-semibold text-swiss-red mb-2">{SITE_CONFIG.name}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-4">{t('title')}</h1>
            <p className="text-text-secondary text-base leading-relaxed max-w-2xl mx-auto">{t('subtitle')}</p>
          </div>

          <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-10">
            <p className="text-text-secondary leading-relaxed text-sm sm:text-base">{t('story')}</p>
          </div>

          <h2 className="text-lg font-bold text-text mb-5 text-center sm:text-left">{t('valuesHeading')}</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-bg rounded-xl border border-border p-5 hover:border-swiss-red/25 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-swiss-red/8 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-swiss-red" />
                </div>
                <h3 className="text-base font-bold text-text mb-1">{title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
