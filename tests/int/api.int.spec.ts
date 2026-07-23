import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'
import {
  isAlreadyLocalized,
  localizeField,
  migrateBioModal,
  type Doc,
} from '../../scripts/lib/localize-migration-helpers'
import { stringToLexical } from '../../src/lib/stringToLexical'

let payload: Payload

describe('API', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches users', async () => {
    const users = await payload.find({
      collection: 'users',
    })
    expect(users).toBeDefined()
  })
})

describe('CMS Globals', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  it('fetches hero-section global', async () => {
    const hero = await payload.findGlobal({ slug: 'hero-section' })
    expect(hero).toBeDefined()
    expect(typeof hero).toBe('object')
  })

  it('fetches about-section global', async () => {
    const about = await payload.findGlobal({ slug: 'about-section' })
    expect(about).toBeDefined()
    expect(typeof about).toBe('object')
  })

  it('fetches cv-modal global', async () => {
    const cvModal = await payload.findGlobal({ slug: 'cv-modal' })
    expect(cvModal).toBeDefined()
  })

  it('fetches bio-modal global', async () => {
    const bioModal = await payload.findGlobal({ slug: 'bio-modal' })
    expect(bioModal).toBeDefined()
  })
})

describe('StatTile collection', () => {
  const createdIds: string[] = []

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const tiles = [
      { number: '__T1', label: 'Test First', description: 'Desc 1', order: 2 },
      { number: '__T2', label: 'Test Second', description: 'Desc 2', order: 1 },
      { number: '__T3', label: 'Test Third', description: 'Desc 3', order: 3 },
    ]
    for (const tile of tiles) {
      const created = await payload.create({ collection: 'stat-tiles', data: tile })
      createdIds.push(created.id)
    }
  })

  afterAll(async () => {
    for (const id of createdIds) {
      await payload.delete({ collection: 'stat-tiles', id })
    }
  })

  it('returns tiles sorted by order ascending', async () => {
    const { docs } = await payload.find({
      collection: 'stat-tiles',
      where: { number: { in: ['__T1', '__T2', '__T3'] } },
      sort: 'order',
      limit: 10,
    })
    expect(docs.length).toBe(3)
    const orders = docs.map((d) => d.order ?? 0)
    for (let i = 1; i < orders.length; i++) {
      expect(orders[i]).toBeGreaterThanOrEqual(orders[i - 1])
    }
  })

  it('returns empty array when no tiles match filter', async () => {
    const { docs } = await payload.find({
      collection: 'stat-tiles',
      where: { number: { equals: '__NON_EXISTENT__' } },
    })
    expect(docs).toHaveLength(0)
  })
})

describe('ServicePage collection', () => {
  let createdId: string

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const created = await payload.create({
      collection: 'service-pages',
      data: {
        slug: '__int-test-service',
        title: 'Integration Test Page',
        eyebrow: 'Test',
        description: 'Test description',
        scopeItems: [{ text: 'Test scope item' }],
      },
    })
    createdId = created.id
  })

  afterAll(async () => {
    if (createdId) {
      await payload.delete({ collection: 'service-pages', id: createdId }).catch(() => {})
    }
  })

  it('finds ServicePage by slug', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__int-test-service' } },
    })
    expect(docs).toHaveLength(1)
    expect(docs[0].title).toBe('Integration Test Page')
  })

  it('returns scopeItems array', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__int-test-service' } },
    })
    expect(docs[0].scopeItems).toHaveLength(1)
    expect(docs[0].scopeItems![0].text).toBe('Test scope item')
  })

  it('returns empty when slug not found', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: '__non-existent-xyz' } },
    })
    expect(docs).toHaveLength(0)
  })
})

describe('Payload localization - locale fallback', () => {
  let createdId: string

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const created = await payload.create({
      collection: 'service-pages',
      locale: 'pl',
      data: {
        slug: '__int-test-locale-fallback',
        title: 'Tytul PL',
        eyebrow: 'Test',
        description: 'Opis PL',
        scopeItems: [{ text: 'Punkt PL' }],
      },
    })
    createdId = created.id
  })

  afterAll(async () => {
    if (createdId) {
      await payload.delete({ collection: 'service-pages', id: createdId }).catch(() => {})
    }
  })

  it('returns PL content unchanged when queried with locale pl', async () => {
    const doc = await payload.findByID({ collection: 'service-pages', id: createdId, locale: 'pl' })
    expect(doc.title).toBe('Tytul PL')
    expect(doc.scopeItems?.[0]?.text).toBe('Punkt PL')
  })

  it('falls back to PL when queried with locale en and no EN translation exists', async () => {
    const doc = await payload.findByID({ collection: 'service-pages', id: createdId, locale: 'en' })
    expect(doc.title).toBe('Tytul PL')
    expect(doc.scopeItems?.[0]?.text).toBe('Punkt PL')
  })

  it('returns EN content when EN translation is set, PL stays unchanged', async () => {
    await payload.update({
      collection: 'service-pages',
      id: createdId,
      locale: 'en',
      data: { title: 'EN Title' },
    })

    const enDoc = await payload.findByID({ collection: 'service-pages', id: createdId, locale: 'en' })
    expect(enDoc.title).toBe('EN Title')

    const plDoc = await payload.findByID({ collection: 'service-pages', id: createdId, locale: 'pl' })
    expect(plDoc.title).toBe('Tytul PL')
  })
})

describe('Payload localization - bio-modal global', () => {
  let originalSections: unknown

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const current = await payload.findGlobal({ slug: 'bio-modal', locale: 'pl' })
    originalSections = current.sections ?? []
  })

  afterAll(async () => {
    await payload.updateGlobal({
      slug: 'bio-modal',
      locale: 'pl',
      data: { sections: originalSections as never },
    })
  })

  it('returns EN content when set, not PL, via findGlobal with locale en', async () => {
    const plWrite = await payload.updateGlobal({
      slug: 'bio-modal',
      locale: 'pl',
      data: { sections: [{ title: 'Sekcja PL', content: stringToLexical('Tresc PL') }] },
    })
    const sectionId = plWrite.sections?.[0]?.id

    // sekcje jako array NIE sa localized (tylko ich pola-liscie title/content) -
    // trzeba zaktualizowac TEN SAM element po id, inaczej powstanie nowy wpis bez wartosci PL
    await payload.updateGlobal({
      slug: 'bio-modal',
      locale: 'en',
      data: { sections: [{ id: sectionId, title: 'Section EN', content: stringToLexical('Content EN') }] },
    })

    const enGlobal = await payload.findGlobal({ slug: 'bio-modal', locale: 'en' })
    expect(enGlobal.sections?.[0]?.title).toBe('Section EN')

    const plGlobal = await payload.findGlobal({ slug: 'bio-modal', locale: 'pl' })
    expect(plGlobal.sections?.[0]?.title).toBe('Sekcja PL')
  })
})

describe('Migration script helpers - idempotency', () => {
  it('does not change an already-localized field on second run', () => {
    const doc: Doc = { title: 'Tytul PL' }

    const firstRun = localizeField(doc, 'title')
    expect(firstRun).toBe(true)
    expect(doc.title).toEqual({ pl: 'Tytul PL' })

    const secondRun = localizeField(doc, 'title')
    expect(secondRun).toBe(false)
    expect(doc.title).toEqual({ pl: 'Tytul PL' })
  })

  it('does not treat lexical richText JSON (with root key) as already localized', () => {
    const richTextValue = { root: { children: [] } }
    expect(isAlreadyLocalized(richTextValue)).toBe(false)
  })

  it('running migrateBioModal twice on the same doc does not duplicate or corrupt sections', () => {
    const doc: Doc = {
      sections: [{ title: 'Sekcja PL', content: 'Tresc PL' }],
    }

    const firstRun = migrateBioModal(doc)
    expect(firstRun).toBe(true)
    const sectionsAfterFirst = doc.sections as Array<{ title: unknown; content: unknown }>
    expect(sectionsAfterFirst).toHaveLength(1)
    expect(sectionsAfterFirst[0].title).toEqual({ pl: 'Sekcja PL' })

    const secondRun = migrateBioModal(doc)
    expect(secondRun).toBe(false)
    const sectionsAfterSecond = doc.sections as Array<{ title: unknown; content: unknown }>
    expect(sectionsAfterSecond).toHaveLength(1)
    expect(sectionsAfterSecond[0].title).toEqual({ pl: 'Sekcja PL' })
  })
})
