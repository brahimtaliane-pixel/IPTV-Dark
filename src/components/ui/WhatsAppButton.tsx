'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import { useLocale } from 'next-intl';

export default function WhatsAppButton() {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const locale = useLocale();

  const message = locale === 'fr'
    ? 'Bonjour ! Je suis intéressé(e) par vos abonnements IPTV.'
    : 'Hallo! Ich interessiere mich für Ihre IPTV-Abonnements.';

  const whatsappUrl = `${SITE_CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;
  const tooltipText = locale === 'fr' ? 'Besoin d\'aide ? Écrivez-nous !' : 'Brauchen Sie Hilfe? Schreiben Sie uns!';

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Tooltip */}
      <AnimatePresence>
        {isTooltipVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-xl shadow-xl border border-border p-4 max-w-[240px] relative"
          >
            <button
              onClick={() => setIsTooltipVisible(false)}
              className="absolute top-2 right-2 text-text-muted hover:text-text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <p className="text-sm text-text pr-4">{tooltipText}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-xs font-semibold text-[#25D366] hover:underline"
            >
              {locale === 'fr' ? 'Démarrer le chat →' : 'Chat starten →'}
            </a>
            {/* Arrow */}
            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-border rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp FAB */}
      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 260, damping: 20 }}
        className="w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
          <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16.002c0 3.502 1.14 6.742 3.066 9.372L1.06 31.28l6.142-1.97a15.876 15.876 0 008.802 2.652c8.828 0 16-7.174 16-16.002S24.832 0 16.004 0zm9.336 22.594c-.392 1.104-1.938 2.02-3.174 2.288-.846.18-1.95.324-5.67-1.218-4.762-1.972-7.826-6.81-8.064-7.124-.23-.314-1.912-2.55-1.912-4.862s1.21-3.448 1.638-3.922c.428-.474.936-.592 1.248-.592.312 0 .624.002.898.016.288.014.674-.11 1.054.804.392.944 1.332 3.256 1.45 3.492.118.236.196.512.038.826-.158.314-.236.512-.472.788-.236.276-.496.616-.708.826-.236.236-.482.492-.208.966.276.474 1.226 2.022 2.632 3.276 1.81 1.614 3.336 2.114 3.81 2.35.474.236.75.196 1.026-.118.276-.314 1.184-1.38 1.5-1.854.316-.474.632-.392 1.066-.236.434.158 2.746 1.296 3.218 1.532.474.236.788.354.906.55.118.196.118 1.134-.274 2.238z" />
        </svg>
        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
      </motion.a>
    </div>
  );
}
