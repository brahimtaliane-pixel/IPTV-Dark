import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'IPTV Suisse — chaînes HD/4K, VOD et replay';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: { locale: string } }) {
  const locale = params.locale;
  const isFr = locale === 'fr';

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
        {/* Red accent bar at top */}
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

        {/* Swiss cross background watermark */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            height: 300,
            opacity: 0.04,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{
            width: 300,
            height: 300,
            background: '#E31937',
            borderRadius: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 200,
            color: 'white',
            fontWeight: 900,
          }}>+</div>
        </div>

        {/* Logo area */}
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
            <span style={{ fontSize: 56, fontWeight: 900, color: '#E31937' }}>SUISSE</span>
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          {isFr
            ? 'Service IPTV en Suisse'
            : 'IPTV-Service in der Schweiz'}
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 22,
            color: '#d1d5db',
            textAlign: 'center',
            maxWidth: 800,
            marginBottom: 36,
          }}
        >
          {isFr
            ? '37 000+ chaînes HD/4K • 40 000+ films • Replay & VOD • Support 24/7'
            : '37 000+ HD/4K-Kanäle • 40 000+ Filme • Replay & VOD • 24/7 Support'}
        </div>

        {/* Price badge */}
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
          {isFr ? 'Dès 35.99 CHF' : 'Ab 35.99 CHF'}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 28,
            fontSize: 18,
            color: '#6b7280',
            letterSpacing: 1,
          }}
        >
          meilleur.iptv-suisse.com
        </div>
      </div>
    ),
    { ...size }
  );
}
