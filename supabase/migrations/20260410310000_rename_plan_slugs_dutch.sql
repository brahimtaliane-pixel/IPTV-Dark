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
