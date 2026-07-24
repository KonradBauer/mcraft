import { getPayload, Payload } from 'payload'
import config from '@/payload.config'
import { GET } from '@/app/api/seed/route'

import { describe, it, beforeAll, afterAll, afterEach, expect, vi } from 'vitest'

const noAuthRequest = new Request('http://localhost/api/seed')

let payload: Payload

describe('MK Gym - seed via /api/seed', () => {
  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('rejects unauthenticated requests with 401 (no session cookie)', async () => {
    const res = await GET(noAuthRequest)
    expect(res.status).toBe(401)
  })

  it('authenticated call upserts exactly one ServicePage with slug mk-gym, twice in a row (idempotent)', async () => {
    // route-level auth gate is Payload's own login/session mechanism - real login()
    // hits a JWT-signing incompatibility under vitest's jsdom environment, unrelated
    // to this route's logic, so the "is authenticated" branch is exercised by
    // stubbing payload.auth() to resolve a user, same as a real logged-in admin would.
    //
    // Doesn't reset/delete the shared 'mk-gym' record first: this collection is
    // touched by other test files too (e.g. realizacja-page.int.spec.ts), and Vitest
    // runs files in parallel against the same real MongoDB - deleting it here would
    // race with them. First-call status is therefore whatever it already is
    // ('created' or 'updated'); only the invariant "exactly one doc, second call
    // always updates" is asserted.
    vi.spyOn(payload, 'auth').mockResolvedValue({
      permissions: {} as never,
      user: { collection: 'users', id: 'test-admin' } as never,
    })

    const firstRes = await GET(noAuthRequest)
    expect(firstRes.status).toBe(200)
    const firstBody = await firstRes.json()
    const firstResult = firstBody.results.find((r: { slug: string }) => r.slug === 'mk-gym')
    expect(['created', 'updated']).toContain(firstResult?.status)

    const secondRes = await GET(noAuthRequest)
    const secondBody = await secondRes.json()
    const secondResult = secondBody.results.find((r: { slug: string }) => r.slug === 'mk-gym')
    expect(secondResult).toEqual({ slug: 'mk-gym', status: 'updated' })

    const { docs, totalDocs } = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: 'mk-gym' } },
      limit: 10,
    })
    expect(totalDocs).toBe(1)
    expect(docs[0].title).toBe('MK Gym')
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
