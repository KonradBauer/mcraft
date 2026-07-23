import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react'
import { LanguageSwitcher } from '@/components/mcraft/LanguageSwitcher'
import { ModalProvider } from '@/components/mcraft/ModalProvider'

afterEach(cleanup)

const mockRefresh = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh }),
}))

const mockSetLocale = vi.fn().mockResolvedValue(undefined)
vi.mock('@/lib/i18n/setLocale', () => ({
  setLocale: (...args: unknown[]) => mockSetLocale(...args),
}))

describe('LanguageSwitcher', () => {
  it('shows the current locale label', () => {
    render(<LanguageSwitcher locale="pl" />)
    expect(screen.getByRole('button', { name: /PL/i })).toBeTruthy()
  })

  it('opens the dropdown and shows both locale options on click', () => {
    render(<LanguageSwitcher locale="pl" />)
    fireEvent.click(screen.getByRole('button', { name: /PL/i }))
    expect(screen.getAllByText('PL').length).toBeGreaterThan(0)
    expect(screen.getByText('EN')).toBeTruthy()
  })

  it('calls setLocale with the opposite locale when selecting it', async () => {
    render(<LanguageSwitcher locale="pl" />)
    fireEvent.click(screen.getByRole('button', { name: /PL/i }))
    fireEvent.click(screen.getByText('EN'))

    await waitFor(() => expect(mockSetLocale).toHaveBeenCalledWith('en'))
    await waitFor(() => expect(mockRefresh).toHaveBeenCalled())
  })

  it('renders without crashing when there is no ModalProvider ancestor', () => {
    render(<LanguageSwitcher locale="en" />)
    expect(screen.getByRole('button', { name: /EN/i })).toBeTruthy()
  })

  it('renders identically when nested inside ModalProvider (desktop/mobile nav context)', () => {
    render(
      <ModalProvider>
        <LanguageSwitcher locale="pl" />
      </ModalProvider>,
    )
    expect(screen.getByRole('button', { name: /PL/i })).toBeTruthy()
  })
})
