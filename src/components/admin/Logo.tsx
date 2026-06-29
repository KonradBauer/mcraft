import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontSize: '28px',
        letterSpacing: '0.18em',
        color: '#FFFFFF',
        lineHeight: 1,
      }}>
        MCRAFT
      </div>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
        fontSize: '9px',
        letterSpacing: '0.22em',
        color: '#808080',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}>
        Panel administracyjny
      </div>
    </div>
  )
}
