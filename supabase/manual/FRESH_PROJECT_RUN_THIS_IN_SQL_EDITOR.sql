-- ============================================================
-- IPTV Dark — ONE-SHOT SCHEMA (new empty Supabase project)
-- Paste into SQL Editor → Run once. Safe on empty DB.
-- Order: dedupe (103200) runs BEFORE rename (103100) to avoid slug conflicts.
-- ============================================================


-- === 20260208000000_initial_schema.sql ===
-- ============================================================
-- IPTV Nederland - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  duration INTEGER NOT NULL, -- months
  price DECIMAL(10,2) NOT NULL, -- EUR
  original_price DECIMAL(10,2),
  devices INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  payment_link TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  name_fr VARCHAR(255) NOT NULL,
  name_de VARCHAR(255) NOT NULL,
  description_fr TEXT,
  description_de TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table (CRM)
CREATE TABLE IF NOT EXISTS leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id),
  plan_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  locale VARCHAR(5) DEFAULT 'fr',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'email_sent', 'clicked', 'converted', 'cancelled')),
  payment_link TEXT,
  click_count INTEGER DEFAULT 0,
  payment_clicked_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Click tracking table
CREATE TABLE IF NOT EXISTS click_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT
);

-- FAQs table (bilingual)
CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_fr TEXT NOT NULL,
  question_de TEXT NOT NULL,
  answer_fr TEXT NOT NULL,
  answer_de TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Testimonials table (bilingual)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text_fr TEXT NOT NULL,
  text_de TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_plans_slug ON plans(slug);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_click_tracking_lead_id ON click_tracking(lead_id);

-- RPC function to increment click count atomically
CREATE OR REPLACE FUNCTION increment_click_count(lead_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE leads
  SET click_count = click_count + 1,
      status = 'clicked',
      payment_clicked_at = COALESCE(payment_clicked_at, NOW()),
      updated_at = NOW()
  WHERE id = lead_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;

-- Public read access for plans, faqs, testimonials
CREATE POLICY "Public read plans" ON plans FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);

-- Leads: insert publicly, read/update with service role only
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (auth.role() = 'service_role');

-- Click tracking: insert publicly
CREATE POLICY "Public insert clicks" ON click_tracking FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Service role full access clicks" ON click_tracking FOR ALL USING (auth.role() = 'service_role');

-- ============================================================
-- SEED DATA - Initial plans
-- ============================================================

INSERT INTO plans (slug, duration, price, original_price, devices, features, is_popular, name_fr, name_de, description_fr, description_de, sort_order)
VALUES 
  ('abonnement-iptv-3-mois', 3, 25.00, 45.00, 1, 
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
   FALSE, 'Abonnement IPTV 3 Mois', 'IPTV Abo 3 Monate',
   'Idéal pour découvrir notre service premium', 'Ideal zum Entdecken unseres Premium-Service', 1),
  
  ('abonnement-iptv-6-mois', 6, 35.00, 70.00, 1,
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
   FALSE, 'Abonnement IPTV 6 Mois', 'IPTV Abo 6 Monate',
   'L''équilibre parfait entre durée et prix', 'Die perfekte Balance zwischen Dauer und Preis', 3),
  
  ('abonnement-iptv-12-mois', 12, 59.99, 119.99, 1,
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
   TRUE, 'Abonnement IPTV 12 Mois', 'IPTV Abo 12 Monate',
   'Notre meilleur rapport qualité-prix', 'Unser bestes Preis-Leistungs-Verhältnis', 2)
ON CONFLICT (slug) DO NOTHING;


-- === 20260208100000_admin_setup.sql ===
-- ============================================================
-- Admin Setup Migration
-- ============================================================

-- Admin settings table (key-value store for site configuration)
CREATE TABLE IF NOT EXISTS admin_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Only service role can access admin_settings
CREATE POLICY "Service role full access admin_settings" ON admin_settings FOR ALL USING (auth.role() = 'service_role');

-- Insert default settings
INSERT INTO admin_settings (key, value) VALUES 
  ('admin_email', 'contact@nederlandsiptv.com'),
  ('notification_email', 'contact@nederlandsiptv.com'),
  ('resend_from_name', 'IPTV Nederland'),
  ('resend_from_domain', 'nederlandsiptv.com'),
  ('auto_send_payment_email', 'true'),
  ('whatsapp_number', '+31XXXXXXXXX'),
  ('phone_number', '+31 XX XXX XX XX')
ON CONFLICT (key) DO NOTHING;

-- Add payment_link column to plans if not exists (should already exist)
-- Just make sure it's there
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='plans' AND column_name='payment_link') THEN
    ALTER TABLE plans ADD COLUMN payment_link TEXT;
  END IF;
END $$;


-- === 20260215000000_conversations.sql ===
-- ============================================================
-- Conversations & Messages (Email Inbox System)
-- ============================================================

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  subject TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  references_header TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_customer_email ON conversations(customer_email);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access conversations" ON conversations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access messages" ON messages FOR ALL USING (auth.role() = 'service_role');


-- === 20260216000000_live_chat.sql ===
-- Live Chat tables
-- chat_sessions: one per visitor browser session
-- chat_messages: individual messages within a session

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  page_url TEXT,
  locale TEXT DEFAULT 'fr',
  unread_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access chat_sessions" ON chat_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can insert chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can read own chat_sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Anon can update own chat_sessions" ON chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Anon can insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can read chat_messages" ON chat_messages FOR SELECT USING (true);


-- === 20260216100000_live_visitors.sql ===
-- Live Visitors tracking table
-- Rows are upserted on heartbeat and considered "offline" after 30s without update

CREATE TABLE IF NOT EXISTS live_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL UNIQUE,
  email TEXT,
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  locale TEXT DEFAULT 'fr',
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_visitors_last_seen ON live_visitors(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_visitors_visitor_id ON live_visitors(visitor_id);

ALTER TABLE live_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access live_visitors" ON live_visitors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon can upsert live_visitors" ON live_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update live_visitors" ON live_visitors FOR UPDATE USING (true);


-- === 20260409130000_fix_stub_leads_and_plans.sql ===
-- ============================================================
-- One-time fix for Supabase projects that only had a stub `leads`
-- table (e.g. bigint id + created_at) and no `plans` table.
-- Run in SQL Editor if lead forms return 500 / PGRST204.
-- ============================================================

DROP TABLE IF EXISTS click_tracking CASCADE;
DROP TABLE IF EXISTS leads CASCADE;

-- Plans (needed for plan_id FK and public pricing from DB)
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  duration INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  devices INTEGER DEFAULT 1,
  features TEXT[] DEFAULT '{}',
  payment_link TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  name_fr VARCHAR(255) NOT NULL,
  name_de VARCHAR(255) NOT NULL,
  description_fr TEXT,
  description_de TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES plans(id),
  plan_name VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  locale VARCHAR(5) DEFAULT 'fr',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'email_sent', 'clicked', 'converted', 'cancelled')),
  payment_link TEXT,
  click_count INTEGER DEFAULT 0,
  payment_clicked_at TIMESTAMPTZ,
  ip_address VARCHAR(45),
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  email_sent_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS click_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address VARCHAR(45),
  user_agent TEXT,
  referrer TEXT
);

CREATE TABLE IF NOT EXISTS faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question_fr TEXT NOT NULL,
  question_de TEXT NOT NULL,
  answer_fr TEXT NOT NULL,
  answer_de TEXT NOT NULL,
  category VARCHAR(50) DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  text_fr TEXT NOT NULL,
  text_de TEXT NOT NULL,
  avatar_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_plans_slug ON plans(slug);
CREATE INDEX IF NOT EXISTS idx_plans_active ON plans(is_active);
CREATE INDEX IF NOT EXISTS idx_click_tracking_lead_id ON click_tracking(lead_id);

CREATE OR REPLACE FUNCTION increment_click_count(lead_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE leads
  SET click_count = click_count + 1,
      status = 'clicked',
      payment_clicked_at = COALESCE(payment_clicked_at, NOW()),
      updated_at = NOW()
  WHERE id = lead_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_plans_updated_at ON plans;
CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read plans" ON plans;
CREATE POLICY "Public read plans" ON plans FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read faqs" ON faqs;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public read testimonials" ON testimonials;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (is_active = TRUE);

DROP POLICY IF EXISTS "Public insert leads" ON leads;
CREATE POLICY "Public insert leads" ON leads FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access leads" ON leads;
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public insert clicks" ON click_tracking;
CREATE POLICY "Public insert clicks" ON click_tracking FOR INSERT WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access clicks" ON click_tracking;
CREATE POLICY "Service role full access clicks" ON click_tracking FOR ALL USING (auth.role() = 'service_role');

-- name_fr / description_fr hold Dutch (primary locale); name_de / description_de = German
INSERT INTO plans (slug, duration, price, original_price, devices, features, is_popular, name_fr, name_de, description_fr, description_de, sort_order)
VALUES
  ('abonnement-iptv-3-maanden', 3, 25.00, 45.00, 1,
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
   FALSE, 'IPTV-abonnement 3 maanden', 'IPTV Abo 3 Monate',
   'Ideaal om onze premium service uit te proberen', 'Ideal zum Entdecken unseres Premium-Service', 1),
  ('abonnement-iptv-6-maanden', 6, 35.00, 70.00, 1,
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7'],
   FALSE, 'IPTV-abonnement 6 maanden', 'IPTV Abo 6 Monate',
   'De beste balans tussen looptijd en prijs', 'Die perfekte Balance zwischen Dauer und Preis', 3),
  ('abonnement-iptv-12-maanden', 12, 59.99, 119.99, 1,
   ARRAY['premium_server', 'all_channels', 'hd_4k', 'replay_vod', 'all_devices', 'support_24_7', 'free_updates'],
   TRUE, 'IPTV-abonnement 12 maanden', 'IPTV Abo 12 Monate',
   'Onze beste prijs-kwaliteit — aanbevolen', 'Unser bestes Preis-Leistungs-Verhältnis — Empfohlen', 2)
ON CONFLICT (slug) DO NOTHING;


-- === 20260409200000_resend_brand_iptv_nederland.sql ===
-- Update email sender display name if admin_settings exists (safe if row missing)
UPDATE admin_settings
SET value = 'IPTV Nederland', updated_at = NOW()
WHERE key = 'resend_from_name';


-- === 20260409210000_admin_domain_nederlandsiptv.sql ===
-- Align email sending domain with public site (Resend / DNS)
UPDATE admin_settings
SET value = 'nederlandsiptv.com', updated_at = NOW()
WHERE key = 'resend_from_domain';


-- === 20260410120000_checkout_mode_and_click_plan.sql ===
-- Per-plan checkout: admin chooses lead form OR direct payment (one per plan)
-- Anonymous direct payment clicks (plan_id without lead_id)

ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS checkout_mode TEXT NOT NULL DEFAULT 'form_only'
  CONSTRAINT plans_checkout_mode_check CHECK (
    checkout_mode IN ('form_only', 'direct_only')
  );

ALTER TABLE click_tracking
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_click_tracking_plan_id ON click_tracking(plan_id);


-- === 20260410210000_checkout_mode_remove_both.sql ===
-- Older installs may have checkout_mode = 'both'; collapse to form_only | direct_only only.

UPDATE plans
SET checkout_mode = CASE
  WHEN checkout_mode = 'both' AND payment_link IS NOT NULL AND trim(payment_link) <> '' THEN 'direct_only'
  ELSE 'form_only'
END
WHERE checkout_mode = 'both';

ALTER TABLE plans DROP CONSTRAINT IF EXISTS plans_checkout_mode_check;
ALTER TABLE plans ADD CONSTRAINT plans_checkout_mode_check
  CHECK (checkout_mode IN ('form_only', 'direct_only'));


-- === 20260410320000_dedupe_plans_after_dutch_slugs.sql ===
-- OPTIONAL — only if `SELECT count(*) FROM plans` > 12 (duplicate rows from seeding Dutch slugs before renaming).
-- Do NOT run if you already have exactly 12 rows with Dutch slugs only.
-- Then run 20260410310000_rename_plan_slugs_dutch.sql if any French slugs remain.

DELETE FROM plans WHERE slug IN (
  'abonnement-iptv-3-maanden',
  'abonnement-iptv-6-maanden',
  'abonnement-iptv-12-maanden',
  '2-schermen-3-maanden',
  '2-schermen-6-maanden',
  '2-schermen-12-maanden',
  '3-schermen-3-maanden',
  '3-schermen-6-maanden',
  '3-schermen-12-maanden',
  '4-schermen-3-maanden',
  '4-schermen-6-maanden',
  '4-schermen-12-maanden'
);

UPDATE plans SET slug = 'abonnement-iptv-3-maanden' WHERE slug = 'abonnement-iptv-3-mois';
UPDATE plans SET slug = 'abonnement-iptv-6-maanden' WHERE slug = 'abonnement-iptv-6-mois';
UPDATE plans SET slug = 'abonnement-iptv-12-maanden' WHERE slug = 'abonnement-iptv-12-mois';
UPDATE plans SET slug = '2-schermen-3-maanden' WHERE slug = '2-ecrans-3-mois';
UPDATE plans SET slug = '2-schermen-6-maanden' WHERE slug = '2-ecrans-6-mois';
UPDATE plans SET slug = '2-schermen-12-maanden' WHERE slug = '2-ecrans-12-mois';
UPDATE plans SET slug = '3-schermen-3-maanden' WHERE slug = '3-ecrans-3-mois';
UPDATE plans SET slug = '3-schermen-6-maanden' WHERE slug = '3-ecrans-6-mois';
UPDATE plans SET slug = '3-schermen-12-maanden' WHERE slug = '3-ecrans-12-mois';
UPDATE plans SET slug = '4-schermen-3-maanden' WHERE slug = '4-ecrans-3-mois';
UPDATE plans SET slug = '4-schermen-6-maanden' WHERE slug = '4-ecrans-6-mois';
UPDATE plans SET slug = '4-schermen-12-maanden' WHERE slug = '4-ecrans-12-mois';


-- === 20260410310000_rename_plan_slugs_dutch.sql ===
-- Rename plan slugs: French-style URLs → Dutch (see src/lib/plan-slugs.ts).
-- Run in Supabase SQL Editor before deploying code that expects new slugs.
-- Safe: updates rows in place (same id; FKs unchanged).

UPDATE plans SET slug = 'abonnement-iptv-3-maanden' WHERE slug = 'abonnement-iptv-3-mois';
UPDATE plans SET slug = 'abonnement-iptv-6-maanden' WHERE slug = 'abonnement-iptv-6-mois';
UPDATE plans SET slug = 'abonnement-iptv-12-maanden' WHERE slug = 'abonnement-iptv-12-mois';
UPDATE plans SET slug = '2-schermen-3-maanden' WHERE slug = '2-ecrans-3-mois';
UPDATE plans SET slug = '2-schermen-6-maanden' WHERE slug = '2-ecrans-6-mois';
UPDATE plans SET slug = '2-schermen-12-maanden' WHERE slug = '2-ecrans-12-mois';
UPDATE plans SET slug = '3-schermen-3-maanden' WHERE slug = '3-ecrans-3-mois';
UPDATE plans SET slug = '3-schermen-6-maanden' WHERE slug = '3-ecrans-6-mois';
UPDATE plans SET slug = '3-schermen-12-maanden' WHERE slug = '3-ecrans-12-mois';
UPDATE plans SET slug = '4-schermen-3-maanden' WHERE slug = '4-ecrans-3-mois';
UPDATE plans SET slug = '4-schermen-6-maanden' WHERE slug = '4-ecrans-6-mois';
UPDATE plans SET slug = '4-schermen-12-maanden' WHERE slug = '4-ecrans-12-mois';


-- === 20260410330000_public_read_contact_settings.sql ===
-- Allow the storefront (anon key) to read only public contact fields from admin_settings.
-- Service role continues to have full access via existing policy.

CREATE POLICY "Public read contact keys on admin_settings"
  ON admin_settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN ('phone_number', 'whatsapp_number'));


-- === 20260415120000_admin_branding_iptvdark4k.sql ===
-- Final branding for IPTV Dark / iptvdark4k.nl (runs after older nederlandsiptv.nl migrations)
UPDATE admin_settings
SET value = 'IPTV Dark', updated_at = NOW()
WHERE key = 'resend_from_name';

UPDATE admin_settings
SET value = 'iptvdark4k.nl', updated_at = NOW()
WHERE key = 'resend_from_domain';

UPDATE admin_settings
SET value = 'contact@iptvdark4k.nl', updated_at = NOW()
WHERE key IN ('admin_email', 'notification_email');

