'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { MapPin, Check, ArrowRight, Star, Tv, Zap, Headphones, Wifi, Globe } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { PLANS, STATS } from '@/lib/constants';
import { formatPrice, getDiscount } from '@/lib/utils';
import { CITIES_DATA, ALL_CITY_SLUGS } from '@/lib/cities';

export default function CityPageClient({ citySlug }: { citySlug: string }) {
  const locale = useLocale();
  const t = useTranslations('pricing');

  const city = CITIES_DATA[citySlug];
  if (!city) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text mb-4">City not found</h1>
          <Link href="/" className="text-swiss-red hover:underline">← Back</Link>
        </div>
      </div>
    );
  }

  const meta = locale === 'fr' ? city.meta_fr : city.meta_de;

  const benefits = locale === 'fr'
    ? [
        'Toutes les chaînes suisses et internationales',
        'Qualité HD et 4K sur tous vos appareils',
        'Replay et VOD avec 40\'000+ films et séries',
        `Support client disponible 24/7 pour les résidents de ${city.name}`,
        'Activation rapide en moins de 2 heures',
        'Compatible Smart TV, Android, iOS, Fire Stick et plus',
      ]
    : [
        'Alle Schweizer und internationalen Kanäle',
        'HD- und 4K-Qualität auf allen Ihren Geräten',
        'Replay und VOD mit 40\'000+ Filmen und Serien',
        `24/7 Kundensupport für Einwohner von ${city.name}`,
        'Schnelle Aktivierung in weniger als 2 Stunden',
        'Kompatibel mit Smart TV, Android, iOS, Fire Stick und mehr',
      ];

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
              {city.name} ({city.canton})
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
              {locale === 'fr' ? 'Voir nos offres' : 'Angebote ansehen'}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg transition-colors text-sm"
            >
              {locale === 'fr' ? 'Nous contacter' : 'Kontaktieren'}
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
          {[
            { value: STATS.channels, label: locale === 'fr' ? 'Chaînes' : 'Kanäle' },
            { value: STATS.movies, label: locale === 'fr' ? 'Films' : 'Filme' },
            { value: STATS.uptime, label: locale === 'fr' ? 'Disponibilité' : 'Verfügbarkeit' },
            { value: STATS.supportHours, label: 'Support' },
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
              {locale === 'fr'
                ? `Pourquoi choisir IPTV Suisse à ${city.name} ?`
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
            {[
              { icon: Tv, title: locale === 'fr' ? '15\'000+ Chaînes' : '15\'000+ Kanäle', desc: locale === 'fr' ? 'Suisses et internationales en HD/4K' : 'Schweizer und internationale in HD/4K' },
              { icon: Zap, title: locale === 'fr' ? 'Activation < 2h' : 'Aktivierung < 2h', desc: locale === 'fr' ? 'Commencez à regarder immédiatement' : 'Sofort loslegen' },
              { icon: Headphones, title: locale === 'fr' ? 'Support local 24/7' : 'Lokaler 24/7 Support', desc: locale === 'fr' ? `Assistance dédiée pour ${city.name}` : `Dedizierte Unterstützung für ${city.name}` },
            ].map((item) => (
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
            {locale === 'fr'
              ? `Nos offres IPTV à ${city.name}`
              : `Unsere IPTV-Angebote in ${city.name}`}
          </h2>
          <p className="text-text-secondary mb-8">
            {locale === 'fr'
              ? 'Choisissez le forfait qui vous convient. Livraison immédiate par email.'
              : 'Wählen Sie das Paket, das zu Ihnen passt. Sofortige Lieferung per E-Mail.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...PLANS].sort((a, b) => a.duration - b.duration).map((plan) => {
              const planName = locale === 'fr' ? plan.name_fr : plan.name_de;
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
                    <span className="text-sm opacity-80">CHF</span>
                    {discount > 0 && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded ml-1 ${plan.is_popular ? 'bg-white/20' : 'bg-success text-white'}`}>
                        -{discount}%
                      </span>
                    )}
                  </div>
                  {plan.original_price && (
                    <div className={`text-xs line-through mb-3 ${plan.is_popular ? 'text-white/60' : 'text-text-muted'}`}>
                      {formatPrice(plan.original_price)} CHF
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
            {locale === 'fr'
              ? `Compatibilité internet à ${city.name}`
              : `Internet-Kompatibilität in ${city.name}`}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {locale === 'fr'
              ? `Notre service IPTV Suisse fonctionne avec tous les fournisseurs d'accès internet disponibles à ${city.name} et dans le canton de ${city.canton}. Vous n'avez besoin d'aucune configuration spéciale — une connexion internet standard de 10 Mbps ou plus suffit pour profiter de la HD, et 25 Mbps pour la 4K.`
              : `Unser IPTV Schweiz Service funktioniert mit allen Internetanbietern in ${city.name} und im Kanton ${city.canton}. Sie benötigen keine spezielle Konfiguration — eine Standard-Internetverbindung ab 10 Mbit/s reicht für HD, ab 25 Mbit/s für 4K.`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['Swisscom', 'Sunrise', 'Salt', 'UPC'].map((isp) => (
              <div key={isp} className="bg-white rounded-lg border border-border p-3 text-center">
                <div className="text-sm font-semibold text-text">{isp}</div>
                <div className="text-xs text-success mt-0.5 flex items-center justify-center gap-1">
                  <Check className="w-3 h-3" />
                  {locale === 'fr' ? 'Compatible' : 'Kompatibel'}
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
            {locale === 'fr'
              ? `Zones de couverture à ${city.name}`
              : `Abdeckungsgebiete in ${city.name}`}
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {locale === 'fr'
              ? `Notre service IPTV est accessible dans toutes les communes et quartiers de ${city.name} et alentours :`
              : `Unser IPTV-Service ist in allen Gemeinden und Quartieren von ${city.name} und Umgebung verfügbar:`}
          </p>
          <div className="flex flex-wrap gap-2">
            {(locale === 'fr' ? city.neighborhoods_fr : city.neighborhoods_de).map((n) => (
              <span key={n} className="px-3 py-1.5 bg-white border border-border rounded-full text-sm text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        {/* Expanded FAQ Section */}
        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-6">
            {locale === 'fr'
              ? `Service IPTV à ${city.name} — Questions fréquentes`
              : `IPTV-Service in ${city.name} — Häufige Fragen`}
          </h2>
          <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'fr'
                  ? `Comment fonctionne IPTV Suisse à ${city.name} ?`
                  : `Wie funktioniert IPTV Schweiz in ${city.name}?`}
              </h3>
              <p>
                {locale === 'fr'
                  ? `Notre service IPTV est disponible partout à ${city.name} et dans le canton de ${city.canton}. Il vous suffit d'une connexion internet (minimum 10 Mbps) pour profiter de plus de 37'000 chaînes en qualité HD et 4K. L'activation se fait en moins de 2 heures après votre commande.`
                  : `Unser IPTV-Service ist überall in ${city.name} und im Kanton ${city.canton} verfügbar. Sie benötigen lediglich eine Internetverbindung (mindestens 10 Mbit/s), um über 37'000 Kanäle in HD- und 4K-Qualität zu geniessen. Die Aktivierung erfolgt in weniger als 2 Stunden nach Ihrer Bestellung.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'fr'
                  ? `Quels fournisseurs internet sont compatibles à ${city.name} ?`
                  : `Welche Internetanbieter sind in ${city.name} kompatibel?`}
              </h3>
              <p>
                {locale === 'fr'
                  ? `Notre service fonctionne avec tous les fournisseurs internet de ${city.name} : Swisscom, Sunrise, Salt, UPC et tous les autres. Aucune configuration spéciale n'est nécessaire.`
                  : `Unser Service funktioniert mit allen Internetanbietern in ${city.name}: Swisscom, Sunrise, Salt, UPC und allen anderen. Es ist keine spezielle Konfiguration erforderlich.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'fr'
                  ? `Quels appareils puis-je utiliser à ${city.name} ?`
                  : `Welche Geräte kann ich in ${city.name} verwenden?`}
              </h3>
              <p>
                {locale === 'fr'
                  ? `Tous les appareils sont compatibles : Smart TV Samsung, LG et Sony, Amazon Fire Stick, Apple TV, smartphones et tablettes Android/iOS, ordinateurs Windows et Mac, ainsi que les boîtiers MAG et Formuler.`
                  : `Alle Geräte sind kompatibel: Samsung, LG und Sony Smart TV, Amazon Fire Stick, Apple TV, Android/iOS Smartphones und Tablets, Windows und Mac Computer sowie MAG und Formuler Boxen.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'fr'
                  ? `Le replay et la VOD sont-ils inclus à ${city.name} ?`
                  : `Sind Replay und VOD in ${city.name} enthalten?`}
              </h3>
              <p>
                {locale === 'fr'
                  ? `Oui, tous nos abonnements incluent le replay jusqu'à 7 jours, plus de 40'000 films et 17'000 séries en VOD, le guide des programmes (EPG) et les mises à jour automatiques. Ces fonctionnalités sont disponibles partout en Suisse, y compris à ${city.name}.`
                  : `Ja, alle unsere Abonnements beinhalten Replay bis zu 7 Tage, über 40'000 Filme und 17'000 Serien als VOD, den Programmführer (EPG) und automatische Updates. Diese Funktionen sind überall in der Schweiz verfügbar, auch in ${city.name}.`}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">
                {locale === 'fr'
                  ? `Combien de temps prend l'activation à ${city.name} ?`
                  : `Wie lange dauert die Aktivierung in ${city.name}?`}
              </h3>
              <p>
                {locale === 'fr'
                  ? `L'activation se fait en moins de 2 heures après confirmation du paiement, 7 jours sur 7. Vous recevez vos identifiants par email et pouvez commencer à regarder immédiatement.`
                  : `Die Aktivierung erfolgt in weniger als 2 Stunden nach Zahlungsbestätigung, 7 Tage die Woche. Sie erhalten Ihre Zugangsdaten per E-Mail und können sofort loslegen.`}
              </p>
            </div>
          </div>
        </div>

        {/* Other cities cross-links */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-text mb-4">
            {locale === 'fr'
              ? 'IPTV Suisse dans d\'autres villes'
              : 'IPTV Schweiz in anderen Städten'}
          </h2>
          <div className="flex flex-wrap gap-2">
            {ALL_CITY_SLUGS.filter((s) => s !== citySlug).slice(0, 8).map((slug) => {
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
