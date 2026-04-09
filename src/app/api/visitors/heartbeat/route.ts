import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase';

function isMissingTableError(message: string, code?: string): boolean {
  const m = message.toLowerCase();
  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    m.includes('does not exist') ||
    m.includes('schema cache') ||
    m.includes('could not find the table')
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitor_id, page_url, page_title, referrer, device, browser, locale } = body;

    if (!visitor_id) {
      return NextResponse.json({ error: 'visitor_id required' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anonKey) {
      return NextResponse.json({ ok: true, skipped: 'no_supabase' }, { status: 200 });
    }

    // Geo data from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    const email = body.email || null;

    const supabase = process.env.SUPABASE_SERVICE_ROLE_KEY
      ? createServerClient()
      : createClient(url, anonKey, {
          auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
        });

    const { error } = await supabase.from('live_visitors').upsert(
      {
        visitor_id,
        email,
        page_url: page_url || null,
        page_title: page_title || null,
        referrer: referrer || null,
        device: device || null,
        browser: browser || null,
        country,
        city,
        locale: locale || 'nl',
        last_seen_at: new Date().toISOString(),
      },
      { onConflict: 'visitor_id' },
    );

    if (error) {
      if (isMissingTableError(error.message, error.code)) {
        // DB not migrated yet — avoid 500 spam in the browser console
        return NextResponse.json({ ok: true, skipped: 'live_visitors_missing' }, { status: 200 });
      }
      console.error('Heartbeat upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
