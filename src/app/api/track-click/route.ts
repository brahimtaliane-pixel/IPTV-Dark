import { NextRequest, NextResponse } from 'next/server';
import { SITE_CONFIG } from '@/lib/constants';

// Legacy URLs from older emails: /api/track-click?lead=…&redirect=…
// Redirects only — no click logging (payment buttons and new emails use the payment URL directly).

export async function GET(request: NextRequest) {
  const redirect = request.nextUrl.searchParams.get('redirect');
  const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE_CONFIG.url;

  if (!redirect) {
    return NextResponse.redirect(fallbackUrl);
  }

  return NextResponse.redirect(decodeURIComponent(redirect));
}
