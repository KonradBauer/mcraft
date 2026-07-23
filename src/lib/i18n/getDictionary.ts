import 'server-only'
import type { Locale } from './locale'
import type { Dictionary } from './dictionaries/pl'
import { pl } from './dictionaries/pl'
import { en } from './dictionaries/en'

const dictionaries: Record<Locale, Dictionary> = { pl, en }

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]
}
