'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Check, ArrowRight, Tv, Zap, Headphones, Wifi, Globe } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PRICE_CURRENCY, type SiteStatsSnapshot } from '@/lib/constants';
import type { SitePlan } from '@/lib/get-plans';
import { formatPrice, getDiscount } from '@/lib/utils';
import { NL_CITY_SLUGS_ORDERED, NL_CITY_SLUGS } from '@/lib/nl-city-slugs';
import { CITIES_DATA } from '@/lib/cities';

const ISP_NL = ['KPN', 'Ziggo', 'T-Mobile', 'Odido'] as const;
const ISP_CH = ['Swisscom', 'Sunrise', 'Salt', 'UPC'] as const;

export default function CityPageClient({
  citySlug,
  plans,
  stats,
}: {
  citySlug: string;
  plans: SitePlan[];
  stats: SiteStatsSnapshot;
}) {
  const locale = useLocale();
  const t = useTranslations('pricing');
  const isNlCity = NL_CITY_SLUGS.has(citySlug);

  const city = CITIES_DATA[citySlug];
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">City not found</h1>
          <Link href="/" className="text-swiss-red hover:underline">
            ← Terug
          </Link>
        </div>
      </div>
    );
  }

  const meta = locale === 'nl' ? city.meta_fr : city.meta_de;

  const benefitsNl = [
    'Nederlandse, Belgische en internationale zenders — ruim 30.000 in HD/4K',
    'HD- en 4K-kwaliteit op Smart TV, telefoon, tablet en pc',
    'Replay en VOD met 170.000+ films en series',
    `Nederlandstalige support 24/7 — ook voor kijkers in ${city.name}`,
    'Activering meestal binnen 2 uur na betaling',
    'Compatibel met Smart TV, Android, iOS, Fire Stick, MAG en meer',
  ];

  const benefitsDe = [
    'Alle Schweizer und internationalen Kanäle',
    'HD- und 4K-Qualität auf allen Ihren Geräten',
    'Replay und VOD mit 40\'000+ Filmen und Serien',
    `24/7 Kundensupport für Einwohner von ${city.name}`,
    'Schnelle Aktivierung in weniger als 2 Stunden',
    'Kompatibel mit Smart TV, Android, iOS, Fire Stick und mehr',
  ];

  const benefits = locale === 'nl' ? benefitsNl : benefitsDe;

  const ispList = locale === 'nl' && isNlCity ? ISP_NL : ISP_CH;
  const regionPhraseNl = isNlCity
    ? city.name === city.canton
      ? `in ${city.name} en omgeving`
      : `in ${city.name} en de provincie ${city.canton}`
    : `in ${city.name} en kanton ${city.canton}`;
  const regionPhraseDe = `in ${city.name} und im Kanton ${city.canton}`;

  return (
    <section className="pt-28 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* Hero */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/8 rounded-full border border-swiss-red/15 mb-5"
          >
            <MapPin className="w-3.5 h-3.5 text-swiss-red" />
            <span className="text-xs font-semibold text-swiss-red uppercase tracking-wide">
              {city.name}
              {city.canton ? ` · ${city.canton}` : ''}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight tracking-tight mb-5"
          >
            {meta.h1}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8"
          >
            {meta.intro}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/#pricing"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              {locale === 'nl' ? 'Bekijk onze pakketten' : 'Angebote ansehen'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg transition-colors text-sm"
            >
              {locale === 'nl' ? 'Neem contact op' : 'Kontaktieren'}
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
          {[
            { value: stats.channels, label: locale === 'nl' ? 'Zenders' : 'Kanäle' },
            { value: stats.movies, label: locale === 'nl' ? 'Films en series' : 'Filme & Serien' },
            { value: stats.uptime, label: locale === 'nl' ? 'Beschikbaarheid' : 'Verfügbarkeit' },
            { value: stats.supportHours, label: locale === 'nl' ? 'Support' : 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-extrabold text-text mb-6">
              {locale === 'nl'
                ? `Waarom IPTV Nederland in ${city.name}?`
                : `Warum IPTV Schweiz in ${city.name} wählen?`}
            </h2>
            <ul className="space-y-3.5">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-swiss-red/10 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-swiss-red" />
                  </div>
                  <span className="text-text-secondary text-sm leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(
              locale === 'nl'
                ? [
                    {
                      icon: Tv,
                      title: '30.000+ zenders',
                      desc: 'Nederlandse, Belgische en internationale zenders in HD/4K',
                    },
                    {
                      icon: Zap,
                      title: 'Activering < 2 uur',
                      desc: 'Meestal dezelfde dag nog kijken',
                    },
                    {
                      icon: Headphones,
                      title: 'Support 24/7',
                      desc: `Hulp voor ${city.name} en omgeving`,
                    },
                  ]
                : [
                    { icon: Tv, title: '15\'000+ Kanäle', desc: 'Schweizer und internationale in HD/4K' },
                    { icon: Zap, title: 'Aktivierung < 2h', desc: 'Sofort loslegen' },
                    {
                      icon: Headphones,
                      title: 'Lokaler 24/7 Support',
                      desc: `Dedizierte Unterstützung für ${city.name}`,
                    },
                  ]
            ).map((item) => (
              <div key={item.title} className="bg-bg rounded-xl border border-border p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-swiss-red" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text">{item.title}</div>
                  <div className="text-xs text-text-muted mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing cards */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-text mb-2">
            {locale === 'nl'
              ? `Onze IPTV-pakketten in ${city.name}`
              : `Unsere IPTV-Angebote in ${city.name}`}
          </h2>
          <p className="text-text-secondary mb-8">
            {locale === 'nl'
              ? 'Kies het pakket dat bij je past. Je ontvangt direct je gegevens per e-mail.'
              : 'Wählen Sie das Paket, das zu Ihnen passt. Sofortige Lieferung per E-Mail.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...plans].sort((a, b) => a.duration - b.duration).map((plan) => {
              const planName = locale === 'nl' ? plan.name_nl : plan.name_de;
              const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-6 transition-all ${
                    plan.is_popular
                      ? 'bg-swiss-red border-swiss-red text-white relative'
                      : 'bg-white border-border hover:border-swiss-red/20'
                  }`}
                >
                  {plan.is_popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-swiss-red text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {t('popular')}
                    </span>
                  )}
                  <div className="text-sm font-semibold mb-3">{planName}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold">{formatPrice(plan.price)}</span>
                    <span className="text-sm opacity-80">{PRICE_CURRENCY}</span>
                    {discount > 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ml-1 ${plan.is_popular ? 'bg-white/20' : 'bg-success text-white'}`}
                      >
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {plan.original_price && (
                    <div className={`text-xs line-through mb-3 ${plan.is_popular ? 'text-white/60' : 'text-text-muted'}`}>
                      {formatPrice(plan.original_price)} {PRICE_CURRENCY}
                    </div>
                  )}
                  <Link
                    href={`/plans/${plan.slug}`}
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      plan.is_popular
                        ? 'bg-white text-swiss-red hover:bg-white/90'
                        : 'bg-swiss-red text-white hover:bg-swiss-red-dark'
                    }`}
                  >
                    {t('cta')}
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ISP Compatibility Section */}
        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-swiss-red" />
            </div>
            {locale === 'nl'
              ? `Internet in ${city.name} — geschikt voor IPTV`
              : `Internet-Kompatibilität in ${city.name}`}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {locale === 'nl' ? (
              isNlCity ? (
                <>
                  IPTV Nederland werkt met de grote providers {regionPhraseNl}. Je hebt geen speciale router of instellingen
                  nodig: een stabiele verbinding vanaf ongeveer 10 Mbps is genoeg voor HD, en ongeveer 25 Mbps voor 4K.
                </>
              ) : (
                <>
                  Onze stream werkt met gangbare internetverbindingen {regionPhraseNl}. Minimaal ongeveer 10 Mbps voor HD
                  en 25 Mbps voor 4K — geen ingewikkelde configuratie nodig.
                </>
              )
            ) : (
              `Unser IPTV Schweiz Service funktioniert mit allen Internetanbietern ${regionPhraseDe}. Sie benötigen keine spezielle Konfiguration — eine Standard-Internetverbindung ab 10 Mbit/s reicht für HD, ab 25 Mbit/s für 4K.`
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ispList.map((isp) => (
              <div key={isp} className="bg-white rounded-lg border border-border p-3 text-center">
                <div className="text-sm font-semibold text-text">{isp}</div>
                <div className="text-xs text-success mt-0.5 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  {locale === 'nl' ? 'Geschikt' : 'Kompatibel'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Neighborhoods / Coverage Section */}
        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Globe className="w-4 h-4 text-swiss-red" />
            </div>
            {locale === 'nl' ? `Dekking in en rond ${city.name}` : `Abdeckungsgebiete in ${city.name}`}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {locale === 'nl'
              ? `IPTV is beschikbaar in onderstaande wijken en omliggende gebieden van ${city.name}:`
              : `Unser IPTV-Service ist in allen Gemeinden und Quartieren von ${city.name} und Umgebung verfügbar:`}
          </p>
          <div className="flex flex-wrap gap-2">
            {(locale === 'nl' ? city.neighborhoods_fr : city.neighborhoods_de).map((n) => (
              <span key={n} className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded FAQ Section */}
        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-6">
            {locale === 'nl'
              ? `IPTV in ${city.name} — veelgestelde vragen`
              : `IPTV-Service in ${city.name} — Häufige Fragen`}
          </h2>
          <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'nl'
                  ? `Hoe werkt IPTV Nederland in ${city.name}?`
                  : `Wie funktioniert IPTV Schweiz in ${city.name}?`}
              </h3>
              <p>
                {locale === 'nl' ? (
                  <>
                    Je kunt overal in {city.name}
                    {isNlCity
                      ? city.name === city.canton
                        ? ' en omgeving'
                        : ` en de provincie ${city.canton}`
                      : ` en kanton ${city.canton}`}{' '}
                    kijken zolang je internet hebt (minimaal ca. 10 Mbps). Je krijgt toegang tot meer dan 30.000 zenders in
                    HD en 4K. Na betaling wordt je abonnement meestal binnen 2 uur geactiveerd.
                  </>
                ) : (
                  `Unser IPTV-Service ist überall in ${city.name} und im Kanton ${city.canton} verfügbar. Sie benötigen lediglich eine Internetverbindung (mindestens 10 Mbit/s), um über 30'000 Kanäle in HD- und 4K-Qualität zu geniessen. Die Aktivierung erfolgt in weniger als 2 Stunden nach Ihrer Bestellung.`
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'nl'
                  ? `Welke internetproviders werken in ${city.name}?`
                  : `Welche Internetanbieter sind in ${city.name} kompatibel?`}
              </h3>
              <p>
                {locale === 'nl' ? (
                  isNlCity ? (
                    <>
                      Onze service werkt met vrijwel alle providers, waaronder KPN, Ziggo, T-Mobile, Odido en regionale
                      glasvezel. Geen speciale IPTV-box van je provider nodig.
                    </>
                  ) : (
                    <>
                      De stream werkt met gangbare verbindingen in {city.name}. Geen aparte IPTV-abonnement van je
                      provider vereist — alleen stabiel internet.
                    </>
                  )
                ) : (
                  `Unser Service funktioniert mit allen Internetanbietern in ${city.name}: Swisscom, Sunrise, Salt, UPC und allen anderen. Es ist keine spezielle Konfiguration erforderlich.`
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'nl'
                  ? `Welke apparaten kan ik gebruiken in ${city.name}?`
                  : `Welche Geräte kann ich in ${city.name} verwenden?`}
              </h3>
              <p>
                {locale === 'nl'
                  ? 'Onder andere: Smart TV (Samsung, LG, Sony), Fire TV Stick, Apple TV, Android- en iPhones/tablets, Windows en Mac, MAG- en Formuler-boxen.'
                  : `Alle Geräte sind kompatibel: Samsung, LG und Sony Smart TV, Amazon Fire Stick, Apple TV, Android/iOS Smartphones und Tablets, Windows und Mac Computer sowie MAG und Formuler Boxen.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'nl'
                  ? `Zitten replay en VOD inbegrepen in ${city.name}?`
                  : `Sind Replay und VOD in ${city.name} enthalten?`}
              </h3>
              <p>
                {locale === 'nl'
                  ? `Ja. Alle pakketten bevatten replay (tot 7 dagen terug), een grote VOD-bibliotheek met films en series, EPG en updates — ook in ${city.name}.`
                  : `Ja, alle unsere Abonnements beinhalten Replay bis zu 7 Tage, eine grosse VOD-Bibliothek mit über 170'000 Filmen und Serien, den Programmführer (EPG) und automatische Updates. Diese Funktionen sind überall verfügbar, auch in ${city.name}.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'nl'
                  ? `Hoe snel wordt mijn abonnement actief in ${city.name}?`
                  : `Wie lange dauert die Aktivierung in ${city.name}?`}
              </h3>
              <p>
                {locale === 'nl'
                  ? 'Meestal binnen 2 uur na betalingsbevestiging, 7 dagen per week. Je ontvangt je inloggegevens per e-mail en kunt direct beginnen met kijken.'
                  : `Die Aktivierung erfolgt in weniger als 2 Stunden nach Zahlungsbestätigung, 7 Tage die Woche. Sie erhalten Ihre Zugangsdaten per E-Mail und können sofort loslegen.`}
              </p>
            </div>
          </div>
        </div>

        {/* Other cities cross-links */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-text mb-4">
            {locale === 'nl' ? 'IPTV Nederland in andere steden' : 'IPTV Nederland in anderen Städten'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {NL_CITY_SLUGS_ORDERED.filter((s) => s !== citySlug)
              .slice(0, 8)
              .map((slug) => {
                const other = CITIES_DATA[slug];
                if (!other) return null;
                return (
                  <Link
                    key={slug}
                    href={`/iptv-${slug}`}
                    className="px-4 py-2 bg-bg border border-border rounded-lg text-sm text-text-secondary hover:border-swiss-red/20 hover:text-swiss-red transition-all"
                  >
                    IPTV {other.name}
                  </Link>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
}
