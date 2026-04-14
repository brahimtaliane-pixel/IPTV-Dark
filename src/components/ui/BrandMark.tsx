'use client';

import { useId } from 'react';

/**
 * TV mark — lime brand bezel (matches --color-swiss-red), glass-like screen, play on a dark chip.
 */
export default function BrandMark({ className }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const bezel = `bmz-${id}`;
  const screenShine = `bms-${id}`;

  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id={bezel} x1="20" y1="11" x2="20" y2="37" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4ff70" />
          <stop offset="0.45" stopColor="#c6ff3f" />
          <stop offset="1" stopColor="#3d5010" />
        </linearGradient>
        <linearGradient id={screenShine} x1="20" y1="14.5" x2="20" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity={0.55} />
          <stop offset="0.4" stopColor="#FFFFFF" stopOpacity={0} />
        </linearGradient>
      </defs>

      {/* Antennas — depth + lime rods + tips */}
      <line x1="13.2" y1="11.8" x2="9" y2="3.2" stroke="#1a2e0a" strokeWidth="2.8" strokeLinecap="round" opacity={0.35} />
      <line x1="13" y1="11.8" x2="9" y2="3.5" stroke="#a3d635" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="3.5" r="2.5" fill="#c6ff3f" stroke="#3d5010" strokeWidth="0.45" />
      <ellipse cx="8.35" cy="2.85" rx="1.05" ry="0.7" fill="rgba(255,255,255,0.42)" />

      <line x1="26.8" y1="11.8" x2="31" y2="3.2" stroke="#1a2e0a" strokeWidth="2.8" strokeLinecap="round" opacity={0.35} />
      <line x1="27" y1="11.8" x2="31" y2="3.5" stroke="#a3d635" strokeWidth="2" strokeLinecap="round" />
      <circle cx="31" cy="3.5" r="2.5" fill="#c6ff3f" stroke="#3d5010" strokeWidth="0.45" />
      <ellipse cx="30.35" cy="2.85" rx="1.05" ry="0.7" fill="rgba(255,255,255,0.42)" />

      {/* Chassis */}
      <rect x="5" y="12" width="30" height="24" rx="4.75" fill={`url(#${bezel})`} />
      <rect x="5.5" y="12.5" width="29" height="23" rx="4.25" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.65" />
      <rect x="5" y="12" width="30" height="24" rx="4.75" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="0.8" />

      {/* Screen */}
      <rect x="8.25" y="14.75" width="23.5" height="15.5" rx="2.35" fill="#f4f4f5" />
      <rect x="8.25" y="14.75" width="23.5" height="15.5" rx="2.35" fill={`url(#${screenShine})`} />
      <rect x="8.25" y="14.75" width="23.5" height="15.5" rx="2.35" stroke="#d4d4d8" strokeWidth="0.9" />
      <rect x="8.25" y="14.75" width="23.5" height="15.5" rx="2.35" stroke="rgba(255,255,255,0.85)" strokeWidth="0.35" opacity={0.9} />

      {/* Play — dark chip + lime triangle (matches CTA: black + accent) */}
      <circle cx="20" cy="22.5" r="6.2" fill="#0a0a0a" stroke="rgba(198,255,63,0.35)" strokeWidth="0.55" />
      <path
        d="M18.1 19.85 L23.95 22.5 L18.1 25.15 Z"
        fill="#c6ff3f"
        stroke="#3d5010"
        strokeWidth="0.35"
        strokeLinejoin="round"
      />
    </svg>
  );
}
