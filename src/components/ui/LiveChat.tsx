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
  visitor_email?: string | null;
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
  typeBelow: 'Typ je bericht hieronder',
  sendFailed: 'Verzenden mislukt. Probeer opnieuw of neem contact op via WhatsApp.',
  sessionFailed: 'Chat kon niet starten. Controleer je e-mail of probeer later opnieuw.',
  notConfigured: 'Chat is tijdelijk niet beschikbaar. Gebruik WhatsApp of e-mail.',
  /** Shown when Supabase has no chat_* tables (migration not applied) */
  chatDbMissing:
    'Live chat is nog niet geactiveerd op de server. Gebruik WhatsApp of e-mail — of probeer later opnieuw.',
};

/** Turn raw API/PostgREST errors into short copy for visitors */
function mapChatApiError(raw: string | undefined, t: typeof TEXTS): string {
  if (!raw) return t.sessionFailed;
  const lower = raw.toLowerCase();
  if (
    lower.includes('could not find the table') ||
    lower.includes('schema cache') ||
    (lower.includes('relation') && lower.includes('does not exist')) ||
    lower.includes('chat_sessions') ||
    lower.includes('chat_messages')
  ) {
    return t.chatDbMissing;
  }
  return raw;
}

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
  const [chatError, setChatError] = useState<string | null>(null);
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
      .then(async (data) => {
        if (data.session) {
          setSession(data.session);
          setMessages(data.messages || []);
          lastMessageCount.current = data.messages?.length || 0;
          setEmailSubmitted(true);
          if (data.session.visitor_email) {
            setEmail(data.session.visitor_email);
            localStorage.setItem('chat_visitor_email', data.session.visitor_email);
          }
          return;
        }
        // Saved email but no open session — create one so the composer can send messages
        const emailFromLs = localStorage.getItem('chat_visitor_email');
        if (
          emailFromLs &&
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailFromLs)
        ) {
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'create_session',
                visitor_id: visitorId,
                visitor_email: emailFromLs,
                page_url: typeof window !== 'undefined' ? window.location.href : '',
                locale,
              }),
            });
            const created = await res.json();
            if (created.session) {
              setSession(created.session);
            }
          } catch {
            /* ignore */
          }
        }
      })
      .catch(() => {});
  }, [locale]);

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
    setChatError(null);
  }

  async function startSession(e?: React.FormEvent) {
    e?.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;

    const visitorId = getVisitorId();
    setChatError(null);
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
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setChatError(
          res.status === 503
            ? t.notConfigured
            : mapChatApiError(data.error, t)
        );
        return;
      }
      if (data.session) {
        localStorage.setItem('chat_visitor_email', trimmed);
        setEmailSubmitted(true);
        setSession(data.session);
      } else {
        setChatError(mapChatApiError(data.error, t));
      }
    } catch {
      setChatError(t.sessionFailed);
    }
  }

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || sending) return;
    setChatError(null);

    let activeSession = session;
    if (!activeSession?.id) {
      const visitorId = getVisitorId();
      const mail =
        email.trim() || localStorage.getItem('chat_visitor_email') || '';
      if (!mail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return;

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_session',
            visitor_id: visitorId,
            visitor_email: mail,
            page_url: window.location.href,
            locale,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setChatError(
            res.status === 503
              ? t.notConfigured
              : mapChatApiError(data.error, t)
          );
          return;
        }
        if (data.session) {
          activeSession = data.session;
          setSession(data.session);
        } else {
          setChatError(mapChatApiError(data.error, t));
          return;
        }
      } catch {
        setChatError(t.sessionFailed);
        return;
      }
    }

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
          session_id: activeSession!.id,
          sender: 'visitor',
          body: msgBody,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        lastMessageCount.current = Math.max(0, lastMessageCount.current - 1);
        setInput(msgBody);
        setChatError(
          res.status === 503
            ? t.notConfigured
            : mapChatApiError(data.error, t) || t.sendFailed
        );
        return;
      }
      if (data.message) {
        setMessages(prev =>
          prev.map(m => (m.id === optimistic.id ? data.message : m))
        );
      } else {
        setMessages(prev => prev.filter(m => m.id !== optimistic.id));
        lastMessageCount.current = Math.max(0, lastMessageCount.current - 1);
        setInput(msgBody);
        setChatError(t.sendFailed);
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      lastMessageCount.current = Math.max(0, lastMessageCount.current - 1);
      setInput(msgBody);
      setChatError(t.sendFailed);
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
            className="w-[min(100vw-2rem,380px)] min-h-[300px] bg-white rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[min(70vh,520px)]"
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

            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
              {!emailSubmitted ? (
                <form onSubmit={startSession} className="space-y-3">
                  <p className="text-sm text-text-secondary">{t.emailRequired}</p>
                  <label className="block text-xs font-medium text-text-muted">{t.emailLabel}</label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setChatError(null);
                    }}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3 py-2 rounded-lg border border-border text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-swiss-red text-white text-sm font-semibold rounded-lg hover:bg-swiss-red-dark"
                  >
                    {t.emailStart}
                  </button>
                  {chatError && (
                    <p className="text-xs text-red-600" role="alert">
                      {chatError}
                    </p>
                  )}
                </form>
              ) : (
                <>
                  {messages.length === 0 && (
                    <div className="space-y-1">
                      <p className="text-sm text-text-secondary">{t.greeting}</p>
                      <p className="text-xs text-text-muted">{t.typeBelow}</p>
                    </div>
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

            {emailSubmitted && chatError && (
              <div
                className="px-3 py-2 bg-red-50 text-red-800 text-xs border-t border-red-100 shrink-0"
                role="alert"
              >
                {chatError}
              </div>
            )}

            {emailSubmitted && (
              <form
                onSubmit={sendMessage}
                className="p-3 border-t border-border bg-white flex gap-2 shrink-0"
              >
                <label className="sr-only" htmlFor="live-chat-input">
                  {t.placeholder}
                </label>
                <input
                  id="live-chat-input"
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={e => {
                    setInput(e.target.value);
                    setChatError(null);
                  }}
                  placeholder={t.placeholder}
                  autoComplete="off"
                  className="flex-1 px-3 py-2.5 rounded-lg border border-border text-sm min-w-0 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-swiss-red/30 focus:border-swiss-red"
                />
                <button
                  type="submit"
                  disabled={sending || !input.trim()}
                  className="shrink-0 px-3 py-2 rounded-lg bg-swiss-red text-white disabled:opacity-50 hover:bg-swiss-red-dark transition-colors"
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
