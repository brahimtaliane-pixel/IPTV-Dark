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
  ('admin_email', 'isaac@meilleur.iptvsuisse.ch'),
  ('notification_email', 'isaac@meilleur.iptvsuisse.ch'),
  ('resend_from_name', 'IPTV Suisse'),
  ('resend_from_domain', 'meilleur.iptvsuisse.ch'),
  ('auto_send_payment_email', 'true'),
  ('whatsapp_number', '+41XXXXXXXXX'),
  ('phone_number', '+41 XX XXX XX XX')
ON CONFLICT (key) DO NOTHING;

-- Add payment_link column to plans if not exists (should already exist)
-- Just make sure it's there
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='plans' AND column_name='payment_link') THEN
    ALTER TABLE plans ADD COLUMN payment_link TEXT;
  END IF;
END $$;
