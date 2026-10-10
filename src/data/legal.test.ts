import { privacyPolicy, termsOfUse, LEGAL_LAST_UPDATED } from './legal'
import { EMAIL } from './links'

const RESERVED_IDS = ['top', 'connect', 'projects', 'about']

describe.each([
  ['privacy policy', privacyPolicy],
  ['terms of use', termsOfUse],
])('%s', (_name, doc) => {
  test('has a title, date, intro and sections', () => {
    expect(doc.title).toBeTruthy()
    expect(doc.lastUpdated).toBe(LEGAL_LAST_UPDATED)
    expect(doc.intro).toBeTruthy()
    expect(doc.sections.length).toBeGreaterThan(0)
    for (const s of doc.sections) {
      expect(s.heading).toBeTruthy()
      expect(s.paragraphs.length).toBeGreaterThan(0)
    }
  })

  test('section ids are unique, slug-shaped, and do not clash with page anchors', () => {
    const ids = doc.sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id).toMatch(/^[a-z0-9-]+$/)
      expect(RESERVED_IDS).not.toContain(id)
    }
  })

  test('lists the contact email', () => {
    const text = doc.sections.flatMap((s) => s.paragraphs).join(' ')
    expect(text).toContain(EMAIL)
  })
})

test('terms name India as governing law', () => {
  const text = termsOfUse.sections.flatMap((s) => s.paragraphs).join(' ')
  expect(text).toMatch(/laws of India/)
})
