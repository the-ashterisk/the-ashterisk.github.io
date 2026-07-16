import { renderHook } from '@testing-library/react'
import { usePointerFine } from './usePointerFine'
import { mockMatchMedia } from '../testUtils'

test('returns false when pointer is not fine (touch)', () => {
  mockMatchMedia([])
  const { result } = renderHook(() => usePointerFine())
  expect(result.current).toBe(false)
})

test('returns true when (pointer: fine) matches', () => {
  mockMatchMedia(['(pointer: fine)'])
  const { result } = renderHook(() => usePointerFine())
  expect(result.current).toBe(true)
})
