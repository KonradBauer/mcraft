import { randomBytes } from 'crypto'

export type Doc = Record<string, unknown>

function newRowId(): string {
  return randomBytes(12).toString('hex')
}

/**
 * Mapuje surowy dokument portfolio-projects na kształt jednego wiersza pola
 * `realizacje` w service-pages. Kopiuje `title`/`slug`/`description`/`images`/
 * `additionalGalleries` jeden-do-jednego (już w kształcie { pl, en } po migracji i18n) -
 * pomija `_id`, `servicePage`, `order`, `createdAt`, `updatedAt`.
 */
export function toRealizacjaRow(portfolioDoc: Doc): Doc {
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

export function sortByOrder(docs: Doc[]): Doc[] {
  return [...docs].sort((a, b) => {
    const orderA = typeof a.order === 'number' ? a.order : 0
    const orderB = typeof b.order === 'number' ? b.order : 0
    return orderA - orderB
  })
}
