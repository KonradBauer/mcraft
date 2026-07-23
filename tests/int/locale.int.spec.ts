import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
const mockCookies = vi.fn(() => Promise.resolve({ get: mockGet }))

vi.mock('next/headers', () => ({
  cookies: () => mockCookies(),
}))

describe('getLocale', () => {
  beforeEach(() => {
    mockGet.mockReset()
  })

  it('returns "pl" when no locale cookie is set', async () => {
    mockGet.mockReturnValue(undefined)
    const { getLocale } = await import('@/lib/i18n/locale')

    const locale = await getLocale()

    expect(locale).toBe('pl')
  })

  it('returns "en" when locale cookie is "en"', async () => {
    mockGet.mockReturnValue({ value: 'en' })
    const { getLocale } = await import('@/lib/i18n/locale')

    const locale = await getLocale()

    expect(locale).toBe('en')
  })

  it('returns "pl" and does not throw when cookie has an invalid value', async () => {
    mockGet.mockReturnValue({ value: 'de' })
    const { getLocale } = await import('@/lib/i18n/locale')

    await expect(getLocale()).resolves.toBe('pl')
  })

  it('returns "pl" when cookie value is an empty string', async () => {
    mockGet.mockReturnValue({ value: '' })
    const { getLocale } = await import('@/lib/i18n/locale')

    const locale = await getLocale()

    expect(locale).toBe('pl')
  })
})
