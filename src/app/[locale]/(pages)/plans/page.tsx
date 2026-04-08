import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  Check,
  ArrowRight,
  Tv,
  Monitor,
  Users,
  Home,
  Shield,
  Zap,
  Headphones,
  Star,
} from 'lucide-react';
import { SITE_CONFIG, PLANS } from '@/lib/constants';
import { localeUrl, formatPrice, getMonthlyPrice, getDiscount } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';

type Props = {
  params: Promise<{ locale: string }>;
};

// Hardcoded so SSR output stays deterministic — bump quarterly.
const PRICE_VALID_UNTIL = '2026-12-31';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  const title = isFr
    ? 'Abonnement IPTV Suisse — Tous nos forfaits HD/4K dès 35.99 CHF'
    : 'IPTV Schweiz Abo — Alle HD/4K-Pakete ab 35.99 CHF';

  const description = isFr
    ? "Tous les abonnements IPTV Suisse en un coup d'œil : 1, 2, 3 ou 4 écrans, durées 3/6/12 mois. 37 000+ chaînes HD/4K, 40 000 films, replay 7 jours. Activation en 2h."
    : 'Alle IPTV Schweiz Abos auf einen Blick: 1, 2, 3 oder 4 Bildschirme, Laufzeiten 3/6/12 Monate. 37 000+ HD/4K-Kanäle, 40 000 Filme, 7 Tage Replay. Aktivierung in 2h.';

  return {
    title,
    description,
    keywords: isFr
      ? [
          'abonnement iptv suisse',
          'iptv suisse',
          'forfait iptv suisse',
          'iptv abonnement',
          'tarif iptv suisse',
          'iptv suisse pas cher',
          'prix iptv suisse',
          'meilleur abonnement iptv suisse',
        ]
      : [
          'iptv schweiz abo',
          'iptv schweiz',
          'iptv abo schweiz',
          'iptv abonnement schweiz',
          'iptv schweiz preise',
          'iptv schweiz günstig',
          'bestes iptv schweiz abo',
          'iptv paket schweiz',
        ],
    openGraph: {
      title,
      description,
      url: locale === 'fr' ? `${SITE_CONFIG.url}/plans` : `${SITE_CONFIG.url}/de/plans`,
      siteName: SITE_CONFIG.name,
      locale: isFr ? 'fr_CH' : 'de_CH',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: locale === 'fr' ? `${SITE_CONFIG.url}/plans` : `${SITE_CONFIG.url}/de/plans`,
      languages: {
        'fr-CH': `${SITE_CONFIG.url}/plans`,
        'de-CH': `${SITE_CONFIG.url}/de/plans`,
        'x-default': `${SITE_CONFIG.url}/plans`,
      },
    },
  };
}

const DEVICE_LABELS: Record<number, { fr: string; de: string }> = {
  1: { fr: '1 Écran', de: '1 Bildschirm' },
  2: { fr: '2 Écrans', de: '2 Bildschirme' },
  3: { fr: '3 Écrans', de: '3 Bildschirme' },
  4: { fr: '4 Écrans', de: '4 Bildschirme' },
};

const DEVICE_ICONS: Record<number, typeof Tv> = {
  1: Tv,
  2: Users,
  3: Home,
  4: Monitor,
};

export default async function PlansHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pt = await getTranslations('pricing');
  const isFr = locale === 'fr';

  // Group plans by device count
  const deviceGroups = [1, 2, 3, 4].map((d) => ({
    devices: d,
    plans: PLANS.filter((p) => p.devices === d).slice().sort((a, b) => a.duration - b.duration),
  }));

  // ── Schemas ───────────────────────────────────────────────
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: isFr ? 'Abonnements IPTV Suisse' : 'IPTV Schweiz Abos',
    numberOfItems: PLANS.length,
    itemListElement: PLANS.map((plan, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localeUrl(locale, `/plans/${plan.slug}`),
      name: isFr ? plan.name_fr : plan.name_de,
    })),
  };

  const productSchemas = PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: isFr ? plan.name_fr : plan.name_de,
    description: isFr ? plan.description_fr : plan.description_de,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: { '@type': 'Brand', name: SITE_CONFIG.name },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: 'CHF',
      availability: 'https://schema.org/InStock',
      priceValidUntil: PRICE_VALID_UNTIL,
      url: localeUrl(locale, `/plans/${plan.slug}`),
    },
  }));

  const faqs = isFr
    ? [
        {
          question: 'Quels sont les prix des abonnements IPTV en Suisse ?',
          answer:
            "Nos abonnements IPTV Suisse débutent à 35.99 CHF pour 3 mois (1 écran) et vont jusqu'à 179.99 CHF pour 12 mois sur 4 écrans. Tous incluent 37 000+ chaînes HD/4K, 40 000+ films, 17 000+ séries et le replay 7 jours.",
        },
        {
          question: 'Quelle est la différence entre les forfaits 1, 2, 3 et 4 écrans ?',
          answer:
            "Le nombre d'écrans correspond au nombre d'appareils pouvant streamer simultanément. 1 écran convient à un usage individuel, 2 écrans à un couple, 3-4 écrans à toute la famille. Tous les forfaits donnent accès au même catalogue de chaînes et de VOD.",
        },
        {
          question: 'Quel forfait offre le meilleur rapport qualité-prix ?',
          answer:
            "L'abonnement IPTV 12 mois (1 écran) à 59.99 CHF est notre best-seller — soit environ 5 CHF par mois. Pour les familles, le forfait 2 écrans 12 mois à 89.99 CHF offre la meilleure économie sur l'année.",
        },
        {
          question: 'Y a-t-il un engagement ou un renouvellement automatique ?',
          answer:
            'Aucun engagement. Vos abonnements sont à durée fixe (3, 6 ou 12 mois) et ne se renouvellent pas automatiquement. Vous payez une seule fois et profitez du service jusqu\'à la fin de la période choisie.',
        },
        {
          question: 'Combien de temps après le paiement puis-je commencer à regarder ?',
          answer:
            "L'activation se fait en moins de 2 heures après confirmation du paiement. Vous recevez vos identifiants par email avec un guide d'installation pour votre appareil (Smart TV, Fire Stick, MAG, mobile, etc.).",
        },
      ]
    : [
        {
          question: 'Was kosten IPTV-Abos in der Schweiz?',
          answer:
            'Unsere IPTV Schweiz Abos beginnen bei 35.99 CHF für 3 Monate (1 Bildschirm) und reichen bis 179.99 CHF für 12 Monate auf 4 Bildschirmen. Alle enthalten 37 000+ HD/4K-Kanäle, 40 000+ Filme, 17 000+ Serien und 7 Tage Replay.',
        },
        {
          question: 'Was ist der Unterschied zwischen 1, 2, 3 und 4 Bildschirmen?',
          answer:
            'Die Anzahl der Bildschirme entspricht der Anzahl der Geräte, die gleichzeitig streamen können. 1 Bildschirm für die Einzelnutzung, 2 für ein Paar, 3-4 für die ganze Familie. Alle Pakete bieten Zugang zum gleichen Katalog an Kanälen und VOD.',
        },
        {
          question: 'Welches Paket bietet das beste Preis-Leistungs-Verhältnis?',
          answer:
            'Das IPTV Abo 12 Monate (1 Bildschirm) für 59.99 CHF ist unser Bestseller — also rund 5 CHF pro Monat. Für Familien bietet das 2-Bildschirme-Paket 12 Monate für 89.99 CHF die grösste Ersparnis aufs Jahr gerechnet.',
        },
        {
          question: 'Gibt es eine Vertragsbindung oder automatische Verlängerung?',
          answer:
            'Keine Vertragsbindung. Ihre Abonnements haben eine feste Laufzeit (3, 6 oder 12 Monate) und verlängern sich nicht automatisch. Sie zahlen einmal und nutzen den Service bis zum Ende der gewählten Periode.',
        },
        {
          question: 'Wie lange nach der Zahlung kann ich mit dem Schauen beginnen?',
          answer:
            'Die Aktivierung erfolgt in weniger als 2 Stunden nach Zahlungsbestätigung. Sie erhalten Ihre Zugangsdaten per E-Mail mit einer Installationsanleitung für Ihr Gerät (Smart TV, Fire Stick, MAG, Mobile, usw.).',
        },
      ];

  // ── Copy ──────────────────────────────────────────────────
  const copy = isFr
    ? {
        badge: 'IPTV Suisse — 12 forfaits',
        h1Pre: 'Abonnement IPTV Suisse —',
        h1Highlight: 'Tous nos forfaits',
        intro:
          "Choisissez l'abonnement IPTV Suisse qui vous convient : 1 à 4 écrans, durées de 3, 6 ou 12 mois. Accès à 37 000+ chaînes HD/4K, 40 000+ films et 17 000+ séries. Activation en 2h, support 24/7, sans engagement.",
        trustChannels: '37 000+ chaînes HD/4K',
        trustReplay: 'Replay 7 jours inclus',
        trustNoContract: 'Sans engagement',
        trustActivation: 'Activation en 2h',
        groupTitlePre: 'Forfaits',
        durationLabel: '{count} mois',
        monthlyPrefix: 'soit',
        monthlySuffix: ' CHF/mois',
        bestSeller: 'Best-seller',
        savingsLabel: 'vous économisez {amount} CHF',
        viewDetails: 'Voir les détails',
        ctaSection: 'Pas sûr du forfait à choisir ?',
        ctaSectionDesc:
          "Notre support francophone est disponible 24/7 par WhatsApp pour vous conseiller en quelques minutes — gratuitement et sans engagement.",
        ctaButton: 'Contacter le support',
        ctaSecondary: "Voir l'accueil",
        faqTitle: 'Questions fréquentes sur les abonnements',
        faqIntro:
          "Tout ce que vous devez savoir avant de choisir votre abonnement IPTV Suisse.",
      }
    : {
        badge: 'IPTV Schweiz — 12 Pakete',
        h1Pre: 'IPTV Schweiz Abo —',
        h1Highlight: 'Alle Pakete',
        intro:
          'Wählen Sie das IPTV Schweiz Abo, das zu Ihnen passt: 1 bis 4 Bildschirme, Laufzeiten von 3, 6 oder 12 Monaten. Zugang zu 37 000+ HD/4K-Kanälen, 40 000+ Filmen und 17 000+ Serien. Aktivierung in 2h, 24/7 Support, ohne Vertragsbindung.',
        trustChannels: '37 000+ HD/4K-Kanäle',
        trustReplay: '7 Tage Replay inklusive',
        trustNoContract: 'Ohne Vertragsbindung',
        trustActivation: 'Aktivierung in 2h',
        groupTitlePre: 'Pakete',
        durationLabel: '{count} Monate',
        monthlyPrefix: 'das sind',
        monthlySuffix: ' CHF/Monat',
        bestSeller: 'Bestseller',
        savingsLabel: 'Sie sparen {amount} CHF',
        viewDetails: 'Details ansehen',
        ctaSection: 'Unsicher, welches Paket Sie wählen sollen?',
        ctaSectionDesc:
          'Unser deutschsprachiger Support ist 24/7 per WhatsApp erreichbar und berät Sie in wenigen Minuten — kostenlos und unverbindlich.',
        ctaButton: 'Support kontaktieren',
        ctaSecondary: 'Zur Startseite',
        faqTitle: 'Häufig gestellte Fragen zu den Abos',
        faqIntro: 'Alles, was Sie vor der Wahl Ihres IPTV Schweiz Abos wissen müssen.',
      };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: isFr ? 'Accueil' : 'Startseite', url: localeUrl(locale) },
          {
            name: isFr ? 'Abonnements' : 'Abonnements',
            url: localeUrl(locale, '/plans'),
          },
        ]}
      />
      <FAQSchema faqs={faqs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      {productSchemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ═══════════════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════════════ */}
      <section className="relative bg-white pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-swiss-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/5 border border-swiss-red/15 rounded-full mb-6">
            <div
              className="w-6 h-6 bg-swiss-red rounded swiss-cross flex-shrink-0"
              style={{ fontSize: 0 }}
            />
            <span className="text-xs font-semibold text-swiss-red tracking-wide uppercase">
              {copy.badge}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text mb-6 max-w-4xl">
            {copy.h1Pre} <span className="text-swiss-red">{copy.h1Highlight}</span>
          </h1>

          <p className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-8">
            {copy.intro}
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-text-secondary">
            {[copy.trustChannels, copy.trustReplay, copy.trustNoContract, copy.trustActivation].map(
              (item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-success shrink-0" />
                  <span>{item}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          2. PLANS GRID — grouped by device count
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 lg:py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          {deviceGroups.map((group) => {
            const Icon = DEVICE_ICONS[group.devices];
            const groupLabel = isFr
              ? DEVICE_LABELS[group.devices].fr
              : DEVICE_LABELS[group.devices].de;

            return (
              <div key={group.devices}>
                {/* Group header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-swiss-red/8 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-swiss-red" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                    {copy.groupTitlePre} <span className="text-swiss-red">{groupLabel}</span>
                  </h2>
                </div>

                {/* Plans row */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.plans.map((plan) => {
                    const name = isFr ? plan.name_fr : plan.name_de;
                    const desc = isFr ? plan.description_fr : plan.description_de;
                    const discount = plan.original_price
                      ? getDiscount(plan.original_price, plan.price)
                      : 0;
                    const savings = plan.original_price
                      ? (plan.original_price - plan.price).toFixed(2)
                      : '0';
                    const monthly = getMonthlyPrice(plan.price, plan.duration);
                    const isPopular = plan.is_popular;

                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-xl p-6 flex flex-col bg-white border transition-all duration-300 hover:-translate-y-1 ${
                          isPopular
                            ? 'border-swiss-red/40 shadow-lg shadow-swiss-red/10'
                            : 'border-border hover:border-swiss-red/20'
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-swiss-red text-white text-[11px] font-bold rounded-full uppercase tracking-wide shadow-sm">
                              <Star className="w-3 h-3 fill-current" />
                              {copy.bestSeller}
                            </span>
                          </div>
                        )}

                        {/* Name + duration */}
                        <div className="mb-4">
                          <h3 className="text-base font-bold text-text">{name}</h3>
                          <p className="text-xs text-text-muted mt-0.5">
                            {copy.durationLabel.replace('{count}', plan.duration.toString())}
                          </p>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          {plan.original_price && (
                            <div className="text-sm text-text-muted line-through mb-0.5">
                              {formatPrice(plan.original_price)} CHF
                            </div>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-extrabold text-text">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-sm font-medium text-text-muted">CHF</span>
                            {discount > 0 && (
                              <span className="ml-1 bg-success text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                                -{discount}%
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-muted mt-1">
                            {copy.monthlyPrefix} {monthly}
                            {copy.monthlySuffix}
                          </div>
                          {plan.original_price && (
                            <div className="text-xs text-success mt-1 font-medium">
                              {copy.savingsLabel.replace('{amount}', savings)}
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-grow">
                          {desc}
                        </p>

                        {/* Features (compact) */}
                        <ul className="space-y-2 mb-6">
                          {plan.features.slice(0, 4).map((f) => (
                            <li key={f} className="flex items-start gap-2">
                              <Check className="w-4 h-4 mt-0.5 shrink-0 text-swiss-red" />
                              <span className="text-xs text-text-secondary">
                                {pt(`features.${f}`)}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA */}
                        <Link
                          href={`/plans/${plan.slug}`}
                          className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                            isPopular
                              ? 'bg-swiss-red text-white hover:bg-swiss-red-dark'
                              : 'bg-bg border border-border text-text hover:border-swiss-red/30 hover:text-swiss-red'
                          }`}
                        >
                          {copy.viewDetails}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          3. TRUST BAR
      ═══════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: isFr ? 'Garantie 24h' : '24h Garantie',
                desc: isFr ? 'Satisfait ou remboursé' : 'Zufrieden oder Geld zurück',
              },
              {
                icon: Zap,
                title: isFr ? 'Activation 2h' : 'Aktivierung 2h',
                desc: isFr ? 'Après confirmation' : 'Nach Bestätigung',
              },
              {
                icon: Headphones,
                title: isFr ? 'Support 24/7' : '24/7 Support',
                desc: isFr ? 'WhatsApp & email' : 'WhatsApp & E-Mail',
              },
              {
                icon: Tv,
                title: isFr ? 'Tous appareils' : 'Alle Geräte',
                desc: isFr ? 'Smart TV, mobile, MAG' : 'Smart TV, Mobile, MAG',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-swiss-red" />
                </div>
                <div>
                  <div className="text-sm font-bold text-text">{item.title}</div>
                  <div className="text-xs text-text-muted">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          4. CTA SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-bg">
        <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3 tracking-tight">
            {copy.ctaSection}
          </h2>
          <p className="text-text-secondary mb-7 max-w-2xl mx-auto">{copy.ctaSectionDesc}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              {copy.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-white transition-colors text-sm"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          5. FAQ
      ═══════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3 tracking-tight">
              {copy.faqTitle}
            </h2>
            <p className="text-text-secondary">{copy.faqIntro}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details
                key={i}
                className="group bg-bg rounded-xl border border-border overflow-hidden hover:border-swiss-red/20 transition-colors"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                  <span className="text-sm sm:text-base font-medium text-text group-open:text-swiss-red transition-colors">
                    {faq.question}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-swiss-red/8 flex items-center justify-center shrink-0 transition-transform group-open:rotate-45">
                    <span className="text-swiss-red text-lg leading-none">+</span>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed border-t border-border/50">
                  <div className="pt-4">{faq.answer}</div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
