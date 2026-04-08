import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE_CONFIG } from '@/lib/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LiveChat from '@/components/ui/LiveChat';
import VisitorTracker from '@/components/ui/VisitorTracker';
import GoogleAnalytics from '@/components/ui/GoogleAnalytics';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const meta = (messages as Record<string, Record<string, string>>).metadata;

  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: meta.title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: meta.description,
    keywords: locale === 'fr'
      ? ['iptv suisse', 'abonnement iptv suisse', 'iptv suisse premium', 'iptv suisse 4k', 'iptv chaînes suisses', 'streaming iptv suisse', 'iptv vod suisse', 'iptv replay suisse', 'meilleur iptv suisse', 'tv internet suisse']
      : ['iptv schweiz', 'iptv schweiz abo', 'iptv schweiz premium', 'iptv schweiz 4k', 'iptv abo schweiz', 'schweizer iptv kanäle', 'iptv streaming schweiz', 'iptv vod schweiz', 'iptv replay schweiz', 'bestes iptv schweiz'],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: locale === 'fr' ? SITE_CONFIG.url : `${SITE_CONFIG.url}/de`,
      siteName: SITE_CONFIG.name,
      locale: locale === 'fr' ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: locale === 'fr' ? SITE_CONFIG.url : `${SITE_CONFIG.url}/de`,
      languages: {
        'fr-CH': SITE_CONFIG.url,
        'de-CH': `${SITE_CONFIG.url}/de`,
        'x-default': SITE_CONFIG.url,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'fr' | 'de')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale === 'fr' ? 'fr-CH' : 'de-CH'} className={inter.variable} suppressHydrationWarning>
      <body className="font-body antialiased">
        <NextIntlClientProvider messages={messages}>
          <GoogleAnalytics />
          <Header />
          <main className="min-h-screen bg-bg text-text">
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
          <LiveChat />
          <VisitorTracker />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
