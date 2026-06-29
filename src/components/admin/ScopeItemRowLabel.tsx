'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function ScopeItemRowLabel() {
  const { data, rowNumber } = useRowLabel<{ text?: string }>()
  return <>{data?.text || `Punkt ${(rowNumber ?? 0) + 1}`}</>
}
