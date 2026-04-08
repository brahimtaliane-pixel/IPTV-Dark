import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

// POST — Resend inbound email webhook
// Webhook URL: https://meilleur.iptv-suisse.com/api/webhooks/resend
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Resend webhook raw:', JSON.stringify(body).slice(0, 1000));

    // Resend can send: { type: 'email.received', data: {...} } or the email data directly
    const data = body.type === 'email.received' ? body.data : body;

    // If there's no from field at all, it's not an email event
    if (!data.from) {
      console.log('Webhook event (not inbound email):', body.type || 'unknown');
      return NextResponse.json({ success: true });
    }

    // Parse from field
    let senderEmail = '';
    let senderName = '';

    if (typeof data.from === 'string') {
      const match = data.from.match(/<(.+)>/);
      if (match) {
        senderEmail = match[1];
        senderName = data.from.replace(/<.+>/, '').trim();
      } else {
        senderEmail = data.from;
        senderName = data.from.split('@')[0];
      }
    } else if (data.from?.email) {
      senderEmail = data.from.email;
      senderName = data.from.name || data.from.email.split('@')[0];
    }

    if (!senderEmail) {
      console.error('Could not parse sender email from:', data.from);
      return NextResponse.json({ error: 'No sender email' }, { status: 400 });
    }

    // Parse to field
    const toEmail = Array.isArray(data.to)
      ? (typeof data.to[0] === 'string' ? data.to[0] : data.to[0]?.email || 'contact@meilleur.iptv-suisse.com')
      : (typeof data.to === 'string' ? data.to : 'contact@meilleur.iptv-suisse.com');

    const subject = data.subject || '(Pas de sujet)';
    const emailId = data.email_id || data.id || null;
    const messageId = data.message_id || null;

    // Fetch email content from Resend Receiving API
    let bodyHtml = '';
    let bodyText = '';
    if (emailId) {
      try {
        const apiKey = process.env.RESEND_API_KEY;
        if (apiKey) {
          const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
            headers: { 'Authorization': `Bearer ${apiKey}` },
          });
          if (res.ok) {
            const content = await res.json();
            bodyHtml = content.html || '';
            bodyText = content.text || '';
          } else {
            console.warn('Resend API returned', res.status, 'for email', emailId);
          }
        }
      } catch (e) {
        console.warn('Could not fetch email content:', e);
      }
    }

    // Fallback to inline data
    if (!bodyHtml && data.html) bodyHtml = data.html;
    if (!bodyText && data.text) bodyText = data.text;
    if (!bodyText && !bodyHtml) bodyText = '(Contenu non disponible)';

    // Strip quoted reply content
    if (bodyText) {
      bodyText = bodyText.split(/\s*On\s+\w{3},\s/i)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\s*On\s+\d{1,2}\s+\w{3}\s+\d{4}/i)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\s*From:\s/i)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\s*-{3,}\s*(Original|Message)/i)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\n\s*>/)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\n\s*-{5,}/)[0]?.trim() || bodyText;
      bodyText = bodyText.split(/\s*<[^>]+>\s*wrote:/i)[0]?.trim() || bodyText;
    }
    if (bodyHtml) {
      bodyHtml = bodyHtml.replace(/<div class="gmail_quote">[\s\S]*$/i, '').trim();
      bodyHtml = bodyHtml.replace(/<div id="appendonsend">[\s\S]*$/i, '').trim();
      bodyHtml = bodyHtml.replace(/<blockquote[\s\S]*$/i, '').trim();
    }

    const supabase = createServerClient();

    // Find existing conversation
    let conversationId: string | null = null;

    // Check if reply to existing message
    if (data.in_reply_to || messageId) {
      const searchId = data.in_reply_to || messageId;
      const { data: existingMsg } = await supabase
        .from('messages')
        .select('conversation_id')
        .eq('message_id', searchId)
        .single();

      if (existingMsg) {
        conversationId = existingMsg.conversation_id;
      }
    }

    // Check for open conversation with same email
    if (!conversationId) {
      const { data: existingConvo } = await supabase
        .from('conversations')
        .select('id')
        .eq('customer_email', senderEmail)
        .eq('status', 'open')
        .order('last_message_at', { ascending: false })
        .limit(1)
        .single();

      if (existingConvo) {
        conversationId = existingConvo.id;
      }
    }

    // Create new conversation if none exists
    if (!conversationId) {
      const { data: newConvo, error: convoError } = await supabase
        .from('conversations')
        .insert({
          customer_email: senderEmail,
          customer_name: senderName || senderEmail.split('@')[0],
          subject,
          status: 'open',
          unread_count: 1,
        })
        .select('id')
        .single();

      if (convoError || !newConvo) {
        console.error('Failed to create conversation:', convoError);
        return NextResponse.json({ error: 'Failed to create conversation', details: convoError?.message }, { status: 500 });
      }
      conversationId = newConvo.id;
      console.log(`New conversation created: ${conversationId}`);
    } else {
      // Update existing conversation
      const { data: convo } = await supabase
        .from('conversations')
        .select('unread_count')
        .eq('id', conversationId)
        .single();

      await supabase
        .from('conversations')
        .update({
          last_message_at: new Date().toISOString(),
          unread_count: (convo?.unread_count || 0) + 1,
          status: 'open',
        })
        .eq('id', conversationId);
    }

    // Save message
    const { error: msgError } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      direction: 'inbound',
      from_email: senderEmail,
      to_email: toEmail,
      subject,
      body_html: bodyHtml || null,
      body_text: bodyText || null,
      message_id: messageId || null,
      in_reply_to: data.in_reply_to || null,
      references_header: data.references || null,
    });

    if (msgError) {
      console.error('Failed to save message:', msgError);
      return NextResponse.json({ error: 'Failed to save message', details: msgError.message }, { status: 500 });
    }

    console.log(`Inbound email saved: ${senderEmail} -> ${subject} (convo: ${conversationId})`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Webhook processing failed', details: msg }, { status: 500 });
  }
}
