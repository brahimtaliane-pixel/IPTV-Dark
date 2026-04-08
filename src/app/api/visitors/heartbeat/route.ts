import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { visitor_id, page_url, page_title, referrer, device, browser, locale } = body;

    if (!visitor_id) {
      return NextResponse.json({ error: 'visitor_id required' }, { status: 400 });
    }

    // Geo data from Vercel headers
    const country = request.headers.get('x-vercel-ip-country') || null;
    const city = request.headers.get('x-vercel-ip-city') || null;

    // Check for email from chat session
    const email = body.email || null;

    const supabase = createServerClient();

    const { error } = await supabase
      .from('live_visitors')
      .upsert(
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
          locale: locale || 'fr',
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: 'visitor_id' }
      );

    if (error) {
      console.error('Heartbeat upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Heartbeat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
