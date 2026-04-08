'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { useLocale } from 'next-intl';

interface Message {
  id: string;
  sender: 'visitor' | 'admin';
  body: string;
  created_at: string;
}

interface Session {
  id: string;
  visitor_id: string;
  status: string;
}

const TEXTS = {
  title: 'Live chat',
  subtitle: 'We reageren meestal binnen enkele minuten',
  placeholder: 'Typ je bericht...',
  greeting: 'Hallo! Hoe kunnen we helpen?',
  offline: 'We zijn even offline. Laat een bericht achter!',
  send: 'Versturen',
  emailLabel: 'Je e-mailadres',
  emailPlaceholder: 'email@voorbeeld.nl',
  emailStart: 'Start chat',
  emailRequired: 'Vul je e-mail in om te beginnen',
};

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('chat_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('chat_visitor_id', id);
  }
  return id;
}

export default function LiveChat() {
  const locale = useLocale();
  const t = TEXTS;

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [sending, setSending] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const lastMessageCount = useRef(0);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    const savedEmail = localStorage.getItem('chat_visitor_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setEmailSubmitted(true);
    }

    fetch(`/api/chat?visitor_id=${visitorId}`)
      .then(r => r.json())
      .then(data => {
        if (data.session) {
          setSession(data.session);
          setMessages(data.messages || []);
          setEmailSubmitted(true);
          lastMessageCount.current = data.messages?.length || 0;
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!session?.id) return;

    const poll = setInterval(() => {
      fetch(`/api/chat?session_id=${session.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.messages) {
            setMessages(data.messages);
            if (data.messages.length > lastMessageCount.current) {
              const newOnes = data.messages.slice(lastMessageCount.current);
              const hasAdminMsg = newOnes.some((m: Message) => m.sender === 'admin');
              if (hasAdminMsg && !isOpen) {
                setHasNewMessage(true);
              }
              lastMessageCount.current = data.messages.length;
            }
          }
        })
        .catch(() => {});
    }, 3000);

    return () => clearInterval(poll);
  }, [session?.id, isOpen]);

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      if (!emailSubmitted) {
        setTimeout(() => emailInputRef.current?.focus(), 200);
      } else {
        setTimeout(() => inputRef.current?.focus(), 200);
      }
    }
  }, [isOpen, isMinimized, emailSubmitted]);

  function openChat() {
    setIsOpen(true);
    setIsMinimized(false);
    setHasNewMessage(false);
  }

  async function startSession(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    localStorage.setItem('chat_visitor_email', trimmed);
    setEmailSubmitted(true);

    const visitorId = getVisitorId();
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_session',
          visitor_id: visitorId,
          visitor_email: trimmed,
          page_url: window.location.href,
          locale,
        }),
      });
      const data = await res.json();
      if (data.session) {
        setSession(data.session);
      }
    } catch {
      // silently fail
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || !session?.id || sending) return;

    const msgBody = input.trim();
    setInput('');
    setSending(true);

    const optimistic: Message = {
      id: `temp-${Date.now()}`,
      sender: 'visitor',
      body: msgBody,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    lastMessageCount.current += 1;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_message',
          session_id: session.id,
          sender: 'visitor',
          body: msgBody,
        }),
      });
      const data = await res.json();
      if (data.message) {
        setMessages(prev =>
          prev.map(m => (m.id === optimistic.id ? data.message : m))
        );
      }
    } catch {
      // keep optimistic message
    } finally {
      setSending(false);
    }
  }

  function formatTime(dateStr: string) {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('nl-NL', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[min(100vw-2rem,380px)] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[min(70vh,520px)]"
          >
            <div className="bg-swiss-red text-white px-4 py-3 flex items-center justify-between shrink-0">
              <div>
                <div className="font-bold text-sm">{t.title}</div>
                <div className="text-[11px] text-white/80">{t.subtitle}</div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsMinimized(true)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Minimaliseren"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                  aria-label="Sluiten"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
              {!emailSubmitted ? (
                <form onSubmit={startSession} className="space-y-3">
                  <p className="text-sm text-text-secondary">{t.emailRequired}</p>
                  <label className="block text-xs font-medium text-text-muted">{t.emailLabel}</label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-swiss-red text-white text-sm font-semibold rounded-lg hover:bg-swiss-red-dark"
                  >
                    {t.emailStart}
                  </button>
                </form>
              ) : (
                <>
                  {messages.length === 0 && (
                    <p className="text-sm text-text-secondary">{t.greeting}</p>
                  )}
                  {messages.map(m => (
                    <div
                      key={m.id}
                      className={`flex ${m.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          m.sender === 'visitor'
                            ? 'bg-swiss-red text-white rounded-br-sm'
                            : 'bg-bg text-text rounded-bl-sm'
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words">{m.body}</p>
                        <p
                          className={`text-[10px] mt-1 ${
                            m.sender === 'visitor' ? 'text-white/70' : 'text-text-muted'
                          }`}
                        >
                          {formatTime(m.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {emailSubmitted && session && (
              <form onSubmit={sendMessage} className="p-3 border-t border-border flex gap-2 shrink-0">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  className="flex-1 px-3 py-2 rounded-lg border border-border text-sm min-w-0"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="p-2 rounded-lg bg-swiss-red text-white disabled:opacity-50"
                  aria-label={t.send}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && isMinimized && (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg border border-border text-sm font-medium text-text"
        >
          <MessageCircle className="w-4 h-4 text-swiss-red" />
          {t.title}
          {hasNewMessage && <span className="w-2 h-2 rounded-full bg-swiss-red animate-pulse" />}
        </button>
      )}

      {!isOpen && (
        <button
          type="button"
          onClick={openChat}
          className="relative flex items-center gap-2 px-4 py-3 bg-swiss-red text-white rounded-full shadow-lg hover:bg-swiss-red-dark transition-colors text-sm font-semibold"
        >
          <MessageCircle className="w-5 h-5" />
          {t.title}
          {hasNewMessage && <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-white border-2 border-swiss-red" />}
        </button>
      )}
    </div>
  );
}
