import { setRequestLocale, getTranslations } from 'next-intl/server';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Smartphone, Tv, Monitor, Tablet, Download, Wifi } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const title = isFr
    ? 'Guide d\'Installation IPTV — Tous les Appareils'
    : 'IPTV Installationsanleitung — Alle Geräte';
  const description = isFr
    ? 'Installez IPTV Suisse sur Smart TV, Android, iOS, Fire Stick, MAG et plus. Guide étape par étape pour tous les appareils.'
    : 'Installieren Sie IPTV Schweiz auf Smart TV, Android, iOS, Fire Stick, MAG und mehr. Schritt-für-Schritt-Anleitung für alle Geräte.';
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: isFr ? `${SITE_CONFIG.url}/installation` : `${SITE_CONFIG.url}/de/installation`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: isFr ? `${SITE_CONFIG.url}/installation` : `${SITE_CONFIG.url}/de/installation`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/installation`,
        'de-CH': `${SITE_CONFIG.url}/de/installation`,
        'x-default': `${SITE_CONFIG.url}/installation`,
      },
    },
  };
}

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'installation' });
  const isFr = locale === 'fr';

  const devices = [
    { icon: Tv, name: 'Smart TV', brands: 'Samsung, LG, Sony, Philips', steps: isFr ? ['Ouvrez le Smart Hub ou App Store', 'Recherchez l\'application IPTV', 'Installez et ouvrez', 'Entrez vos identifiants', 'Profitez !'] : ['Smart Hub oder App Store öffnen', 'IPTV-App suchen', 'Installieren und öffnen', 'Zugangsdaten eingeben', 'Geniessen!'] },
    { icon: Smartphone, name: 'Android / iOS', brands: 'iPhone, Samsung, Huawei', steps: isFr ? ['Téléchargez l\'app', 'Ouvrez l\'application', 'Configurez avec votre lien M3U', 'Sélectionnez vos chaînes', 'Regardez !'] : ['App herunterladen', 'App öffnen', 'Mit M3U-Link konfigurieren', 'Kanäle auswählen', 'Schauen!'] },
    { icon: Monitor, name: 'Windows / Mac', brands: 'PC, MacBook, iMac', steps: isFr ? ['Téléchargez le lecteur IPTV', 'Installez le logiciel', 'Ajoutez votre playlist M3U', 'Configurez', 'Commencez !'] : ['IPTV-Player herunterladen', 'Software installieren', 'M3U-Playlist hinzufügen', 'Konfigurieren', 'Loslegen!'] },
    { icon: Download, name: 'Fire Stick', brands: 'Fire TV Stick, Cube', steps: isFr ? ['Paramètres > Appareil', 'Activez sources inconnues', 'Installez Downloader', 'Téléchargez l\'app IPTV', 'Entrez vos identifiants'] : ['Einstellungen > Gerät', 'Unbekannte Quellen aktivieren', 'Downloader installieren', 'IPTV-App herunterladen', 'Zugangsdaten eingeben'] },
    { icon: Tablet, name: 'MAG Box', brands: 'MAG 250, 254, 322, 520', steps: isFr ? ['Connectez au réseau', 'Accédez au portail', 'Paramètres système', 'Entrez l\'URL du portail', 'Sauvegardez'] : ['Mit Netzwerk verbinden', 'Portal aufrufen', 'Systemeinstellungen', 'Portal-URL eingeben', 'Speichern'] },
    { icon: Wifi, name: 'Formuler / Enigma2', brands: 'Formuler Z+, Z8, Dreambox', steps: isFr ? ['Connectez à Internet', 'Paramètres réseau', 'Configurez le portail IPTV', 'Entrez les identifiants', 'Profitez !'] : ['Mit Internet verbinden', 'Netzwerkeinstellungen', 'IPTV-Portal konfigurieren', 'Anmeldedaten eingeben', 'Geniessen!'] },
  ];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          { name: isFr ? 'Installation' : 'Installation', url: localeUrl(locale, '/installation') },
        ]}
      />
      <div className="pt-28 pb-20 bg-white">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">{t('title')}</h1>
            <p className="text-text-secondary">{t('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {devices.map(({ icon: Icon, name, brands, steps }) => (
              <div key={name} className="bg-bg rounded-xl border border-border p-5 hover:border-swiss-red/20 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-swiss-red/8 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-swiss-red" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-text">{name}</h2>
                    <p className="text-[11px] text-text-muted">{brands}</p>
                  </div>
                </div>
                <ol className="space-y-2">
                  {steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-swiss-red/8 text-swiss-red text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-sm text-text-secondary">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
