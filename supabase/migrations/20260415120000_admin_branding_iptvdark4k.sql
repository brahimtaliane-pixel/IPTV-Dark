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
