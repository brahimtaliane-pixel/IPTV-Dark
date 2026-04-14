'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Mail, ArrowLeft, Send, Archive, CheckCircle, Circle,
  Inbox, Search, MailOpen,
} from 'lucide-react';

interface Conversation {
  id: string;
  customer_email: string;
  customer_name: string;
  subject: string;
  last_message_at: string;
  status: string;
  unread_count: number;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  direction: 'inbound' | 'outbound';
  from_email: string;
  to_email: string;
  subject: string;
  body_html: string;
  body_text: string;
  created_at: string;
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 15000);
    return () => clearInterval(interval);
  }, [filter]);

  async function fetchConversations() {
    const res = await fetch(`/api/admin/messages?status=${filter}`);
    const data = await res.json();
    setConversations(data.conversations || []);
    setLoading(false);
  }

  async function openConversation(convo: Conversation) {
    setSelectedConvo(convo);
    const res = await fetch(`/api/admin/messages?conversation_id=${convo.id}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setConversations(prev =>
      prev.map(c => c.id === convo.id ? { ...c, unread_count: 0 } : c)
    );
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function sendReply() {
    if (!selectedConvo || !replyText.trim()) return;
    setSending(true);

    await fetch('/api/admin/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id: selectedConvo.id,
        body_text: replyText,
      }),
    });

    setReplyText('');
    setSending(false);

    const res = await fetch(`/api/admin/messages?conversation_id=${selectedConvo.id}`);
    const data = await res.json();
    setMessages(data.messages || []);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  async function updateStatus(id: string, status: string) {
    await fetch('/api/admin/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    fetchConversations();
    if (selectedConvo?.id === id) {
      setSelectedConvo(null);
      setMessages([]);
    }
  }

  function formatTime(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString('fr-CH', { day: '2-digit', month: 'short' });
  }

  function stripHtml(html: string) {
    return html?.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim() || '';
  }

  const filteredConvos = search
    ? conversations.filter(c =>
        c.customer_email.toLowerCase().includes(search.toLowerCase()) ||
        c.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        c.subject.toLowerCase().includes(search.toLowerCase())
      )
    : conversations;

  const totalUnread = conversations.filter(c => c.unread_count > 0).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-swiss-red border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-130px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-text flex items-center gap-2">
          Messages
          {totalUnread > 0 && (
            <span className="bg-swiss-red text-text-on-red text-xs font-bold px-2 py-0.5 rounded-full">
              {totalUnread}
            </span>
          )}
        </h1>
        <p className="text-sm text-text-muted mt-1">Customer email conversations</p>
      </div>

      <div className="flex-1 flex bg-surface rounded-xl border border-border overflow-hidden min-h-0">
        <div className={`w-full md:w-96 border-r border-border flex flex-col ${selectedConvo ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b border-border space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-border rounded-lg bg-bg-alt text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-swiss-red/20 focus:border-swiss-red"
              />
            </div>
            <div className="flex gap-1">
              {[
                { label: 'All', value: 'all', icon: Inbox },
                { label: 'Open', value: 'open', icon: Circle },
                { label: 'Closed', value: 'closed', icon: CheckCircle },
              ].map(tab => (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setFilter(tab.value)}
                  className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition ${
                    filter === tab.value
                      ? 'bg-swiss-red text-text-on-red'
                      : 'text-text-muted hover:bg-bg-alt'
                  }`}
                >
                  <tab.icon size={12} />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredConvos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-text-muted">
                <MailOpen size={32} className="mb-2 opacity-60" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Incoming emails will appear here</p>
              </div>
            ) : (
              filteredConvos.map(convo => (
                <button
                  key={convo.id}
                  type="button"
                  onClick={() => openConversation(convo)}
                  className={`w-full text-left px-4 py-3 border-b border-border hover:bg-bg-alt transition ${
                    selectedConvo?.id === convo.id ? 'bg-swiss-red/10' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      convo.unread_count > 0 ? 'bg-swiss-red text-text-on-red' : 'bg-bg-alt text-text-muted border border-border'
                    }`}>
                      {convo.customer_name[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm truncate ${convo.unread_count > 0 ? 'font-bold text-text' : 'font-medium text-text-secondary'}`}>
                          {convo.customer_name}
                        </span>
                        <span className="text-[10px] text-text-muted shrink-0 ml-2">
                          {formatTime(convo.last_message_at)}
                        </span>
                      </div>
                      <p className={`text-xs truncate mt-0.5 ${convo.unread_count > 0 ? 'font-semibold text-text-secondary' : 'text-text-muted'}`}>
                        {convo.subject}
                      </p>
                      <p className="text-[11px] text-text-muted truncate">{convo.customer_email}</p>
                    </div>
                    {convo.unread_count > 0 && (
                      <span className="bg-swiss-red text-text-on-red text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {convo.unread_count}
                      </span>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <div className={`flex-1 flex flex-col ${selectedConvo ? 'flex' : 'hidden md:flex'}`}>
          {selectedConvo ? (
            <>
              <div className="px-4 py-3 border-b border-border flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => { setSelectedConvo(null); setMessages([]); }}
                  className="md:hidden p-1 text-text-muted hover:text-text"
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-text text-sm truncate">{selectedConvo.subject}</h3>
                  <p className="text-xs text-text-muted">{selectedConvo.customer_name} &lt;{selectedConvo.customer_email}&gt;</p>
                </div>
                <div className="flex gap-1">
                  {selectedConvo.status === 'open' ? (
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedConvo.id, 'closed')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-400 bg-green-500/15 border border-green-500/25 rounded-lg hover:bg-green-500/20 transition"
                    >
                      <CheckCircle size={12} /> Close
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => updateStatus(selectedConvo.id, 'open')}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-swiss-red bg-swiss-red/10 border border-swiss-red/25 rounded-lg hover:bg-swiss-red/15 transition"
                    >
                      <Circle size={12} /> Reopen
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedConvo.id, 'archived')}
                    className="p-1.5 text-text-muted hover:text-text hover:bg-bg-alt rounded-lg transition"
                    title="Archive"
                  >
                    <Archive size={14} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] rounded-xl px-4 py-3 ${
                      msg.direction === 'outbound'
                        ? 'bg-swiss-red text-text-on-red'
                        : 'bg-bg-alt border border-border text-text'
                    }`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-medium ${msg.direction === 'outbound' ? 'text-text-on-red/80' : 'text-text-muted'}`}>
                          {msg.direction === 'outbound' ? 'You' : msg.from_email}
                        </span>
                        <span className={`text-[10px] ${msg.direction === 'outbound' ? 'text-text-on-red/60' : 'text-text-muted'}`}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                      <div className={`text-sm leading-relaxed ${msg.direction === 'outbound' ? 'text-text-on-red/95' : 'text-text-secondary'}`}>
                        {msg.body_text || stripHtml(msg.body_html || '')}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-3 border-t border-border bg-surface">
                <div className="flex gap-2">
                  <textarea
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendReply();
                      }
                    }}
                    placeholder="Type your reply... (Enter to send, Shift+Enter for new line)"
                    rows={2}
                    className="flex-1 px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt resize-none placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-swiss-red/20 focus:border-swiss-red"
                  />
                  <button
                    type="button"
                    onClick={sendReply}
                    disabled={!replyText.trim() || sending}
                    className="px-4 bg-swiss-red text-text-on-red rounded-lg hover:bg-swiss-red-dark transition disabled:opacity-40 flex items-center gap-1.5 text-sm font-medium self-end"
                  >
                    {sending ? (
                      <div className="animate-spin w-4 h-4 border-2 border-text-on-red border-t-transparent rounded-full" />
                    ) : (
                      <Send size={14} />
                    )}
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-muted bg-bg">
              <Mail size={40} className="mb-3 opacity-40" />
              <p className="font-medium text-text-secondary">Select a conversation</p>
              <p className="text-xs mt-1">Choose from the left panel to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
