import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'MCRAFT - Dr inż. Michał Macherzyński | Inżynier spawalnik'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0e1a17',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* Teal accent line */}
        <div style={{ width: 56, height: 2, background: '#4f9a8c', marginBottom: 32 }} />

        {/* Eyebrow */}
        <div
          style={{
            color: '#4f9a8c',
            fontSize: 13,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          Dr inż.
        </div>

        {/* Name */}
        <div
          style={{
            color: '#ffffff',
            fontSize: 68,
            fontWeight: 300,
            lineHeight: 1.05,
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            letterSpacing: '0.01em',
            marginBottom: 36,
          }}
        >
          Michal Macherzynski
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: 'rgba(236,234,228,0.7)',
            fontSize: 18,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 300,
          }}
        >
          Inżynier spawalnik - IWE / IWI / VT2 / PT2
        </div>

        {/* Brand */}
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 100,
            color: 'rgba(236,234,228,0.4)',
            fontSize: 22,
            letterSpacing: '0.45em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 300,
          }}
        >
          MCRAFT
        </div>

        {/* Left border accent */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: 'linear-gradient(to bottom, #4f9a8c, transparent)',
          }}
        />
      </div>
    ),
    { ...size }
  )
}
