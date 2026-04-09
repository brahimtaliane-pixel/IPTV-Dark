-- Allow the storefront (anon key) to read only public contact fields from admin_settings.
-- Service role continues to have full access via existing policy.

CREATE POLICY "Public read contact keys on admin_settings"
  ON admin_settings
  FOR SELECT
  TO anon, authenticated
  USING (key IN ('phone_number', 'whatsapp_number'));
