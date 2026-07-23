'use client'

import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import { setLocale } from '@/lib/i18n/setLocale'
import { useOptionalModal } from './ModalProvider'

export function useLanguageSwitch(locale: Locale) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const modal = useOptionalModal()

  const selectLocale = (next: Locale) => {
    if (next === locale) return
    if (modal?.isOpen) modal.closeModal()
    startTransition(async () => {
      await setLocale(next)
      router.refresh()
    })
  }

  return { isPending, selectLocale }
}
