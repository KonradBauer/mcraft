import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: mockGet }),
}))
vi.mock('server-only', () => ({}))
// next/font/google eksportuje funkcje ktore dziala tylko poprzez kompilator Next.js (SWC/Turbopack) -
// pod Vitest to plain npm package bez tej magii, wiec trzeba je zamockowac.
vi.mock('next/font/google', () => ({
  Montserrat: () => ({ variable: '--font-montserrat' }),
  Barlow: () => ({ variable: '--font-sans' }),
  Great_Vibes: () => ({ variable: '--font-great-vibes' }),
}))

describe('generateMetadata locale-awareness', () => {
  beforeEach(() => {
    mockGet.mockReset()
    vi.resetModules()
  })

  it('nadzor-spawalniczy generateMetadata returns different title for pl vs en', async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const { generateMetadata: generateMetadataPl } = await import('@/app/(frontend)/nadzor-spawalniczy/page')
    const plMeta = await generateMetadataPl()

    vi.resetModules()
    mockGet.mockReturnValue({ value: 'en' })
    const { generateMetadata: generateMetadataEn } = await import('@/app/(frontend)/nadzor-spawalniczy/page')
    const enMeta = await generateMetadataEn()

    expect(plMeta.title).toBe('Nadzór spawalniczy - IWE / IWI / VT2 / PT2')
    expect(enMeta.title).toBe('Welding supervision - IWE / IWI / VT2 / PT2')
    expect(plMeta.title).not.toBe(enMeta.title)
  })

  it('root layout generateMetadata returns different title and openGraph.locale for pl vs en', async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const { generateMetadata: generateMetadataPl } = await import('@/app/(frontend)/layout')
    const plMeta = await generateMetadataPl()

    vi.resetModules()
    mockGet.mockReturnValue({ value: 'en' })
    const { generateMetadata: generateMetadataEn } = await import('@/app/(frontend)/layout')
    const enMeta = await generateMetadataEn()

    expect(plMeta.openGraph?.locale).toBe('pl_PL')
    expect(enMeta.openGraph?.locale).toBe('en_US')
    expect(plMeta.description).not.toBe(enMeta.description)
  })
})
