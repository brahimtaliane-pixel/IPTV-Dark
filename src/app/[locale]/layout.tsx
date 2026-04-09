import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE_CONFIG } from '@/lib/constants';
import { getSiteContact } from '@/lib/get-site-contact';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/ui/WhatsAppButton';
import LiveChat from '@/components/ui/LiveChat';
import VisitorTracker from '@/components/ui/VisitorTracker';
import GoogleAnalytics from '@/components/ui/GoogleAnalytics';

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

/** Contact info must not be prerendered/cached from build-time fallbacks */
export const dynamic = 'force-dynamic';

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
    keywords: [
      'iptv nederland',
      'iptv abonnement nederland',
      'iptv premium nederland',
      'iptv 4k nederland',
      'iptv streaming nederland',
      'iptv vod nederland',
      'iptv replay nederland',
      'beste iptv nederland',
      'tv internet nederland',
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
    alternates: {
      canonical: SITE_CONFIG.url,
      languages: {
        'nl-NL': SITE_CONFIG.url,
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

  if (!routing.locales.includes(locale as 'nl')) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const contact = await getSiteContact();

  return (
    <NextIntlClientProvider messages={messages}>
      <GoogleAnalytics />
      <Header />
      <main className="min-h-screen min-w-0 overflow-x-clip bg-bg text-text">{children}</main>
      <Footer />
      <WhatsAppButton whatsappUrl={contact.whatsappUrl} />
      <LiveChat />
      <VisitorTracker />
    </NextIntlClientProvider>
  );
}
