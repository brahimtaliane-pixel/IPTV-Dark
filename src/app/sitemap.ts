import { MetadataRoute } from 'next';
import { SITE_CONFIG } from '@/lib/constants';
import { getPlans } from '@/lib/get-plans';
import { ALL_CITY_SLUGS } from '@/lib/cities';

function pageUrl(path: string) {
  return `${SITE_CONFIG.url}${path}`;
}

const SITE_LAST_MODIFIED = '2026-04-07';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const plans = await getPlans();
  const baseUrl = SITE_CONFIG.url;
  const lastModified = new Date(SITE_LAST_MODIFIED);

  const staticPages = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/abonnementen', priority: 0.95, changeFrequency: 'weekly' as const },
    { path: '/multi-schermen', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/pandora-iptv', priority: 0.85, changeFrequency: 'monthly' as const },
    { path: '/iptv-kopen', priority: 0.88, changeFrequency: 'weekly' as const },
    { path: '/dutch-iptv', priority: 0.87, changeFrequency: 'weekly' as const },
    { path: '/iptv-nederland', priority: 0.88, changeFrequency: 'weekly' as const },
    { path: '/iptv-abonnement', priority: 0.88, changeFrequency: 'weekly' as const },
    { path: '/iptv-dark-nederland', priority: 0.87, changeFrequency: 'weekly' as const },
    { path: '/faq', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/installatiegids', priority: 0.8, changeFrequency: 'monthly' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/privacy', priority: 0.3, changeFrequency: 'yearly' as const },
    { path: '/terms', priority: 0.3, changeFrequency: 'yearly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of staticPages) {
    const u = pageUrl(page.path);
    entries.push({
      url: u,
      lastModified,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          'nl-NL': u,
          'x-default': u,
        },
      },
    });
  }

  for (const plan of plans) {
    entries.push({
      url: pageUrl(`/abonnementen/${plan.slug}`),
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.9,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/abonnementen/${plan.slug}`,
          'x-default': `${baseUrl}/abonnementen/${plan.slug}`,
        },
      },
    });
  }

  for (const city of ALL_CITY_SLUGS) {
    entries.push({
      url: pageUrl(`/iptv-${city}`),
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.85,
      alternates: {
        languages: {
          'nl-NL': `${baseUrl}/iptv-${city}`,
          'x-default': `${baseUrl}/iptv-${city}`,
        },
      },
    });
  }

  return entries;
}
