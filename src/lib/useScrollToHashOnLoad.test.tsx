import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { useScrollToHashOnLoad } from './useScrollToHashOnLoad'

function Page() {
  useScrollToHashOnLoad()
  return <section id="projects">Projects</section>
}

const scrollIntoView = vi.fn()
beforeEach(() => {
  scrollIntoView.mockClear()
  Element.prototype.scrollIntoView = scrollIntoView
})
afterEach(() => window.history.pushState({}, '', '/'))

test('scrolls to the element named by the hash after render', () => {
  window.history.pushState({}, '', '/#projects')
  render(<Page />)
  expect(scrollIntoView).toHaveBeenCalledTimes(1)
  expect((scrollIntoView.mock.contexts[0] as Element).id).toBe('projects')
})

test('does nothing without a hash', () => {
  render(<Page />)
  expect(scrollIntoView).not.toHaveBeenCalled()
})

test('ignores a hash that matches no element', () => {
  window.history.pushState({}, '', '/#nope')
  render(<Page />)
  expect(scrollIntoView).not.toHaveBeenCalled()
})

test('survives a malformed percent-encoded hash', () => {
  window.history.pushState({}, '', '/#%')
  expect(() => render(<Page />)).not.toThrow()
  expect(scrollIntoView).not.toHaveBeenCalled()
})

describe.each(['reload', 'back_forward'])('on a %s navigation', (type) => {
  afterEach(() => vi.restoreAllMocks())

  test('leaves the browser-restored scroll position alone', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
      { type } as unknown as PerformanceEntry,
    ])
    window.history.pushState({}, '', '/#projects')
    render(<Page />)
    expect(scrollIntoView).not.toHaveBeenCalled()
  })
})
