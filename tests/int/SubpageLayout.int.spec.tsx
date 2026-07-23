import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { DEFAULT_BULLET_STYLE } from '@/lib/bulletStyles'
import { stringToLexical } from '@/lib/stringToLexical'

// SubpageLayout renderuje LanguageSwitcher (Faza 4), ktory wymaga next/navigation router
// context oraz wywoluje server action setLocale - obie zaleznosci zewnetrzne w tym tescie.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))
vi.mock('@/lib/i18n/setLocale', () => ({
  setLocale: vi.fn().mockResolvedValue(undefined),
}))

afterEach(cleanup)

const BASE_PROPS = {
  title: 'Konstrukcje stalowe',
  items: [{ text: 'Konstrukcje przemysłowe i hale' }],
}

describe('SubpageLayout', () => {
  it('does not render the "Dla kogo?" heading when audience is null', () => {
    render(<SubpageLayout {...BASE_PROPS} audience={null} />)
    expect(screen.queryByRole('heading', { name: 'Dla kogo?' })).toBeNull()
  })

  it('renders the "Dla kogo?" heading and its items when audience is provided', () => {
    render(
      <SubpageLayout
        {...BASE_PROPS}
        audience={{
          title: 'Dla kogo?',
          bulletStyle: DEFAULT_BULLET_STYLE,
          items: [{ text: stringToLexical('Zakłady produkcyjne') }],
        }}
      />,
    )
    expect(screen.getByRole('heading', { name: 'Dla kogo?' })).toBeTruthy()
    expect(screen.getByText('Zakłady produkcyjne')).toBeTruthy()
  })

  it('does not render a "Realizacje" heading when realizacje is empty', () => {
    render(<SubpageLayout {...BASE_PROPS} realizacje={[]} />)
    expect(screen.queryByRole('heading', { name: 'Realizacje' })).toBeNull()
  })

  it('renders without crashing when there are no additional sections and no audience', () => {
    render(<SubpageLayout {...BASE_PROPS} />)
    expect(screen.getByRole('heading', { name: 'Zakres' })).toBeTruthy()
  })
})
