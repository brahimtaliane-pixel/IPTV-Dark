import { ImageResponse } from 'next/og';
import { SITE_CONFIG, PRICE_CURRENCY_SYMBOL } from '@/lib/constants';

export const runtime = 'edge';
export const alt = 'IPTV Nederland — zenders HD/4K, VOD en replay';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0000 0%, #3d0000 50%, #1a0000 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Inter, sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#E31937',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              background: '#E31937',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                color: 'white',
                fontSize: 36,
                fontWeight: 900,
              }}
            >
              +
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#ffffff' }}>IPTV</span>
            <span style={{ fontSize: 56, fontWeight: 900, color: '#E31937' }}>NEDERLAND</span>
          </div>
        </div>

        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          IPTV-service in Nederland
        </div>

        <div
          style={{
            fontSize: 22,
            color: '#d1d5db',
            textAlign: 'center',
            maxWidth: 800,
            marginBottom: 36,
          }}
        >
          30.000+ zenders HD/4K • 170.000+ films en series • Replay & VOD • Support 24/7
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: '#E31937',
            color: 'white',
            padding: '14px 40px',
            borderRadius: 14,
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {`Vanaf 35,99 ${PRICE_CURRENCY_SYMBOL}`}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 18,
            color: '#6b7280',
            letterSpacing: 1,
          }}
        >
          {SITE_CONFIG.domain}
        </div>
      </div>
    ),
    { ...size }
  );
}
