-- Live Visitors tracking table
-- Rows are upserted on heartbeat and considered "offline" after 30s without update

CREATE TABLE IF NOT EXISTS live_visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL UNIQUE,
  email TEXT,
  page_url TEXT,
  page_title TEXT,
  referrer TEXT,
  device TEXT,
  browser TEXT,
  country TEXT,
  city TEXT,
  locale TEXT DEFAULT 'fr',
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_live_visitors_last_seen ON live_visitors(last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_live_visitors_visitor_id ON live_visitors(visitor_id);

ALTER TABLE live_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access live_visitors" ON live_visitors FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Anon can upsert live_visitors" ON live_visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update live_visitors" ON live_visitors FOR UPDATE USING (true);
