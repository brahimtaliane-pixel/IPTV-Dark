'use client';

import { useEffect } from 'react';
import { useLocale } from 'next-intl';

function getVisitorId(): string {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('chat_visitor_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('chat_visitor_id', id);
  }
  return id;
}

function detectDevice(): string {
  const ua = navigator.userAgent;
  if (/iPad|Tablet/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

function detectBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}

export default function VisitorTracker() {
  const locale = useLocale();

  useEffect(() => {
    const visitorId = getVisitorId();
    if (!visitorId) return;

    function sendHeartbeat() {
      const email = localStorage.getItem('chat_visitor_email') || undefined;

      fetch('/api/visitors/heartbeat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          visitor_id: visitorId,
          email,
          page_url: window.location.href,
          page_title: document.title,
          referrer: document.referrer || undefined,
          device: detectDevice(),
          browser: detectBrowser(),
          locale,
        }),
        keepalive: true,
      }).catch(() => {});
    }

    // Initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 10 seconds
    const interval = setInterval(sendHeartbeat, 10_000);

    // Update on page visibility change (tab focus)
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        sendHeartbeat();
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [locale]);

  return null;
}
