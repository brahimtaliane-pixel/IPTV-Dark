import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://rzyutwarhhmkkxgrtqto.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eXV0d2FyaGhta2t4Z3J0cXRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzNzY2MCwiZXhwIjoyMDg2MTEzNjYwfQ.uD1y_V8COvLvGxWHkyF6_AhEHcdCMZzQZBlyvFBbo2U'
);

const ALL_PLANS = [
  // ── 1 Screen Plans ──
  {
    slug: 'abonnement-iptv-3-mois',
    duration: 3, price: 35.99, original_price: 51.41, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 1,
    name_fr: 'Abonnement IPTV 3 Mois', name_de: 'IPTV Abo 3 Monate',
    description_fr: 'Idéal pour découvrir notre service premium',
    description_de: 'Ideal zum Entdecken unseres Premium-Service',
    payment_link: 'https://iptvsuisse.ch/standard',
  },
  {
    slug: 'abonnement-iptv-6-mois',
    duration: 6, price: 44.99, original_price: 64.27, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 2,
    name_fr: 'Abonnement IPTV 6 Mois', name_de: 'IPTV Abo 6 Monate',
    description_fr: "L'équilibre parfait entre durée et prix",
    description_de: 'Die perfekte Balance zwischen Dauer und Preis',
    payment_link: 'https://iptvsuisse.ch/express',
  },
  {
    slug: 'abonnement-iptv-12-mois',
    duration: 12, price: 59.99, original_price: 85.70, devices: 1,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: true, is_active: true, sort_order: 3,
    name_fr: 'Abonnement IPTV 12 Mois', name_de: 'IPTV Abo 12 Monate',
    description_fr: 'Notre meilleur rapport qualité-prix — Recommandé',
    description_de: 'Unser bestes Preis-Leistungs-Verhältnis — Empfohlen',
    payment_link: 'https://supremeiptv.ch/Premium',
  },
  // ── 2 Screens Plans ──
  {
    slug: '2-ecrans-3-mois',
    duration: 3, price: 53.99, original_price: 77.13, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 4,
    name_fr: '2 Écrans 3 Mois', name_de: '2 Bildschirme 3 Monate',
    description_fr: 'Partagez votre abonnement sur 2 appareils simultanément',
    description_de: 'Teilen Sie Ihr Abo auf 2 Geräten gleichzeitig',
    payment_link: '',
  },
  {
    slug: '2-ecrans-6-mois',
    duration: 6, price: 67.99, original_price: 97.13, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 5,
    name_fr: '2 Écrans 6 Mois', name_de: '2 Bildschirme 6 Monate',
    description_fr: '6 mois de streaming sur 2 écrans',
    description_de: '6 Monate Streaming auf 2 Bildschirmen',
    payment_link: '',
  },
  {
    slug: '2-ecrans-12-mois',
    duration: 12, price: 89.99, original_price: 128.56, devices: 2,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 6,
    name_fr: '2 Écrans 12 Mois', name_de: '2 Bildschirme 12 Monate',
    description_fr: 'Le meilleur prix pour 2 écrans — 1 an complet',
    description_de: 'Bester Preis für 2 Bildschirme — 1 ganzes Jahr',
    payment_link: '',
  },
  // ── 3 Screens Plans ──
  {
    slug: '3-ecrans-3-mois',
    duration: 3, price: 80.99, original_price: 115.70, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 7,
    name_fr: '3 Écrans 3 Mois', name_de: '3 Bildschirme 3 Monate',
    description_fr: 'Pour toute la famille — 3 appareils simultanés',
    description_de: 'Für die ganze Familie — 3 gleichzeitige Geräte',
    payment_link: '',
  },
  {
    slug: '3-ecrans-6-mois',
    duration: 6, price: 101.99, original_price: 145.70, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 8,
    name_fr: '3 Écrans 6 Mois', name_de: '3 Bildschirme 6 Monate',
    description_fr: '6 mois pour 3 écrans — idéal pour les familles',
    description_de: '6 Monate für 3 Bildschirme — ideal für Familien',
    payment_link: '',
  },
  {
    slug: '3-ecrans-12-mois',
    duration: 12, price: 134.99, original_price: 192.84, devices: 3,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 9,
    name_fr: '3 Écrans 12 Mois', name_de: '3 Bildschirme 12 Monate',
    description_fr: '1 an complet pour 3 écrans — meilleur prix familial',
    description_de: '1 ganzes Jahr für 3 Bildschirme — bester Familienpreis',
    payment_link: '',
  },
  // ── 4 Screens Plans ──
  {
    slug: '4-ecrans-3-mois',
    duration: 3, price: 107.99, original_price: 154.27, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 10,
    name_fr: '4 Écrans 3 Mois', name_de: '4 Bildschirme 3 Monate',
    description_fr: 'Maximum de connexions — 4 appareils simultanés',
    description_de: 'Maximale Verbindungen — 4 gleichzeitige Geräte',
    payment_link: '',
  },
  {
    slug: '4-ecrans-6-mois',
    duration: 6, price: 134.99, original_price: 192.84, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
    is_popular: false, is_active: true, sort_order: 11,
    name_fr: '4 Écrans 6 Mois', name_de: '4 Bildschirme 6 Monate',
    description_fr: '6 mois sur 4 écrans pour toute la maison',
    description_de: '6 Monate auf 4 Bildschirmen für das ganze Haus',
    payment_link: '',
  },
  {
    slug: '4-ecrans-12-mois',
    duration: 12, price: 179.99, original_price: 257.13, devices: 4,
    features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
    is_popular: false, is_active: true, sort_order: 12,
    name_fr: '4 Écrans 12 Mois', name_de: '4 Bildschirme 12 Monate',
    description_fr: 'Offre ultime — 4 écrans pendant 1 an complet',
    description_de: 'Ultimatives Angebot — 4 Bildschirme für 1 ganzes Jahr',
    payment_link: '',
  },
];

async function seedPlans() {
  console.log('🔧 Seeding all 12 plans...\n');

  // Delete existing plans first
  const { error: deleteError } = await supabase.from('plans').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.log('⚠️  Could not clear existing plans:', deleteError.message);
  } else {
    console.log('✅ Cleared existing plans');
  }

  // Insert all plans
  const { data, error } = await supabase.from('plans').insert(ALL_PLANS).select();

  if (error) {
    console.error('❌ Error inserting plans:', error.message);
    return;
  }

  console.log(`\n✅ Inserted ${data.length} plans:\n`);

  // Group by devices
  const groups = {};
  data.forEach(p => {
    const key = `${p.devices} Screen${p.devices > 1 ? 's' : ''}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  for (const [group, plans] of Object.entries(groups)) {
    console.log(`── ${group} ──`);
    plans.forEach(p => {
      const popular = p.is_popular ? ' ⭐ POPULAR' : '';
      const link = p.payment_link ? ' 🔗' : ' ⚠️ no payment link';
      console.log(`   ${p.name_fr}: ${p.price} CHF (was ${p.original_price} CHF)${popular}${link}`);
    });
    console.log('');
  }

  console.log('🎉 Done! All 12 plans are now in the database.');
}

seedPlans().catch(console.error);
