import { SITE_CONFIG } from '@/lib/constants';

/** Canonical origin for JSON-LD `@id` URLs (no trailing slash). */
export function schemaOrigin(): string {
  return SITE_CONFIG.url.replace(/\/$/, '');
}

/**
 * Shared Schema.org nodes — same `@id`s on every page so crawlers merge the graph.
 * Logo = wordmark (`/logo.svg`); favicon listed on Organization for rich results.
 */
export function schemaKernel() {
  const base = schemaOrigin();
  const logoId = `${base}/#logo`;
  const brandId = `${base}/#brand`;
  const orgId = `${base}/#organization`;

  const logo = {
    '@type': 'ImageObject',
    '@id': logoId,
    url: `${base}/logo.svg`,
    contentUrl: `${base}/logo.svg`,
    caption: `${SITE_CONFIG.name} logo`,
  };

  const brand = {
    '@type': 'Brand',
    '@id': brandId,
    name: SITE_CONFIG.name,
    logo: { '@id': logoId },
    slogan: 'Premium IPTV streaming voor Nederland & België',
  };

  /** Minimal Organization — embed in Product / Offer graphs; matches home `JsonLd` @id. */
  const organizationCompact = {
    '@type': 'Organization',
    '@id': orgId,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.name,
    url: base,
    logo: { '@id': logoId },
    image: [`${base}/logo.svg`, `${base}/favicon.svg`],
    brand: { '@id': brandId },
    email: SITE_CONFIG.email,
  };

  return { base, logoId, brandId, orgId, logo, brand, organizationCompact };
}
