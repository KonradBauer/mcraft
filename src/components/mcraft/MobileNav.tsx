'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface MobileNavProps {
  links: { href: string; label: string }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const close = () => setIsOpen(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      <button
        className="hidden max-[980px]:flex items-center justify-center w-10 h-10 text-white cursor-pointer bg-transparent border-none"
        onClick={() => setIsOpen(true)}
        aria-label="Otwórz menu"
        aria-expanded={isOpen}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-6 h-6">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      <div
        className={`fixed inset-0 z-[79] bg-black/50 transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 h-full w-[280px] bg-ink z-[80] flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacyjne"
      >
        <div className="flex items-center justify-between px-7 py-[30px] border-b border-white/10">
          <span className="font-montserrat font-light text-[16px] tracking-[0.45em] text-white uppercase">MCRAFT</span>
          <button
            className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white transition-colors duration-200 cursor-pointer bg-transparent border-none"
            onClick={close}
            aria-label="Zamknij menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-5 h-5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-7 pt-8 gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={close}
              className="font-montserrat text-[13px] font-semibold tracking-[0.22em] uppercase text-light py-[14px] border-b border-white/10 hover:text-accent transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
