import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

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

  // New leads (last 24h that haven't been "seen" — use created_at as proxy)
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .gte('created_at', dayAgo);

  // Unread email conversations
  const { data: unreadConvos } = await supabase
    .from('conversations')
    .select('unread_count')
    .gt('unread_count', 0);
  const unreadMessages = unreadConvos?.reduce((sum, c) => sum + (c.unread_count || 0), 0) || 0;

  // Unread chat sessions
  const { data: unreadChats } = await supabase
    .from('chat_sessions')
    .select('unread_count')
    .eq('status', 'open')
    .gt('unread_count', 0);
  const unreadChat = unreadChats?.reduce((sum, c) => sum + (c.unread_count || 0), 0) || 0;

  // Online visitors (last 30s)
  const cutoff = new Date(Date.now() - 30_000).toISOString();
  const { count: onlineVisitors } = await supabase
    .from('live_visitors')
    .select('*', { count: 'exact', head: true })
    .gte('last_seen_at', cutoff);

  return NextResponse.json({
    leads: newLeads || 0,
    messages: unreadMessages,
    chat: unreadChat,
    visitors: onlineVisitors || 0,
  });
}
