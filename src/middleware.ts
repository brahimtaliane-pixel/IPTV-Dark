import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Known DMCA enforcement, brand-protection and anti-piracy crawlers.
// These get a clean 404 — no body, no headers hinting that anything exists here.
// The visible marketing site has no infringing content, but this is defense in depth.
const DMCA_SCANNER_UA = [
  'markmonitor',
  'markscan',
  'muso',
  'friend mts',
  'friendmts',
  'fmts-bot',
  'corsearch',
  'incopro',
  'leakid',
  'websheriff',
  'web-sheriff',
  'ip-echelon',
  'ipechelon',
  'ceg-tek',
  'cegtek',
  'dtecnet',
  'rivendell',
  'athentech',
  'opsec-online',
  'brandshield',
  'pointer brand',
  'excipio',
  'audiblemagic',
  'vobile',
  'digimarc',
  'onsist',
  'red points',
  'redpoints',
  'nagravision',
  'nagra',
  'viaccess',
  'irdeto',
  'nexguard',
  'entura',
  'reposcan',
  'copytrack',
  'copyright agent',
  'mpa-crawler',
  'mpaa-crawler',
  'tnoodle',
  'mediaprotector',
  'piracybot',
  'antipiracybot',
];

export default function middleware(request: NextRequest) {
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase();

  // 1) Block known DMCA / anti-piracy crawlers everywhere on the site.
  //    Empty 404 — no breadcrumbs.
  if (userAgent && DMCA_SCANNER_UA.some((bot) => userAgent.includes(bot))) {
    return new NextResponse(null, { status: 404 });
  }

  // 2) Everything else (real users from any country, Googlebot, Bingbot,
  //    Applebot, Yandex, social previews, etc.) gets the real localized site.
  //    The site is marketing-only with no streams, no M3U, no channel lists,
  //    no copyrighted material — safe to serve publicly.
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(nl)/:path*', '/((?!api|_next|_vercel|images|admin|geo-blocked|.*\\..*).*)'],
};
