import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendPaymentLinkEmail, sendAdminNotification } from '@/lib/resend';
import { PLANS as STATIC_PLANS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, plan_id, plan_name, locale = 'nl' } = body;

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Leads API: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 503 }
      );
    }

    // Validate required fields
    if (!name || !email || !phone || !plan_id || !plan_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Get client info
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    let planPrice = '0';
    let planDuration = 0;
    let paymentLink = '';
    let resolvedPlanUuid: string | null = null;

    const supabase = createServerClient();

    // Resolve plan: UI sends static ids ('1','2') or a real UUID from DB
    let dbPlan: {
      id: string;
      price: number;
      duration: number;
      payment_link: string | null;
      slug: string;
    } | null = null;

    if (UUID_RE.test(String(plan_id))) {
      const { data } = await supabase
        .from('plans')
        .select('id, price, duration, payment_link, slug')
        .eq('id', plan_id)
        .maybeSingle();
      dbPlan = data;
    } else {
      const fallback = STATIC_PLANS.find((p) => String(p.id) === String(plan_id));
      if (fallback) {
        const { data } = await supabase
          .from('plans')
          .select('id, price, duration, payment_link, slug')
          .eq('slug', fallback.slug)
          .maybeSingle();
        dbPlan = data;
      }
    }

    if (dbPlan) {
      resolvedPlanUuid = dbPlan.id;
      planPrice = formatPrice(Number(dbPlan.price));
      planDuration = dbPlan.duration;
      paymentLink = dbPlan.payment_link ?? '';
    } else {
      const fallback = STATIC_PLANS.find((p) => String(p.id) === String(plan_id));
      if (fallback) {
        planPrice = formatPrice(fallback.price);
        planDuration = fallback.duration;
        paymentLink = fallback.payment_link ?? '';
      }
    }

    const insertPayload: Record<string, unknown> = {
      plan_name,
      customer_name: name,
      email,
      phone,
      locale,
      status: 'pending',
      payment_link: paymentLink,
      ip_address: ip,
      user_agent: userAgent,
    };
    if (resolvedPlanUuid) {
      insertPayload.plan_id = resolvedPlanUuid;
    }

    const { data: inserted, error: insertError } = await supabase
      .from('leads')
      .insert(insertPayload)
      .select('id')
      .single();

    if (insertError) {
      console.error('Supabase insert error:', insertError);
      return NextResponse.json(
        {
          error:
            'Could not save your request. Check that Supabase has the `leads` table and `SUPABASE_SERVICE_ROLE_KEY` is set on the server.',
          details: process.env.NODE_ENV === 'development' ? insertError.message : undefined,
        },
        { status: 500 }
      );
    }

    const leadId = inserted!.id;

    // ─── Send Emails ─────────────────────────────────────
    const emailData = {
      customerName: name,
      email,
      phone,
      planName: plan_name,
      planPrice,
      planDuration,
      paymentLink,
      locale,
      leadId,
    };

    try {
      const emailResult = await sendPaymentLinkEmail(emailData);

      if (emailResult.success) {
        await supabase
          .from('leads')
          .update({ status: 'email_sent', email_sent_at: new Date().toISOString() })
          .eq('id', leadId);
      }

      sendAdminNotification(emailData).catch(() => {});
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json(
      { success: true, message: 'Lead captured successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
