import { describe, it, expect, vi } from 'vitest'
import { pl } from '@/lib/i18n/dictionaries/pl'
import { en } from '@/lib/i18n/dictionaries/en'
import { getDictionary } from '@/lib/i18n/getDictionary'

// 'server-only' rzuca poza kontekstem RSC Next.js (brak warunku exports "react-server"
// w plain Node/Vitest) - zamockuj zeby getDictionary dalo sie zaimportowac w tescie.
// vi.mock jest hoistowany przed importami, wiec dziala mimo kolejnosci zapisu.
vi.mock('server-only', () => ({}))

describe('i18n dictionaries', () => {
  it('en.ts exports exactly the same top-level keys as pl.ts', () => {
    expect(Object.keys(en).sort()).toEqual(Object.keys(pl).sort())
  })

  it('getDictionary("pl") returns the PL dictionary', async () => {
    const dict = await getDictionary('pl')
    expect(dict.nav.about).toBe('O mnie')
  })

  it('getDictionary("en") returns the EN dictionary', async () => {
    const dict = await getDictionary('en')
    expect(dict.nav.about).toBe('About')
  })
})
