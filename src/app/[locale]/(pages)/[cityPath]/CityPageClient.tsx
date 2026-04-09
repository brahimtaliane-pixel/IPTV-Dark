'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Check, ArrowRight, Tv, Zap, Headphones, Wifi, Globe } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PRICE_CURRENCY_SYMBOL, SITE_CONFIG, type SiteStatsSnapshot } from '@/lib/constants';
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
  const t = useTranslations('pricing');
  const isNlCity = NL_CITY_SLUGS.has(citySlug);

  const city = CITIES_DATA[citySlug];
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-swiss-red mb-2">{SITE_CONFIG.name}</p>
          <h1 className="text-2xl font-bold text-text mb-4">Stad niet gevonden</h1>
          <p className="text-text-secondary text-sm mb-6">Deze locatie staat niet op onze lijst.</p>
          <Link href="/" className="text-swiss-red hover:underline font-medium">
            ← Terug naar home
          </Link>
        </div>
      </div>
    );
  }

  const meta = city.meta_nl;

  const benefitsNl = [
    'Nederlandse, Belgische en internationale zenders — ruim 30.000 in HD/4K',
    'HD- en 4K-kwaliteit op Smart TV, telefoon, tablet en pc',
    'Replay en VOD met 170.000+ films en series',
    `Nederlandstalige support 24/7 — ook voor kijkers in ${city.name}`,
    'Activering meestal binnen 2 uur na betaling',
    'Compatibel met Smart TV, Android, iOS, Fire Stick, MAG en meer',
  ];

  const benefitsChNl = [
    'Zwitsers, Europees en internationaal aanbod — ruim 30.000 zenders in HD/4K',
    'HD- en 4K-kwaliteit op Smart TV, telefoon, tablet en pc',
    'Replay en VOD met 170.000+ films en series',
    `Nederlandstalige support 24/7 — ook voor kijkers in ${city.name} en Zwitserland`,
    'Activering meestal binnen 2 uur na betaling',
    'Compatibel met Smart TV, Android, iOS, Fire Stick, MAG en meer',
  ];

  const benefits = isNlCity ? benefitsNl : benefitsChNl;

  const ispList = isNlCity ? ISP_NL : ISP_CH;
  const regionPhraseNl = isNlCity
    ? city.name === city.canton
      ? `in ${city.name} en omgeving`
      : `in ${city.name} en de provincie ${city.canton}`
    : `in ${city.name} en kanton ${city.canton}`;

  const featureCardsNl = [
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
  ];

  const featureCardsChNl = [
    {
      icon: Tv,
      title: '30.000+ zenders',
      desc: 'Zwitsers, Europees en internationaal in HD/4K',
    },
    {
      icon: Zap,
      title: 'Activering < 2 uur',
      desc: 'Meestal dezelfde dag nog kijken',
    },
    {
      icon: Headphones,
      title: 'Support 24/7',
      desc: `Hulp voor ${city.name} en Zwitserland`,
    },
  ];

  const featureCards = isNlCity ? featureCardsNl : featureCardsChNl;

  const neighborhoodLabels = isNlCity ? city.neighborhoods_fr : city.neighborhoods_de;

  return (
    <section className="pt-28 pb-20 bg-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/8 rounded-full border border-swiss-red/15 mb-5"
          >
            <MapPin className="w-3.5 h-3.5 text-swiss-red" />
            <span className="text-xs font-semibold text-swiss-red uppercase tracking-wide">
              {SITE_CONFIG.name} · {city.name}
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
              Bekijk onze pakketten
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg transition-colors text-sm"
            >
              Neem contact op
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
          {[
            { value: stats.channels, label: 'Zenders' },
            { value: stats.movies, label: 'Films en series' },
            { value: stats.uptime, label: 'Beschikbaarheid' },
            { value: stats.supportHours, label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-extrabold text-text mb-6">Waarom {SITE_CONFIG.name} in {city.name}?</h2>
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
            {featureCards.map((item) => (
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

        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-text mb-2">Onze IPTV-pakketten in {city.name}</h2>
          <p className="text-text-secondary mb-8">
            Kies het pakket dat bij je past. Je ontvangt direct je gegevens per e-mail.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...plans].sort((a, b) => a.duration - b.duration).map((plan) => {
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
                  <div className="text-sm font-semibold mb-3">{plan.name_nl}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold">{formatPrice(plan.price)}</span>
                    <span className="text-sm opacity-80">{PRICE_CURRENCY_SYMBOL}</span>
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
                      {formatPrice(plan.original_price)} {PRICE_CURRENCY_SYMBOL}
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

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-swiss-red" />
            </div>
            Internet in {city.name} — geschikt voor IPTV
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {isNlCity ? (
              <>
                {SITE_CONFIG.name} werkt met de grote providers {regionPhraseNl}. Je hebt geen speciale router of
                instellingen nodig: een stabiele verbinding vanaf ongeveer 10 Mbps is genoeg voor HD, en ongeveer 25 Mbps
                voor 4K.
              </>
            ) : (
              <>
                Onze stream werkt met gangbare internetverbindingen {regionPhraseNl}. Compatibel met onder andere
                Swisscom, Sunrise, Salt en UPC. Minimaal ongeveer 10 Mbps voor HD en 25 Mbps voor 4K — geen ingewikkelde
                configuratie nodig.
              </>
            )}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ispList.map((isp) => (
              <div key={isp} className="bg-white rounded-lg border border-border p-3 text-center">
                <div className="text-sm font-semibold text-text">{isp}</div>
                <div className="text-xs text-success mt-0.5 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  Geschikt
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Globe className="w-4 h-4 text-swiss-red" />
            </div>
            Dekking in en rond {city.name}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            IPTV is beschikbaar in onderstaande wijken en omliggende gebieden van {city.name}:
          </p>
          <div className="flex flex-wrap gap-2">
            {neighborhoodLabels.map((n) => (
              <span key={n} className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-6">
            IPTV in {city.name} — veelgestelde vragen
          </h2>
          <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
            <div>
              <h3 className="font-semibold text-text mb-1">Hoe werkt {SITE_CONFIG.name} in {city.name}?</h3>
              <p>
                Je kunt overal in {city.name}
                {isNlCity
                  ? city.name === city.canton
                    ? ' en omgeving'
                    : ` en de provincie ${city.canton}`
                  : ` en kanton ${city.canton}`}{' '}
                kijken zolang je internet hebt (minimaal ca. 10 Mbps). Je krijgt toegang tot meer dan 30.000 zenders in HD
                en 4K. Na betaling wordt je abonnement meestal binnen 2 uur geactiveerd.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Welke internetproviders werken in {city.name}?</h3>
              <p>
                {isNlCity ? (
                  <>
                    Onze service werkt met vrijwel alle providers, waaronder KPN, Ziggo, T-Mobile, Odido en regionale
                    glasvezel. Geen speciale IPTV-box van je provider nodig.
                  </>
                ) : (
                  <>
                    De stream werkt in {city.name} met onder andere Swisscom, Sunrise, Salt en UPC. Geen apart IPTV-product
                    van je internetprovider vereist — alleen een stabiele verbinding.
                  </>
                )}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Welke apparaten kan ik gebruiken in {city.name}?</h3>
              <p>
                Onder andere: Smart TV (Samsung, LG, Sony), Fire TV Stick, Apple TV, Android- en iPhones/tablets, Windows
                en Mac, MAG- en Formuler-boxen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Zitten replay en VOD inbegrepen in {city.name}?</h3>
              <p>
                Ja. Alle pakketten bevatten replay (tot 7 dagen terug), een grote VOD-bibliotheek met films en series, EPG
                en updates — ook in {city.name}.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Hoe snel wordt mijn abonnement actief in {city.name}?</h3>
              <p>
                Meestal binnen 2 uur na betalingsbevestiging, 7 dagen per week. Je ontvangt je inloggegevens per e-mail en
                kunt direct beginnen met kijken.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-text mb-4">{SITE_CONFIG.name} in andere steden</h2>
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
