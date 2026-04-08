import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

async function requireAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return false;
  try {
    const [payloadB64, hmac] = token.split('.');
    const crypto = await import('crypto');
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (hmac !== expectedHmac) return false;
    const data = JSON.parse(payload);
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();

  // Consider visitors "online" if last heartbeat was within 30 seconds
  const cutoff = new Date(Date.now() - 30_000).toISOString();

  const { data: visitors, error } = await supabase
    .from('live_visitors')
    .select('*')
    .gte('last_seen_at', cutoff)
    .order('last_seen_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Also get total count including recently offline (last 24h) for stats
  const dayCutoff = new Date(Date.now() - 86_400_000).toISOString();
  const { count: todayTotal } = await supabase
    .from('live_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('first_seen_at', dayCutoff);

  return NextResponse.json({
    visitors: visitors || [],
    online_count: visitors?.length || 0,
    today_total: todayTotal || 0,
  });
}
