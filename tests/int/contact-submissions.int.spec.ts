import { getPayload, Payload } from 'payload'
import config from '@/payload.config'

import { describe, it, beforeAll, afterAll, expect } from 'vitest'

let payload: Payload

describe('ContactSubmission collection', () => {
  let createdId: string | undefined

  beforeAll(async () => {
    const payloadConfig = await config
    payload = await getPayload({ config: payloadConfig })
  })

  afterAll(async () => {
    if (createdId) {
      await payload.delete({ collection: 'contact-submissions', id: createdId })
    }
  })

  it('allows an unauthenticated visitor to submit the contact form (public create)', async () => {
    const created = await payload.create({
      collection: 'contact-submissions',
      data: {
        name: '__test-visitor',
        email: 'test-visitor@example.com',
        message: 'Wiadomość testowa z formularza MK Gym.',
      },
      overrideAccess: false,
    })

    createdId = created.id
    expect(created.name).toBe('__test-visitor')
    expect(created.email).toBe('test-visitor@example.com')
  })

  it('rejects a submission missing the required message field', async () => {
    await expect(
      payload.create({
        collection: 'contact-submissions',
        data: {
          name: '__test-invalid',
          email: 'invalid@example.com',
        } as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('rejects an unauthenticated read (default restrictive access)', async () => {
    await expect(
      payload.find({
        collection: 'contact-submissions',
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})
