'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState, useTransition } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import { setLocale } from '@/lib/i18n/setLocale'
import { useOptionalModal } from './ModalProvider'

const LOCALES: Locale[] = ['pl', 'en']
const LOCALE_LABELS: Record<Locale, string> = { pl: 'PL', en: 'EN' }

interface LanguageSwitcherProps {
  locale: Locale
  triggerClassName?: string
}

export function LanguageSwitcher({ locale, triggerClassName = '' }: LanguageSwitcherProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const modal = useOptionalModal()
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [open])

  const handleSelect = (next: Locale) => {
    setOpen(false)
    if (next === locale) return
    if (modal?.isOpen) modal.closeModal()
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 cursor-pointer bg-transparent border-none disabled:opacity-50 ${triggerClassName}`}
        aria-haspopup="true"
        aria-expanded={open}
        disabled={isPending}
      >
        {LOCALE_LABELS[locale]}
        <svg
          viewBox="0 0 10 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className={`w-[9px] h-[5px] flex-none transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1l4 4 4-4" />
        </svg>
      </button>

      <div
        className={`absolute top-full right-0 pt-[10px] z-50 transition-all duration-150 ${open ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        aria-hidden={!open}
      >
        <div className="bg-ink border border-white/10 py-1.5 min-w-[90px]">
          {LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={() => handleSelect(code)}
              className={`w-full text-left flex items-center gap-3 px-5 py-[11px] font-montserrat text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-150 cursor-pointer bg-transparent border-none ${
                code === locale ? 'text-accent' : 'text-white/65 hover:text-accent hover:bg-white/[0.04]'
              }`}
            >
              {LOCALE_LABELS[code]}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
