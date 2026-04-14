'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import {
  MapPin,
  Check,
  ArrowRight,
  Tv,
  Headphones,
  Wifi,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Scale,
  BookOpen,
  HelpCircle,
  Wrench,
  Users,
  Timer,
  Headset,
  ChevronRight,
  Laptop,
  Lightbulb,
  Languages,
  CreditCard,
  Flag,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import BrandMark from '@/components/ui/BrandMark';
import { PRICE_CURRENCY_SYMBOL, SITE_CONFIG, STATS, type SiteStatsSnapshot } from '@/lib/constants';
import type { SitePlan } from '@/lib/get-plans';
import { formatPrice, getDiscount } from '@/lib/utils';
import { NL_CITY_SLUGS_ORDERED } from '@/lib/nl-city-slugs';
import { CITIES_DATA } from '@/lib/cities';

const ISP_NL = ['KPN', 'Ziggo', 'T-Mobile', 'Odido'] as const;

const COMPARISON_ROWS: { label: string; generic: string; us: string }[] = [
  {
    label: 'Zenders & VOD',
    generic: 'Vaak misleidende beloftes; klein aanbod na betaling',
    us: '32.000+ zenders + 175.000+ films en 175.000+ series on demand — zoals beloofd',
  },
  {
    label: 'Support na aankoop',
    generic: 'Geen reactie meer na betalen of alleen via forums',
    us: 'Nederlandstalige support 24/7, ook ná je aankoop',
  },
  {
    label: 'Activering',
    generic: 'Dagen wachten of geen duidelijke status',
    us: 'Meestal binnen 2 uur na betalingsbevestiging',
  },
  {
    label: 'Prijs / kwaliteit',
    generic: 'Verborgen kosten of “lifetime” die niet klopt',
    us: 'Transparante pakketten: 3, 6 of 12 maanden, geen verrassingen',
  },
  {
    label: 'Meerdere schermen',
    generic: 'Extra betalen per stream of onduidelijke regels',
    us: 'Multi-scherm pakketten voor 2–4 gelijktijdige streams',
  },
];

const STEPS = [
  { n: '1', title: 'Kies wat je koopt', desc: 'Looptijd en prijs in één oogopslag — geen kleine lettertjes.' },
  { n: '2', title: 'Betaal veilig', desc: 'Bevestiging per e-mail; je weet dat je order binnen is.' },
  { n: '3', title: 'Ontvang toegang', desc: 'Inloggegevens binnen circa 2 uur na betaling.' },
  { n: '4', title: 'Kijk direct', desc: 'Smart TV, mobiel, Fire Stick, MAG — zelfde account.' },
];

const TOPIC_TAGS = [
  'IPTV kopen',
  'IPTV abonnement kopen',
  'IPTV Dark',
  'goedkoop IPTV',
  'premium IPTV',
  'HD & 4K',
  'Smart TV',
  'Fire TV Stick',
  'abonnement 3 maanden',
  'Replay & VOD',
  'Multi-scherm kopen',
  'veilig IPTV bestellen',
  SITE_CONFIG.domain,
  'EPG',
  'Xtream Codes',
];

const PAGE_NAV = [
  { id: '#vergelijk', label: 'Vergelijking' },
  { id: '#voordelen', label: 'Voordelen' },
  { id: '#starten', label: 'Aan de slag' },
  { id: '#pakketten', label: 'Pakketten' },
  { id: '#installatie', label: 'Installatie' },
  { id: '#faq', label: 'FAQ' },
] as const;

const HERO_HIGHLIGHTS = [
  'Veilig online bestellen',
  'Directe activering',
  '32.000+ zenders',
  'Geen verborgen kosten',
];

export default function IptvKopenClient({
  plans,
  stats,
}: {
  plans: SitePlan[];
  stats: SiteStatsSnapshot;
}) {
  const t = useTranslations('pricing');

  const benefits = [
    'Je koopt bij een vaste aanbieder met duidelijke voorwaarden — geen anonieme tussenpersonen',
    'Eén checkout: kies looptijd (3, 6 of 12 maanden) en weet direct wat je betaalt',
    '32.000+ zenders HD/4K, meer dan 175.000 films en meer dan 175.000 series, replay tot 7 dagen',
    'Activering meestal binnen 2 uur; Nederlandstalige support 24/7',
    'Zelfde abonnement op Smart TV, telefoon, tablet, Fire Stick, MAG en pc',
    'Werkt op KPN, Ziggo, T-Mobile, Odido en andere providers — geen speciale router',
  ];

  const featureCards = [
    {
      icon: Tv,
      title: 'Alles in één pakket',
      desc: 'Van Eredivisie tot internationale zenders en een enorme VOD-bibliotheek.',
    },
    {
      icon: ShieldCheck,
      title: 'Koopt met vertrouwen',
      desc: 'Duidelijke prijzen en geen “lifetime”-verhalen die niet kloppen.',
    },
    {
      icon: Headphones,
      title: 'Hulp na je aankoop',
      desc: 'Installatie of apparaatprobleem? Onze helpdesk staat voor je klaar.',
    },
  ];

  const quickLinks = [
    { href: '/abonnementen' as const, label: 'Alle abonnementen', icon: BookOpen },
    { href: '/iptv-abonnement' as const, label: 'IPTV abonnement', icon: CreditCard },
    { href: '/dutch-iptv' as const, label: 'Dutch IPTV', icon: Languages },
    { href: '/iptv-dark-nederland' as const, label: 'IPTV Dark Nederland', icon: Flag },
    { href: '/multi-scherm' as const, label: 'Multi-scherm', icon: Tv },
    { href: '/faq' as const, label: 'FAQ', icon: HelpCircle },
    { href: '/installation' as const, label: 'Installatie', icon: Wrench },
    { href: '/pandora-iptv' as const, label: 'Pandora IPTV', icon: Sparkles },
  ];

  const trustItems = [
    { icon: Users, label: `${STATS.customers} klanten`, sub: 'In Nederland en daarbuiten' },
    { icon: Timer, label: 'Activering < 2 uur', sub: 'Meestal dezelfde dag' },
    { icon: Headset, label: 'Support 24/7', sub: 'Nederlandstalige helpdesk' },
  ];

  return (
    <section className="relative pt-28 pb-20 bg-bg overflow-hidden">
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[min(100vw,900px)] h-64 bg-gradient-to-b from-swiss-red/[0.07] to-transparent blur-3xl rounded-full"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-32 left-0 w-[min(420px,85vw)] h-[420px] bg-swiss-red/[0.04] rounded-full blur-[100px]"
        aria-hidden
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative">
        <div className="mb-16">
          <nav aria-label="Broodkruimel" className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted mb-4">
            <Link href="/" className="hover:text-swiss-red transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" aria-hidden />
            <span className="text-text font-medium">IPTV kopen</span>
            <span className="hidden sm:inline text-border">·</span>
            <time dateTime="2026-04-12" className="hidden sm:inline text-text-muted/80">
              Bijgewerkt april 2026
            </time>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <BrandMark className="w-10 h-10 sm:w-11 shrink-0" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-swiss-red">{SITE_CONFIG.name}</p>
                <p className="text-xs text-text-muted">{SITE_CONFIG.domain} · Thema</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-swiss-red/25 shadow-sm shadow-black/25">
              <ShoppingCart className="w-3.5 h-3.5 text-swiss-red shrink-0" />
              <span className="text-[11px] font-semibold text-swiss-red uppercase tracking-wide">
                IPTV kopen · Nederland
              </span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-text leading-tight tracking-tight mb-5"
          >
            IPTV kopen — premium abonnement bij {SITE_CONFIG.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary leading-relaxed max-w-3xl mb-6"
          >
            Wil je <strong className="text-text font-semibold">IPTV kopen</strong> zonder gedoe? Op{' '}
            <strong className="text-text font-semibold">{SITE_CONFIG.domain}</strong> bestel je een officieel abonnement met
            32.000+ zenders, meer dan 175.000 films en meer dan 175.000 series on demand, replay en Nederlandstalige support — activering meestal
            binnen 2 uur, op al je apparaten.
          </motion.p>

          <p className="text-sm text-text-muted max-w-3xl mb-8 border-l-2 border-swiss-red/25 pl-4">
            Geen tussenpersonen of onduidelijke “lifetime”-deals: je koopt rechtstreeks bij {SITE_CONFIG.name} met
            transparante pakketten en duidelijke voorwaarden.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3"
          >
            <Link
              href="/abonnementen"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-black font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
            >
              IPTV kopen — bekijk pakketten
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg transition-colors text-sm"
            >
              Stel je vraag
            </Link>
          </motion.div>

          <div className="mt-8 flex flex-wrap gap-2">
            {HERO_HIGHLIGHTS.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg border border-border text-xs font-medium text-text-secondary"
              >
                <Check className="w-3.5 h-3.5 text-success shrink-0" aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-10 rounded-xl border border-dashed border-swiss-red/25 bg-swiss-red/[0.03] p-5 sm:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg bg-swiss-red/10 flex items-center justify-center shrink-0">
              <Lightbulb className="w-4 h-4 text-swiss-red" aria-hidden />
            </div>
            <div>
              <h2 className="text-sm font-bold text-text">Checklist voordat je IPTV koopt</h2>
              <p className="text-xs text-text-muted mt-1">Drie punten die je helpen een betrouwbare aanbieder te kiezen.</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm text-text-secondary">
            <li className="flex gap-2">
              <span className="font-bold text-swiss-red shrink-0">1.</span>
              Kijk of de aanbieder <strong className="text-text font-semibold">bereikbaar blijft na betaling</strong> (e-mail,
              chat, WhatsApp) — niet alleen een eenmalige link.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-swiss-red shrink-0">2.</span>
              Controleer of <strong className="text-text font-semibold">EPG, replay en updates</strong> expliciet inbegrepen zijn.
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-swiss-red shrink-0">3.</span>
              Vermijd aanbiedingen die <strong className="text-text font-semibold">te mooi lijken om waar te zijn</strong> — kwaliteit en support kosten nu eenmaal geld.
            </li>
          </ul>
        </div>

        <div className="mb-10 -mt-2">
          <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Op deze pagina</p>
          <div className="flex flex-wrap gap-2">
            {PAGE_NAV.map(({ id, label }) => (
              <a
                key={id}
                href={id}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-surface text-text-secondary hover:border-swiss-red/35 hover:text-swiss-red transition-colors scroll-mt-28"
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border mb-16">
          {[
            { value: stats.channels, label: 'Zenders' },
            { value: stats.movies, label: 'Films en series' },
            { value: stats.uptime, label: 'Beschikbaarheid' },
            { value: stats.supportHours, label: 'Support' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mb-10 flex flex-wrap gap-2 sm:gap-3">
          <span className="text-xs font-semibold text-text-muted uppercase tracking-wider w-full sm:w-auto sm:mr-2 self-center">
            Snel naar
          </span>
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-border bg-bg/80 text-sm font-medium text-text-secondary hover:border-swiss-red/30 hover:text-swiss-red hover:bg-surface transition-all"
            >
              <Icon className="w-3.5 h-3.5 text-swiss-red shrink-0" aria-hidden />
              {label}
            </Link>
          ))}
        </div>

        <div className="mb-16 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {trustItems.map(({ icon: Icon, label, sub }) => (
            <div
              key={label}
              className="flex items-center gap-4 rounded-xl border border-border bg-gradient-to-br from-bg to-surface px-5 py-4 shadow-sm shadow-black/20"
            >
              <div className="w-11 h-11 rounded-full bg-swiss-red/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-swiss-red" aria-hidden />
              </div>
              <div>
                <div className="text-sm font-bold text-text leading-tight">{label}</div>
                <div className="text-xs text-text-muted mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhancement: comparison */}
        <div
          id="vergelijk"
          className="mb-16 rounded-2xl border border-border bg-gradient-to-b from-bg to-surface overflow-hidden shadow-lg shadow-black/25 scroll-mt-28"
        >
          <div className="px-6 py-5 sm:px-8 border-b border-border bg-surface/80 backdrop-blur-sm flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-swiss-red/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-swiss-red" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-text">IPTV kopen: onbekende sites vs. {SITE_CONFIG.name}</h2>
              <p className="text-sm text-text-muted">Waarom duizenden kiezen voor een premium abonnement bij ons</p>
            </div>
          </div>
          <div className="lg:hidden p-4 sm:p-5 space-y-3 bg-bg/40 border-b border-border">
            {COMPARISON_ROWS.map((row) => (
              <div key={row.label} className="rounded-xl border border-border bg-surface p-4 shadow-sm">
                <div className="text-xs font-bold text-swiss-red uppercase tracking-wide mb-2">{row.label}</div>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-[10px] font-semibold text-text-muted uppercase mb-0.5">Onbekende aanbieders</div>
                    <p className="text-text-secondary">{row.generic}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-swiss-red uppercase mb-0.5">{SITE_CONFIG.name}</div>
                    <p className="text-text flex items-start gap-2">
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                      {row.us}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="overflow-x-auto hidden lg:block">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-bg/80">
                  <th className="text-left py-3 px-4 sm:px-6 font-semibold text-text">Criterium</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-medium text-text-muted">Veel onbekende / te goedkope sites</th>
                  <th className="text-left py-3 px-4 sm:px-6 font-semibold text-swiss-red">{SITE_CONFIG.name}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0 hover:bg-bg/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 font-medium text-text">{row.label}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-text-secondary">{row.generic}</td>
                    <td className="py-3.5 px-4 sm:px-6 text-text">
                      <span className="inline-flex items-start gap-2">
                        <Check className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        {row.us}
                      </span>
                    </td>
                  </tr>
              ))}
            </tbody>
            </table>
          </div>
          <p className="text-xs text-text-muted px-4 sm:px-6 py-3 bg-bg/30 border-t border-border lg:hidden">
            Tip: op desktop zie je het volledige overzicht in één tabel.
          </p>
        </div>

        <div id="voordelen" className="grid lg:grid-cols-2 gap-12 mb-16 scroll-mt-28">
          <div>
            <h2 className="text-2xl font-extrabold text-text mb-6">Voordelen op een rij</h2>
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

        <div className="mb-16 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-swiss-red/10 flex items-center justify-center text-swiss-red font-extrabold text-lg shrink-0">
              “
            </div>
            <blockquote className="flex-1">
              <p className="text-text text-sm sm:text-base leading-relaxed font-medium">
                Ik wilde gewoon IPTV kopen zonder gedoe. Bestellen ging snel, de mail met gegevens kwam dezelfde middag en
                op de Samsung-TV stond alles binnen tien minuten goed.
              </p>
              <footer className="mt-3 text-xs text-text-muted">
                — Sophie L., <span className="text-text-secondary">Rotterdam</span> · tevreden klant
              </footer>
            </blockquote>
          </div>
        </div>

        {/* Enhancement: steps */}
        <div id="starten" className="mb-16 scroll-mt-28">
          <h2 className="text-2xl font-extrabold text-text mb-2 text-center">Van kopen tot kijken</h2>
          <p className="text-text-secondary text-center mb-10 max-w-xl mx-auto text-sm">
            Zo verloopt je bestelling bij ons — transparant van begin tot eind.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative rounded-xl border border-border bg-bg p-5 pt-8"
              >
                <div className="absolute -top-3 left-5 w-9 h-9 rounded-full bg-swiss-red text-black text-sm font-extrabold flex items-center justify-center shadow-md">
                  {step.n}
                </div>
                <h3 className="text-sm font-bold text-text mb-1">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div id="pakketten" className="mb-16 scroll-mt-28">
          <h2 className="text-2xl font-extrabold text-text mb-2">IPTV abonnement kopen — onze pakketten</h2>
          <p className="text-text-secondary mb-8">
            Kies hoe lang je wilt inleggen: 3, 6 of 12 maanden. Na betaling ontvang je je inloggegevens per e-mail om direct
            te starten.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[...plans].sort((a, b) => a.duration - b.duration).map((plan) => {
              const discount = plan.original_price ? getDiscount(plan.original_price, plan.price) : 0;

              return (
                <div
                  key={plan.id}
                  className={`rounded-xl border p-6 transition-all ${
                    plan.is_popular
                      ? 'bg-swiss-red border-swiss-red text-black relative'
                      : 'bg-surface border-border hover:border-swiss-red/20'
                  }`}
                >
                  {plan.is_popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-swiss-red text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {t('popular')}
                    </span>
                  )}
                  <div className="text-sm font-semibold mb-3">{plan.name_nl}</div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-3xl font-extrabold">{formatPrice(plan.price)}</span>
                    <span className="text-sm opacity-80">{PRICE_CURRENCY_SYMBOL}</span>
                    {discount > 0 && (
                      <span
                        className={`text-xs font-bold px-1.5 py-0.5 rounded ml-1 ${plan.is_popular ? 'bg-black/25' : 'bg-success text-white'}`}
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
                    href={`/abonnementen/${plan.slug}`}
                    className={`block text-center py-2.5 rounded-lg font-semibold text-sm transition-colors ${
                      plan.is_popular
                        ? 'bg-black text-swiss-red hover:bg-black/90'
                        : 'bg-swiss-red text-black hover:bg-swiss-red-dark'
                    }`}
                  >
                    {t('cta')}
                  </Link>
                </div>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/abonnementen"
              className="inline-flex items-center gap-2 text-sm font-semibold text-swiss-red hover:underline"
            >
              Alle pakketten vergelijken
              <ArrowRight className="w-4 h-4" />
            </Link>
            <span className="hidden sm:inline text-border">|</span>
            <Link
              href="/multi-scherm"
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-swiss-red transition-colors"
            >
              Multi-scherm voor gezinnen
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div
          id="installatie"
          className="mb-16 rounded-2xl border border-swiss-red/20 bg-gradient-to-br from-bg via-white to-bg p-6 sm:p-8 scroll-mt-28"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-swiss-red mb-2">
                <Laptop className="w-4 h-4" aria-hidden />
                Installatie
              </div>
              <h2 className="text-xl font-extrabold text-text mb-2">Zelf installeren — stap voor stap</h2>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">
                Na activering ontvang je duidelijke instructies. Op onze installatiepagina leggen we uit hoe je {SITE_CONFIG.name}{' '}
                op Smart TV, Fire Stick, telefoon en meer zet — inclusief tips voor de beste beeldkwaliteit.
              </p>
              <Link
                href="/installation"
                className="inline-flex items-center gap-2 text-sm font-bold text-swiss-red hover:underline"
              >
                Open de installatiegids
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="lg:w-56 flex flex-wrap gap-2 justify-start lg:justify-end">
              {['Smart TV', 'Fire TV', 'Android', 'iOS', 'Windows'].map((chip) => (
                <span key={chip} className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-medium text-text-secondary">
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold text-text mb-4 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-swiss-red/8 flex items-center justify-center">
              <Wifi className="w-4 h-4 text-swiss-red" />
            </div>
            Internet in Nederland — geschikt voor IPTV
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            {SITE_CONFIG.name} werkt met de grote providers door heel Nederland. Geen speciale router nodig: vanaf ongeveer
            10 Mbps voor HD en ~25 Mbps voor 4K.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {ISP_NL.map((isp) => (
              <div key={isp} className="bg-surface rounded-lg border border-border p-3 text-center">
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
              <MapPin className="w-4 h-4 text-swiss-red" />
            </div>
            Onderwerpen & zoektermen
          </h2>
          <p className="text-sm text-text-secondary leading-relaxed mb-4">
            Handige labels die passen bij wat bezoekers zoeken rond IPTV en streaming in Nederland:
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPIC_TAGS.map((n) => (
              <span key={n} className="px-3 py-1.5 bg-surface border border-border rounded-full text-sm text-text-secondary">
                {n}
              </span>
            ))}
          </div>
        </div>

        <div id="faq" className="bg-bg rounded-xl border border-border p-6 sm:p-8 mb-16 scroll-mt-28">
          <h2 className="text-xl font-bold text-text mb-6">Veelgestelde vragen — IPTV kopen</h2>
          <div className="space-y-5 text-sm text-text-secondary leading-relaxed">
            <div>
              <h3 className="font-semibold text-text mb-1">Waar kan ik veilig IPTV kopen?</h3>
              <p>
                Bij een aanbieder met duidelijke website, voorwaarden en bereikbare support — zoals {SITE_CONFIG.name} op{' '}
                {SITE_CONFIG.domain}. Vermijd anonieme verkopers zonder herkenbaar bedrijf achter de aanbieding.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Hoe betaal ik mijn IPTV-abonnement?</h3>
              <p>
                Je volgt het bestelproces op de site en ontvangt een bevestiging per e-mail. Exacte betaalopties worden tijdens
                het afrekenen getoond; je krijgt altijd bewijs van je bestelling.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Wat krijg ik precies als ik IPTV koop bij jullie?</h3>
              <p>
                Een actief abonnement met toegang tot 32.000+ zenders, grote VOD-bibliotheek, replay tot 7 dagen, EPG en
                updates — plus Nederlandstalige helpdesk voor vragen na je aankoop.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Hoe snel na betalen kan ik kijken?</h3>
              <p>
                Meestal binnen ongeveer 2 uur na bevestiging van je betaling, 7 dagen per week. Je ontvangt je gegevens per
                e-mail.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Kan ik multi-scherm erbij kopen?</h3>
              <p>
                Ja. Voor meerdere gelijktijdige streams hebben we aparte pakketten. Zie{' '}
                <Link href="/multi-scherm" className="text-swiss-red font-medium hover:underline">
                  Multi-scherm
                </Link>{' '}
                voor opties en prijzen.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-text mb-1">Wat als ik spijt krijg van mijn aankoop?</h3>
              <p>
                We hanteren: niet tevreden — geld terug binnen 24 uur (zie onze algemene voorwaarden). Zo koop je met meer
                zekerheid.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-14 rounded-2xl bg-gradient-to-br from-swiss-red to-swiss-red-dark p-8 sm:p-10 text-center text-black shadow-lg shadow-swiss-red/20">
          <h2 className="text-xl sm:text-2xl font-extrabold mb-2">Klaar om IPTV te kopen?</h2>
          <p className="text-black/80 text-sm sm:text-base max-w-lg mx-auto mb-6">
            Kies je looptijd, rond je bestelling af en begin vandaag nog met kijken — met dezelfde service waar duizenden
            klanten op vertrouwen.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/abonnementen"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-swiss-red font-bold rounded-lg text-sm hover:bg-black/90 transition-colors"
            >
              Bekijk pakketten
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-black/25 text-black font-semibold rounded-lg text-sm hover:bg-black/10 transition-colors"
            >
              Contact opnemen
            </Link>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold text-text mb-4">{SITE_CONFIG.name} in jouw regio</h2>
          <div className="flex flex-wrap gap-2">
            {NL_CITY_SLUGS_ORDERED.slice(0, 8).map((slug) => {
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
