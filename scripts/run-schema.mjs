import pg from 'pg';
import { readFileSync } from 'fs';

// Try ALL possible Supabase regions including Fly.io-based ones
const regions = [
  // AWS regions
  'aws-0-eu-central-1',
  'aws-0-eu-west-1', 
  'aws-0-eu-west-2',
  'aws-0-eu-west-3',
  'aws-0-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1',
  'aws-0-us-west-2',
  'aws-0-ap-southeast-1',
  'aws-0-ap-southeast-2',
  'aws-0-ap-northeast-1',
  'aws-0-ap-northeast-2',
  'aws-0-ap-south-1',
  'aws-0-ca-central-1',
  'aws-0-sa-east-1',
  'aws-0-me-south-1',
  'aws-0-af-south-1',
  // Fly regions
  'fly-0-iad',
  'fly-0-sea',
  'fly-0-lax',
  'fly-0-ord',
  'fly-0-sjc',
  'fly-0-lhr',
  'fly-0-cdg',
  'fly-0-ams',
  'fly-0-fra',
  'fly-0-gru',
  'fly-0-sin',
  'fly-0-hkg',
  'fly-0-nrt',
  'fly-0-syd',
];

const ref = 'rzyutwarhhmkkxgrtqto';
const password = 'Karim2311@allah';

async function tryConnect(region) {
  const connString = `postgresql://postgres.${ref}:${encodeURIComponent(password)}@${region}.pooler.supabase.com:6543/postgres`;
  const client = new pg.Client({ connectionString: connString, connectionTimeoutMillis: 5000 });
  try {
    await client.connect();
    await client.query('SELECT 1 as ok');
    console.log(`✅ Connected via ${region}!`);
    return { client, region };
  } catch (err) {
    const msg = err.message.split('\n')[0];
    if (!msg.includes('Tenant or user not found') && !msg.includes('getaddrinfo')) {
      console.log(`⚠️  ${region}: ${msg}`);
    }
    try { await client.end(); } catch {}
    return null;
  }
}

async function main() {
  console.log('🔍 Scanning all Supabase regions...\n');
  
  const batchSize = 10;
  let connected = null;

  for (let i = 0; i < regions.length && !connected; i += batchSize) {
    const batch = regions.slice(i, i + batchSize);
    console.log(`  Trying batch: ${batch.join(', ')}`);
    const results = await Promise.allSettled(batch.map(r => tryConnect(r)));
    
    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        connected = result.value;
        break;
      }
    }
  }
  
  if (!connected) {
    console.log('\n❌ Could not connect to any region.');
    console.log('\nPlease go to your Supabase dashboard:');
    console.log(`  1. https://supabase.com/dashboard/project/${ref}/settings/database`);
    console.log('  2. Copy the "Connection string" (URI format)');
    console.log('  3. Share it here so I can connect\n');
    console.log('OR run the SQL manually:');
    console.log(`  1. Go to https://supabase.com/dashboard/project/${ref}/sql/new`);
    console.log('  2. Paste contents of supabase/schema.sql');
    console.log('  3. Click "Run"\n');
    process.exit(1);
  }

  console.log(`\n🔧 Running schema on ${connected.region}...\n`);
  
  const sql = readFileSync('supabase/schema.sql', 'utf8');
  
  try {
    await connected.client.query(sql);
    console.log('✅ Schema created successfully!');
    
    const tables = await connected.client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    console.log('\n📋 Tables created:');
    tables.rows.forEach(r => console.log(`   - ${r.table_name}`));
    
    const plans = await connected.client.query('SELECT slug, price FROM plans ORDER BY sort_order');
    console.log('\n💰 Plans seeded:');
    plans.rows.forEach(r => console.log(`   - ${r.slug}: ${r.price} CHF`));
    
  } catch (err) {
    console.error('❌ Error running schema:', err.message);
  } finally {
    await connected.client.end();
  }
}

main();
