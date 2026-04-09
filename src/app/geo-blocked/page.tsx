import type { Metadata } from 'next';
import { SITE_CONFIG } from '@/lib/constants';

export const metadata: Metadata = {
  title: `Niet beschikbaar | ${SITE_CONFIG.name}`,
  description: `Deze pagina is tijdelijk niet beschikbaar — ${SITE_CONFIG.name}.`,
  robots: { index: false, follow: false },
};

export default function GeoBlockedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a1a] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="mb-2 text-6xl" aria-hidden>
          🚧
        </p>
        <p className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">{SITE_CONFIG.name}</p>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">Pagina niet beschikbaar</h1>
        <p className="text-gray-400">
          Deze pagina is tijdelijk niet bereikbaar. Probeer het later opnieuw of ga terug naar de homepage.
        </p>
      </div>
    </div>
  );
}
