import { createClient } from '@supabase/supabase-js';
import { loadEnvFiles } from './load-env.mjs';

loadEnvFiles();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

// DB columns are name_fr / description_fr but content is Dutch (primary locale for this site); name_de / description_de = German
const ALL_PLANS = [
  // ── 1 Screen Plans ──
  {
    slug: 'abonnement-iptv-3-maanden',
    duration: 3, price: 35.99, original_price: 51.41, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 1,
    name_fr: 'IPTV-abonnement 3 maanden', name_de: 'IPTV Abo 3 Monate',
    description_fr: 'Ideaal om onze premium service uit te proberen',
    description_de: 'Ideal zum Entdecken unseres Premium-Service',
    payment_link: '',
  },
  {
    slug: 'abonnement-iptv-6-maanden',
    duration: 6, price: 44.99, original_price: 64.27, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 2,
    name_fr: 'IPTV-abonnement 6 maanden', name_de: 'IPTV Abo 6 Monate',
    description_fr: 'De beste balans tussen looptijd en prijs',
    description_de: 'Die perfekte Balance zwischen Dauer und Preis',
    payment_link: '',
  },
  {
    slug: 'abonnement-iptv-12-maanden',
    duration: 12, price: 59.99, original_price: 85.7, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: true, is_active: true, sort_order: 3,
    name_fr: 'IPTV-abonnement 12 maanden', name_de: 'IPTV Abo 12 Monate',
    description_fr: 'Onze beste prijs-kwaliteit — aanbevolen',
    description_de: 'Unser bestes Preis-Leistungs-Verhältnis — Empfohlen',
    payment_link: '',
  },
  // ── 2 Screens Plans ──
  {
    slug: '2-schermen-3-maanden',
    duration: 3, price: 53.99, original_price: 77.13, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 4,
    name_fr: '2 schermen — 3 maanden', name_de: '2 Bildschirme 3 Monate',
    description_fr: 'Deel je abonnement op 2 apparaten tegelijk',
    description_de: 'Teilen Sie Ihr Abo auf 2 Geräten gleichzeitig',
    payment_link: '',
  },
  {
    slug: '2-schermen-6-maanden',
    duration: 6, price: 67.99, original_price: 97.13, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 5,
    name_fr: '2 schermen — 6 maanden', name_de: '2 Bildschirme 6 Monate',
    description_fr: 'Zes maanden streamen op twee schermen',
    description_de: '6 Monate Streaming auf 2 Bildschirmen',
    payment_link: '',
  },
  {
    slug: '2-schermen-12-maanden',
    duration: 12, price: 89.99, original_price: 128.56, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 6,
    name_fr: '2 schermen — 12 maanden', name_de: '2 Bildschirme 12 Monate',
    description_fr: 'Beste prijs voor twee schermen — een vol jaar',
    description_de: 'Bester Preis für 2 Bildschirme — 1 ganzes Jahr',
    payment_link: '',
  },
  // ── 3 Screens Plans ──
  {
    slug: '3-schermen-3-maanden',
    duration: 3, price: 80.99, original_price: 115.7, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 7,
    name_fr: '3 schermen — 3 maanden', name_de: '3 Bildschirme 3 Monate',
    description_fr: 'Voor het hele gezin — drie apparaten tegelijk',
    description_de: 'Für die ganze Familie — 3 gleichzeitige Geräte',
    payment_link: '',
  },
  {
    slug: '3-schermen-6-maanden',
    duration: 6, price: 101.99, original_price: 145.7, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 8,
    name_fr: '3 schermen — 6 maanden', name_de: '3 Bildschirme 6 Monate',
    description_fr: 'Zes maanden voor drie schermen — ideaal voor gezinnen',
    description_de: '6 Monate für 3 Bildschirme — ideal für Familien',
    payment_link: '',
  },
  {
    slug: '3-schermen-12-maanden',
    duration: 12, price: 134.99, original_price: 192.84, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 9,
    name_fr: '3 schermen — 12 maanden', name_de: '3 Bildschirme 12 Monate',
    description_fr: 'Een vol jaar voor drie schermen — beste gezinsdeal',
    description_de: '1 ganzes Jahr für 3 Bildschirme — bester Familienpreis',
    payment_link: '',
  },
  // ── 4 Screens Plans ──
  {
    slug: '4-schermen-3-maanden',
    duration: 3, price: 107.99, original_price: 154.27, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 10,
    name_fr: '4 schermen — 3 maanden', name_de: '4 Bildschirme 3 Monate',
    description_fr: 'Maximaal parallel — vier apparaten tegelijk',
    description_de: 'Maximale Verbindungen — 4 gleichzeitige Geräte',
    payment_link: '',
  },
  {
    slug: '4-schermen-6-maanden',
    duration: 6, price: 134.99, original_price: 192.84, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 11,
    name_fr: '4 schermen — 6 maanden', name_de: '4 Bildschirme 6 Monate',
    description_fr: 'Zes maanden op vier schermen voor het hele huishouden',
    description_de: '6 Monate auf 4 Bildschirmen für das ganze Haus',
    payment_link: '',
  },
  {
    slug: '4-schermen-12-maanden',
    duration: 12, price: 179.99, original_price: 257.13, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 12,
    name_fr: '4 schermen — 12 maanden', name_de: '4 Bildschirme 12 Monate',
    description_fr: 'Topdeal — vier schermen voor een vol jaar',
    description_de: 'Ultimatives Angebot — 4 Bildschirme für 1 ganzes Jahr',
    payment_link: '',
  },
];

async function seedPlans() {
  console.log('🔧 Upserting all 12 plans (NL primary; by slug)...\n');

  const { data, error } = await supabase
    .from('plans')
    .upsert(ALL_PLANS, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('❌ Error upserting plans:', error.message);
    return;
  }

  console.log(`\n✅ Upserted ${data.length} plans:\n`);

  const groups = {};
  data.forEach((p) => {
    const key = `${p.devices} Screen${p.devices > 1 ? 's' : ''}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  for (const [group, plans] of Object.entries(groups)) {
    console.log(`── ${group} ──`);
    plans.forEach((p) => {
      const popular = p.is_popular ? ' ⭐ POPULAR' : '';
      const link = p.payment_link ? ' 🔗' : ' ⚠️ no payment link';
      console.log(`   ${p.name_fr}: ${p.price} EUR (was ${p.original_price} EUR)${popular}${link}`);
    });
    console.log('');
  }

  console.log('🎉 Done! All 12 plans are now in the database (Dutch + German).');
}

seedPlans().catch(console.error);
