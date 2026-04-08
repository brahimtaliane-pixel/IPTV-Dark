import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';
import { sendPaymentLinkEmail } from '@/lib/resend';
import { PLANS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

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

// POST — Send payment email to a specific lead
export async function POST(request: NextRequest) {
  try {
    if (!(await requireAuth())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { leadId } = await request.json();
    if (!leadId) return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });

    // Check Resend API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'RESEND_API_KEY not configured on server' }, { status: 500 });
    }

    const supabase = createServerClient();

    // Get lead details
    const { data: lead, error: leadError } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (leadError || !lead) {
      return NextResponse.json({ error: 'Lead not found', details: leadError?.message }, { status: 404 });
    }

    if (!lead.payment_link) {
      return NextResponse.json({ error: 'No payment link set for this lead\'s plan' }, { status: 400 });
    }

    // Look up plan info for price/duration
    const plan = PLANS.find(p => p.name_fr === lead.plan_name || p.name_de === lead.plan_name);
    const planPrice = plan ? formatPrice(plan.price) : '—';
    const planDuration = plan?.duration || 0;

    // Send payment email
    const result = await sendPaymentLinkEmail({
      customerName: lead.customer_name,
      email: lead.email,
      phone: lead.phone || '',
      planName: lead.plan_name,
      planPrice,
      planDuration,
      paymentLink: lead.payment_link,
      locale: lead.locale || 'fr',
      leadId: lead.id,
    });

    if (result.success) {
      // Update lead status
      await supabase
        .from('leads')
        .update({ status: 'email_sent', email_sent_at: new Date().toISOString() })
        .eq('id', leadId);

      return NextResponse.json({ success: true, emailId: result.id });
    } else {
      const errMsg = result.error instanceof Error ? result.error.message : JSON.stringify(result.error);
      console.error('Send email failed:', errMsg);
      return NextResponse.json({ error: 'Failed to send email', details: errMsg }, { status: 500 });
    }
  } catch (error) {
    console.error('Send email route error:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
