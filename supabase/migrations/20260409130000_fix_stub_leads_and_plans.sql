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
