import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// GET — fetch existing session + messages for a visitor
export async function GET(request: NextRequest) {
  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');
  const visitorId = searchParams.get('visitor_id');

  if (sessionId) {
    const { data: messages } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    return NextResponse.json({ messages: messages || [] });
  }

  if (visitorId) {
    const { data: session } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('visitor_id', visitorId)
      .eq('status', 'open')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (session) {
      const { data: messages } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', session.id)
        .order('created_at', { ascending: true });

      return NextResponse.json({ session, messages: messages || [] });
    }

    return NextResponse.json({ session: null, messages: [] });
  }

  return NextResponse.json({ error: 'session_id or visitor_id required' }, { status: 400 });
}

// POST — create session or send message
export async function POST(request: NextRequest) {
  const supabase = createServerClient();

  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'create_session') {
      const { visitor_id, visitor_email, page_url, locale } = body;
      if (!visitor_id) {
        return NextResponse.json({ error: 'visitor_id required' }, { status: 400 });
      }

      const { data: existing } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('visitor_id', visitor_id)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

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
          locale: locale || 'fr',
        })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json({ session });
    }

    if (action === 'send_message') {
      const { session_id, sender, body: msgBody } = body;
      if (!session_id || !sender || !msgBody?.trim()) {
        return NextResponse.json({ error: 'session_id, sender, body required' }, { status: 400 });
      }

      const { data: message, error } = await supabase
        .from('chat_messages')
        .insert({ session_id, sender, body: msgBody.trim() })
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Update session timestamp
      const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

      if (sender === 'visitor') {
        // Increment unread count
        const { data: sess } = await supabase
          .from('chat_sessions')
          .select('unread_count')
          .eq('id', session_id)
          .single();
        update.unread_count = (sess?.unread_count || 0) + 1;
      }

      await supabase.from('chat_sessions').update(update).eq('id', session_id);

      return NextResponse.json({ message });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
