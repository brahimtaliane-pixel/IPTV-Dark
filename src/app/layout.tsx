import '@/app/globals.css';
import { Inter } from 'next/font/google';

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
