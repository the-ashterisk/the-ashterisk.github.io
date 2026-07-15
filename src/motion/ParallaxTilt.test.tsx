import { render, screen, fireEvent } from '@testing-library/react'
import { ParallaxTilt } from './ParallaxTilt'
import { mockMatchMedia } from '../testUtils'

test('renders children statically when disabled', () => {
  mockMatchMedia([])
  render(<ParallaxTilt>mascot</ParallaxTilt>)
  expect(screen.getByText('mascot')).toBeInTheDocument()
  expect(screen.queryByTestId('parallax-zone')).not.toBeInTheDocument()
})

test('sets --px/--py on mousemove and resets on leave', () => {
  mockMatchMedia(['(pointer: fine)'])
  render(<ParallaxTilt>mascot</ParallaxTilt>)
  const zone = screen.getByTestId('parallax-zone')
  fireEvent.mouseMove(zone, { clientX: 100, clientY: 50 })
  expect(zone.style.getPropertyValue('--px')).not.toBe('')
  fireEvent.mouseLeave(zone)
  expect(zone.style.getPropertyValue('--px')).toBe('0')
  expect(zone.style.getPropertyValue('--py')).toBe('0')
})
