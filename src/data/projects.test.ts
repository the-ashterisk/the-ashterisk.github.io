import { projects } from './projects'

test('every project has required fields and a valid repo url', () => {
  expect(projects.length).toBeGreaterThan(0)
  for (const p of projects) {
    expect(p.title).toBeTruthy()
    expect(p.description).toBeTruthy()
    expect(Array.isArray(p.tags)).toBe(true)
    expect(p.repoUrl).toMatch(/^https:\/\/github\.com\//)
  }
})
