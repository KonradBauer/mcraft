import React from 'react'

export default function Logo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 700,
        fontSize: '28px',
        letterSpacing: '0.18em',
        color: '#0e1a17',
        lineHeight: 1,
      }}>
        MCRAFT
      </div>
      <div style={{
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: 400,
        fontSize: '9px',
        letterSpacing: '0.22em',
        color: '#4f9a8c',
        textTransform: 'uppercase',
        lineHeight: 1,
      }}>
        Panel administracyjny
      </div>
    </div>
  )
}
