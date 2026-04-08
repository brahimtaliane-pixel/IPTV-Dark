import { NextRequest, NextResponse } from 'next/server';
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

// GET — list chat sessions (with optional status filter)
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const status = searchParams.get('status') || 'all';

  // Return messages for a specific session
  if (sessionId) {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    // Reset unread count
    await supabase
      .from('chat_sessions')
      .update({ unread_count: 0 })
      .eq('id', sessionId);

    return NextResponse.json({ messages: messages || [] });
  }

  // List all sessions
  let query = supabase
    .from('chat_sessions')
    .select('*')
    .order('updated_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: sessions, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ sessions: sessions || [] });
}

// POST — admin sends a reply
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();

  try {
    const { session_id, body } = await request.json();

    if (!session_id || !body?.trim()) {
      return NextResponse.json({ error: 'session_id and body required' }, { status: 400 });
    }

    const { data: message, error } = await supabase
      .from('chat_messages')
      .insert({ session_id, sender: 'admin', body: body.trim() })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    await supabase
      .from('chat_sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', session_id);

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Admin chat error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — close/reopen a session
export async function PATCH(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { id, status } = await request.json();

  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('chat_sessions')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
