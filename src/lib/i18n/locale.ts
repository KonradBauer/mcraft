import { cookies } from 'next/headers'

export type Locale = 'pl' | 'en'

export const DEFAULT_LOCALE: Locale = 'pl'

export const LOCALE_COOKIE_NAME = 'locale'

function isLocale(value: string | undefined): value is Locale {
  return value === 'pl' || value === 'en'
}

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies()
  const value = cookieStore.get(LOCALE_COOKIE_NAME)?.value
  return isLocale(value) ? value : DEFAULT_LOCALE
}
