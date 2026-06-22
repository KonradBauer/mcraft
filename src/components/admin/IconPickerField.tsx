'use client'

import { useField, FieldLabel } from '@payloadcms/ui'
import { ICON_REGISTRY } from '@/lib/tileIcons'

const ICON_OPTIONS = [
  { value: 'Award',         label: 'Award' },
  { value: 'BadgeCheck',    label: 'BadgeCheck' },
  { value: 'Box',           label: 'Box' },
  { value: 'Briefcase',     label: 'Briefcase' },
  { value: 'Calendar',      label: 'Calendar' },
  { value: 'CheckCircle',   label: 'CheckCircle' },
  { value: 'ClipboardCheck',label: 'ClipboardCheck' },
  { value: 'ClipboardList', label: 'ClipboardList' },
  { value: 'Clock',         label: 'Clock' },
  { value: 'Cpu',           label: 'Cpu' },
  { value: 'Droplets',      label: 'Droplets' },
  { value: 'Eye',           label: 'Eye' },
  { value: 'Factory',       label: 'Factory' },
  { value: 'FileSearch',    label: 'FileSearch' },
  { value: 'FileText',      label: 'FileText' },
  { value: 'Flame',         label: 'Flame' },
  { value: 'FlaskConical',  label: 'FlaskConical' },
  { value: 'Globe',         label: 'Globe' },
  { value: 'GraduationCap', label: 'GraduationCap' },
  { value: 'HardHat',       label: 'HardHat' },
  { value: 'Layers',        label: 'Layers' },
  { value: 'Microscope',    label: 'Microscope' },
  { value: 'PenTool',       label: 'PenTool' },
  { value: 'Ruler',         label: 'Ruler' },
  { value: 'Search',        label: 'Search' },
  { value: 'Settings2',     label: 'Settings2' },
  { value: 'ShieldCheck',   label: 'ShieldCheck' },
  { value: 'Star',          label: 'Star' },
  { value: 'Timer',         label: 'Timer' },
  { value: 'Train',         label: 'Train' },
  { value: 'TrendingUp',    label: 'TrendingUp' },
  { value: 'UserCheck',     label: 'UserCheck' },
  { value: 'Users',         label: 'Users' },
  { value: 'Warehouse',     label: 'Warehouse' },
  { value: 'Wrench',        label: 'Wrench' },
  { value: 'Zap',           label: 'Zap' },
]

type Props = {
  field: { label?: string; name: string; required?: boolean }
  path: string
}

export default function IconPickerField({ field, path }: Props) {
  const { value, setValue } = useField<string>({ path })

  return (
    <div style={{ marginBottom: '1rem' }}>
      <FieldLabel label={field.label ?? 'Ikona'} required={field.required} />
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
        gap: '6px',
        marginTop: '8px',
      }}>
        {ICON_OPTIONS.map(({ value: iconName, label }) => {
          const Icon = ICON_REGISTRY[iconName]
          const isSelected = value === iconName
          return (
            <button
              key={iconName}
              type="button"
              onClick={() => setValue(isSelected ? undefined : iconName)}
              title={label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '10px 4px 8px',
                border: isSelected ? '2px solid #4f9a8c' : '1px solid var(--theme-elevation-150)',
                borderRadius: '4px',
                background: isSelected ? 'rgba(79,154,140,0.12)' : 'var(--theme-elevation-50)',
                cursor: 'pointer',
                color: isSelected ? '#4f9a8c' : 'var(--theme-text)',
                transition: 'all 0.15s',
              }}
            >
              {Icon && <Icon size={22} strokeWidth={1.6} />}
              <span style={{ fontSize: '9px', lineHeight: 1.2, textAlign: 'center', wordBreak: 'break-all' }}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
