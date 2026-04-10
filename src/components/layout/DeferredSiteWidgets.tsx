'use client';

import dynamic from 'next/dynamic';

const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'), { ssr: false });
const LiveChat = dynamic(() => import('@/components/ui/LiveChat'), { ssr: false });

export default function DeferredSiteWidgets({ whatsappUrl }: { whatsappUrl: string }) {
  return (
    <>
      <WhatsAppButton whatsappUrl={whatsappUrl} />
      <LiveChat />
    </>
  );
}
