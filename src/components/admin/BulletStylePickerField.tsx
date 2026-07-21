'use client'

import { useField, FieldLabel } from '@payloadcms/ui'
import { BULLET_STYLE_OPTIONS, type BulletStyle } from '@/lib/bulletStyles'

const ACCENT = '#4f9a8c'

function BulletPreview({ value }: { value: BulletStyle }) {
  switch (value) {
    case 'check':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke={ACCENT} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12l5 5L20 6" />
        </svg>
      )
    case 'step-number':
      return <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 13, color: ACCENT }}>01</span>
    case 'vertical-accent':
      return <span style={{ width: 3, height: 20, background: ACCENT, display: 'block' }} />
    case 'arrow':
      return (
        <svg viewBox="0 0 20 12" width="22" height="13" fill="none" stroke={ACCENT} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 6h15M11 1l5 5-5 5" />
        </svg>
      )
    case 'plus':
      return (
        <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke={ACCENT} strokeWidth="2.2" strokeLinecap="round">
          <path d="M8 1v14M1 8h14" />
        </svg>
      )
    case 'short-line':
    default:
      return <span style={{ width: 14, height: 2, background: ACCENT, display: 'block' }} />
  }
}

type Props = {
  field: { label?: string; name: string; required?: boolean }
  path: string
}

export default function BulletStylePickerField({ field, path }: Props) {
  const { value, setValue } = useField<BulletStyle>({ path })

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label ?? 'Styl punktora'} required={field.required} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '8px',
        marginTop: '8px',
      }}>
        {BULLET_STYLE_OPTIONS.map(({ value: styleValue, label, description }) => {
          const isSelected = value === styleValue
          return (
            <button
              key={styleValue}
              type="button"
              onClick={() => setValue(styleValue)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '8px',
                padding: '12px',
                border: isSelected ? `2px solid ${ACCENT}` : '1px solid var(--theme-elevation-150)',
                borderRadius: '4px',
                background: isSelected ? 'rgba(79,154,140,0.12)' : 'var(--theme-elevation-50)',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', height: 22 }}>
                <BulletPreview value={styleValue} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: isSelected ? ACCENT : 'var(--theme-text)' }}>
                {label}
              </span>
              <span style={{ fontSize: 10.5, lineHeight: 1.35, color: 'var(--theme-elevation-500)' }}>
                {description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
