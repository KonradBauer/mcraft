'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'
import { LanguageSwitcher } from './LanguageSwitcher'

type NavItem =
  | { href: string; label: string; sub?: never }
  | { label: string; sub: { href: string; label: string }[]; href?: never }

interface MobileNavProps {
  links: NavItem[]
  locale?: Locale
  dict: Dictionary
}

export function MobileNav({ links, locale = 'pl', dict }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const scrollYRef = useRef(0)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
    } else {
      const y = scrollYRef.current
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (y) window.scrollTo(0, y)
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [isOpen])

  return (
    <>
      <button
        className="hidden max-[980px]:flex items-center justify-center w-10 h-10 text-white cursor-pointer bg-transparent border-none"
        onClick={() => setIsOpen(true)}
        aria-label={dict.mobileNav.openMenuAria}
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[80] bg-ink flex flex-col transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        role="dialog"
        aria-modal="true"
        aria-label={dict.mobileNav.menuLabelAria}
      >
        <div className="flex items-center justify-between px-5 py-[30px] border-b border-white/10 flex-none">
          <span className="font-montserrat font-light text-[18px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
          <button
            className="w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
            onClick={close}
            aria-label={dict.mobileNav.closeMenuAria}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 flex flex-col justify-center px-8">
          {links.map((item) => {
            if (item.sub) {
              return (
                <div key={item.label} className="border-b border-white/[0.08] py-[14px]">
                  <span className="block font-montserrat text-[11px] font-semibold tracking-[0.28em] uppercase text-accent/70 mb-[10px]">
                    {item.label}
                  </span>
                  {item.sub.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={close}
                      className="block font-montserrat text-[18px] font-light tracking-[0.22em] uppercase text-light/70 py-[10px] pl-3 hover:text-accent hover:pl-5 transition-all duration-200"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              )
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="font-montserrat text-[22px] font-light tracking-[0.25em] uppercase text-light/80 py-[18px] border-b border-white/[0.08] hover:text-accent hover:pl-3 transition-all duration-200 last:border-b-0"
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="px-8 pb-10 flex-none">
          <div className="w-10 h-px bg-accent mb-6" />
          <div className="mb-5">
            <LanguageSwitcher locale={locale} triggerClassName="text-light/50 hover:text-accent text-[13px] font-montserrat font-semibold tracking-[0.2em] uppercase" />
          </div>
          <a
            href="https://www.linkedin.com/in/micha%C5%82-macherzy%C5%84ski-399521276/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="inline-flex items-center gap-3 font-montserrat text-[11px] font-semibold tracking-[0.2em] uppercase text-light/50 hover:text-accent transition-colors duration-200"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-[15px] h-[15px] flex-none">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
            {dict.mobileNav.linkedin}
          </a>
        </div>
      </div>
    </>
  )
}
