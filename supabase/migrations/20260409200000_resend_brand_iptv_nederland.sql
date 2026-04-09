-- Update email sender display name if admin_settings exists (safe if row missing)
UPDATE admin_settings
SET value = 'IPTV Nederland', updated_at = NOW()
WHERE key = 'resend_from_name';
