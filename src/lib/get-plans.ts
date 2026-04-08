import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { PLANS as STATIC_PLANS } from '@/lib/constants';

export type SitePlan = {
  id: string;
  slug: string;
  duration: number;
  price: number;
  original_price?: number;
  devices: number;
  features: string[];
  payment_link: string;
  is_popular: boolean;
  is_active: boolean;
  name_nl: string;
  name_de: string;
  description_nl: string;
  description_de: string;
  image: string;
  created_at: string;
};

type DbPlanRow = {
  id: string;
  slug: string;
  duration: number;
  price: number;
  original_price: number | null;
  devices: number;
  features: string[] | null;
  payment_link: string | null;
  is_popular: boolean;
  is_active: boolean;
  name_fr: string;
  name_de: string;
  description_fr: string | null;
  description_de: string | null;
};

function imageForSlug(slug: string): string {
  const s = STATIC_PLANS.find((p) => p.slug === slug);
  return s?.image ?? '/images/plans/abonnement-iptv-3-mois.png';
}

function rowToSitePlan(row: DbPlanRow): SitePlan {
  const canonical = STATIC_PLANS.find((s) => s.slug === row.slug);
  return {
    id: row.id,
    slug: row.slug,
    duration: row.duration,
    price: Number(row.price),
    original_price: row.original_price != null ? Number(row.original_price) : undefined,
    devices: row.devices,
    features: Array.isArray(row.features) ? row.features : [],
    payment_link: row.payment_link ?? '',
    is_popular: row.is_popular,
    is_active: row.is_active,
    // Prefer canonical Dutch titles for known slugs (avoids SSR/CSR drift vs admin "name_fr"); DB still drives price/links
    name_nl: canonical?.name_nl ?? row.name_fr,
    name_de: canonical?.name_de ?? row.name_de,
    description_nl:
      row.description_fr?.trim() !== '' && row.description_fr != null
        ? row.description_fr
        : (canonical?.description_nl ?? ''),
    description_de:
      row.description_de?.trim() !== '' && row.description_de != null
        ? row.description_de
        : (canonical?.description_de ?? ''),
    image: imageForSlug(row.slug),
    created_at: new Date().toISOString(),
  };
}

function staticToSitePlan(p: (typeof STATIC_PLANS)[number]): SitePlan {
  return {
    id: String(p.id),
    slug: p.slug,
    duration: p.duration,
    price: p.price,
    original_price: p.original_price,
    devices: p.devices,
    features: [...p.features],
    payment_link: p.payment_link ?? '',
    is_popular: p.is_popular,
    is_active: p.is_active,
    name_nl: p.name_nl,
    name_de: p.name_de,
    description_nl: p.description_nl,
    description_de: p.description_de,
    image: p.image,
    created_at: p.created_at,
  };
}

/**
 * Active plans for the public site — loaded from Supabase when configured,
 * otherwise falls back to `PLANS` in `constants.ts`.
 */
export async function getPlans(): Promise<SitePlan[]> {
  noStore();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return STATIC_PLANS.map(staticToSitePlan);
  }

  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data?.length) {
    return STATIC_PLANS.map(staticToSitePlan);
  }

  return (data as DbPlanRow[]).map(rowToSitePlan);
}

export async function getPlanBySlug(slug: string): Promise<SitePlan | undefined> {
  const plans = await getPlans();
  return plans.find((p) => p.slug === slug);
}

/** Homepage pricing strip: 3 mo, popular (usually 12 mo), 6 mo — computed on the server only */
export function selectHomePricingPlans(all: SitePlan[]): SitePlan[] {
  const single = all.filter((p) => p.devices === 1);
  const threeMo = single.find((p) => p.duration === 3);
  const popular = single.find((p) => p.is_popular);
  const sixMo = single.find((p) => p.duration === 6);
  const out: SitePlan[] = [];
  if (threeMo) out.push(threeMo);
  if (popular) out.push(popular);
  if (sixMo) out.push(sixMo);
  return out;
}
