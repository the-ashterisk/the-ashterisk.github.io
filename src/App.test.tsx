import { render, screen } from '@testing-library/react'
import { ThemeProvider } from './theme/ThemeProvider'
import App from './App'

test('composes the full landing page', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
  expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument() // hero
  expect(screen.getByRole('heading', { name: /things i've built/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /the channel/i })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: /follow the journey/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy/')
})
