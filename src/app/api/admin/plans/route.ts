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

  const { data, error } = await supabase
    .from('plans')
    .update({ ...updates, updated_at: new Date().toISOString() })
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

  const { data, error } = await supabase
    .from('plans')
    .insert(body)
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
