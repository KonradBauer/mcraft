import type { ReactNode } from 'react'

/**
 * "PhD" pod CSS `uppercase` renderuje sie jako "PHD" (myli sie z akronimem instytucji).
 * Owija fragment "PhD" w span z `normal-case`, zeby nadpisac transform rodzica -
 * reszta tekstu nadal dziedziczy uppercase bez zmian.
 */
export function preserveAcronymCase(text: string): ReactNode {
  const parts = text.split('PhD')
  if (parts.length === 1) return text

  return parts.reduce<ReactNode[]>((acc, part, i) => {
    if (i > 0) acc.push(<span key={i} className="normal-case">PhD</span>)
    acc.push(part)
    return acc
  }, [])
}
