import { vi, beforeEach, afterEach, describe, test, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SmoothScroll } from './SmoothScroll'

const { destroy, raf, LenisCtor, reducedState } = vi.hoisted(() => {
  const destroy = vi.fn()
  const raf = vi.fn()
  const LenisCtor = vi.fn(function Lenis() {
    return { raf, destroy }
  })
  const reducedState = { reduced: false }
  return { destroy, raf, LenisCtor, reducedState }
})

vi.mock('lenis', () => ({
  default: LenisCtor,
}))

vi.mock('../theme/useReducedMotion', () => ({
  usePrefersReducedMotion: () => reducedState.reduced,
}))

describe('SmoothScroll', () => {
  let rafSpy: ReturnType<typeof vi.spyOn>
  let cafSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    LenisCtor.mockClear()
    destroy.mockClear()
    raf.mockClear()
    reducedState.reduced = false

    // Stub rAF/cAF so no real animation frames fire during tests.
    rafSpy = vi
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation(() => 1)
    cafSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {})
  })

  afterEach(() => {
    rafSpy.mockRestore()
    cafSpy.mockRestore()
  })

  test('does not construct Lenis when reduced motion is preferred', () => {
    reducedState.reduced = true

    const { unmount } = render(
      <SmoothScroll>
        <div>content</div>
      </SmoothScroll>,
    )

    expect(LenisCtor).not.toHaveBeenCalled()

    unmount()
    expect(destroy).not.toHaveBeenCalled()
  })

  test('constructs Lenis and destroys it on unmount when motion is not reduced', () => {
    reducedState.reduced = false

    const { unmount } = render(
      <SmoothScroll>
        <div>content</div>
      </SmoothScroll>,
    )

    expect(LenisCtor).toHaveBeenCalledTimes(1)
    expect(destroy).not.toHaveBeenCalled()

    unmount()

    expect(destroy).toHaveBeenCalledTimes(1)
  })
})
