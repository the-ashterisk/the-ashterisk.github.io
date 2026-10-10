import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Hero } from './Hero'
import { mockMatchMedia } from '../testUtils'

test('renders headline, both CTAs, and all four link buttons', () => {
  render(
    <ThemeProvider>
      <Hero />
    </ThemeProvider>,
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /watch on youtube/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /view projects/i })).toBeInTheDocument()
  // 4 social link buttons (YouTube/Instagram/GitHub/Email)
  expect(screen.getByRole('link', { name: /^instagram$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^github$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^email$/i })).toBeInTheDocument()
})

test('status badge names the mobile-to-AI shift and pings only when motion is allowed', () => {
  const { container, unmount } = render(
    <ThemeProvider>
      <Hero />
    </ThemeProvider>,
  )
  expect(screen.getByText(/mobile engineer, now building/i)).toBeInTheDocument()
  expect(container.querySelector('.animate-ping')).not.toBeNull()
  unmount()

  mockMatchMedia(['(prefers-reduced-motion: reduce)'])
  const reduced = render(
    <ThemeProvider>
      <Hero />
    </ThemeProvider>,
  )
  expect(reduced.container.querySelector('.animate-ping')).toBeNull()
})
