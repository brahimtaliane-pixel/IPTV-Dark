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

  // Get lead counts by status
  const { data: leads } = await supabase.from('leads').select('status, created_at');
  
  const total = leads?.length || 0;
  const pending = leads?.filter(l => l.status === 'pending').length || 0;
  const emailSent = leads?.filter(l => l.status === 'email_sent').length || 0;
  const clicked = leads?.filter(l => l.status === 'clicked').length || 0;
  const converted = leads?.filter(l => l.status === 'converted').length || 0;
  const cancelled = leads?.filter(l => l.status === 'cancelled').length || 0;

  // Today's leads
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayLeads = leads?.filter(l => new Date(l.created_at) >= today).length || 0;

  // This week's leads
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekLeads = leads?.filter(l => new Date(l.created_at) >= weekAgo).length || 0;

  // This month's leads
  const monthAgo = new Date();
  monthAgo.setDate(monthAgo.getDate() - 30);
  const monthLeads = leads?.filter(l => new Date(l.created_at) >= monthAgo).length || 0;

  // Plans count
  const { count: plansCount } = await supabase
    .from('plans')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true);

  // Click tracking
  const { count: totalClicks } = await supabase
    .from('click_tracking')
    .select('*', { count: 'exact', head: true });

  // Conversion rate
  const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(1) : '0';

  // Notification badges
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const { count: newLeads24h } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', dayAgo);

  const { data: unreadConvos } = await supabase
    .from('conversations')
    .select('unread_count')
    .gt('unread_count', 0);
  const unreadMessages = unreadConvos?.reduce((sum, c) => sum + (c.unread_count || 0), 0) || 0;

  let unreadChat = 0;
  try {
    const { data: unreadChats } = await supabase
      .from('chat_sessions')
      .select('unread_count')
      .eq('status', 'open')
      .gt('unread_count', 0);
    unreadChat = unreadChats?.reduce((sum, c) => sum + (c.unread_count || 0), 0) || 0;
  } catch { /* table may not exist yet */ }

  let onlineVisitors = 0;
  try {
    const cutoff30s = new Date(Date.now() - 30_000).toISOString();
    const { count } = await supabase
      .from('live_visitors')
      .select('*', { count: 'exact', head: true })
      .gte('last_seen_at', cutoff30s);
    onlineVisitors = count || 0;
  } catch { /* table may not exist yet */ }

  return NextResponse.json({
    leads: {
      total,
      pending,
      emailSent,
      clicked,
      converted,
      cancelled,
      today: todayLeads,
      thisWeek: weekLeads,
      thisMonth: monthLeads,
    },
    plans: {
      active: plansCount || 0,
    },
    clicks: {
      total: totalClicks || 0,
    },
    conversionRate,
    badges: {
      leads: newLeads24h || 0,
      messages: unreadMessages,
      chat: unreadChat,
      visitors: onlineVisitors,
    },
  });
}
