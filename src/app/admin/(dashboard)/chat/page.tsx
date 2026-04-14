'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageCircle,
  Send,
  Circle,
  XCircle,
  RefreshCw,
  Clock,
  Globe,
} from 'lucide-react';

interface ChatSession {
  id: string;
  visitor_id: string;
  visitor_name: string | null;
  visitor_email: string | null;
  status: 'open' | 'closed';
  page_url: string | null;
  locale: string;
  unread_count: number;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  session_id: string;
  sender: 'visitor' | 'admin';
  body: string;
  created_at: string;
}

export default function AdminChatPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('open');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSessions = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/chat?status=${filter}`);
      const data = await res.json();
      setSessions(data.sessions || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/admin/chat?session_id=${sessionId}`);
      const data = await res.json();
      setMessages(data.messages || []);
    } catch {
      // silently fail
    }
  }, []);

  // Initial load + polling
  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => clearInterval(interval);
  }, [fetchSessions]);

  // Poll messages for selected session
  useEffect(() => {
    if (!selectedSession) return;
    fetchMessages(selectedSession.id);
    const interval = setInterval(() => fetchMessages(selectedSession.id), 3000);
    return () => clearInterval(interval);
  }, [selectedSession, fetchMessages]);

  // Scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function selectSession(s: ChatSession) {
    setSelectedSession(s);
    setMessages([]);
    fetchMessages(s.id);
    setTimeout(() => inputRef.current?.focus(), 100);
  }

  async function sendReply(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || !selectedSession || sending) return;

    const msgBody = input.trim();
    setInput('');
    setSending(true);

    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      session_id: selectedSession.id,
      sender: 'admin',
      body: msgBody,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const res = await fetch('/api/admin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: selectedSession.id, body: msgBody }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev =>
          prev.map(m => (m.id === optimistic.id ? data.message : m))
        );
      }
    } catch {
      // keep optimistic
    } finally {
      setSending(false);
    }
  }

  async function toggleStatus(session: ChatSession) {
    const newStatus = session.status === 'open' ? 'closed' : 'open';
    await fetch('/api/admin/chat', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: session.id, status: newStatus }),
    });
    setSelectedSession(prev =>
      prev?.id === session.id ? { ...prev, status: newStatus } : prev
    );
    fetchSessions();
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  const totalUnread = sessions.reduce((sum, s) => sum + (s.unread_count || 0), 0);

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-swiss-red" />
            Live Chat
            {totalUnread > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-swiss-red text-text-on-red text-xs font-bold rounded-full">
                {totalUnread}
              </span>
            )}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            {sessions.length} conversation{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={fetchSessions}
          className="text-text-muted hover:text-text transition p-2"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Main Layout */}
      <div className="flex gap-4 h-[calc(100%-5rem)]">
        {/* Sessions List */}
        <div className="w-80 shrink-0 bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
          {/* Filter Tabs */}
          <div className="flex border-b border-border shrink-0">
            {(['open', 'closed', 'all'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`flex-1 py-3 text-xs font-semibold transition ${
                  filter === f
                    ? 'text-swiss-red border-b-2 border-swiss-red'
                    : 'text-text-muted hover:text-text-secondary'
                }`}
              >
                {f === 'open' ? 'Open' : f === 'closed' ? 'Closed' : 'All'}
              </button>
            ))}
          </div>

          {/* Session List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-6 h-6 border-2 border-swiss-red border-t-transparent rounded-full mx-auto" />
              </div>
            ) : sessions.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm">
                No conversations yet
              </div>
            ) : (
              sessions.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => selectSession(s)}
                  className={`w-full text-left px-4 py-3.5 border-b border-border hover:bg-bg-alt transition ${
                    selectedSession?.id === s.id ? 'bg-swiss-red/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-bg-alt border border-border rounded-full flex items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-text-muted">
                        {(s.visitor_name || s.visitor_id).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-text truncate">
                          {s.visitor_email || s.visitor_name || `Visitor ${s.visitor_id.slice(0, 6)}`}
                        </span>
                        <span className="text-[10px] text-text-muted shrink-0 ml-2">
                          {timeAgo(s.updated_at)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Circle
                          className={`w-2 h-2 shrink-0 ${
                            s.status === 'open'
                              ? 'fill-green-500 text-green-500'
                              : 'fill-border-dark text-text-muted'
                          }`}
                        />
                        <span className="text-xs text-text-muted truncate">
                          {s.locale.toUpperCase()} · {s.status}
                        </span>
                        {s.unread_count > 0 && (
                          <span className="ml-auto px-1.5 py-0.5 bg-swiss-red text-text-on-red text-[10px] font-bold rounded-full shrink-0">
                            {s.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 bg-surface rounded-xl border border-border flex flex-col overflow-hidden">
          {!selectedSession ? (
            <div className="flex-1 flex items-center justify-center text-text-muted">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Select a conversation to start replying</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div className="px-5 py-3.5 border-b border-border flex items-center gap-3 shrink-0">
                <div className="w-8 h-8 bg-bg-alt border border-border rounded-full flex items-center justify-center">
                  <span className="text-xs font-semibold text-text-muted">
                    {(selectedSession.visitor_name || selectedSession.visitor_id)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-text">
                    {selectedSession.visitor_email ||
                      selectedSession.visitor_name ||
                      `Visitor ${selectedSession.visitor_id.slice(0, 8)}`}
                  </h3>
                  <div className="flex items-center gap-3 text-[11px] text-text-muted">
                    {selectedSession.visitor_email && (
                      <span className="truncate max-w-[200px]">
                        {selectedSession.visitor_email}
                      </span>
                    )}
                    {selectedSession.page_url && (
                      <span className="flex items-center gap-1 truncate max-w-[200px]">
                        <Globe className="w-3 h-3" />
                        {new URL(selectedSession.page_url).pathname}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo(selectedSession.created_at)}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(selectedSession)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                    selectedSession.status === 'open'
                      ? 'bg-red-500/15 text-red-400 border-red-500/25 hover:bg-red-500/20'
                      : 'bg-green-500/15 text-green-400 border-green-500/25 hover:bg-green-500/20'
                  }`}
                >
                  {selectedSession.status === 'open' ? (
                    <span className="flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Close
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Reopen
                    </span>
                  )}
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-3 bg-bg">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex gap-2.5 items-end ${
                      msg.sender === 'admin' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    {msg.sender === 'visitor' && (
                      <div className="w-7 h-7 rounded-full bg-bg-alt border border-border flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-text-muted">V</span>
                      </div>
                    )}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 max-w-[70%] shadow-sm ${
                        msg.sender === 'admin'
                          ? 'bg-swiss-red text-text-on-red rounded-br-md'
                          : 'bg-surface border border-border rounded-bl-md'
                      }`}
                    >
                      <p
                        className={`text-sm leading-relaxed ${
                          msg.sender === 'admin' ? 'text-text-on-red' : 'text-text-secondary'
                        }`}
                      >
                        {msg.body}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          msg.sender === 'admin' ? 'text-text-on-red/65' : 'text-text-muted'
                        }`}
                      >
                        {formatTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Input */}
              {selectedSession.status === 'open' && (
                <form
                  onSubmit={sendReply}
                  className="p-3 border-t border-border bg-surface flex gap-2 shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 px-3.5 py-2.5 bg-bg-alt border border-border rounded-xl text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-swiss-red/40 focus:ring-1 focus:ring-swiss-red/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="px-4 py-2.5 bg-swiss-red hover:bg-swiss-red-dark disabled:opacity-40 text-text-on-red rounded-xl flex items-center gap-2 text-sm font-semibold transition"
                  >
                    <Send className="w-4 h-4" />
                    Send
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
