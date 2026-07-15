import { render, fireEvent, screen } from '@testing-library/react'
import { Spotlight } from './Spotlight'
import { mockMatchMedia } from '../testUtils'

test('renders nothing when cursor effects are disabled', () => {
  mockMatchMedia([])
  render(<div><Spotlight /></div>)
  expect(screen.queryByTestId('spotlight')).not.toBeInTheDocument()
})

test('follows the cursor within its parent and fades on leave', () => {
  mockMatchMedia(['(pointer: fine)'])
  render(<div data-testid="host"><Spotlight /></div>)
  const host = screen.getByTestId('host')
  const spot = screen.getByTestId('spotlight')
  fireEvent.mouseMove(host, { clientX: 120, clientY: 60 })
  expect(spot.style.transform).toMatch(/translate\(120px, 60px\)/)
  expect(spot.style.opacity).toBe('1')
  fireEvent.mouseLeave(host)
  expect(spot.style.opacity).toBe('0')
})
