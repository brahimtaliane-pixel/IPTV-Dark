import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// ─── Payment Link Click Tracking ─────────────────────────────
// URL: /api/track-click?lead=LEAD_ID&redirect=PAYMENT_URL
//
// Tracks when a customer clicks the payment link in their email,
// then redirects them to the actual payment page.
// ──────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const leadId = searchParams.get('lead');
  const redirect = searchParams.get('redirect');

  // Default fallback
  const fallbackUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://meilleur.iptv-suisse.com';

  if (!redirect) {
    return NextResponse.redirect(fallbackUrl);
  }

  // Get client info
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referrer = request.headers.get('referer') || '';

  if (leadId) {
    try {
      const supabase = createServerClient();

      // 1. Insert click tracking record
      await supabase.from('click_tracking').insert({
        lead_id: leadId,
        ip_address: ip,
        user_agent: userAgent,
        referrer,
      });

      // 2. Update lead: increment click count, set status, timestamp
      await supabase.rpc('increment_click_count', { lead_uuid: leadId });

      // Fallback if RPC doesn't exist — direct update
      await supabase
        .from('leads')
        .update({
          status: 'clicked',
          payment_clicked_at: new Date().toISOString(),
          click_count: 1, // Will be overwritten by RPC if available
        })
        .eq('id', leadId)
        .eq('status', 'email_sent'); // Only update if not already clicked
    } catch (error) {
      console.error('Click tracking error:', error);
      // Don't block redirect on tracking failure
    }
  }

  // Redirect to the actual payment URL
  return NextResponse.redirect(decodeURIComponent(redirect));
}
