import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendPaymentLinkEmail, sendAdminNotification } from '@/lib/resend';
import { PLANS as STATIC_PLANS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, plan_id, plan_name, locale = 'nl' } = body;

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

    let leadId = crypto.randomUUID();

    // ─── Save to Supabase ────────────────────────────────
    try {
      const supabase = createServerClient();

      const { data: dbPlan } = await supabase
        .from('plans')
        .select('price, duration, payment_link, slug')
        .eq('id', plan_id)
        .maybeSingle();

      if (dbPlan) {
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

      const { data, error } = await supabase
        .from('leads')
        .insert({
          plan_name,
          customer_name: name,
          email,
          phone,
          locale,
          status: 'pending',
          payment_link: paymentLink,
          ip_address: ip,
          user_agent: userAgent,
        })
        .select('id')
        .single();

      if (error) {
        console.error('Supabase insert error:', error);
        // Continue even if DB fails — still send email
      } else if (data) {
        leadId = data.id;
      }
    } catch (dbError) {
      console.error('Supabase connection error:', dbError);
      // Continue — don't block the flow
    }

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
      // Send payment link email to customer
      const emailResult = await sendPaymentLinkEmail(emailData);

      if (emailResult.success) {
        // Update lead status to email_sent
        try {
          const supabase = createServerClient();
          await supabase
            .from('leads')
            .update({ status: 'email_sent', email_sent_at: new Date().toISOString() })
            .eq('id', leadId);
        } catch {
          // Non-blocking
        }
      }

      // Send admin notification (non-blocking)
      sendAdminNotification(emailData).catch(() => {});
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Lead is saved, email failed — that's okay
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
