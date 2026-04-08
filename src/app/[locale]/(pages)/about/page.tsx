import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Shield, Users, Headphones, Award } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const isFr = locale === 'fr';
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: isFr ? `${SITE_CONFIG.url}/about` : `${SITE_CONFIG.url}/de/about`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('subtitle') },
    alternates: {
      canonical: isFr ? `${SITE_CONFIG.url}/about` : `${SITE_CONFIG.url}/de/about`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/about`,
        'de-CH': `${SITE_CONFIG.url}/de/about`,
        'x-default': `${SITE_CONFIG.url}/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'about' });
  const isFr = locale === 'fr';

  const values = [
    { icon: Shield, title: isFr ? 'Fiabilité' : 'Zuverlässigkeit', desc: isFr ? 'Une infrastructure premium avec 99.9% de disponibilité.' : 'Premium-Infrastruktur mit 99.9% Verfügbarkeit.' },
    { icon: Users, title: isFr ? 'Communauté' : 'Gemeinschaft', desc: isFr ? 'Plus de 15 000 clients à travers la Suisse.' : 'Über 15 000 Kunden in der ganzen Schweiz.' },
    { icon: Headphones, title: isFr ? 'Support Dédié' : 'Engagierter Support', desc: isFr ? 'Équipe bilingue disponible 24/7 pour vous accompagner.' : 'Zweisprachiges Team 24/7 für Sie verfügbar.' },
    { icon: Award, title: isFr ? 'Qualité HD & 4K' : 'HD & 4K Qualität', desc: isFr ? 'Streaming en haute définition et 4K sur tous vos appareils.' : 'Streaming in HD und 4K auf allen Ihren Geräten.' },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: isFr ? 'À propos' : 'Über uns', url: localeUrl(locale, '/about') },
        ]}
      />
      <div className="pt-28 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">{t('title')}</h1>
            <p className="text-text-secondary">{t('subtitle')}</p>
          </div>

          <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-10">
            <p className="text-text-secondary leading-relaxed text-sm">
              {isFr ? 'Notre service est né d\'une vision simple : offrir aux foyers suisses une expérience de streaming TV moderne et fiable. Depuis 2020, nous accompagnons plus de 15 000 clients en Suisse avec un service stable, un support réactif et un catalogue régulièrement mis à jour.' : 'Unser Service entstand aus einer einfachen Vision: Schweizer Haushalten ein modernes und zuverlässiges TV-Streaming-Erlebnis zu bieten. Seit 2020 betreuen wir über 15 000 Kunden in der Schweiz mit einem stabilen Service, reaktionsschnellem Support und einem regelmäßig aktualisierten Katalog.'}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-bg rounded-xl border border-border p-5 hover:border-swiss-red/20 transition-colors">
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
