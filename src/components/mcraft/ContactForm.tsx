'use client'

import { useState } from 'react'
import type { Dictionary } from '@/lib/i18n/dictionaries/pl'

type SubmitStatus = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'success' } | { kind: 'error' }

const inputClass =
  'w-full bg-white border border-[#e8e3d9] px-[18px] py-[14px] text-[15px] text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-accent transition-colors duration-200'

export function ContactForm({ dict }: { dict: Dictionary }) {
  const [status, setStatus] = useState<SubmitStatus>({ kind: 'idle' })

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ kind: 'submitting' })

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || undefined,
          message: formData.get('message'),
        }),
      })

      if (!res.ok) throw new Error('Request failed')

      setStatus({ kind: 'success' })
      form.reset()
    } catch {
      setStatus({ kind: 'error' })
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="relative bg-white border border-[#e8e3d9] p-[28px] max-w-[560px] mx-auto text-center">
        <span className="absolute top-0 left-0 w-[22px] h-[22px] border-t border-l border-accent pointer-events-none" />
        <p className="font-montserrat font-semibold text-[15px] text-dark-text">{dict.mkGym.contactSuccess}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-white border border-[#e8e3d9] p-[28px] max-w-[560px] mx-auto text-left flex flex-col gap-4">
      <span className="absolute top-0 left-0 w-[22px] h-[22px] border-t border-l border-accent pointer-events-none" />
      <input type="text" name="name" placeholder={dict.mkGym.contactNamePlaceholder} required className={inputClass} />
      <input type="email" name="email" placeholder={dict.mkGym.contactEmailPlaceholder} required className={inputClass} />
      <input type="tel" name="phone" placeholder={dict.mkGym.contactPhonePlaceholder} className={inputClass} />
      <textarea name="message" placeholder={dict.mkGym.contactMessagePlaceholder} required rows={4} className={inputClass} />
      <button
        type="submit"
        disabled={status.kind === 'submitting'}
        className="inline-flex items-center justify-center gap-6 bg-ink text-light font-montserrat text-xs font-semibold tracking-[0.2em] uppercase px-[28px] py-[17px] transition-all duration-[220ms] hover:bg-accent hover:text-ink disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status.kind === 'submitting' ? dict.mkGym.contactSubmitting : dict.mkGym.contactSubmit}
      </button>
      {status.kind === 'error' && (
        <p className="text-[13px] text-red-700">{dict.mkGym.contactError}</p>
      )}
    </form>
  )
}
