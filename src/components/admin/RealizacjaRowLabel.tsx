'use client'

import { useRowLabel } from '@payloadcms/ui'

export default function RealizacjaRowLabel() {
  const { data, rowNumber } = useRowLabel<{ title?: string }>()
  return <>{data?.title || `Realizacja ${(rowNumber ?? 0) + 1}`}</>
}
