import type { Metadata } from 'next';
import type { LucideIcon } from 'lucide-react';
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
  Server,
  Sparkles,
  Film,
  PlayCircle,
  Smartphone,
} from 'lucide-react';
import {
  SITE_CONFIG,
  PRICE_CURRENCY_SYMBOL,
  STATS,
} from '@/lib/constants';
import { getPlans, type SitePlan } from '@/lib/get-plans';
import { localeUrl, formatPrice, getMonthlyPrice, getDiscount } from '@/lib/utils';
import {
  BreadcrumbSchema,
  BrandedWebPageSchema,
  FAQSchema,
  PlansHubSchema,
} from '@/components/seo/SchemaMarkup';
import BrandMark from '@/components/ui/BrandMark';

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = 'force-dynamic';

const PLANS_HUB_PAGE_TITLE = `IPTV Dark abonnementen — alle HD/4K-pakketten vanaf 35,99 ${PRICE_CURRENCY_SYMBOL}`;
const PLANS_HUB_PAGE_DESCRIPTION =
  'Alle IPTV Dark-pakketten op een rij: 1, 2, 3 of 4 schermen, looptijd 3, 6 of 12 maanden. 32.000+ zenders HD/4K, meer dan 175.000 films en meer dan 175.000 series on demand, 7 dagen replay. Activering binnen 2 uur.';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;

  const title = PLANS_HUB_PAGE_TITLE;
  const description = PLANS_HUB_PAGE_DESCRIPTION;

  const plansUrl = `${SITE_CONFIG.url}/abonnementen`;

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
  badge: 'Prijzen & pakketten',
  h1Pre: 'Alle',
  h1Highlight: 'IPTV Dark-abonnementen',
  intro:
    'Eén premiumdienst — jij kiest hoeveel schermen je tegelijk gebruikt (1–4) en hoelang je vooruitbetaalt (3, 6 of 12 maanden). Overal 32.000+ zenders, meer dan 175.000 films en meer dan 175.000 series on demand, replay en geen automatische verlenging.',
  trustChannels: '32.000+ zenders HD/4K',
  trustReplay: '7 dagen replay inbegrepen',
  trustNoContract: 'Geen verplichte verlenging',
  trustActivation: 'Activering binnen 2 uur',
  includedTitle: 'Volledig aanbod in elk pakket',
  includedSubtitle:
    'Of je nu 3 maanden of 12 maanden kiest — de inhoud blijft hetzelfde. Alleen het aantal gelijktijdige schermen en de looptijd verschillen.',
  ctaScroll: 'Naar alle pakketten',
  ctaAdvice: 'Persoonlijk advies',
  groupTitlePre: 'Pakketten',
  durationLabel: '{count} maanden',
  monthlyPrefix: 'dat is',
  monthlySuffix: ` ${PRICE_CURRENCY_SYMBOL} per maand`,
  bestSeller: 'Populair',
  savingsLabel: `je bespaart {amount} ${PRICE_CURRENCY_SYMBOL}`,
  viewDetails: 'Bekijk details',
  ctaSection: 'Twijfel je welk pakket je nodig hebt?',
  ctaSectionDesc:
    'Ons team is 24/7 bereikbaar via WhatsApp om je kort en vrijblijvend te adviseren.',
  ctaButton: 'Neem contact op',
  ctaSecondary: 'Naar home',
  faqTitle: 'Veelgestelde vragen over abonnementen',
  faqIntro: 'Wat je wilt weten voordat je een IPTV Dark-abonnement kiest.',
};

const INCLUDED_HIGHLIGHTS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Server,
    title: 'Premium servers',
    desc: 'Stabiele streams en korte buffer — ook tijdens drukke avonden.',
  },
  {
    icon: Tv,
    title: '32.000+ zenders',
    desc: 'Nederlandse, Belgische en internationale zenders in HD en 4K.',
  },
  {
    icon: Sparkles,
    title: 'Ultra HD & 4K',
    desc: 'Scherp beeld op Smart TV, box, tablet en telefoon.',
  },
  {
    icon: PlayCircle,
    title: 'Replay & EPG',
    desc: 'Tot 7 dagen terugkijken met overzichtelijke TV-gids.',
  },
  {
    icon: Film,
    title: 'Films & series on demand',
    desc: 'Meer dan 175.000 films en meer dan 175.000 series in de bibliotheek.',
  },
  {
    icon: Smartphone,
    title: 'Alle gangbare apparaten',
    desc: 'Van Samsung & LG tot Fire Stick, MAG, Android en iOS.',
  },
];

/** FAQ copy on /abonnementen — prijzen uit actieve plannen zodat ze overeenkomen met de kaarten op de pagina. */
function buildPlansPageFaqs(plans: SitePlan[], sym: string): { question: string; answer: string }[] {
  const active = plans.filter((p) => p.is_active);
  const pick = (devices: number, duration: number) => {
    const m = active.filter((p) => p.devices === devices && p.duration === duration);
    return m.find((p) => p.is_popular) ?? m[0];
  };
  const p12_1 = pick(1, 12);
  const p12_2 = pick(2, 12);

  let valueAnswer: string;
  if (p12_1 && p12_2) {
    const m1 = getMonthlyPrice(p12_1.price, p12_1.duration);
    valueAnswer = `Het 12-maanden abonnement (1 scherm) voor ${formatPrice(p12_1.price)} ${sym} wordt veel gekozen — rond ${m1} ${sym} per maand. Voor gezinnen is 2 schermen / 12 maanden (${formatPrice(p12_2.price)} ${sym}) vaak een sterke deal op jaarbasis.`;
  } else if (p12_1) {
    const m1 = getMonthlyPrice(p12_1.price, p12_1.duration);
    valueAnswer = `Het 12-maanden abonnement (1 scherm) voor ${formatPrice(p12_1.price)} ${sym} wordt veel gekozen — rond ${m1} ${sym} per maand. Bekijk hierboven alle pakketten voor meer schermen en looptijden.`;
  } else {
    valueAnswer =
      'De beste keuze hangt af van hoeveel schermen je tegelijk gebruikt en hoe lang je wilt vooruitbetalen. Vergelijk de pakketten op deze pagina — “Populair” markeert wat klanten vaak kiezen.';
  }

  return [
    {
      question: 'Wat is het verschil tussen 1, 2, 3 en 4 schermen?',
      answer:
        'Het aantal schermen is het aantal apparaten dat tegelijk kan streamen. 1 scherm voor jezelf, 2 voor een stel, 3–4 voor het gezin. Elk pakket geeft dezelfde zenders en VOD.',
    },
    {
      question: 'Welk pakket heeft de beste prijs-kwaliteit?',
      answer: valueAnswer,
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
}

export default async function PlansHubPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const pt = await getTranslations('pricing');
  const PLANS = await getPlans();
  const planFaqs = buildPlansPageFaqs(PLANS, PRICE_CURRENCY_SYMBOL);

  const deviceGroups = [1, 2, 3, 4].map((d) => ({
    devices: d,
    plans: PLANS.filter((p) => p.devices === d)
      .slice()
      .sort((a, b) => a.duration - b.duration),
  }));

  const copy = PAGE_COPY;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', url: localeUrl(locale) },
          { name: 'Abonnementen', url: localeUrl(locale, '/abonnementen') },
        ]}
      />
      <BrandedWebPageSchema
        locale={locale}
        path="/abonnementen"
        title={PLANS_HUB_PAGE_TITLE}
        description={PLANS_HUB_PAGE_DESCRIPTION}
      />
      <FAQSchema faqs={planFaqs} />
      <PlansHubSchema locale={locale} plans={PLANS} />

      <section className="relative bg-bg pt-28 pb-16 lg:pt-36 lg:pb-20 overflow-hidden border-b border-border">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute -top-32 -right-24 w-[min(520px,90vw)] h-[520px] bg-swiss-red/[0.07] rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-1/4 w-[340px] h-[340px] bg-swiss-red/[0.03] rounded-full blur-[80px]" />
        </div>

        <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-surface border border-swiss-red/25 rounded-full mb-6">
                <BrandMark className="w-6 h-6 shrink-0" />
                <span className="text-[11px] sm:text-xs font-semibold text-swiss-red tracking-wide uppercase">
                  {copy.badge}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold leading-[1.06] tracking-tight text-text mb-5">
                <span className="text-text">{copy.h1Pre}</span>{' '}
                <span className="text-swiss-red">{copy.h1Highlight}</span>
              </h1>

              <p className="text-base sm:text-lg text-text-secondary leading-relaxed mb-8 max-w-xl">
                {copy.intro}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <Link
                  href="#pakketten"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-swiss-red text-black font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
                >
                  {copy.ctaScroll}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-surface transition-colors text-sm"
                >
                  {copy.ctaAdvice}
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[copy.trustChannels, copy.trustReplay, copy.trustNoContract, copy.trustActivation].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2.5 rounded-xl bg-surface border border-border px-3.5 py-3 text-xs sm:text-sm text-text-secondary"
                    >
                      <Check className="w-4 h-4 text-success shrink-0" strokeWidth={2.5} />
                      <span className="leading-snug">{item}</span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl border border-border bg-surface/90 backdrop-blur-sm p-6 sm:p-8 shadow-xl shadow-black/40">
                <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-4">
                  Waarom IPTV Dark
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Zenders', value: STATS.channels },
                    { label: 'Films (VOD)', value: STATS.movies },
                    { label: 'Series (VOD)', value: STATS.series },
                    { label: 'Beschikbaarheid', value: STATS.uptime },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="rounded-xl bg-bg border border-border/80 px-4 py-4 text-center"
                    >
                      <div className="text-xl sm:text-2xl font-extrabold text-swiss-red tabular-nums">
                        {s.value}
                      </div>
                      <div className="text-[10px] sm:text-xs text-text-muted mt-1 uppercase tracking-wide">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-text-muted mt-5 leading-relaxed">
                  Zelfde catalogus in elk abonnement — je betaalt alleen voor schermen en looptijd.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pakketten" className="py-12 lg:py-16 bg-bg">
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
                        className={`relative rounded-xl p-6 flex flex-col bg-surface border transition-all duration-300 hover:-translate-y-1 ${
                          isPopular
                            ? 'border-swiss-red/40 shadow-lg shadow-swiss-red/10'
                            : 'border-border hover:border-swiss-red/20'
                        }`}
                      >
                        {isPopular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-swiss-red text-black text-[11px] font-bold rounded-full uppercase tracking-wide shadow-sm">
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
                              {formatPrice(plan.original_price)} {PRICE_CURRENCY_SYMBOL}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-3xl font-extrabold text-text">
                              {formatPrice(plan.price)}
                            </span>
                            <span className="text-sm font-medium text-text-muted">{PRICE_CURRENCY_SYMBOL}</span>
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
                          href={`/abonnementen/${plan.slug}`}
                          className={`block text-center py-3 rounded-lg font-semibold text-sm transition-colors ${
                            isPopular
                              ? 'bg-swiss-red text-black hover:bg-swiss-red-dark'
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

      <section className="py-14 lg:py-16 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text tracking-tight mb-3">
              {copy.includedTitle}
            </h2>
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
              {copy.includedSubtitle}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {INCLUDED_HIGHLIGHTS.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-bg p-5 sm:p-6 hover:border-swiss-red/25 transition-colors"
              >
                <div className="w-11 h-11 rounded-xl bg-swiss-red/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-swiss-red" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text mb-1.5">{title}</h3>
                  <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-bg border-y border-border">
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
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-black font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              {copy.ctaButton}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-surface transition-colors text-sm"
            >
              {copy.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-text mb-3 tracking-tight">
              {copy.faqTitle}
            </h2>
            <p className="text-text-secondary">{copy.faqIntro}</p>
          </div>

          <div className="space-y-3">
            {planFaqs.map((faq, i) => (
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
