-- Per-plan checkout: admin chooses lead form OR direct payment (one per plan)
-- Anonymous direct payment clicks (plan_id without lead_id)

ALTER TABLE plans
  ADD COLUMN IF NOT EXISTS checkout_mode TEXT NOT NULL DEFAULT 'form_only'
  CONSTRAINT plans_checkout_mode_check CHECK (
    checkout_mode IN ('form_only', 'direct_only')
  );

ALTER TABLE click_tracking
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES plans(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_click_tracking_plan_id ON click_tracking(plan_id);
