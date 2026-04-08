// ============================================================
// Utility Functions
// ============================================================

import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(price: number): string {
  return price % 1 === 0 ? price.toString() : price.toFixed(2);
}

export function getMonthlyPrice(price: number, duration: number): string {
  return (price / duration).toFixed(2);
}

export function getDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

// ─── Locale URL helpers (as-needed prefix) ───────────────────
// French (default) → no prefix: https://meilleur.iptv-suisse.com/path
// German           → prefix:    https://meilleur.iptv-suisse.com/de/path
import { SITE_CONFIG } from './constants';

export function localeUrl(locale: string, path: string = '') {
  if (locale === 'fr') {
    return `${SITE_CONFIG.url}${path}`;
  }
  return `${SITE_CONFIG.url}/${locale}${path}`;
}

export function localeAlternates(path: string = '') {
  return {
    canonical: undefined as string | undefined, // set by caller
    languages: {
      'fr-CH': `${SITE_CONFIG.url}${path}`,
      'de-CH': `${SITE_CONFIG.url}/de${path}`,
      'x-default': `${SITE_CONFIG.url}${path}`,
    },
  };
}
