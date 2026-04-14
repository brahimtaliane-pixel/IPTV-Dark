import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { getSiteContact } from '@/lib/get-site-contact';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Mail, Phone, MessageCircle, Clock, ArrowRight, Package } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const contactUrl = `${SITE_CONFIG.url}/contact`;
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: contactUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('subtitle') },
    alternates: {
      canonical: contactUrl,
      languages: {
        'nl-NL': contactUrl,
        'x-default': contactUrl,
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const contact = await getSiteContact();

  const channels = [
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      desc: 'Meestal reactie binnen 30 minuten',
      action: 'Open WhatsApp',
      href: contact.whatsappUrl,
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/8',
    },
    {
      icon: Mail,
      title: 'E-mail',
      desc: 'Antwoord binnen 2 uur',
      action: 'Mail ons',
      href: `mailto:${SITE_CONFIG.email}`,
      color: 'text-swiss-red',
      bg: 'bg-swiss-red/8',
    },
    {
      icon: Phone,
      title: 'Telefoon',
      desc: '24/7 bereikbaar',
      action: 'Bel ons',
      href: `tel:${contact.phone.replace(/\s/g, '')}`,
      color: 'text-blue-600',
      bg: 'bg-blue-600/8',
    },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Contact', url: localeUrl(locale, '/contact') },
        ]}
      />
      <div className="pt-28 pb-20 bg-bg">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-wider text-swiss-red mb-2">{SITE_CONFIG.name}</p>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">{t('title')}</h1>
            <p className="text-text-secondary">{t('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {channels.map(({ icon: Icon, title, desc, action, href, color, bg }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-bg rounded-xl border border-border p-5 text-center hover:border-swiss-red/20 transition-all block"
              >
                <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-base font-bold text-text mb-0.5">{title}</h3>
                <p className="text-xs text-text-muted mb-3">{desc}</p>
                <span className="text-sm font-medium text-swiss-red">
                  {action} →
                </span>
              </a>
            ))}
          </div>

          <div className="bg-bg rounded-xl border border-border p-6 text-center">
            <Clock className="w-6 h-6 text-swiss-red mx-auto mb-2" />
            <h3 className="font-bold text-text mb-1">Support</h3>
            <p className="text-sm text-text-muted">24/7 beschikbaar, ook op feestdagen.</p>
          </div>
        </div>
      </div>

      <section className="py-14 lg:py-16 bg-bg border-t border-border" aria-labelledby="contact-plans-cta">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 id="contact-plans-cta" className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
            {t('plansSectionTitle')}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">{t('plansSectionSubtitle')}</p>
          <Link
            href="/abonnementen"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-swiss-red text-black font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
          >
            <Package className="w-4 h-4" aria-hidden />
            {t('plansSectionCta')}
            <ArrowRight className="w-4 h-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
}
