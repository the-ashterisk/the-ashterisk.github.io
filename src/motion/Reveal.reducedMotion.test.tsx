import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

vi.mock('../theme/useReducedMotion', () => ({
  usePrefersReducedMotion: () => true,
}))

test('renders a plain element with no motion styling when reduced motion is preferred', () => {
  render(<Reveal className="foo">hi</Reveal>)

  const el = screen.getByText('hi')

  // Still renders children.
  expect(el).toBeInTheDocument()

  // Reduced path returns a plain <div>, not a Framer Motion component.
  expect(el.tagName).toBe('DIV')
  expect(el.className).toBe('foo')

  // No inline transform/opacity styling — Framer Motion applies these via
  // inline styles on mount/whileInView; a plain div must have none.
  expect(el.style.transform).toBe('')
  expect(el.style.opacity).toBe('')
})
