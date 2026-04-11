import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { SITE_CONFIG } from '@/lib/constants';
import { localeUrl } from '@/lib/utils';
import { BreadcrumbSchema } from '@/components/seo/SchemaMarkup';
import { Smartphone, Tv, Monitor, Tablet, Download, Wifi, ArrowRight, Package } from 'lucide-react';
import type { Metadata } from 'next';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  const title = 'IPTV-installatiegids — alle apparaten';
  const description =
    'Installeer IPTV Nederland op Smart TV, Android, iOS, Fire Stick, MAG en meer. Stap-voor-stap voor elk apparaat.';
  const url = `${SITE_CONFIG.url}/installation`;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'article',
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

const DEVICE_STEPS: Record<string, string[]> = {
  'Smart TV': [
    'Open de smart hub of app store',
    'Zoek naar de IPTV-app',
    'Installeer en open',
    'Voer je inloggegevens in',
    'Klaar — geniet van je zenders',
  ],
  'Android / iOS': [
    'Download de app uit de store',
    'Open de applicatie',
    'Configureer met je M3U-link',
    'Selecteer je zenders',
    'Stream waar je wilt',
  ],
  'Windows / Mac': [
    'Download een IPTV-speler',
    'Installeer de software',
    'Voeg je M3U-playlist toe',
    'Controleer de instellingen',
    'Start met kijken',
  ],
  'Fire Stick': [
    'Ga naar Instellingen > Apparaat',
    'Schakel onbekende bronnen in',
    'Installeer Downloader',
    'Download de IPTV-app',
    'Voer je inloggegevens in',
  ],
  'MAG Box': [
    'Verbind met het netwerk',
    'Open het portaalmenu',
    'Ga naar systeeminstellingen',
    'Voer de portal-URL in',
    'Sla op en herstart indien nodig',
  ],
  'Formuler / Enigma2': [
    'Verbind met internet',
    'Open netwerkinstellingen',
    'Configureer het IPTV-portaal',
    'Voer je gebruikersgegevens in',
    'Geniet van stabiele streams',
  ],
};

export default async function InstallationPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'installation' });

  const devices = [
    { icon: Tv, name: 'Smart TV', brands: 'Samsung, LG, Sony, Philips' },
    { icon: Smartphone, name: 'Android / iOS', brands: 'iPhone, Samsung, Huawei' },
    { icon: Monitor, name: 'Windows / Mac', brands: 'PC, MacBook, iMac' },
    { icon: Download, name: 'Fire Stick', brands: 'Fire TV Stick, Cube' },
    { icon: Tablet, name: 'MAG Box', brands: 'MAG 250, 254, 322, 520' },
    { icon: Wifi, name: 'Formuler / Enigma2', brands: 'Formuler Z+, Z8, Dreambox' },
  ].map((d) => ({ ...d, steps: DEVICE_STEPS[d.name] ?? [] }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Installatie', url: localeUrl(locale, '/installation') },
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

      <section className="py-14 lg:py-16 bg-bg border-t border-border" aria-labelledby="installation-plans-cta">
        <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
          <h2 id="installation-plans-cta" className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
            {t('plansSectionTitle')}
          </h2>
          <p className="text-text-secondary text-sm sm:text-base leading-relaxed mb-8">{t('plansSectionSubtitle')}</p>
          <Link
            href="/plans"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
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
