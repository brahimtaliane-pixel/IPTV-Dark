import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Mail, Phone, MessageCircle, Clock } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact' });
  const isNl = locale === 'nl';
  return {
    title: t('title'),
    description: t('subtitle'),
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: isNl ? `${SITE_CONFIG.url}/contact` : `${SITE_CONFIG.url}/de/contact`,
      siteName: SITE_CONFIG.name,
      locale: isNl ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title: t('title'), description: t('subtitle') },
    alternates: {
      canonical: isNl ? `${SITE_CONFIG.url}/contact` : `${SITE_CONFIG.url}/de/contact`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/contact`,
        'de-CH': `${SITE_CONFIG.url}/de/contact`,
        'x-default': `${SITE_CONFIG.url}/contact`,
      },
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'contact' });
  const isNl = locale === 'nl';

  const channels = [
    { icon: MessageCircle, title: 'WhatsApp', desc: isNl ? 'Réponse en moins de 30 min' : 'Antwort in weniger als 30 Min.', action: isNl ? 'Ouvrir WhatsApp' : 'WhatsApp öffnen', href: SITE_CONFIG.whatsapp, color: 'text-[#25D366]', bg: 'bg-[#25D366]/8' },
    { icon: Mail, title: 'Email', desc: isNl ? 'Réponse garantie en 2h' : 'Garantierte Antwort in 2h', action: isNl ? 'Envoyer un email' : 'E-Mail senden', href: `mailto:${SITE_CONFIG.email}`, color: 'text-swiss-red', bg: 'bg-swiss-red/8' },
    { icon: Phone, title: isNl ? 'Téléphone' : 'Telefon', desc: '24/7', action: isNl ? 'Appeler' : 'Anrufen', href: `tel:${SITE_CONFIG.phone}`, color: 'text-blue-600', bg: 'bg-blue-600/8' },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isNl ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: 'Contact', url: localeUrl(locale, '/contact') },
        ]}
      />
      <div className="pt-28 pb-20 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">{t('title')}</h1>
            <p className="text-text-secondary">{t('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 mb-10">
            {channels.map(({ icon: Icon, title, desc, action, href, color, bg }) => (
              <a key={title} href={href} target="_blank" rel="noopener noreferrer" className="bg-bg rounded-xl border border-border p-5 text-center hover:border-swiss-red/20 transition-all block">
                <div className={`w-12 h-12 rounded-lg ${bg} flex items-center justify-center mx-auto mb-3`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
                <h3 className="text-base font-bold text-text mb-0.5">{title}</h3>
                <p className="text-xs text-text-muted mb-3">{desc}</p>
                <span className="text-sm font-medium text-swiss-red">{action} →</span>
              </a>
            ))}
          </div>

          <div className="bg-bg rounded-xl border border-border p-6 text-center">
            <Clock className="w-6 h-6 text-swiss-red mx-auto mb-2" />
            <h3 className="font-bold text-text mb-1">{isNl ? 'Horaires de support' : 'Support-Zeiten'}</h3>
            <p className="text-sm text-text-muted">{isNl ? 'Disponible 24h/24, 7j/7, y compris les jours fériés.' : 'Verfügbar 24/7, auch an Feiertagen.'}</p>
          </div>
        </div>
      </div>
    </>
  );
}
