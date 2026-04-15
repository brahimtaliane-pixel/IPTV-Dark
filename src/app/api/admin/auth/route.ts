import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';
/** Defaults match production; override with `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env.local`. */
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL?.trim() || 'contact@iptvdark4k.nl').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD?.trim() || 'Karimisaac2311@';

/** Prefer ADMIN_SESSION_SECRET; use Supabase role key if admin secret is unset or empty (Vercel often has `ADMIN_SESSION_SECRET` present but blank). */
function getSessionSecret(): string {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    ''
  );
}

function createToken(email: string): string {
  const secret = getSessionSecret();
  const payload = JSON.stringify({ email, exp: Date.now() + 24 * 60 * 60 * 1000 }); // 24h
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

function verifyToken(token: string): { email: string; exp: number } | null {
  try {
    const secret = getSessionSecret();
    if (!secret) return null;
    const [payloadB64, hmac] = token.split('.');
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedHmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (hmac !== expectedHmac) return null;
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

// POST /api/admin/auth — Login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const emailNorm = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const passNorm = typeof body.password === 'string' ? body.password : '';

    if (emailNorm !== ADMIN_EMAIL || passNorm !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    if (!getSessionSecret()) {
      return NextResponse.json(
        {
          error:
            'Server misconfigured: set SUPABASE_SERVICE_ROLE_KEY or ADMIN_SESSION_SECRET in your environment (e.g. Vercel project → Settings → Environment Variables, or .env.local locally), then redeploy / restart.',
        },
        { status: 500 },
      );
    }

    const token = createToken(emailNorm);
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true, email: emailNorm });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE /api/admin/auth — Logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  return NextResponse.json({ success: true });
}

// GET /api/admin/auth — Check session
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('admin_session')?.value;
  if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

  const data = verifyToken(token);
  if (!data) return NextResponse.json({ authenticated: false }, { status: 401 });

  return NextResponse.json({ authenticated: true, email: data.email });
}

// Export for middleware use
export { verifyToken };
