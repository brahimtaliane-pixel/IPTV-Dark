import '@/app/globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const favicon = '/favicon.svg?v=nl';

/** NL tricolour mark — same asset as `app/icon.svg` / `public/favicon.svg` (not the old Swiss favicon). */
export const metadata: Metadata = {
  icons: {
    icon: [{ url: favicon, type: 'image/svg+xml' }],
    shortcut: [{ url: favicon, type: 'image/svg+xml' }],
    apple: [{ url: favicon, type: 'image/svg+xml', sizes: '180x180' }],
  },
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl-NL" className={inter.variable} suppressHydrationWarning>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
