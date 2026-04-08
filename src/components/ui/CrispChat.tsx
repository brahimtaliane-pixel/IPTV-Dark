'use client';

import { useEffect } from 'react';

// ─── Crisp Live Chat Widget ─────────────────────────────────
// Sign up at https://crisp.chat and get your Website ID
// Set it in .env.local as NEXT_PUBLIC_CRISP_WEBSITE_ID
// ─────────────────────────────────────────────────────────────

declare global {
  interface Window {
    $crisp: unknown[];
    CRISP_WEBSITE_ID: string;
    CRISP_RUNTIME_CONFIG: Record<string, unknown>;
  }
}

export default function CrispChat() {
  useEffect(() => {
    const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;
    if (!crispId) return;

    // Prevent double-loading
    if (window.$crisp) return;

    // Set runtime config BEFORE loading the script — this is the official way
    window.CRISP_RUNTIME_CONFIG = {
      locale: 'fr',
      position: 'left',
    };

    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispId;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    // Aggressive CSS fallback: target all known Crisp container patterns
    const style = document.createElement('style');
    style.id = 'crisp-position-override';
    style.textContent = `
      .crisp-client,
      .crisp-client *[class*="cc-"] {
        right: auto !important;
        left: 0 !important;
      }
      .crisp-client > div:last-child {
        right: auto !important;
        left: 24px !important;
      }
      #crisp-chatbox {
        right: auto !important;
        left: 0 !important;
      }
      #crisp-chatbox > div {
        right: auto !important;
        left: 24px !important;
      }
      #crisp-chatbox a[data-maximized="false"] {
        right: auto !important;
        left: 24px !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      try {
        document.head.removeChild(script);
        document.head.removeChild(style);
      } catch {
        // ignore
      }
    };
  }, []);

  return null; // Crisp injects its own UI
}
