import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page non disponible',
  description: 'Cette page n\'est pas disponible.',
  robots: { index: false, follow: false },
};

export default function GeoBlockedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a1a] px-6 text-white">
      <div className="max-w-md text-center">
        <p className="mb-2 text-6xl">🚧</p>
        <h1 className="mb-4 text-2xl font-semibold tracking-tight">
          Page non disponible
        </h1>
        <p className="text-gray-400">
          Cette page est actuellement en maintenance.
        </p>
      </div>
    </div>
  );
}
