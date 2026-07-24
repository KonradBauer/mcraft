import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const mockGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: mockGet }),
}))
vi.mock('server-only', () => ({}))
vi.mock('next/navigation', async (importOriginal) => {
  const actual = await importOriginal<typeof import('next/navigation')>()
  return { ...actual, useRouter: () => ({ refresh: vi.fn() }) }
})
vi.mock('@/lib/i18n/setLocale', () => ({
  setLocale: vi.fn().mockResolvedValue(undefined),
}))

afterEach(cleanup)

let payload: Payload
let portfolioId: string | undefined

describe('Realizacja detail page - mk-gym support', () => {
  beforeAll(async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    // Nie zakładaj, że rekord 'mk-gym' już istnieje - inne pliki testowe (np.
    // mk-gym-collections.int.spec.ts) mogą go w tym samym momencie usuwać/tworzyć
    // na tej samej realnej MongoDB (Vitest domyślnie uruchamia pliki równolegle).
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 1,
      overrideAccess: true,
    })
    const servicePageId = docs[0]
      ? docs[0].id
      : (
          await payload.create({
            collection: 'service-pages',
            data: { slug: 'mk-gym', title: 'MK Gym' },
            overrideAccess: true,
          })
        ).id

    const created = await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: '__test-mk-gym-realizacja-detail',
        slug: '__test-mk-gym-realizacja-detail',
        servicePage: servicePageId,
      },
    })
    portfolioId = created.id
  })

  afterAll(async () => {
    if (portfolioId) {
      await payload.delete({ collection: 'portfolio-projects', id: portfolioId })
    }
  })

  it('renders the correct content for serviceSlug=mk-gym with a valid realizacja slug', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-mk-gym-realizacja-detail' }),
    })
    render(jsx)
    expect(screen.getByText('__test-mk-gym-realizacja-detail')).toBeTruthy()
  })

  it('back link in the header points to /mk-gym, not the homepage', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-mk-gym-realizacja-detail' }),
    })
    render(jsx)
    const backLink = screen.getByText('MK Gym').closest('a')
    expect(backLink?.getAttribute('href')).toBe('/mk-gym')
  })

  it('still returns notFound() for a serviceSlug outside the allowed list (regression)', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    await expect(
      RealizacjaPage({
        params: Promise.resolve({ serviceSlug: 'nieistniejacy-obszar', slug: '__test-mk-gym-realizacja-detail' }),
      }),
    ).rejects.toThrow()
  })
})
