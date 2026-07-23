import type { ReactNode } from 'react'
import type { Locale } from '@/lib/i18n/locale'

function FlagFrame({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 60 40" className="w-[18px] h-3 flex-none rounded-[2px] overflow-hidden ring-1 ring-black/10" aria-hidden="true">
      {children}
    </svg>
  )
}

function PlFlag() {
  return (
    <FlagFrame>
      <rect width="60" height="20" fill="#fff" />
      <rect y="20" width="60" height="20" fill="#dc143c" />
    </FlagFrame>
  )
}

function GbFlag() {
  return (
    <FlagFrame>
      <rect width="60" height="40" fill="#00247d" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#fff" strokeWidth="8" />
      <path d="M0 0 L60 40 M60 0 L0 40" stroke="#cf142b" strokeWidth="3" />
      <path d="M30 0 V40 M0 20 H60" stroke="#fff" strokeWidth="13" />
      <path d="M30 0 V40 M0 20 H60" stroke="#cf142b" strokeWidth="8" />
    </FlagFrame>
  )
}

export function LocaleFlag({ code }: { code: Locale }) {
  return code === 'pl' ? <PlFlag /> : <GbFlag />
}
