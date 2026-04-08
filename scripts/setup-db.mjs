// Run: node scripts/setup-db.mjs
// This script sets up the Supabase database schema

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const supabaseUrl = 'https://rzyutwarhhmkkxgrtqto.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6eXV0d2FyaGhta2t4Z3J0cXRvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDUzNzY2MCwiZXhwIjoyMDg2MTEzNjYwfQ.uD1y_V8COvLvGxWHkyF6_AhEHcdCMZzQZBlyvFBbo2U';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  db: { schema: 'public' },
});

async function setupDatabase() {
  console.log('🔧 Setting up IPTV Suisse database...\n');

  // Test connection
  console.log('1. Testing connection...');
  const { data: test, error: testError } = await supabase.from('plans').select('count').limit(1);
  
  if (testError && testError.code === '42P01') {
    console.log('   → Tables don\'t exist yet. You need to run the SQL schema manually.\n');
    console.log('   📋 Please go to your Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/rzyutwarhhmkkxgrtqto/sql/new\n');
    console.log('   Then paste and run the contents of: supabase/schema.sql\n');
    
    // Try alternative: use the rpc to check
    console.log('   Alternatively, trying to create tables via REST...');
    
    // We can't run raw SQL via REST, but we CAN insert data if tables exist
    // The user needs to run the SQL manually in the Supabase dashboard
    return false;
  } else if (testError) {
    console.log('   ❌ Connection error:', testError.message);
    return false;
  } else {
    console.log('   ✅ Connected! Tables already exist.');
  }

  // Check if plans have data
  console.log('\n2. Checking plans data...');
  const { data: plans, error: plansError } = await supabase
    .from('plans')
    .select('*')
    .order('sort_order');

  if (plansError) {
    console.log('   ❌ Error reading plans:', plansError.message);
  } else if (plans.length === 0) {
    console.log('   → No plans found. Inserting seed data...');
    
    const { error: insertError } = await supabase.from('plans').insert([
      {
        slug: 'abonnement-iptv-3-mois',
        duration: 3,
        price: 25.00,
        original_price: 45.00,
        devices: 1,
        features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
        is_popular: false,
        name_fr: 'Abonnement IPTV 3 Mois',
        name_de: 'IPTV Abo 3 Monate',
        description_fr: 'Idéal pour découvrir notre service premium',
        description_de: 'Ideal zum Entdecken unseres Premium-Service',
        sort_order: 1,
      },
      {
        slug: 'abonnement-iptv-6-mois',
        duration: 6,
        price: 35.00,
        original_price: 70.00,
        devices: 1,
        features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
        is_popular: false,
        name_fr: 'Abonnement IPTV 6 Mois',
        name_de: 'IPTV Abo 6 Monate',
        description_fr: "L'équilibre parfait entre durée et prix",
        description_de: 'Die perfekte Balance zwischen Dauer und Preis',
        sort_order: 3,
      },
      {
        slug: 'abonnement-iptv-12-mois',
        duration: 12,
        price: 59.99,
        original_price: 119.99,
        devices: 1,
        features: ['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
        is_popular: true,
        name_fr: 'Abonnement IPTV 12 Mois',
        name_de: 'IPTV Abo 12 Monate',
        description_fr: 'Notre meilleur rapport qualité-prix',
        description_de: 'Unser bestes Preis-Leistungs-Verhältnis',
        sort_order: 2,
      },
    ]);

    if (insertError) {
      console.log('   ❌ Error inserting plans:', insertError.message);
    } else {
      console.log('   ✅ Plans inserted successfully!');
    }
  } else {
    console.log(`   ✅ ${plans.length} plans found:`);
    plans.forEach(p => console.log(`      - ${p.name_fr} (${p.price} CHF)`));
  }

  // Check leads table
  console.log('\n3. Checking leads table...');
  const { count, error: leadsError } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  if (leadsError) {
    console.log('   ❌ Error:', leadsError.message);
  } else {
    console.log(`   ✅ Leads table ready (${count || 0} leads)`);
  }

  // Check click_tracking table
  console.log('\n4. Checking click_tracking table...');
  const { error: clickError } = await supabase
    .from('click_tracking')
    .select('*', { count: 'exact', head: true });

  if (clickError) {
    console.log('   ❌ Error:', clickError.message);
  } else {
    console.log('   ✅ Click tracking table ready');
  }

  console.log('\n🎉 Database setup complete!\n');
  return true;
}

setupDatabase().catch(console.error);
