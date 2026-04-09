-- Older installs may have checkout_mode = 'both'; collapse to form_only | direct_only only.

UPDATE plans
SET checkout_mode = CASE
  WHEN checkout_mode = 'both' AND payment_link IS NOT NULL AND trim(payment_link) <> '' THEN 'direct_only'
  ELSE 'form_only'
END
WHERE checkout_mode = 'both';

ALTER TABLE plans DROP CONSTRAINT IF EXISTS plans_checkout_mode_check;
ALTER TABLE plans ADD CONSTRAINT plans_checkout_mode_check
  CHECK (checkout_mode IN ('form_only', 'direct_only'));
