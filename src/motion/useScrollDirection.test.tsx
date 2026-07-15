import { renderHook, act } from '@testing-library/react'
import { useScrollDirection } from './useScrollDirection'

function scrollTo(y: number) {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true })
  window.dispatchEvent(new Event('scroll'))
}

test('starts as up and flips down after scrolling past threshold', () => {
  scrollTo(0)
  const { result } = renderHook(() => useScrollDirection())
  expect(result.current).toBe('up')
  act(() => scrollTo(200))
  expect(result.current).toBe('down')
  act(() => scrollTo(100))
  expect(result.current).toBe('up')
})
