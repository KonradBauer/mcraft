import type { Document, Media } from '@/payload-types'

export function mediaUrl(field: string | Media | Document | null | undefined): string | null {
  if (!field || typeof field === 'string') return null
  return (field as { url?: string | null }).url ?? null
}
