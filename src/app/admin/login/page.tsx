'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import BrandMark from '@/components/ui/BrandMark';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push('/admin');
        return;
      }

      setError(
        typeof data.error === 'string' && data.error.length > 0
          ? data.error
          : 'Invalid email or password',
      );
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <BrandMark className="w-14 h-14" />
          </div>
          <h1 className="text-xl font-bold text-text tracking-tight">
            IPTV<span className="text-swiss-red">DARK</span>
            <span className="text-text-secondary font-semibold"> Admin</span>
          </h1>
          <p className="text-sm text-text-muted mt-1">Sign in to manage your site</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-surface rounded-xl border border-border p-6 space-y-4 shadow-[0_0_0_1px_rgba(198,255,63,0.06)]"
        >
          {error && (
            <div className="bg-red-500/10 text-red-400 text-sm px-4 py-3 rounded-lg border border-red-500/25">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-swiss-red/25 focus:border-swiss-red transition bg-bg-alt"
              placeholder="contact@localhost"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-swiss-red/25 focus:border-swiss-red transition bg-bg-alt"
              placeholder="••••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-swiss-red text-text-on-red py-2.5 rounded-lg text-sm font-semibold hover:bg-swiss-red-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-text-muted mt-6">
          Protected admin area · IPTV Dark
        </p>
      </div>
    </div>
  );
}
