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

// GET — Fetch all settings
export async function GET() {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const { data, error } = await supabase.from('admin_settings').select('*');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  // Add env var status (don't reveal the actual keys)
  settings['resend_configured'] = process.env.RESEND_API_KEY ? 'true' : 'false';
  settings['ga_configured'] = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? 'true' : 'false';
  settings['crisp_configured'] = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID ? 'true' : 'false';

  return NextResponse.json({ settings });
}

// PATCH — Update settings
export async function PATCH(request: NextRequest) {
  if (!(await requireAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createServerClient();
  const updates = await request.json();

  for (const [key, value] of Object.entries(updates)) {
    await supabase
      .from('admin_settings')
      .upsert({ key, value: value as string, updated_at: new Date().toISOString() });
  }

  return NextResponse.json({ success: true });
}
