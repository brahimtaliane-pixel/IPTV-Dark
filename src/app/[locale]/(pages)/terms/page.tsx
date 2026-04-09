import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

const TERMS_URL = `${SITE_CONFIG.url}/terms`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'termsPage' });
  const title = t('title');
  const description = t('metaDescription');
  return {
    title,
    description,
    keywords: [
      'algemene voorwaarden',
      'IPTV Nederland',
      'voorwaarden streaming',
      'iptv voorwaarden',
    ],
    openGraph: {
      title,
      description,
      url: TERMS_URL,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description },
    alternates: {
      canonical: TERMS_URL,
      languages: {
        'nl-NL': TERMS_URL,
        'x-default': TERMS_URL,
      },
    },
  };
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'termsPage' });

  const sections = [
    { title: t('s1Title'), body: t('s1Body') },
    { title: t('s2Title'), body: t('s2Body') },
    { title: t('s3Title'), body: t('s3Body') },
    { title: t('s4Title'), body: t('s4Body') },
    { title: t('s5Title'), body: t('s5Body') },
    { title: t('s6Title'), body: t('s6Body') },
    { title: t('s7Title'), body: t('s7Body') },
    { title: t('s8Title'), body: t('s8Body', { email: SITE_CONFIG.email }) },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: t('breadcrumb'), url: localeUrl(locale, '/terms') },
        ]}
      />
      <div className="pt-28 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10 sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/8 rounded-full border border-swiss-red/15 mb-5">
              <span className="text-xs font-semibold text-swiss-red uppercase tracking-wide">{t('badge')}</span>
            </div>
            <p className="text-sm font-semibold text-swiss-red mb-2">{SITE_CONFIG.name}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-4">{t('title')}</h1>
            <p className="text-text-secondary leading-relaxed">{t('subtitle')}</p>
          </div>

          <p className="text-sm text-text-secondary leading-relaxed mb-8">{t('intro')}</p>

          <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 space-y-8">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-base font-bold text-text mb-2">{s.title}</h2>
                <p className="text-sm text-text-muted leading-relaxed">{s.body}</p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
