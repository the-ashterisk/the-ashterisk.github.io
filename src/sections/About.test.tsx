import { render, screen } from '@testing-library/react'
import { About } from './About'

test('renders the about heading and tagline', () => {
  render(<About />)
  expect(screen.getByRole('heading', { name: /the channel/i })).toBeInTheDocument()
  expect(screen.getByText(/build in public\. learn out loud\./i)).toBeInTheDocument()
})
