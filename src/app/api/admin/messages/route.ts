import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import { SITE_CONFIG } from '@/lib/constants';

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

// GET — List conversations or messages for a conversation
export async function GET(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { searchParams } = new URL(request.url);
  const conversationId = searchParams.get('conversation_id');
  const status = searchParams.get('status') || 'all';

  // If conversation_id provided, return messages for that conversation
  if (conversationId) {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Mark as read
    await supabase
      .from('conversations')
      .update({ unread_count: 0 })
      .eq('id', conversationId);

    return NextResponse.json({ messages: messages || [] });
  }

  // Otherwise return all conversations
  let query = supabase
    .from('conversations')
    .select('*')
    .order('last_message_at', { ascending: false });

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data: conversations, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ conversations: conversations || [] });
}

// POST — Send a reply in a conversation
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { conversation_id, body_html, body_text } = await request.json();

    if (!conversation_id || (!body_html && !body_text)) {
      return NextResponse.json({ error: 'conversation_id and message body required' }, { status: 400 });
    }

    const supabase = createServerClient();

    // Get conversation
    const { data: conversation, error: convoError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversation_id)
      .single();

    if (convoError || !conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get the last message for threading
    const { data: lastMsg } = await supabase
      .from('messages')
      .select('message_id, references_header')
      .eq('conversation_id', conversation_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    // Build threading headers
    const headers: Record<string, string> = {};
    if (lastMsg?.message_id) {
      headers['In-Reply-To'] = lastMsg.message_id;
      const prevRefs = lastMsg.references_header || '';
      headers['References'] = prevRefs ? `${prevRefs} ${lastMsg.message_id}` : lastMsg.message_id;
    }

    // Send via Resend
    const { getResend } = await import('@/lib/resend');
    const resend = getResend();

    const subject = conversation.subject.startsWith('Re:')
      ? conversation.subject
      : `Re: ${conversation.subject}`;

    const htmlContent = body_html || `<p>${(body_text || '').replace(/\n/g, '<br>')}</p>`;

    const fullHtml = `
<!DOCTYPE html>
<html lang="fr">
<body style="margin:0;padding:0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:20px;">
    ${htmlContent}
    <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
    <p style="color:#94a3b8;font-size:12px;">
      ${SITE_CONFIG.name} — ${SITE_CONFIG.domain}<br>
      Support 24/7 | ${SITE_CONFIG.email}
    </p>
  </div>
</body>
</html>`;

    const fromEmail = `contact@${SITE_CONFIG.domain}`;

    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: `${SITE_CONFIG.name} <${fromEmail}>`,
      to: conversation.customer_email,
      subject,
      html: fullHtml,
      headers,
    });

    if (emailError) {
      console.error('Reply send error:', emailError);
      return NextResponse.json({ error: 'Failed to send reply: ' + emailError.message }, { status: 500 });
    }

    // Save outbound message
    await supabase.from('messages').insert({
      conversation_id,
      direction: 'outbound',
      from_email: fromEmail,
      to_email: conversation.customer_email,
      subject,
      body_html: fullHtml,
      body_text: body_text || null,
      message_id: emailResult?.id || null,
      in_reply_to: lastMsg?.message_id || null,
      references_header: headers['References'] || null,
    });

    // Update conversation
    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH — Update conversation status (open/closed/archived)
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
    .from('conversations')
    .update({ status })
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
