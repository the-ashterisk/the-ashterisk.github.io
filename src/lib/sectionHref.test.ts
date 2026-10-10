import { sectionHref } from './sectionHref'

afterEach(() => window.history.pushState({}, '', '/'))

test('returns a page-local hash on the home page', () => {
  window.history.pushState({}, '', '/')
  expect(sectionHref('projects')).toBe('#projects')
})

test('treats /index.html as the home page', () => {
  window.history.pushState({}, '', '/index.html')
  expect(sectionHref('about')).toBe('#about')
})

test('points back to the home page from other pages', () => {
  window.history.pushState({}, '', '/privacy/')
  expect(sectionHref('projects')).toBe('/#projects')
})
