'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, AlertCircle, Shield, User, Mail, Phone } from 'lucide-react';

interface LeadFormProps {
  planId: string;
  planName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LeadForm({ planId, planName, isOpen, onClose }: LeadFormProps) {
  const t = useTranslations('lead');
  const locale = useLocale();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, plan_id: planId, plan_name: planName, locale }),
      });
      if (!res.ok) throw new Error();
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-3 right-3 p-1.5 text-text-muted hover:text-text rounded-md hover:bg-bg-alt">
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8">
              {status === 'success' ? (
                <div className="text-center py-6">
                  <CheckCircle className="w-14 h-14 text-success mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-text">{t('success')}</h3>
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-bold text-text mb-1">{t('title')}</h3>
                  <p className="text-sm text-text-muted mb-4">{t('subtitle')}</p>
                  <div className="px-3 py-2 bg-swiss-red/5 border border-swiss-red/15 rounded-lg mb-5">
                    <span className="text-sm font-semibold text-swiss-red">{planName}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-3">
                    {[
                      { key: 'name', type: 'text', icon: User, field: 'name' as const },
                      { key: 'email', type: 'email', icon: Mail, field: 'email' as const },
                      { key: 'phone', type: 'tel', icon: Phone, field: 'phone' as const },
                    ].map(({ key, type, icon: Icon, field }) => (
                      <div key={key} className="relative">
                        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <input
                          type={type}
                          required
                          value={formData[field]}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                          placeholder={t(key)}
                          className="w-full pl-10 pr-4 py-3 bg-bg border border-border rounded-lg text-sm text-text placeholder-text-muted focus:outline-none focus:border-swiss-red/40 focus:ring-1 focus:ring-swiss-red/20"
                        />
                      </div>
                    ))}

                    {status === 'error' && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg">
                        <AlertCircle className="w-4 h-4 text-swiss-red shrink-0" />
                        <span className="text-sm text-swiss-red">{t('error')}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                    >
                      {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : t('submit')}
                    </button>
                  </form>

                  <div className="flex items-center gap-1.5 mt-3">
                    <Shield className="w-3 h-3 text-text-muted" />
                    <p className="text-[11px] text-text-muted">{t('privacy')}</p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
