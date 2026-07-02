import { render, screen } from '@testing-library/react'
import { Connect } from './Connect'

test('renders all social links and the brand stamp', () => {
  render(<Connect />)
  expect(screen.getByRole('link', { name: /^youtube$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^instagram$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^github$/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /^email$/i })).toBeInTheDocument()
  expect(screen.getByText(/build in public\. learn out loud\./i)).toBeInTheDocument()
})
