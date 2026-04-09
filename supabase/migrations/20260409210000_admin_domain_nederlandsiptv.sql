-- Align email sending domain with public site (Resend / DNS)
UPDATE admin_settings
SET value = 'nederlandsiptv.com', updated_at = NOW()
WHERE key = 'resend_from_domain';
