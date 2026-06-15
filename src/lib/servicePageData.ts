import type { Media, ServicePage } from '@/payload-types'
import type { SubpageLayoutProps } from '@/components/mcraft/SubpageLayout'

function resolveMediaUrl(field: string | Media | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return field.url ?? null
}

export function toSubpageLayoutProps(
  page: ServicePage | undefined,
  fallback: Required<Pick<SubpageLayoutProps, 'eyebrow' | 'title' | 'description' | 'items'>>,
): SubpageLayoutProps {
  if (!page) return fallback

  const galleryImages = (page.galleryImages ?? []).reduce<{ url: string; alt?: string | null }[]>(
    (acc, g) => {
      const url = resolveMediaUrl(g.image)
      if (url) acc.push({ url, alt: g.alt })
      return acc
    },
    [],
  )

  return {
    eyebrow: page.eyebrow ?? fallback.eyebrow,
    title: page.title ?? fallback.title,
    description: page.description ?? fallback.description,
    items: page.scopeItems?.map((s) => ({ text: s.text })) ?? fallback.items,
    mainImageUrl: resolveMediaUrl(page.mainImage),
    galleryImages,
  }
}
