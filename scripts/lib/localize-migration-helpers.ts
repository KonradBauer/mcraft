export type Doc = Record<string, unknown>

export function isAlreadyLocalized(value: unknown): boolean {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false
  const obj = value as Record<string, unknown>
  return ('pl' in obj || 'en' in obj) && !('root' in obj)
}

export function localizeField(doc: Doc, field: string): boolean {
  const value = doc[field]
  if (value === undefined || value === null) return false
  if (isAlreadyLocalized(value)) return false
  doc[field] = { pl: value }
  return true
}

export function localizeArrayField(doc: Doc, arrayField: string, subFields: string[]): boolean {
  const items = doc[arrayField]
  if (!Array.isArray(items)) return false
  let changed = false
  for (const item of items) {
    if (!item || typeof item !== 'object') continue
    for (const sub of subFields) {
      if (localizeField(item as Doc, sub)) changed = true
    }
  }
  return changed
}

export function migrateServicePage(doc: Doc): boolean {
  let changed = false
  if (localizeField(doc, 'eyebrow')) changed = true
  if (localizeField(doc, 'title')) changed = true
  if (localizeField(doc, 'description')) changed = true
  if (localizeArrayField(doc, 'scopeItems', ['text', 'description', 'modalDescription'])) changed = true
  if (localizeField(doc, 'audienceTitle')) changed = true
  if (localizeArrayField(doc, 'audienceItems', ['text'])) changed = true

  const sections = doc.additionalSections
  if (Array.isArray(sections)) {
    for (const section of sections) {
      if (!section || typeof section !== 'object') continue
      if (localizeField(section as Doc, 'title')) changed = true
      if (localizeArrayField(section as Doc, 'items', ['text'])) changed = true
    }
  }

  if (localizeField(doc, 'ctaHeader')) changed = true
  if (localizeField(doc, 'thumbnailTitle')) changed = true
  return changed
}

export function migratePortfolio(doc: Doc): boolean {
  let changed = false
  if (localizeField(doc, 'title')) changed = true
  if (localizeField(doc, 'description')) changed = true
  if (localizeArrayField(doc, 'images', ['alt'])) changed = true
  return changed
}

export function migrateStatTile(doc: Doc): boolean {
  let changed = false
  if (localizeField(doc, 'label')) changed = true
  if (localizeField(doc, 'description')) changed = true
  return changed
}

export function migrateHeroSection(doc: Doc): boolean {
  let changed = false
  if (localizeField(doc, 'subtitle')) changed = true
  if (localizeField(doc, 'description')) changed = true
  return changed
}

export function migrateAboutSection(doc: Doc): boolean {
  return localizeField(doc, 'bioText')
}

export function migrateCvModal(doc: Doc): boolean {
  let changed = false
  if (localizeArrayField(doc, 'experience', ['description', 'company'])) changed = true
  if (localizeArrayField(doc, 'qualifications', ['description'])) changed = true
  if (localizeArrayField(doc, 'education', ['institution', 'description'])) changed = true
  if (localizeArrayField(doc, 'additionalQualifications', ['description'])) changed = true
  if (localizeField(doc, 'skills')) changed = true
  if (localizeField(doc, 'interests')) changed = true
  return changed
}

export function migrateBioModal(doc: Doc): boolean {
  return localizeArrayField(doc, 'sections', ['title', 'content'])
}
