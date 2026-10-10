import { render, screen, within } from '@testing-library/react'
import { Footer } from './Footer'
import { EMAIL, socialLinks } from '../data/links'

afterEach(() => window.history.pushState({}, '', '/'))

test('keeps the connect anchor and the call to action', () => {
  const { container } = render(<Footer />)
  expect(container.querySelector('footer#connect')).not.toBeNull()
  expect(screen.getByRole('heading', { name: /follow the journey/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /email ashterisk/i })).toHaveAttribute('href', `mailto:${EMAIL}`)
})

test('shows the brand tagline', () => {
  render(<Footer />)
  expect(screen.getByText(/build in public\. learn out loud\./i)).toBeInTheDocument()
})

test('explore column links to home sections', () => {
  render(<Footer />)
  const explore = screen.getByRole('navigation', { name: 'Explore' })
  expect(within(explore).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
  expect(within(explore).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
})

test('explore column points home from a legal page', () => {
  window.history.pushState({}, '', '/terms/')
  render(<Footer />)
  const explore = screen.getByRole('navigation', { name: 'Explore' })
  expect(within(explore).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
})

test('follow column has one link per social', () => {
  render(<Footer />)
  const follow = screen.getByRole('navigation', { name: 'Follow' })
  for (const link of socialLinks) {
    expect(within(follow).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
  }
})

test('legal row has copyright, privacy and terms links', () => {
  render(<Footer />)
  const legal = screen.getByRole('navigation', { name: 'Legal' })
  expect(screen.getByText(`© ${new Date().getFullYear()} Ashterisk`)).toBeInTheDocument()
  expect(within(legal).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy/')
  expect(within(legal).getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('href', '/terms/')
})

test('back to top is a plain page-local link', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top')
})

test('copyright sits outside the legal navigation', () => {
  render(<Footer />)
  const legal = screen.getByRole('navigation', { name: 'Legal' })
  const copyright = screen.getByText(`© ${new Date().getFullYear()} Ashterisk`)
  expect(legal).not.toContainElement(copyright)
})
