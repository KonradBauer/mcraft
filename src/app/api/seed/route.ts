import { getPayload } from 'payload'
import config from '@payload-config'
import { NextResponse } from 'next/server'

const PAGES = [
  {
    slug: 'meble-premium',
    title: 'Meble premium',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Meble premium',
    scopeItems: [
      { text: 'Autorskie meble premium' },
      { text: 'Realizacje indywidualne na zamówienie' },
      { text: 'Stal, kamień, drewno i szkło' },
      { text: 'Konstrukcje wykonywane ręcznie' },
      { text: 'Detale i wykończenia klasy premium' },
    ],
  },
  {
    slug: 'konstrukcje-stalowe',
    title: 'Konstrukcje stalowe',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Konstrukcje stalowe',
    scopeItems: [
      { text: 'Konstrukcje przemysłowe' },
      { text: 'Zadaszenia i zabudowy' },
      { text: 'Konstrukcje wsporcze i użytkowe' },
      { text: 'Elementy infrastruktury' },
      { text: 'Prefabrykacja warsztatowa' },
      { text: 'Indywidualne realizacje stalowe' },
    ],
  },
  {
    slug: 'nadzor-spawalniczy',
    title: 'Nadzór spawalniczy',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'Nadzór spawalniczy',
    scopeItems: [],
  },
  {
    slug: 'mk-gym',
    title: 'MK Gym',
    eyebrow: 'Obszar działalności',
    thumbnailTitle: 'MK Gym',
    scopeItems: [],
  },
]

export async function GET(request: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

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
      await payload.update({
        collection: 'service-pages',
        id: existing.docs[0].id,
        data: page,
        overrideAccess: true,
      })
      results.push({ slug: page.slug, status: 'updated' })
    }
  }

  return NextResponse.json({ ok: true, results })
}

export async function DELETE(request: Request) {
  const payload = await getPayload({ config })

  const { user } = await payload.auth({ headers: request.headers })
  if (!user) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const allowed = new Set(PAGES.map((p) => p.slug))

  const all = await payload.find({
    collection: 'service-pages',
    limit: 100,
    overrideAccess: true,
  })

  const deleted: string[] = []
  for (const doc of all.docs) {
    if (!allowed.has(doc.slug)) {
      await payload.delete({ collection: 'service-pages', id: doc.id, overrideAccess: true })
      deleted.push(doc.slug)
    }
  }

  return NextResponse.json({ ok: true, deleted })
}
