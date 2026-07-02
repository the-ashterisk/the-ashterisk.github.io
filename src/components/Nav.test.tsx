import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Nav } from './Nav'

test('shows brand wordmark and a subscribe link to youtube', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByText(/ashterisk/i)).toBeInTheDocument()
  const subscribe = screen.getByRole('link', { name: /subscribe/i })
  expect(subscribe).toHaveAttribute('href', 'https://www.youtube.com/@the.ashterisk')
})
