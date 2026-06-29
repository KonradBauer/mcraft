import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const PAGES = [
  {
    slug: 'meble-premium',
    title: 'Meble premium',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Meble premium',
  },
  {
    slug: 'konstrukcje-stalowe',
    title: 'Konstrukcje stalowe',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Konstrukcje stalowe',
  },
  {
    slug: 'nadzor-spawalniczy',
    title: 'Nadzor spawalniczy',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Nadzor spawalniczy',
  },
]

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only available in development' }, { status: 403 })
  }

  const payload = await getPayload({ config })
  const results: { slug: string; status: string }[] = []

  for (const page of PAGES) {
    const existing = await payload.find({
      collection: 'service-pages',
      where: { slug: { equals: page.slug } },
      limit: 1,
      overrideAccess: true,
    })

    if (existing.totalDocs === 0) {
      await payload.create({
        collection: 'service-pages',
        data: page,
        overrideAccess: true,
      })
      results.push({ slug: page.slug, status: 'created' })
    } else {
      results.push({ slug: page.slug, status: 'exists' })
    }
  }

  return NextResponse.json({ ok: true, results })
}
