-- ============================================================
-- Conversations & Messages (Email Inbox System)
-- ============================================================

-- Conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email VARCHAR(255) NOT NULL,
  customer_name VARCHAR(255),
  subject TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'closed', 'archived')),
  unread_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  direction VARCHAR(10) NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  from_email VARCHAR(255) NOT NULL,
  to_email VARCHAR(255) NOT NULL,
  subject TEXT,
  body_html TEXT,
  body_text TEXT,
  message_id TEXT,
  in_reply_to TEXT,
  references_header TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_conversations_customer_email ON conversations(customer_email);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(status);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_message_id ON messages(message_id);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access conversations" ON conversations FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access messages" ON messages FOR ALL USING (auth.role() = 'service_role');
