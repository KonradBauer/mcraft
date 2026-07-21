import type { Media, PortfolioProject, ServicePage } from '@/payload-types'
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

  const audienceItems = page.audienceItems?.filter((item) => item.text) ?? []

  return {
    eyebrow: page.eyebrow ?? fallback.eyebrow,
    title: page.title ?? fallback.title,
    description: page.description ?? fallback.description,
    heroImageUrl: resolveMediaUrl(page.heroImage),
    items: page.scopeItems?.length
      ? page.scopeItems.map((s) => ({
          icon: s.icon ?? null,
          text: s.text,
          description: s.description ?? null,
          modalDescription: s.modalDescription ?? null,
        }))
      : fallback.items,
    audience: audienceItems.length
      ? { title: page.audienceTitle ?? 'Dla kogo?', items: audienceItems.map((item) => ({ text: item.text })) }
      : null,
    additionalSections: (page.additionalSections ?? [])
      .map((section) => ({
        title: section.title,
        items: (section.items ?? []).filter((item) => item.text).map((item) => ({ text: item.text })),
      }))
      .filter((section) => section.items.length > 0),
  }
}

export function toRealizacjeProps(
  items: PortfolioProject[],
  serviceSlug: string,
): NonNullable<SubpageLayoutProps['realizacje']> {
  return items.map((item) => ({
    href: `/${serviceSlug}/realizacje/${item.slug}`,
    title: item.title,
    thumbnailUrl: resolveMediaUrl(item.thumbnail),
  }))
}
