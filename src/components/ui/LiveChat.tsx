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
  fr: {
    title: 'Chat en direct',
    subtitle: 'Nous répondons généralement en quelques minutes',
    placeholder: 'Écrivez votre message...',
    greeting: 'Bonjour ! Comment pouvons-nous vous aider ?',
    offline: 'Nous sommes actuellement hors ligne. Laissez-nous un message !',
    send: 'Envoyer',
    emailLabel: 'Votre adresse e-mail',
    emailPlaceholder: 'email@exemple.com',
    emailStart: 'Démarrer le chat',
    emailRequired: 'Entrez votre e-mail pour commencer',
  },
  de: {
    title: 'Live-Chat',
    subtitle: 'Wir antworten normalerweise in wenigen Minuten',
    placeholder: 'Schreiben Sie Ihre Nachricht...',
    greeting: 'Hallo! Wie können wir Ihnen helfen?',
    offline: 'Wir sind derzeit offline. Hinterlassen Sie uns eine Nachricht!',
    send: 'Senden',
    emailLabel: 'Ihre E-Mail-Adresse',
    emailPlaceholder: 'email@beispiel.com',
    emailStart: 'Chat starten',
    emailRequired: 'Geben Sie Ihre E-Mail ein, um zu beginnen',
  },
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
  const locale = useLocale() as 'fr' | 'de';
  const t = TEXTS[locale] || TEXTS.fr;

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

  // Load existing session on mount
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

  // Poll for new messages when chat is open
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen, scrollToBottom]);

  // Focus appropriate input when opened
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

    // Optimistic add
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
    return d.toLocaleTimeString(locale === 'fr' ? 'fr-CH' : 'de-CH', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-[360px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
            style={{ height: '480px' }}
          >
            {/* Header */}
            <div className="bg-[#D52B1E] px-5 py-4 flex items-center gap-3 shrink-0">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-sm">{t.title}</h3>
                <p className="text-white/70 text-xs truncate">{t.subtitle}</p>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-white/70 hover:text-white transition p-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!emailSubmitted ? (
              /* Email Collection Form */
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50">
                <div className="flex gap-2.5 items-end mb-6 self-start">
                  <div className="w-7 h-7 rounded-full bg-[#D52B1E] flex items-center justify-center shrink-0">
                    <span className="text-white text-[10px] font-bold">IS</span>
                  </div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 shadow-sm">
                    <p className="text-sm text-gray-700 leading-relaxed">{t.greeting}</p>
                  </div>
                </div>

                <form onSubmit={startSession} className="w-full max-w-[280px] space-y-3">
                  <label className="block text-sm font-semibold text-gray-700">
                    {t.emailLabel}
                  </label>
                  <input
                    ref={emailInputRef}
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D52B1E]/40 focus:ring-1 focus:ring-[#D52B1E]/20 transition"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#D52B1E] hover:bg-[#B82318] text-white font-semibold text-sm rounded-xl transition"
                  >
                    {t.emailStart}
                  </button>
                  <p className="text-[11px] text-gray-400 text-center">{t.emailRequired}</p>
                </form>
              </div>
            ) : (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {/* Greeting */}
                  <div className="flex gap-2.5 items-end">
                    <div className="w-7 h-7 rounded-full bg-[#D52B1E] flex items-center justify-center shrink-0">
                      <span className="text-white text-[10px] font-bold">IS</span>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3.5 py-2.5 max-w-[80%] shadow-sm">
                      <p className="text-sm text-gray-700 leading-relaxed">{t.greeting}</p>
                    </div>
                  </div>

                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 items-end ${
                        msg.sender === 'visitor' ? 'flex-row-reverse' : ''
                      }`}
                    >
                      {msg.sender === 'admin' && (
                        <div className="w-7 h-7 rounded-full bg-[#D52B1E] flex items-center justify-center shrink-0">
                          <span className="text-white text-[10px] font-bold">IS</span>
                        </div>
                      )}
                      <div
                        className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] shadow-sm ${
                          msg.sender === 'visitor'
                            ? 'bg-[#D52B1E] text-white rounded-br-md'
                            : 'bg-white border border-gray-200 rounded-bl-md'
                        }`}
                      >
                        <p className={`text-sm leading-relaxed ${
                          msg.sender === 'visitor' ? 'text-white' : 'text-gray-700'
                        }`}>
                          {msg.body}
                        </p>
                        <p className={`text-[10px] mt-1 ${
                          msg.sender === 'visitor' ? 'text-white/60' : 'text-gray-400'
                        }`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form
                  onSubmit={sendMessage}
                  className="p-3 border-t border-gray-200 bg-white flex gap-2 shrink-0"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#D52B1E]/40 focus:ring-1 focus:ring-[#D52B1E]/20 transition"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="w-10 h-10 bg-[#D52B1E] hover:bg-[#B82318] disabled:opacity-40 disabled:hover:bg-[#D52B1E] rounded-xl flex items-center justify-center transition shrink-0"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Minimized Bar */}
      <AnimatePresence>
        {isOpen && isMinimized && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={() => setIsMinimized(false)}
            className="bg-[#D52B1E] text-white rounded-full px-5 py-3 shadow-lg flex items-center gap-2.5 hover:bg-[#B82318] transition"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm font-semibold">{t.title}</span>
            {hasNewMessage && (
              <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* FAB Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 260, damping: 20 }}
          onClick={openChat}
          className="w-14 h-14 bg-[#D52B1E] hover:bg-[#B82318] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 relative"
          aria-label="Live Chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {hasNewMessage && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
          )}
          <span className="absolute inset-0 rounded-full bg-[#D52B1E] animate-ping opacity-20" />
        </motion.button>
      )}
    </div>
  );
}
