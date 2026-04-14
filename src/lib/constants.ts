// ============================================================
// IPTV Dark - Constants & Configuration
// ============================================================

/** Production default when `NEXT_PUBLIC_SITE_URL` is not set at build time (apex host, no `www.`). */
const DEFAULT_PUBLIC_ORIGIN = 'https://iptvdark4k.nl';

/**
 * Public site origin for canonical URLs, JSON-LD, metadata.
 * - Set `NEXT_PUBLIC_SITE_URL` in `.env.local` to match what you open in the browser
 *   (e.g. `http://localhost:3000` or `https://iptvdark4k.local`).
 * - In `next dev`, if unset, defaults to `http://localhost:<PORT>` so local preview
 *   is not stuck on the production hostname.
 * - If the URL host is `www.example.com`, the origin is normalized to `https://example.com`
 *   so `SITE_CONFIG.url` and `SITE_CONFIG.domain` stay consistent (apex for this project).
 */
function resolvePublicOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      /* fall through */
    }
  }
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || '3000';
    return `http://localhost:${port}`;
  }
  return DEFAULT_PUBLIC_ORIGIN;
}

/** Use apex hostname in canonical origin (localhost / non-www unchanged). */
function originWithoutWwwPrefix(origin: string): string {
  try {
    const u = new URL(origin);
    if (/^www\./i.test(u.hostname)) {
      u.hostname = u.hostname.slice(4);
      return u.origin;
    }
  } catch {
    /* ignore */
  }
  return origin;
}

function hostnameFromOrigin(origin: string): string {
  try {
    return new URL(origin).hostname;
  } catch {
    return 'iptvdark4k.nl';
  }
}

const _publicOrigin = originWithoutWwwPrefix(resolvePublicOrigin());
const _publicHost = hostnameFromOrigin(_publicOrigin);
/** Apex / registrable domain for `contact@` and From headers (strip `www.` when origin is www). */
const _publicDomain = _publicHost.replace(/^www\./i, '') || _publicHost;
const _contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || `contact@${_publicDomain}`;

export const SITE_CONFIG = {
  name: 'IPTV Dark',
  domain: _publicDomain,
  url: _publicOrigin,
  email: _contactEmail,
  // TODO: Replace with real phone number before go-live
  phone: '+31 XX XXX XX XX',
  // TODO: Replace with real WhatsApp number before go-live
  whatsapp: 'https://wa.me/31XXXXXXXXX',
  defaultLocale: 'nl' as const,
  locales: ['nl'] as const,
} as const;

/** ISO 4217 — JSON-LD `priceCurrency`, APIs, structured data (keep as `EUR`) */
export const PRICE_CURRENCY = 'EUR' as const;

/** Euro sign for on-page UI, emails, and human-readable meta text */
export const PRICE_CURRENCY_SYMBOL = '€' as const;

/** Schema.org LocalBusiness `priceRange` (display string) */
export const SCHEMA_PRICE_RANGE = '€ 35.99 - € 179.99' as const;

/**
 * JSON-LD `Offer.priceValidUntil` — must be deterministic for SSR/caching.
 * Update periodically when pricing or campaigns change.
 */
export const SCHEMA_PRICE_VALID_UNTIL = '2026-12-31' as const;

// City slugs live in `./nl-city-slugs` (small file — safe for Client Components)
export { CITIES, NL_CITY_SLUGS_ORDERED, NL_CITY_SLUGS } from './nl-city-slugs';

/** Hero & stat strip — channels = live TV; movies = VOD headline (films + series libraries) */
export const STATS = {
  channels: '32.000+',
  movies: '175.000+',
  series: '175.000+',
  uptime: '99.8%',
  customers: '37,000+',
  supportHours: '24/7',
  activationTime: '2h',
} as const;

/** Passed from Server Components into client city pages so stat text always matches SSR (avoids hydration drift). */
export type SiteStatsSnapshot = Pick<typeof STATS, 'channels' | 'movies' | 'uptime' | 'supportHours'>;

// Plans data — all 12 plans from WordPress, grouped by device count
export const PLANS = [
  // ── 1 Screen Plans ──────────────────────────────────────
  {
    id: '1',
    slug: 'abonnement-iptv-3-maanden',
    duration: 3,
    price: 35.99,
    original_price: 51.41,
    devices: 1,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/abonnement-iptv-3-mois.png',
    name_nl: 'IPTV-abonnement 3 maanden',
    name_de: 'IPTV Abo 3 Monate',
    description_nl: 'Ideaal om onze premium service uit te proberen',
    description_de: 'Ideal zum Entdecken unseres Premium-Service',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    slug: 'abonnement-iptv-6-maanden',
    duration: 6,
    price: 44.99,
    original_price: 64.27,
    devices: 1,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/abonnement-iptv-6-mois.png',
    name_nl: 'IPTV-abonnement 6 maanden',
    name_de: 'IPTV Abo 6 Monate',
    description_nl: 'De beste balans tussen looptijd en prijs',
    description_de: 'Die perfekte Balance zwischen Dauer und Preis',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    slug: 'abonnement-iptv-12-maanden',
    duration: 12,
    price: 59.99,
    original_price: 85.70,
    devices: 1,
    is_popular: true,
    is_active: true,
    payment_link: '',
    image: '/images/plans/abonnement-iptv-12-mois.png',
    name_nl: 'IPTV-abonnement 12 maanden',
    name_de: 'IPTV Abo 12 Monate',
    description_nl: 'Onze beste prijs-kwaliteit — aanbevolen',
    description_de: 'Unser bestes Preis-Leistungs-Verhältnis — Empfohlen',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    created_at: new Date().toISOString(),
  },
  // ── 2 Screens Plans ─────────────────────────────────────
  {
    id: '4',
    slug: '2-schermen-3-maanden',
    duration: 3,
    price: 53.99,
    original_price: 77.13,
    devices: 2,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/2-ecrans-3-mois.png',
    name_nl: '2 schermen — 3 maanden',
    name_de: '2 Bildschirme 3 Monate',
    description_nl: 'Deel je abonnement op 2 apparaten tegelijk',
    description_de: 'Teilen Sie Ihr Abo auf 2 Geräten gleichzeitig',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '5',
    slug: '2-schermen-6-maanden',
    duration: 6,
    price: 67.99,
    original_price: 97.13,
    devices: 2,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/2-ecrans-6-mois.png',
    name_nl: '2 schermen — 6 maanden',
    name_de: '2 Bildschirme 6 Monate',
    description_nl: 'Zes maanden streamen op twee schermen',
    description_de: '6 Monate Streaming auf 2 Bildschirmen',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '6',
    slug: '2-schermen-12-maanden',
    duration: 12,
    price: 89.99,
    original_price: 128.56,
    devices: 2,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/2-ecrans-12-mois.png',
    name_nl: '2 schermen — 12 maanden',
    name_de: '2 Bildschirme 12 Monate',
    description_nl: 'Beste prijs voor twee schermen — een vol jaar',
    description_de: 'Bester Preis für 2 Bildschirme — 1 ganzes Jahr',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    created_at: new Date().toISOString(),
  },
  // ── 3 Screens Plans ─────────────────────────────────────
  {
    id: '7',
    slug: '3-schermen-3-maanden',
    duration: 3,
    price: 80.99,
    original_price: 115.70,
    devices: 3,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/3-ecrans-3-mois.png',
    name_nl: '3 schermen — 3 maanden',
    name_de: '3 Bildschirme 3 Monate',
    description_nl: 'Voor het hele gezin — drie apparaten tegelijk',
    description_de: 'Für die ganze Familie — 3 gleichzeitige Geräte',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '8',
    slug: '3-schermen-6-maanden',
    duration: 6,
    price: 101.99,
    original_price: 145.70,
    devices: 3,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/3-ecrans-6-mois.png',
    name_nl: '3 schermen — 6 maanden',
    name_de: '3 Bildschirme 6 Monate',
    description_nl: 'Zes maanden voor drie schermen — ideaal voor gezinnen',
    description_de: '6 Monate für 3 Bildschirme — ideal für Familien',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '9',
    slug: '3-schermen-12-maanden',
    duration: 12,
    price: 134.99,
    original_price: 192.84,
    devices: 3,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/3-ecrans-12-mois.png',
    name_nl: '3 schermen — 12 maanden',
    name_de: '3 Bildschirme 12 Monate',
    description_nl: 'Een vol jaar voor drie schermen — beste gezinsdeal',
    description_de: '1 ganzes Jahr für 3 Bildschirme — bester Familienpreis',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    created_at: new Date().toISOString(),
  },
  // ── 4 Screens Plans ─────────────────────────────────────
  {
    id: '10',
    slug: '4-schermen-3-maanden',
    duration: 3,
    price: 107.99,
    original_price: 154.27,
    devices: 4,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/4-ecrans-3-mois.png',
    name_nl: '4 schermen — 3 maanden',
    name_de: '4 Bildschirme 3 Monate',
    description_nl: 'Maximaal parallel — vier apparaten tegelijk',
    description_de: 'Maximale Verbindungen — 4 gleichzeitige Geräte',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '11',
    slug: '4-schermen-6-maanden',
    duration: 6,
    price: 134.99,
    original_price: 192.84,
    devices: 4,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/4-ecrans-6-mois.png',
    name_nl: '4 schermen — 6 maanden',
    name_de: '4 Bildschirme 6 Monate',
    description_nl: 'Zes maanden op vier schermen voor het hele huishouden',
    description_de: '6 Monate auf 4 Bildschirmen für das ganze Haus',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    created_at: new Date().toISOString(),
  },
  {
    id: '12',
    slug: '4-schermen-12-maanden',
    duration: 12,
    price: 179.99,
    original_price: 257.13,
    devices: 4,
    is_popular: false,
    is_active: true,
    payment_link: '',
    image: '/images/plans/4-ecrans-12-mois.png',
    name_nl: '4 schermen — 12 maanden',
    name_de: '4 Bildschirme 12 Monate',
    description_nl: 'Topdeal — vier schermen voor een vol jaar',
    description_de: 'Ultimatives Angebot — 4 Bildschirme für 1 ganzes Jahr',
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    created_at: new Date().toISOString(),
  },
] as const;
