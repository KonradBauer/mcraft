'use server'

import { cookies } from 'next/headers'
import { LOCALE_COOKIE_NAME, type Locale } from './locale'

export async function setLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE_NAME, locale, {
    path: '/',
    maxAge: 31536000,
    sameSite: 'lax',
  })
}
