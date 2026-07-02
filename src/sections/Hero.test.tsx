import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Hero } from './Hero'

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
