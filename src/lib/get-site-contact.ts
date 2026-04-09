import { cache } from 'react';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@/lib/supabase';
import { SITE_CONFIG } from '@/lib/constants';

export type SiteContact = {
  phone: string;
  /** Base WhatsApp URL (e.g. https://wa.me/31612345678), no prefilled text */
  whatsappUrl: string;
};

function normalizeWhatsappToUrl(raw: string | undefined): string {
  const fallback = SITE_CONFIG.whatsapp;
  if (!raw?.trim()) return fallback;
  const trimmed = raw.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const digits = trimmed.replace(/\D/g, '');
  if (!digits) return fallback;
  return `https://wa.me/${digits}`;
}

const fallbackContact = (): SiteContact => ({
  phone: SITE_CONFIG.phone,
  whatsappUrl: SITE_CONFIG.whatsapp,
});

/**
 * Phone + WhatsApp from admin_settings (admin panel). Falls back to SITE_CONFIG when unset or on error.
 * Uses service role when available; otherwise anon + RLS policy (see migration public_read_contact_settings).
 * `noStore()` avoids Next.js caching stale contact info on the layout.
 */
export const getSiteContact = cache(async (): Promise<SiteContact> => {
  noStore();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let client;
  if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
    client = createServerClient();
  } else if (url && anonKey) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    });
  } else {
    return fallbackContact();
  }

  try {
    const { data, error } = await client
      .from('admin_settings')
      .select('key, value')
      .in('key', ['phone_number', 'whatsapp_number']);

    if (error) {
      console.error('[getSiteContact]', error.message);
      return fallbackContact();
    }
    if (!data?.length) {
      return fallbackContact();
    }

    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]));
    const phone = map.phone_number?.trim() || SITE_CONFIG.phone;
    const whatsappUrl = normalizeWhatsappToUrl(map.whatsapp_number);

    return { phone, whatsappUrl };
  } catch (e) {
    console.error('[getSiteContact]', e);
    return fallbackContact();
  }
});
