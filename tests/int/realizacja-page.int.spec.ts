import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest'
import { screen, cleanup } from '@testing-library/react'
import { renderServerComponent } from '../helpers/renderServerComponent'

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

async function findOrCreateServicePage(slug: string, title: string): Promise<string> {
  const { docs } = await payload.find({
    collection: 'service-pages',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (docs[0]) return docs[0].id
  const created = await payload.create({
    collection: 'service-pages',
    data: { slug, title },
    overrideAccess: true,
  })
  return created.id
}

// `Portfolio.ts` ma afterChange/afterDelete hook (src/lib/portfolioToRealizacje.ts) który
// synchronizuje portfolio-projects -> service-pages.realizacje automatycznie po każdym
// zapisie/usunięciu - dokładnie tak jak w prawdziwym adminie. Testy tworzą dane przez
// portfolio-projects (nie piszą do service-pages.realizacje bezpośrednio), więc nie ma
// wyścigu z innymi plikami testowymi które też tworzą/usuwają portfolio-projects
// (mk-gym-collections.int.spec.ts) - każdy resync i tak czyta pełny aktualny stan
// portfolio-projects, więc wynik jest spójny niezależnie od kolejności.
describe('Realizacja detail page - mk-gym support', () => {
  let portfolioId: string | undefined

  beforeAll(async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const servicePageId = await findOrCreateServicePage('mk-gym', 'MK Gym')
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
    await renderServerComponent(jsx)
    expect(screen.getByText('__test-mk-gym-realizacja-detail')).toBeTruthy()
  })

  it('back link in the header points to /mk-gym, not the homepage', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-mk-gym-realizacja-detail' }),
    })
    await renderServerComponent(jsx)
    const backLink = screen.getByText('MK Gym').closest('a')
    expect(backLink?.getAttribute('href')).toBe('/mk-gym')
  })

  it('topbar and mobile menu both show the MK Gym logo instead of MCRAFT', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-mk-gym-realizacja-detail' }),
    })
    await renderServerComponent(jsx)

    // Desktop topbar logo + MobileNav overlay header logo - both should be present.
    const logos = screen.getAllByRole('img', { name: 'MK Gym' })
    expect(logos.length).toBe(2)
    for (const logo of logos) {
      expect(logo.getAttribute('src')).toBe('/mk-gym-logo.png')
      expect(logo.parentElement?.className).toContain('bg-white')
    }

    const backLinks = screen.getAllByRole('link', { name: 'Powrót na mkcraft.com.pl' })
    expect(backLinks.length).toBeGreaterThan(0)
    for (const link of backLinks) {
      expect(link.getAttribute('href')).toBe('https://mkcraft.com.pl')
    }
    expect(screen.queryByRole('link', { name: 'O mnie' })).toBeNull()
  })

  it('generateMetadata returns "MK Gym | <tytuł>" title and the MK Gym favicon', async () => {
    const { generateMetadata } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const metadata = await generateMetadata({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-mk-gym-realizacja-detail' }),
    })
    expect(metadata.title).toEqual({ absolute: 'MK Gym | __test-mk-gym-realizacja-detail' })
    expect(metadata.icons).toEqual({ icon: '/mk-gym-favicon.png' })
  })

  it('still returns notFound() for a serviceSlug outside the allowed list (regression)', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'nieistniejacy-obszar', slug: '__test-mk-gym-realizacja-detail' }),
    })
    await expect(renderServerComponent(jsx)).rejects.toThrow()
  })
})

describe('Realizacja detail page - additionalGalleries (multiple groups)', () => {
  let mediaId: string
  let portfolioId: string | undefined

  beforeAll(async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const servicePageId = await findOrCreateServicePage('mk-gym', 'MK Gym')

    const onePixelPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    )
    const media = await payload.create({
      collection: 'media',
      data: { alt: '__test-additional-gallery-media' },
      file: { data: onePixelPng, mimetype: 'image/png', name: 'test-pixel.png', size: onePixelPng.length },
    })
    mediaId = media.id

    const created = await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: '__test-multi-gallery-realizacja',
        slug: '__test-multi-gallery-realizacja',
        servicePage: servicePageId,
        additionalGalleries: [
          { title: '__test-group-akcesoria', images: [{ image: mediaId, alt: '__test-akcesoria-photo' }] },
          { title: '__test-group-empty', images: [] },
        ],
      },
    })
    portfolioId = created.id
  })

  afterAll(async () => {
    if (portfolioId) {
      await payload.delete({ collection: 'portfolio-projects', id: portfolioId })
    }
    if (mediaId) {
      await payload.delete({ collection: 'media', id: mediaId })
    }
  })

  it('renders a group title and its photo for a group that has images', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-multi-gallery-realizacja' }),
    })
    await renderServerComponent(jsx)

    expect(screen.getByRole('heading', { name: '__test-group-akcesoria' })).toBeTruthy()
    expect(screen.getByAltText('__test-akcesoria-photo')).toBeTruthy()
  })

  it('does not render a title heading or gallery for a group with no images', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'mk-gym', slug: '__test-multi-gallery-realizacja' }),
    })
    await renderServerComponent(jsx)

    expect(screen.queryByRole('heading', { name: '__test-group-empty' })).toBeNull()
  })
})

describe('Realizacja detail page - meble-premium regression', () => {
  // meble-premium zostaje na starym modelu (kolekcja portfolio-projects) -
  // realizacje jako zagnieżdżona tablica dotyczy tylko mk-gym.
  let meblePremiumPortfolioId: string | undefined

  beforeAll(async () => {
    mockGet.mockReturnValue({ value: 'pl' })
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'meble-premium' } },
      limit: 1,
      overrideAccess: true,
    })
    const servicePageId = docs[0].id

    const created = await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: '__test-meble-premium-realizacja-detail',
        slug: '__test-meble-premium-realizacja-detail',
        servicePage: servicePageId,
      },
    })
    meblePremiumPortfolioId = created.id
  })

  afterAll(async () => {
    if (meblePremiumPortfolioId) {
      await payload.delete({ collection: 'portfolio-projects', id: meblePremiumPortfolioId })
    }
  })

  it('topbar still shows the MCRAFT wordmark and standard nav for non-mk-gym areas', async () => {
    const { default: RealizacjaPage } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const jsx = await RealizacjaPage({
      params: Promise.resolve({ serviceSlug: 'meble-premium', slug: '__test-meble-premium-realizacja-detail' }),
    })
    await renderServerComponent(jsx)

    expect(screen.getAllByText('MCRAFT').length).toBeGreaterThan(0)
    expect(screen.getAllByRole('link', { name: 'O mnie' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('img', { name: 'MK Gym' })).toBeNull()
  })

  it('generateMetadata still returns the plain realizacja title and no custom icons (regression)', async () => {
    const { generateMetadata } = await import('@/app/(frontend)/[serviceSlug]/realizacje/[slug]/page')
    const metadata = await generateMetadata({
      params: Promise.resolve({ serviceSlug: 'meble-premium', slug: '__test-meble-premium-realizacja-detail' }),
    })
    expect(metadata.title).toBe('__test-meble-premium-realizacja-detail')
    expect(metadata.icons).toBeUndefined()
  })
})

describe('Realizacja slug uniqueness validation', () => {
  let servicePageId: string

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
    servicePageId = await findOrCreateServicePage('mk-gym', 'MK Gym')
  })

  it('rejects two realizacje with the same slug on the same service page', async () => {
    const doc = await payload.findByID({ collection: 'service-pages', id: servicePageId, overrideAccess: true })
    const duplicateSlug = '__test-duplicate-slug'
    const withDuplicates = [
      ...(doc.realizacje ?? []),
      { title: 'A', slug: duplicateSlug },
      { title: 'B', slug: duplicateSlug },
    ]

    await expect(
      payload.update({
        collection: 'service-pages',
        id: servicePageId,
        data: { realizacje: withDuplicates },
        overrideAccess: true,
      }),
    ).rejects.toThrow()
  })
})
