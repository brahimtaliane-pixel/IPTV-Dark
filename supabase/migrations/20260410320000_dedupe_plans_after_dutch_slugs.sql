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
