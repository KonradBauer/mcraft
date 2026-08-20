import { randomBytes } from 'crypto'
import type { Payload } from 'payload'

// Tylko te podstrony czytaja realizacje z zagniezdzonego pola ServicePage.realizacje
// zamiast z kolekcji portfolio-projects bezposrednio (patrz admin.condition w ServicePage.ts).
const REALIZACJE_ENABLED_SLUGS = ['mk-gym']

type Doc = Record<string, unknown>

function newRowId(): string {
  return randomBytes(12).toString('hex')
}

function toRealizacjaRow(portfolioDoc: Doc): Doc {
  return {
    id: newRowId(),
    title: portfolioDoc.title ?? null,
    slug: portfolioDoc.slug ?? '',
    description: portfolioDoc.description ?? null,
    thumbnail: portfolioDoc.thumbnail ?? null,
    images: portfolioDoc.images ?? [],
    additionalGalleries: portfolioDoc.additionalGalleries ?? [],
  }
}

function sortByOrder(docs: Doc[]): Doc[] {
  return [...docs].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0
    const orderB = typeof b.order === 'number' ? b.order : 0
    return orderA - orderB
  })
}

/**
 * Przepisuje realizacje danej podstrony z surowej kolekcji portfolio-projects do
 * ServicePage.realizacje - surowy dostep przez payload.db.connection (nie Local API),
 * zeby ominac ryzyko utraty danych przy zapisie pol localized bez podania locale (patrz
 * docs/solutions/backend-issues/2026-07-23-payload-unmigrated-locale-fields-lose-data-on-save.md).
 * Bez efektu jesli podstrona nie jest na liscie REALIZACJE_ENABLED_SLUGS.
 */
export async function syncRealizacjeForServicePage(payload: Payload, servicePageId: string): Promise<void> {
  const connection = payload.db.connection as { base: { Types: { ObjectId: new (id: string) => unknown } }; collection: (name: string) => { findOne: (q: Doc) => Promise<Doc | null>; find: (q: Doc) => { toArray: () => Promise<Doc[]> }; updateOne: (q: Doc, u: Doc) => Promise<unknown> } }
  const objectId = new connection.base.Types.ObjectId(servicePageId)

  const servicePages = connection.collection('service-pages')
  const servicePageDoc = await servicePages.findOne({ _id: objectId })
  if (!servicePageDoc || !REALIZACJE_ENABLED_SLUGS.includes(servicePageDoc.slug as string)) return

  const portfolioProjects = connection.collection('portfolio-projects')
  const portfolioDocs = await portfolioProjects.find({ servicePage: servicePageDoc._id }).toArray()

  const realizacje = sortByOrder(portfolioDocs).map(toRealizacjaRow)
  await servicePages.updateOne({ _id: servicePageDoc._id }, { $set: { realizacje } })
}
