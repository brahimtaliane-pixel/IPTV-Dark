import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_EMAIL = 'isaac@meilleur.iptv-suisse.com';
const ADMIN_PASSWORD = 'Karimisaac2311@';
const SESSION_SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY || 'fallback-secret-key';

function createToken(email: string): string {
  const payload = JSON.stringify({ email, exp: Date.now() + 24 * 60 * 60 * 1000 }); // 24h
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + hmac;
}

function verifyToken(token: string): { email: string; exp: number } | null {
  try {
    const [payloadB64, hmac] = token.split('.');
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedHmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
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
    const { email, password } = await request.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createToken(email);
    const cookieStore = await cookies();
    cookieStore.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    });

    return NextResponse.json({ success: true, email });
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
