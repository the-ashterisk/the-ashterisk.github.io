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

const privacySection = (id: string) =>
  privacyPolicy.sections.find((s) => s.id === id)!.paragraphs.join(' ')

test('privacy policy does not claim the theme is only stored on an explicit choice', () => {
  // ThemeProvider persists the active theme on every load, chosen or not.
  expect(privacySection('data-on-your-device')).not.toMatch(/theme choice/i)
})

test("children's section does not contradict the email section", () => {
  expect(privacySection('children')).not.toMatch(/from anyone/i)
  expect(privacySection('children')).toMatch(/from children/i)
})

test('privacy policy discloses cookieless PostHog analytics', () => {
  const text = privacySection('cookies-and-tracking')
  expect(text).not.toMatch(/does not use cookies, analytics tools/i)
  expect(text).toMatch(/PostHog/)
  expect(text).toMatch(/does not use cookies/i)
  expect(text).toMatch(/IP address/i)
  expect(text).toContain('https://posthog.com/privacy')
  expect(privacyPolicy.intro).toMatch(/anonymously/i)
})

test('privacy policy no longer claims pages contact no third party', () => {
  expect(privacySection('cookies-and-tracking')).toMatch(/only outside service a page contacts is PostHog/i)
})
