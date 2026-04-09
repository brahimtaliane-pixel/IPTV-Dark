import { NextRequest, NextResponse } from 'next/server';
import { createChatServerClient } from '@/lib/supabase';

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

// GET — fetch existing session + messages for a visitor
export async function GET(request: NextRequest) {
  const supabase = createChatServerClient();
  if (!supabase) {
    return jsonError('Chat is not configured (missing Supabase URL/key).', 503);
  }

  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const visitorId = searchParams.get('visitor_id');

  if (sessionId) {
    const { data: messages, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      return jsonError(error.message, 500);
    }
    return NextResponse.json({ messages: messages || [] });
  }

  if (visitorId) {
    const { data: session, error: sessionErr } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('visitor_id', visitorId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (sessionErr) {
      return jsonError(sessionErr.message, 500);
    }

    if (!session) {
      return NextResponse.json({ session: null, messages: [] });
    }

    const { data: messages, error: msgErr } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', session.id)
      .order('created_at', { ascending: true });

    if (msgErr) {
      return jsonError(msgErr.message, 500);
    }

    return NextResponse.json({ session, messages: messages || [] });
  }

  return jsonError('session_id or visitor_id required', 400);
}

// POST — create session or send message
export async function POST(request: NextRequest) {
  const supabase = createChatServerClient();
  if (!supabase) {
    return jsonError('Chat is not configured (missing Supabase URL/key).', 503);
  }

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_session') {
      const { visitor_id, visitor_email, page_url, locale } = body;
      if (!visitor_id) {
        return jsonError('visitor_id required', 400);
      }

      const { data: existing, error: findErr } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('visitor_id', visitor_id)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (findErr) {
        return jsonError(findErr.message, 500);
      }

      if (existing) {
        if (visitor_email && !existing.visitor_email) {
          await supabase
            .from('chat_sessions')
            .update({ visitor_email })
            .eq('id', existing.id);
          existing.visitor_email = visitor_email;
        }
        return NextResponse.json({ session: existing });
      }

      const { data: session, error } = await supabase
        .from('chat_sessions')
        .insert({
          visitor_id,
          visitor_email: visitor_email || null,
          page_url: page_url || null,
          locale: locale || 'nl',
        })
        .select()
        .single();

      if (error) {
        return jsonError(error.message, 500);
      }

      return NextResponse.json({ session });
    }

    if (action === 'send_message') {
      const { session_id, sender, body: msgBody } = body;
      if (!session_id || !sender || !msgBody?.trim()) {
        return jsonError('session_id, sender, body required', 400);
      }

      const { data: message, error: insertErr } = await supabase
        .from('chat_messages')
        .insert({ session_id, sender, body: msgBody.trim() })
        .select()
        .single();

      if (insertErr) {
        return jsonError(insertErr.message, 500);
      }

      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (sender === 'visitor') {
        const { data: sess } = await supabase
          .from('chat_sessions')
          .select('unread_count')
          .eq('id', session_id)
          .maybeSingle();
        update.unread_count = (sess?.unread_count ?? 0) + 1;
      }

      const { error: updateErr } = await supabase.from('chat_sessions').update(update).eq('id', session_id);
      if (updateErr) {
        // Message was stored; session badge update is best-effort
        console.error('chat_sessions update:', updateErr.message);
      }

      return NextResponse.json({ message });
    }

    return jsonError('Invalid action', 400);
  } catch (error) {
    console.error('Chat API error:', error);
    return jsonError('Internal server error', 500);
  }
}
