import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, cleanup } from '@testing-library/react'
import { PageLoader } from '@/components/mcraft/PageLoader'

const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

afterEach(cleanup)

describe('PageLoader', () => {
  it('renders the loading splash on regular pages', () => {
    mockUsePathname.mockReturnValue('/meble-premium')
    const { container } = render(<PageLoader title="Test" />)
    expect(container.querySelector('[aria-hidden="true"]')).toBeTruthy()
  })

  it('does not render on /mk-gym - separate brand experience, no MCRAFT splash', () => {
    mockUsePathname.mockReturnValue('/mk-gym')
    const { container } = render(<PageLoader title="Test" />)
    expect(container.firstChild).toBeNull()
  })

  it('does not render on nested /mk-gym routes either', () => {
    mockUsePathname.mockReturnValue('/mk-gym/realizacje/przyklad')
    const { container } = render(<PageLoader title="Test" />)
    expect(container.firstChild).toBeNull()
  })
})
