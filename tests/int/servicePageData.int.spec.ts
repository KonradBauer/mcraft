import { describe, it, expect } from 'vitest'
import { toSubpageLayoutProps } from '@/lib/servicePageData'
import { DEFAULT_BULLET_STYLE } from '@/lib/bulletStyles'
import { stringToLexical } from '@/lib/stringToLexical'
import type { ServicePage } from '@/payload-types'

const text = (value: string) => stringToLexical(value)

const BASE_PAGE: ServicePage = {
  id: 'page-1',
  slug: 'konstrukcje-stalowe',
  title: 'Konstrukcje stalowe',
  updatedAt: '2026-07-21T00:00:00.000Z',
  createdAt: '2026-07-21T00:00:00.000Z',
}

const FALLBACK = {
  eyebrow: 'Obszar działalności',
  title: 'Fallback title',
  description: 'Fallback description',
  items: [{ text: 'Fallback item' }],
}

describe('toSubpageLayoutProps', () => {
  it('returns audience: null when audienceItems is empty', () => {
    const page: ServicePage = { ...BASE_PAGE, audienceItems: [] }
    const result = toSubpageLayoutProps(page, FALLBACK)
    expect(result.audience).toBeNull()
  })

  it('returns audience: null when audienceItems is missing', () => {
    const result = toSubpageLayoutProps(BASE_PAGE, FALLBACK)
    expect(result.audience).toBeNull()
  })

  it('maps filled audienceItems and audienceTitle into audience', () => {
    const page: ServicePage = {
      ...BASE_PAGE,
      audienceTitle: 'Dla kogo?',
      audienceItems: [{ text: text('Zakłady produkcyjne') }, { text: text('Firmy budowlane i wykonawcy') }],
    }
    const result = toSubpageLayoutProps(page, FALLBACK)
    expect(result.audience).toEqual({
      title: 'Dla kogo?',
      bulletStyle: DEFAULT_BULLET_STYLE,
      items: [{ text: text('Zakłady produkcyjne') }, { text: text('Firmy budowlane i wykonawcy') }],
    })
  })

  it('maps filled additionalSections into the correct number of sections and items', () => {
    const page: ServicePage = {
      ...BASE_PAGE,
      additionalSections: [
        { title: 'Jak przygotować zapytanie?', items: [{ text: text('rodzaj konstrukcji') }, { text: text('rysunki lub szkice') }] },
        { title: 'Druga sekcja', items: [{ text: text('punkt A') }] },
      ],
    }
    const result = toSubpageLayoutProps(page, FALLBACK)
    expect(result.additionalSections).toHaveLength(2)
    expect(result.additionalSections?.[0]).toEqual({
      title: 'Jak przygotować zapytanie?',
      bulletStyle: DEFAULT_BULLET_STYLE,
      items: [{ text: text('rodzaj konstrukcji') }, { text: text('rysunki lub szkice') }],
    })
  })

  it('filters out additional sections that have no items', () => {
    const page: ServicePage = {
      ...BASE_PAGE,
      additionalSections: [
        { title: 'Pusta sekcja', items: [] },
        { title: 'Wypełniona sekcja', items: [{ text: text('punkt') }] },
      ],
    }
    const result = toSubpageLayoutProps(page, FALLBACK)
    expect(result.additionalSections).toHaveLength(1)
    expect(result.additionalSections?.[0].title).toBe('Wypełniona sekcja')
  })

  it('returns fallback unchanged when page is undefined', () => {
    const result = toSubpageLayoutProps(undefined, FALLBACK)
    expect(result).toBe(FALLBACK)
  })
})
