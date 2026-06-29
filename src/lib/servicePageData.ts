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

  return {
    eyebrow: page.eyebrow ?? fallback.eyebrow,
    title: page.title ?? fallback.title,
    description: page.description ?? fallback.description,
    items: page.scopeItems?.length ? page.scopeItems.map((s) => ({ icon: s.icon ?? null, text: s.text, description: s.description ?? null })) : fallback.items,
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
