-- ============================================================
-- IPTV Suisse - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database
-- ============================================================

-- Plans table
CREATE TABLE IF NOT EXISTS plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  duration INTEGER NOT NULL, -- months
  price DECIMAL(10,2) NOT NULL, -- CHF
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
