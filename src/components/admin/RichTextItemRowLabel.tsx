'use client'

import { useRowLabel } from '@payloadcms/ui'

type LexicalNode = { type?: string; text?: string; children?: LexicalNode[] }
type LexicalValue = { root?: { children?: LexicalNode[] } }

function extractPlainText(value: unknown): string {
  const children = (value as LexicalValue)?.root?.children
  if (!children) return ''
  const walk = (nodes: LexicalNode[]): string =>
    nodes.map((node) => (node.type === 'text' ? node.text ?? '' : walk(node.children ?? []))).join('')
  return walk(children).trim()
}

export default function RichTextItemRowLabel() {
  const { data, rowNumber } = useRowLabel<{ text?: unknown }>()
  const preview = extractPlainText(data?.text)
  return <>{preview || `Punkt ${(rowNumber ?? 0) + 1}`}</>
}
