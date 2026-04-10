import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { legacyPlanSlugRedirects } from './src/lib/plan-slugs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },

  // ─── Caching Headers (equivalent to .htaccess) ───────────
  async headers() {
    return [
      {
        // Static assets — long cache
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif|woff|woff2)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // JS/CSS — versioned by Next.js, safe to cache long
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // HTML pages — short cache with revalidation
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },

  // ─── Rewrites ────────────────────────────────────────────
  /** Many clients still request `/favicon.ico` first; serve the same NL mark as `public/favicon.svg`. */
  async rewrites() {
    return [{ source: '/favicon.ico', destination: '/favicon.svg' }];
  },

  // ─── Redirects ───────────────────────────────────────────
  async redirects() {
    return [
      ...legacyPlanSlugRedirects(),
      // Subscription landing URLs → pricing (branded + legacy WordPress)
      { source: '/abonnement-iptv-nederland', destination: '/#pricing', permanent: true },
      { source: '/abonnement-iptv-suisse', destination: '/#pricing', permanent: true },
      { source: '/iptv-plan/:slug', destination: '/plans/:slug', permanent: true },
      { source: '/guide-dinstallation-iptv', destination: '/installation', permanent: true },
      { source: '/a-propos', destination: '/about', permanent: true },
      { source: '/politique-de-confidentialite', destination: '/privacy', permanent: true },
      { source: '/conditions-dutilisation', destination: '/terms', permanent: true },
      // Redirect old /fr/ prefixed URLs to clean URLs
      { source: '/fr', destination: '/', permanent: true },
      { source: '/fr/:path+', destination: '/:path+', permanent: true },
      { source: '/de', destination: '/', permanent: true },
      { source: '/de/:path+', destination: '/:path+', permanent: true },
      { source: '/nl', destination: '/', permanent: true },
      { source: '/nl/:path+', destination: '/:path+', permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
