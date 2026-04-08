import { MetadataRoute } from 'next';
import { SITE_CONFIG, PLANS } from '@/lib/constants';
import { ALL_CITY_SLUGS } from '@/lib/cities';

// Helper: build URL for a given locale + path
// French (default) → no prefix: /path
// German → /de/path
function localeUrl(baseUrl: string, locale: string, path: string) {
  if (locale === 'fr') {
    return `${baseUrl}${path}`;
  }
  return `${baseUrl}/${locale}${path}`;
}

// Bump this when you publish meaningful content/copy changes.
// Hardcoded (not Date.now()) so the sitemap output is deterministic across
// requests — Google flagged "Temporary processing error" when this varied.
const SITE_LAST_MODIFIED = '2026-04-07';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_CONFIG.url;
  const locales = SITE_CONFIG.locales;
  const lastModified = new Date(SITE_LAST_MODIFIED);

  // Static pages
  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/plans', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/multi-ecrans', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/installation', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Generate entries for each locale
  for (const locale of locales) {
    // Static pages
    for (const page of staticPages) {
      entries.push({
        url: localeUrl(baseUrl, locale, page.path),
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: {
            'x-default': `${baseUrl}${page.path}`,
            'fr-CH': `${baseUrl}${page.path}`,
            'de-CH': `${baseUrl}/de${page.path}`,
          },
        },
      });
    }

    // Plan pages
    for (const plan of PLANS) {
      entries.push({
        url: localeUrl(baseUrl, locale, `/plans/${plan.slug}`),
        lastModified,
        changeFrequency: 'weekly',
        priority: 0.9,
        alternates: {
          languages: {
            'x-default': `${baseUrl}/plans/${plan.slug}`,
            'fr-CH': `${baseUrl}/plans/${plan.slug}`,
            'de-CH': `${baseUrl}/de/plans/${plan.slug}`,
          },
        },
      });
    }

    // City landing pages
    for (const city of ALL_CITY_SLUGS) {
      entries.push({
        url: localeUrl(baseUrl, locale, `/iptv-${city}`),
        lastModified,
        changeFrequency: 'monthly',
        priority: 0.85,
        alternates: {
          languages: {
            'x-default': `${baseUrl}/iptv-${city}`,
            'fr-CH': `${baseUrl}/iptv-${city}`,
            'de-CH': `${baseUrl}/de/iptv-${city}`,
          },
        },
      });
    }
  }

  // TODO: Future pages to add to sitemap when created:
  // - /chaines (FR) / /kanalliste (DE) — Channel list page
  // - /essai-gratuit (FR) / /gratis-testen (DE) — Free trial page
  // - /iptv-suisse-legal (FR) / /iptv-schweiz-legal (DE) — Legal/trust page
  // - /sports (FR) / /sport (DE) — Sports page
  // - /blog — Blog index and articles (when created)
  // - /comparatif (FR) / /vergleich (DE) — Comparison page

  return entries;
}
