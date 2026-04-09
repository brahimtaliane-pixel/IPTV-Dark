import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase';

const CHECKOUT_MODES = ['form_only', 'direct_only'] as const;

function requiresPaymentLink(checkoutMode: string | undefined | null): boolean {
  return checkoutMode === 'direct_only';
}

function coerceCheckoutMode(
  mode: unknown,
  paymentLink: string
): (typeof CHECKOUT_MODES)[number] {
  const link = paymentLink.trim();
  if (mode === 'both') return link ? 'direct_only' : 'form_only';
  if (mode === 'direct_only') return 'direct_only';
  if (mode === 'form_only') return 'form_only';
  return 'form_only';
}

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

// GET — Fetch all plans
export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plans: data });
}

// PATCH — Update a plan
export async function PATCH(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });

  // Use select('*') so this works even if optional columns (e.g. checkout_mode) are not migrated yet.
  const { data: existing, error: fetchErr } = await supabase
    .from('plans')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchErr) {
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  }

  const mergedLink =
    updates.payment_link !== undefined
      ? String(updates.payment_link ?? '').trim()
      : String((existing as { payment_link?: string | null }).payment_link ?? '').trim();

  const payload = { ...updates } as Record<string, unknown>;
  if (payload.checkout_mode != null) {
    payload.checkout_mode = coerceCheckoutMode(payload.checkout_mode, mergedLink);
  }

  const mergedMode =
    (payload.checkout_mode as string | undefined) ??
    coerceCheckoutMode((existing as { checkout_mode?: string }).checkout_mode, mergedLink);

  if (requiresPaymentLink(mergedMode) && !mergedLink) {
    return NextResponse.json(
      { error: 'Direct checkout requires a non-empty payment link.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('plans')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plan: data });
}

// POST — Create a new plan
export async function POST(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const body = await request.json();

  const link = String(body.payment_link ?? '').trim();
  const mode = coerceCheckoutMode(body.checkout_mode, link);
  if (requiresPaymentLink(mode) && !link) {
    return NextResponse.json(
      { error: 'Direct checkout requires a non-empty payment link.' },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from('plans')
    .insert({ ...body, checkout_mode: mode })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ plan: data });
}

// DELETE — Delete a plan
export async function DELETE(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Plan ID required' }, { status: 400 });

  const { error } = await supabase.from('plans').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
