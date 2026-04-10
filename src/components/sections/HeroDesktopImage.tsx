'use client';

import Image from 'next/image';
import { useSyncExternalStore } from 'react';

const LG = '(min-width: 1024px)';

function subscribe(onChange: () => void) {
  const mql = window.matchMedia(LG);
  mql.addEventListener('change', onChange);
  return () => mql.removeEventListener('change', onChange);
}

function getServerSnapshot() {
  return false;
}

function getSnapshot() {
  return window.matchMedia(LG).matches;
}

/**
 * Loads hero PNG only on lg+ so mobile PageSpeed does not download a hidden image.
 */
export default function HeroDesktopImage({
  alt,
  badgeText,
}: {
  alt: string;
  badgeText: string;
}) {
  const isLg = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isLg) return null;

  return (
    <div className="relative">
      <div className="relative group">
        <div
          className="absolute inset-0 bg-swiss-red/[0.04] rounded-[2rem] blur-3xl scale-95 opacity-70 pointer-events-none"
          aria-hidden
        />
        <div className="relative bg-transparent">
          <Image
            src="/images/hero-devices.png"
            alt={alt}
            width={612}
            height={408}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="relative w-full h-auto object-contain bg-transparent transition-transform duration-500 group-hover:scale-[1.01]"
            priority
            unoptimized
          />
        </div>
        <div className="absolute -top-3 -right-3 bg-swiss-red text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
          {badgeText}
        </div>
      </div>
    </div>
  );
}
