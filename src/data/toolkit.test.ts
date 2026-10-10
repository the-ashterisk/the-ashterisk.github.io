import { RESERVED_ROOT_PATHS, formatDate, toolkitResources, resourceContent, sortedResources } from './toolkit'

const urlSafe = /^[a-z0-9-]+$/

test('slugs are unique and url-safe', () => {
  const slugs = toolkitResources.map((r) => r.slug)
  expect(new Set(slugs).size).toBe(slugs.length)
  for (const slug of slugs) expect(slug).toMatch(urlSafe)
})

test('short links are lowercase single words that never collide', () => {
  const shorts = toolkitResources.map((r) => r.shortLink)
  expect(new Set(shorts).size).toBe(shorts.length)
  for (const short of shorts) {
    expect(short).toMatch(/^[a-z]+$/)
    // A short link becomes /<short>/index.html at the site root.
    expect(RESERVED_ROOT_PATHS).not.toContain(short)
  }
})

test('every resource has its markdown, three how-to steps and a real file name', () => {
  for (const r of toolkitResources) {
    expect(resourceContent(r.slug).trim().length).toBeGreaterThan(0)
    expect(r.howTo).toHaveLength(3)
    for (const step of r.howTo) expect(step.trim()).not.toBe('')
    expect(r.fileName).toMatch(/\.md$/)
    expect(r.description.trim()).not.toBe('')
  }
})

test('dates are ISO and the hub lists newest reel first', () => {
  for (const r of toolkitResources) {
    expect(r.reel.postedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(r.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  }
  const dates = sortedResources().map((r) => r.reel.postedOn)
  expect(dates).toEqual([...dates].sort().reverse())
})

test('missing markdown fails loudly', () => {
  expect(() => resourceContent('nope')).toThrow(/nope\.md/)
})

test('formatDate is timezone-proof', () => {
  expect(formatDate('2026-10-19')).toBe('19 Oct 2026')
  expect(formatDate('2026-01-01')).toBe('1 Jan 2026')
})
