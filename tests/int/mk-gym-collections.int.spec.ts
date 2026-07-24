import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { GET } from '@/app/api/seed/route'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('MK Gym - seed via /api/seed', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const existing = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 10,
      overrideAccess: true,
    })
    for (const doc of existing.docs) {
      await payload.delete({ collection: 'service-pages', id: doc.id, overrideAccess: true })
    }
  })

  it('first call creates exactly one ServicePage with slug mk-gym', async () => {
    const res = await GET()
    const body = await res.json()
    const mkGymResult = body.results.find((r: { slug: string }) => r.slug === 'mk-gym')
    expect(mkGymResult).toEqual({ slug: 'mk-gym', status: 'created' })

    const { docs, totalDocs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 10,
    })
    expect(totalDocs).toBe(1)
    expect(docs[0].title).toBe('MK Gym')
  })

  it('second call updates the existing document instead of duplicating it', async () => {
    const res = await GET()
    const body = await res.json()
    const mkGymResult = body.results.find((r: { slug: string }) => r.slug === 'mk-gym')
    expect(mkGymResult).toEqual({ slug: 'mk-gym', status: 'updated' })

    const { totalDocs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 10,
    })
    expect(totalDocs).toBe(1)
  })
})

describe('Portfolio relationship to the mk-gym service page', () => {
  let servicePageId: string
  let portfolioId: string | undefined

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })

    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 1,
    })
    servicePageId = docs[0].id
  })

  afterAll(async () => {
    if (portfolioId) {
      await payload.delete({ collection: 'portfolio-projects', id: portfolioId })
    }
  })

  it('allows creating a Portfolio project linked to the mk-gym service page (filterOptions accepts it)', async () => {
    const created = await payload.create({
      collection: 'portfolio-projects',
      data: {
        title: '__test-mk-gym-realizacja',
        slug: '__test-mk-gym-realizacja',
        servicePage: servicePageId,
      },
    })
    portfolioId = created.id
    expect(created.servicePage).toBeTruthy()
  })

  it('still rejects a Portfolio project linked to a service page outside the allowed slugs', async () => {
    const { docs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'nadzor-spawalniczy' } },
      limit: 1,
    })
    const disallowedServicePageId = docs[0].id

    await expect(
      payload.create({
        collection: 'portfolio-projects',
        data: {
          title: '__test-disallowed-realizacja',
          slug: '__test-disallowed-realizacja',
          servicePage: disallowedServicePageId,
        },
      }),
    ).rejects.toThrow()
  })
})
