'use client'

import { useTransition } from 'react'
import type { Locale } from '@/lib/i18n/locale'
import { setLocale } from '@/lib/i18n/setLocale'
import { useOptionalModal } from './ModalProvider'

export function useLanguageSwitch(locale: Locale) {
  const [isPending, startTransition] = useTransition()
  const modal = useOptionalModal()

  const selectLocale = (next: Locale) => {
    if (next === locale) return
    if (modal?.isOpen) modal.closeModal()
    startTransition(async () => {
      await setLocale(next)
      // router.refresh() nie odświeża poprawnie zawartości owiniętej w <Suspense>
      // pod Cache Components (React Activity zachowuje stan zamiast podmienić
      // strumieniowaną treść) - pełny reload jest tu i tak spójny UX-owo,
      // bo zmiana języka podmienia praktycznie cały tekst na stronie.
      window.location.reload()
    })
  }

  return { isPending, selectLocale }
}
