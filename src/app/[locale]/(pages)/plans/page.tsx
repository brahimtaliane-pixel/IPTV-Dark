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
import { SITE_CONFIG, PRICE_CURRENCY, SCHEMA_PRICE_VALID_UNTIL } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { localeUrl, formatPrice, getMonthlyPrice, getDiscount } from '@/lib/utils';
import { BreadcrumbSchema, FAQSchema } from '@/components/seo/SchemaMarkup';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  const title = `IPTV Nederland abonnementen — alle HD/4K-pakketten vanaf 35,99 ${PRICE_CURRENCY}`;
  const description =
    'Alle IPTV Nederland-pakketten op een rij: 1, 2, 3 of 4 schermen, looptijd 3, 6 of 12 maanden. 30.000+ zenders HD/4K, 170.000+ films en series on demand, 7 dagen replay. Activering binnen 2 uur.';

  const plansUrl = `${SITE_CONFIG.url}/plans`;

  return {
    title,
    description,
    keywords: [
      'iptv nederland abonnement',
      'iptv nederland pakket',
      'iptv abonnement nederland',
      'iptv prijzen nederland',
      'goedkoopste iptv nederland',
      'iptv 4k nederland',
      'iptv multi scherm',
    ],
    openGraph: {
      title,
      description,
      url: plansUrl,
      siteName: SITE_CONFIG.name,
      locale: 'nl_NL',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    alternates: {
      canonical: plansUrl,
      languages: {
        'nl-NL': plansUrl,
        'x-default': plansUrl,
      },
    },
  };
}

const DEVICE_LABELS: Record<number, string> = {
  1: '1 scherm',
  2: '2 schermen',
  3: '3 schermen',
  4: '4 schermen',
};

const DEVICE_ICONS: Record<number, typeof Tv> = {
  1: Tv,
  2: Users,
  3: Home,
  4: Monitor,
};

const PAGE_COPY = {
  badge: 'IPTV Nederland — 12 pakketten',
  h1Pre: 'IPTV Nederland —',
  h1Highlight: 'Alle abonnementen',
  intro:
    'Kies het IPTV Nederland-pakket dat bij je past: 1 tot 4 schermen, looptijd 3, 6 of 12 maanden. Toegang tot 30.000+ zenders HD/4K en 170.000+ films en series on demand. Activering binnen 2 uur, support 24/7, geen langlopend contract.',
  trustChannels: '30.000+ zenders HD/4K',
  trustReplay: '7 dagen replay inbegrepen',
  trustNoContract: 'Geen verplichte verlenging',
  trustActivation: 'Activering binnen 2 uur',
  groupTitlePre: 'Pakketten',
  durationLabel: '{count} maanden',
  monthlyPrefix: 'dat is',
  monthlySuffix: ` ${PRICE_CURRENCY} per maand`,
  bestSeller: 'Populair',
  savingsLabel: `je bespaart {amount} ${PRICE_CURRENCY}`,
  viewDetails: 'Bekijk details',
  ctaSection: 'Twijfel je welk pakket je nodig hebt?',
  ctaSectionDesc:
    'Ons team is 24/7 bereikbaar via WhatsApp om je kort en vrijblijvend te adviseren.',
  ctaButton: 'Neem contact op',
  ctaSecondary: 'Naar home',
  faqTitle: 'Veelgestelde vragen over abonnementen',
  faqIntro: 'Wat je wilt weten voordat je een IPTV Nederland-abonnement kiest.',
};

const FAQS_NL = [
  {
    question: 'Wat kosten IPTV-abonnementen?',
    answer:
      `Onze IPTV Nederland-pakketten starten vanaf 35,99 ${PRICE_CURRENCY} voor 3 maanden (1 scherm) tot 179,99 ${PRICE_CURRENCY} voor 12 maanden op 4 schermen. Alles inclusief 30.000+ zenders HD/4K, 170.000+ films en series on demand en 7 dagen replay.`,
  },
  {
    question: 'Wat is het verschil tussen 1, 2, 3 en 4 schermen?',
    answer:
      'Het aantal schermen is het aantal apparaten dat tegelijk kan streamen. 1 scherm voor jezelf, 2 voor een stel, 3–4 voor het gezin. Elk pakket geeft dezelfde zenders en VOD.',
  },
  {
    question: 'Welk pakket heeft de beste prijs-kwaliteit?',
    answer:
      `Het 12-maanden abonnement (1 scherm) voor 59,99 ${PRICE_CURRENCY} is onze meest gekozen optie — rond 5 ${PRICE_CURRENCY} per maand. Voor gezinnen is 2 schermen / 12 maanden (89,99 ${PRICE_CURRENCY}) vaak de beste deal op jaarbasis.`,
  },
  {
    question: 'Is er een contract of automatische verlenging?',
    answer:
      'Nee. Je kiest een vaste looptijd (3, 6 of 12 maanden). Geen automatische incasso: je betaalt voor de gekozen periode en geniet tot die datum van het abonnement.',
  },
  {
    question: 'Hoe snel kan ik kijken na betaling?',
    answer:
      'Meestal binnen 2 uur na betaling. Je ontvangt je gegevens per e-mail met een korte installatiegids voor je apparaat (Smart TV, Fire Stick, MAG, telefoon, enz.).',
  },
];

export default async function PlansHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pt = await getTranslations('pricing');
  const PLANS = await getPlans();

  const deviceGroups = [1, 2, 3, 4].map((d) => ({
    devices: d,
    plans: PLANS.filter((p) => p.devices === d)
      .slice()
      .sort((a, b) => a.duration - b.duration),
  }));

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'IPTV Nederland abonnementen',
    numberOfItems: PLANS.length,
    itemListElement: PLANS.map((plan, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: localeUrl(locale, `/plans/${plan.slug}`),
      name: plan.name_nl,
    })),
  };

  const productSchemas = PLANS.map((plan) => ({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: plan.name_nl,
    description: plan.description_nl,
    image: `${SITE_CONFIG.url}${plan.image}`,
    brand: { '@type': 'Brand', name: SITE_CONFIG.name },
    offers: {
      '@type': 'Offer',
      price: plan.price,
      priceCurrency: PRICE_CURRENCY,
      availability: 'https://schema.org/InStock',
      priceValidUntil: SCHEMA_PRICE_VALID_UNTIL,
      url: localeUrl(locale, `/plans/${plan.slug}`),
      seller: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
      },
    },
  }));

  const copy = PAGE_COPY;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Abonnementen', url: localeUrl(locale, '/plans') },
        ]}
      />
      <FAQSchema faqs={FAQS_NL} />
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

      <section className="relative bg-white pt-32 pb-12 lg:pt-40 lg:pb-16 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-swiss-red/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/5 border border-swiss-red/15 rounded-full mb-6">
            <div
              className="w-6 h-6 nl-flag shrink-0"
              aria-hidden={true}
              suppressHydrationWarning
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

      <section className="py-12 lg:py-16 bg-bg">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 space-y-12">
          {deviceGroups.map((group) => {
            const Icon = DEVICE_ICONS[group.devices];
            const groupLabel = DEVICE_LABELS[group.devices];

            return (
              <div key={group.devices}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-swiss-red/8 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-swiss-red" />
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight">
                    {copy.groupTitlePre} <span className="text-swiss-red">{groupLabel}</span>
                  </h2>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {group.plans.map((plan) => {
                    const name = plan.name_nl;
                    const desc = plan.description_nl;
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

                        <div className="mb-4">
                          <h3 className="text-base font-bold text-text">{name}</h3>
                          <p className="text-xs text-text-muted mt-0.5">
                            {copy.durationLabel.replace('{count}', plan.duration.toString())}
                          </p>
                        </div>

                        <div className="mb-4">
                          {plan.original_price && (
                            <div className="text-sm text-text-muted line-through mb-0.5">
                              {formatPrice(plan.original_price)} {PRICE_CURRENCY}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-extrabold text-text">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-sm font-medium text-text-muted">{PRICE_CURRENCY}</span>
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

                        <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-grow">
                          {desc}
                        </p>

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

      <section className="py-12 bg-white border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: '24 uur garantie',
                desc: 'Niet tevreden? Geld terug',
              },
              {
                icon: Zap,
                title: 'Activering binnen 2 uur',
                desc: 'Na betalingsbevestiging',
              },
              {
                icon: Headphones,
                title: 'Support 24/7',
                desc: 'WhatsApp en e-mail',
              },
              {
                icon: Tv,
                title: 'Alle apparaten',
                desc: 'Smart TV, mobiel, MAG',
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

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3 tracking-tight">
              {copy.faqTitle}
            </h2>
            <p className="text-text-secondary">{copy.faqIntro}</p>
          </div>

          <div className="space-y-3">
            {FAQS_NL.map((faq, i) => (
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
