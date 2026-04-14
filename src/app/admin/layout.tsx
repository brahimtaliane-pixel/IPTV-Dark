import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin — IPTV Dark',
  robots: 'noindex, nofollow',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      {children}
    </div>
  );
}
