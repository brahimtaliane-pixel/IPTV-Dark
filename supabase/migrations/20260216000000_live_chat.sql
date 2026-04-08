-- Live Chat tables
-- chat_sessions: one per visitor browser session
-- chat_messages: individual messages within a session

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL,
  visitor_name TEXT,
  visitor_email TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  page_url TEXT,
  locale TEXT DEFAULT 'fr',
  unread_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('visitor', 'admin')),
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_visitor ON chat_sessions(visitor_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_status ON chat_sessions(status);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_updated ON chat_sessions(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access chat_sessions" ON chat_sessions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access chat_messages" ON chat_messages FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anon can insert chat_sessions" ON chat_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can read own chat_sessions" ON chat_sessions FOR SELECT USING (true);
CREATE POLICY "Anon can update own chat_sessions" ON chat_sessions FOR UPDATE USING (true);

CREATE POLICY "Anon can insert chat_messages" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can read chat_messages" ON chat_messages FOR SELECT USING (true);
