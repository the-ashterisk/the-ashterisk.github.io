import { render, screen } from '@testing-library/react'
import { Preloader, shouldShowPreloader } from './Preloader'
import { mockMatchMedia } from '../testUtils'

beforeEach(() => {
  sessionStorage.clear()
  mockMatchMedia([])
})

test('shows once per session', () => {
  expect(shouldShowPreloader()).toBe(true)
  render(<Preloader />)
  expect(screen.getByTestId('preloader')).toBeInTheDocument()
  // mounting records the session flag
  expect(shouldShowPreloader()).toBe(false)
})

test('does not render when reduced motion is preferred', () => {
  mockMatchMedia(['(prefers-reduced-motion: reduce)'])
  render(<Preloader />)
  expect(screen.queryByTestId('preloader')).not.toBeInTheDocument()
})

test('does not render on second mount in the same session', () => {
  const { unmount } = render(<Preloader />)
  unmount()
  render(<Preloader />)
  expect(screen.queryByTestId('preloader')).not.toBeInTheDocument()
})
