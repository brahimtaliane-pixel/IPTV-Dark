-- Run this in Supabase → SQL Editor if admin_settings does not exist yet.
-- Safe to re-run: INSERT uses ON CONFLICT DO NOTHING; policies are dropped/recreated.

-- 1) Table for admin panel settings (phone, WhatsApp, emails, etc.)
CREATE TABLE IF NOT EXISTS admin_settings (
  key VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- 2) Service role: full access (needed for admin API)
DROP POLICY IF EXISTS "Service role full access admin_settings" ON admin_settings;
CREATE POLICY "Service role full access admin_settings"
  ON admin_settings FOR ALL
  USING (auth.role() = 'service_role');

-- 3) Public site: read only phone + WhatsApp (anon key)
DROP POLICY IF EXISTS "Public read contact keys on admin_settings" ON admin_settings;
CREATE POLICY "Public read contact keys on admin_settings"
  ON admin_settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN ('phone_number', 'whatsapp_number'));

-- 4) Default rows (change phone/WhatsApp in Admin → Settings later)
INSERT INTO admin_settings (key, value) VALUES
  ('admin_email', 'contact@nederlandsiptv.com'),
  ('notification_email', 'contact@nederlandsiptv.com'),
  ('resend_from_name', 'IPTV Nederland'),
  ('resend_from_domain', 'nederlandsiptv.com'),
  ('auto_send_payment_email', 'true'),
  ('whatsapp_number', '+31XXXXXXXXX'),
  ('phone_number', '+31 XX XXX XX XX')
ON CONFLICT (key) DO NOTHING;
