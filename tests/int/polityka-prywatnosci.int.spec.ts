import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'

const mockGet = vi.fn()
vi.mock('next/headers', () => ({
  cookies: () => Promise.resolve({ get: mockGet }),
}))
vi.mock('server-only', () => ({}))

afterEach(cleanup)

describe('PolitykaPrywatnosci page', () => {
  beforeEach(() => {
    mockGet.mockReset()
    vi.resetModules()
  })

  it('renders Polish content when locale is pl (default, no cookie)', async () => {
    mockGet.mockReturnValue(undefined)
    const { default: PolitykaPrywatnosci } = await import('@/app/(frontend)/polityka-prywatnosci/page')

    const jsx = await PolitykaPrywatnosci()
    render(jsx)

    expect(screen.getByRole('heading', { name: 'Polityka prywatności' })).toBeTruthy()
    expect(screen.getByText('1. Administrator danych')).toBeTruthy()
    expect(screen.getByText('- Wróć na stronę główną')).toBeTruthy()
    expect(screen.queryByText('Privacy Policy')).toBeNull()
  })

  it('renders English content when locale is en', async () => {
    mockGet.mockReturnValue({ value: 'en' })
    const { default: PolitykaPrywatnosci } = await import('@/app/(frontend)/polityka-prywatnosci/page')

    const jsx = await PolitykaPrywatnosci()
    render(jsx)

    expect(screen.getByRole('heading', { name: 'Privacy Policy' })).toBeTruthy()
    expect(screen.getByText('1. Data Controller')).toBeTruthy()
    expect(screen.getByText('- Back to homepage')).toBeTruthy()
    expect(screen.queryByText('Polityka prywatności')).toBeNull()
  })
})
