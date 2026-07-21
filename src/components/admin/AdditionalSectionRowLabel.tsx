'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function AdditionalSectionRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <>{data?.title || `Sekcja ${(rowNumber ?? 0) + 1}`}</>
}
