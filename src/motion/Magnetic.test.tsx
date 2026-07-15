import { render, screen, fireEvent } from '@testing-library/react'
import { Magnetic } from './Magnetic'
import { mockMatchMedia } from '../testUtils'

test('renders children when cursor effects are disabled (touch)', () => {
  mockMatchMedia([])
  render(<Magnetic>press me</Magnetic>)
  expect(screen.getByText('press me')).toBeInTheDocument()
  expect(screen.queryByTestId('magnetic')).not.toBeInTheDocument()
})

test('translates toward cursor on mousemove and resets on leave', () => {
  mockMatchMedia(['(pointer: fine)'])
  render(<Magnetic>press me</Magnetic>)
  const el = screen.getByTestId('magnetic')
  fireEvent.mouseMove(el, { clientX: 40, clientY: 10 })
  expect(el.style.transform).toMatch(/translate\(/)
  fireEvent.mouseLeave(el)
  expect(el.style.transform).toBe('')
})
