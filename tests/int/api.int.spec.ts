import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

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
