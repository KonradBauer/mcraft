import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { SubpageLayout } from '@/components/mcraft/SubpageLayout'
import { DEFAULT_BULLET_STYLE } from '@/lib/bulletStyles'
import { stringToLexical } from '@/lib/stringToLexical'
import { pl } from '@/lib/i18n/dictionaries/pl'
import { en } from '@/lib/i18n/dictionaries/en'

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
  dict: pl,
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

  it('renders English nav/CTA labels instead of Polish when given the EN dictionary', () => {
    render(<SubpageLayout {...BASE_PROPS} dict={en} />)
    expect(screen.getByRole('heading', { name: 'Scope' })).toBeTruthy()
    expect(screen.getByRole('heading', { name: 'Interested in working together?' })).toBeTruthy()
    expect(screen.getAllByText('Get in touch').length).toBeGreaterThan(0)
    expect(screen.queryByText('Zakres')).toBeNull()
    expect(screen.queryByText('Skontaktuj się')).toBeNull()
  })

  it('renders the MCRAFT wordmark and standard nav links by default (no overrides)', () => {
    render(<SubpageLayout {...BASE_PROPS} />)
    // Wordmark appears twice: desktop topbar + MobileNav overlay header (both always in the DOM).
    expect(screen.getAllByText('MCRAFT').length).toBe(2)
    expect(screen.getAllByRole('link', { name: 'O mnie' }).length).toBeGreaterThan(0)
    expect(screen.queryByRole('img', { name: 'MK Gym' })).toBeNull()
  })

  it('renders the logo image instead of the MCRAFT wordmark in the topbar when logoImageUrl is given', () => {
    render(<SubpageLayout {...BASE_PROPS} logoImageUrl="/mk-gym-logo.png" />)
    const logo = screen.getByRole('img', { name: 'MK Gym' })
    expect(logo.getAttribute('src')).toBe('/mk-gym-logo.png')
    // Only the MobileNav overlay header still says "MCRAFT" - the topbar wordmark itself is gone.
    expect(screen.getAllByText('MCRAFT').length).toBe(1)
  })

  it('logo link uses logoHref when given, defaults to "/" otherwise', () => {
    const { unmount } = render(<SubpageLayout {...BASE_PROPS} />)
    const defaultLogoLink = screen.getAllByRole('link').find((a) => a.textContent === 'MCRAFT')
    expect(defaultLogoLink?.getAttribute('href')).toBe('/')
    unmount()

    render(<SubpageLayout {...BASE_PROPS} logoImageUrl="/mk-gym-logo.png" logoHref="https://mcraft.com.pl" />)
    const logoLink = screen.getByRole('img', { name: 'MK Gym' }).closest('a')
    expect(logoLink?.getAttribute('href')).toBe('https://mcraft.com.pl')
  })

  it('replaces the standard nav with a single navOverride link, but keeps the language switcher', () => {
    render(
      <SubpageLayout
        {...BASE_PROPS}
        navOverride={{ href: 'https://mcraft.com.pl', label: 'Powrót na mcraft.com.pl' }}
      />,
    )
    const backLinks = screen.getAllByRole('link', { name: 'Powrót na mcraft.com.pl' })
    expect(backLinks.length).toBeGreaterThan(0)
    for (const link of backLinks) {
      expect(link.getAttribute('href')).toBe('https://mcraft.com.pl')
    }
    expect(screen.queryByRole('link', { name: 'O mnie' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'Obszary' })).toBeNull()
    expect(screen.queryByText('Realizacje')).toBeNull()
    expect(screen.getAllByRole('button', { name: /PL/i }).length).toBeGreaterThan(0)
  })
})
