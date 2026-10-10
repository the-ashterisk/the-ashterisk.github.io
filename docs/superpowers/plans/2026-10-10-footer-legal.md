# Footer + Legal Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the `Connect` section with a full footer and add standalone Privacy Policy (`/privacy/`) and Terms of Use (`/terms/`) pages.

**Architecture:** Vite multi-page build — two extra HTML entries mount a shared `LegalLayout` (Nav + `LegalPage` + Footer) via a common `renderPage()` helper that also powers the home page. Legal copy lives as data in `src/data/legal.ts`. A `sectionHref()` helper makes section links work from any page.

**Tech Stack:** Vite 8, React 19, TypeScript, Tailwind 3, Framer Motion, Lenis, Vitest + Testing Library (jsdom).

**Spec:** `docs/superpowers/specs/2026-10-10-footer-legal-design.md`

## Global Constraints
- Work on branch `feat/footer-legal`. Never push `main`. Open a PR and **do not merge without the owner's explicit approval**.
- Colors via Tailwind token classes only (`bg`, `surface`, `text`, `text-secondary`, `accent`, `accent-light`, `line`). Fonts: `font-display`, `font-body`.
- Interactive elements: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`. External links: `target="_blank" rel="noreferrer"`. Decorative icons hidden from AT.
- Operator name "Ashterisk" only (no personal name). Contact: `EMAIL` from `src/data/links.ts` (`ashterisk.official@gmail.com`). Governing law: India. Last updated: `10 October 2026`.
- No new dependencies.
- Before each commit: `npm test && npm run lint` pass (lint: no new warnings). Before PR: `npm run build` passes.
- Commit messages end with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus
1. **Arriving at `/#projects` from a legal page** — visitor expects to land on the Projects section, even though React renders after the browser's initial fragment scroll. → Task 2 test.
2. **Home served as `/index.html`** — section links should stay page-local (`#id`), not reload. → Task 1 test.
3. **Legal section ids colliding with page anchors** (`top`, `connect`, `projects`, `about`) — would break back-to-top / nav on legal pages. → Task 3 test.
4. **Direct visit / hard refresh of `/privacy/` and `/terms/`** — must serve a real page, not 404. → Task 6 build check + Task 7 browser check.
5. **Back-to-top with JS-less / reduced-motion (Lenis disabled)** — must still jump to top on every page. → Task 5 asserts plain `href="#top"`; Task 6 asserts `#top` exists on legal pages.

---

### Task 1: `sectionHref` helper + Nav uses it

**Files:**
- Create: `src/lib/sectionHref.ts`, `src/lib/sectionHref.test.ts`
- Modify: `src/components/Nav.tsx`, `src/components/Nav.test.tsx`

**Interfaces:**
- Produces: `sectionHref(id: string): string` — `#id` on the home page (`/` or `/index.html`), else `/#id`.

- [ ] **Step 1: Write the failing test** — `src/lib/sectionHref.test.ts`

```ts
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
```

- [ ] **Step 2: Run to verify it fails** — `npx vitest run src/lib/sectionHref.test.ts` → FAIL (cannot resolve `./sectionHref`).

- [ ] **Step 3: Implement** — `src/lib/sectionHref.ts`

```ts
const HOME_PATHS = ['/', '/index.html']

// Section anchors live on the home page. From any other page (e.g. /privacy/)
// the link must navigate home first, so prefix the path.
export function sectionHref(id: string): string {
  return HOME_PATHS.includes(window.location.pathname) ? `#${id}` : `/#${id}`
}
```

- [ ] **Step 4: Run** — `npx vitest run src/lib/sectionHref.test.ts` → PASS.

- [ ] **Step 5: Add failing Nav test** — append to `src/components/Nav.test.tsx`:

```tsx
afterEach(() => window.history.pushState({}, '', '/'))

test('section links are page-local on the home page', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
})

test('section links and logo point home from a legal page', () => {
  window.history.pushState({}, '', '/privacy/')
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
  expect(screen.getByRole('link', { name: 'Connect' })).toHaveAttribute('href', '/#connect')
  expect(screen.getByRole('link', { name: /ashterisk mascot/i })).toHaveAttribute('href', '/#top')
})
```

Run `npx vitest run src/components/Nav.test.tsx` → second test FAILS (`href="#projects"`).

- [ ] **Step 6: Update Nav** — in `src/components/Nav.tsx`:

```tsx
import { sectionHref } from '../lib/sectionHref'

const anchors = [
  { label: 'Projects', id: 'projects' },
  { label: 'About', id: 'about' },
  { label: 'Connect', id: 'connect' },
]
```
- logo: `href={sectionHref('top')}`
- map: `key={a.id}` and `href={sectionHref(a.id)}` (className unchanged).

- [ ] **Step 7: Run** — `npm test` → all PASS. `npm run lint` → no new warnings.

- [ ] **Step 8: Commit**

```bash
git add src/lib/sectionHref.ts src/lib/sectionHref.test.ts src/components/Nav.tsx src/components/Nav.test.tsx
git commit -m "feat: add sectionHref so nav links work from any page"
```

---

### Task 2: Scroll to hash after the home page renders

**Files:**
- Create: `src/lib/useScrollToHashOnLoad.ts`, `src/lib/useScrollToHashOnLoad.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Produces: `useScrollToHashOnLoad(): void` — on mount, if `location.hash` names an element, `scrollIntoView()` it.

- [ ] **Step 1: Write the failing test** — `src/lib/useScrollToHashOnLoad.test.tsx`

```tsx
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
```

- [ ] **Step 2: Run** — `npx vitest run src/lib/useScrollToHashOnLoad.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement** — `src/lib/useScrollToHashOnLoad.ts`

```ts
import { useEffect } from 'react'

// Arriving at /#projects from another page: the browser's native fragment
// scroll can run before React has rendered the target, so retry once mounted.
export function useScrollToHashOnLoad(): void {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    document.getElementById(id)?.scrollIntoView()
  }, [])
}
```

- [ ] **Step 4: Run** — same command → PASS.

- [ ] **Step 5: Wire into App** — `src/App.tsx`: import `useScrollToHashOnLoad` from `./lib/useScrollToHashOnLoad` and call it as the first line of `App()`.

- [ ] **Step 6: Run** — `npm test` → PASS (App test unaffected: no hash). `npm run lint` clean.

- [ ] **Step 7: Commit**

```bash
git add src/lib/useScrollToHashOnLoad.ts src/lib/useScrollToHashOnLoad.test.tsx src/App.tsx
git commit -m "feat: scroll to hash target after home page renders"
```

---

### Task 3: Legal content data

**Files:**
- Create: `src/data/legal.ts`, `src/data/legal.test.ts`

**Interfaces:**
- Consumes: `EMAIL` from `src/data/links.ts`.
- Produces:
  ```ts
  export interface LegalSection { id: string; heading: string; paragraphs: string[] }
  export interface LegalDoc { title: string; lastUpdated: string; intro: string; sections: LegalSection[] }
  export const LEGAL_LAST_UPDATED: string
  export const privacyPolicy: LegalDoc
  export const termsOfUse: LegalDoc
  ```

- [ ] **Step 1: Write the failing test** — `src/data/legal.test.ts`

```ts
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
```

- [ ] **Step 2: Run** — `npx vitest run src/data/legal.test.ts` → FAIL (module not found).

- [ ] **Step 3: Implement** — `src/data/legal.ts`

```ts
import { EMAIL } from './links'

export interface LegalSection {
  id: string
  heading: string
  paragraphs: string[]
}

export interface LegalDoc {
  title: string
  lastUpdated: string
  intro: string
  sections: LegalSection[]
}

// Bump this whenever either document's wording changes.
export const LEGAL_LAST_UPDATED = '10 October 2026'

export const privacyPolicy: LegalDoc = {
  title: 'Privacy Policy',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'This Privacy Policy explains how Ashterisk ("we", "us") handles information when you visit the-ashterisk.github.io (the "Site"). The short version: we don\'t collect any personal data.',
  sections: [
    {
      id: 'who-we-are',
      heading: 'Who we are',
      paragraphs: [
        "The Site is the home of Ashterisk, a YouTube channel documenting AI project builds, tool reviews, and one engineer's move from Android to AI systems.",
        `You can reach us at ${EMAIL}.`,
      ],
    },
    {
      id: 'information-we-collect',
      heading: 'Information we collect',
      paragraphs: [
        'We do not collect, store, or sell any personal information through the Site. There are no accounts, sign-up forms, comment sections, or contact forms.',
      ],
    },
    {
      id: 'data-on-your-device',
      heading: 'Data stored on your device',
      paragraphs: [
        'The Site saves two small values in your own browser so it behaves the way you expect. They never leave your device and are not sent to us or anyone else.',
        'Your theme choice (light or dark) is saved in localStorage under the key "ashterisk-theme" so it is remembered between visits.',
        'A flag named "ashterisk-preloader-shown" is saved in sessionStorage so the intro animation plays only once per visit. Your browser deletes it when you close the tab.',
        "You can remove both at any time by clearing this Site's data in your browser settings.",
      ],
    },
    {
      id: 'cookies-and-tracking',
      heading: 'Cookies, analytics, and tracking',
      paragraphs: [
        'The Site does not use cookies, analytics tools, advertising pixels, or any other tracking technology.',
        'All fonts and images are served from the Site itself, so loading a page does not contact third-party services such as Google Fonts.',
      ],
    },
    {
      id: 'hosting',
      heading: 'Hosting',
      paragraphs: [
        "The Site is hosted on GitHub Pages. Like most web hosts, GitHub may record technical information such as your IP address in server logs for security and operational purposes. That processing is handled by GitHub under the GitHub General Privacy Statement; we don't have access to those logs.",
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Links to other sites',
      paragraphs: [
        "The Site links to YouTube, Instagram, GitHub, and other external services. When you follow those links, the destination's own privacy policy applies. We are not responsible for how those services handle your data.",
      ],
    },
    {
      id: 'email',
      heading: 'If you email us',
      paragraphs: [
        `If you write to ${EMAIL}, we receive your email address and whatever you choose to include. We use it only to read and reply to your message, and we never sell or share it.`,
      ],
    },
    {
      id: 'children',
      heading: "Children's privacy",
      paragraphs: [
        'The Site is not directed at children under 13 and does not knowingly collect information from anyone, including children.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to this policy',
      paragraphs: [
        'We may update this policy from time to time. The "Last updated" date at the top of this page shows when it last changed.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      paragraphs: [`Questions about this policy? Email ${EMAIL}.`],
    },
  ],
}

export const termsOfUse: LegalDoc = {
  title: 'Terms of Use',
  lastUpdated: LEGAL_LAST_UPDATED,
  intro:
    'These Terms of Use govern your use of the-ashterisk.github.io (the "Site"), run by Ashterisk ("we", "us"). By using the Site, you agree to these terms.',
  sections: [
    {
      id: 'using-the-site',
      heading: 'Using the Site',
      paragraphs: [
        'You are welcome to browse the Site and share links to it. If you do not agree with these terms, please do not use the Site.',
      ],
    },
    {
      id: 'content-and-ip',
      heading: 'Content and intellectual property',
      paragraphs: [
        'Unless stated otherwise, the text, videos, graphics, logos, the Ashterisk name, and the Ash mascot on the Site belong to Ashterisk and may not be copied or reused without permission.',
        'Source code in our public GitHub repositories is governed by the license included in each repository, not by these terms.',
      ],
    },
    {
      id: 'informational-only',
      heading: 'Informational purposes only',
      paragraphs: [
        'Project breakdowns, tutorials, and tool reviews are shared for general information and education. They are not professional, legal, financial, or security advice.',
        'Code, tools, and techniques are provided as-is. Evaluate them yourself and use them at your own risk, especially before relying on them in production.',
      ],
    },
    {
      id: 'third-party-links',
      heading: 'Third-party links',
      paragraphs: [
        'The Site links to third-party websites and services such as YouTube, Instagram, and GitHub. We do not control them and are not responsible for their content, policies, or availability.',
      ],
    },
    {
      id: 'liability',
      heading: 'Disclaimer and limitation of liability',
      paragraphs: [
        'The Site is provided "as is" and "as available", without warranties of any kind. To the fullest extent permitted by law, Ashterisk is not liable for any loss or damage arising from your use of the Site or reliance on its content.',
      ],
    },
    {
      id: 'governing-law',
      heading: 'Governing law',
      paragraphs: [
        'These terms are governed by the laws of India. Any disputes are subject to the jurisdiction of the courts of India.',
      ],
    },
    {
      id: 'changes',
      heading: 'Changes to these terms',
      paragraphs: [
        'We may update these terms from time to time. The "Last updated" date at the top of this page shows when they last changed. Continuing to use the Site means you accept the updated terms.',
      ],
    },
    {
      id: 'contact',
      heading: 'Contact',
      paragraphs: [`Questions about these terms? Email ${EMAIL}.`],
    },
  ],
}
```

- [ ] **Step 4: Run** — `npx vitest run src/data/legal.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/legal.ts src/data/legal.test.ts
git commit -m "feat: add privacy policy and terms of use content"
```

---

### Task 4: `LegalPage` component

**Files:**
- Create: `src/components/LegalPage.tsx`, `src/components/LegalPage.test.tsx`

**Interfaces:**
- Consumes: `LegalDoc`, `privacyPolicy` (test only) from `src/data/legal.ts`.
- Produces: `LegalPage({ doc }: { doc: LegalDoc })` — renders an `<article>`.

- [ ] **Step 1: Write the failing test** — `src/components/LegalPage.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { LegalPage } from './LegalPage'
import { privacyPolicy } from '../data/legal'

test('renders title, last-updated date, intro and every section', () => {
  render(<LegalPage doc={privacyPolicy} />)
  expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
  expect(screen.getByText(`Last updated: ${privacyPolicy.lastUpdated}`)).toBeInTheDocument()
  expect(screen.getByText(privacyPolicy.intro)).toBeInTheDocument()
  for (const s of privacyPolicy.sections) {
    const heading = screen.getByRole('heading', { level: 2, name: s.heading })
    expect(heading).toHaveAttribute('id', s.id)
    expect(screen.getByRole('region', { name: s.heading })).toBeInTheDocument()
  }
})
```

- [ ] **Step 2: Run** — `npx vitest run src/components/LegalPage.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement** — `src/components/LegalPage.tsx`

```tsx
import type { LegalDoc } from '../data/legal'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{doc.title}</h1>
      <p className="mt-3 font-body text-sm text-text-secondary">Last updated: {doc.lastUpdated}</p>
      <p className="mt-8 font-body text-lg leading-relaxed text-text-secondary">{doc.intro}</p>
      {doc.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12">
          <h2 id={section.id} className="scroll-mt-24 font-display text-2xl font-bold">
            {section.heading}
          </h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 font-body leading-relaxed text-text-secondary">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  )
}
```

- [ ] **Step 4: Run** — same command → PASS. `npm run lint` clean.

- [ ] **Step 5: Commit**

```bash
git add src/components/LegalPage.tsx src/components/LegalPage.test.tsx
git commit -m "feat: add LegalPage component"
```

---

### Task 5: `Footer` replaces `Connect`

**Files:**
- Create: `src/sections/Footer.tsx`, `src/sections/Footer.test.tsx`
- Delete: `src/sections/Connect.tsx`, `src/sections/Connect.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `sectionHref` (Task 1); `socialLinks`, `EMAIL` from `src/data/links.ts`; `Button`, `GradientText`, `Magnetic`, `Reveal`.
- Produces: `Footer()` — `<footer id="connect">`.

- [ ] **Step 1: Write the failing test** — `src/sections/Footer.test.tsx`

```tsx
import { render, screen, within } from '@testing-library/react'
import { Footer } from './Footer'
import { EMAIL, socialLinks } from '../data/links'

afterEach(() => window.history.pushState({}, '', '/'))

test('keeps the connect anchor and the call to action', () => {
  const { container } = render(<Footer />)
  expect(container.querySelector('footer#connect')).not.toBeNull()
  expect(screen.getByRole('heading', { name: /follow the journey/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /email ashterisk/i })).toHaveAttribute('href', `mailto:${EMAIL}`)
})

test('shows the brand tagline', () => {
  render(<Footer />)
  expect(screen.getByText(/build in public\. learn out loud\./i)).toBeInTheDocument()
})

test('explore column links to home sections', () => {
  render(<Footer />)
  const explore = screen.getByRole('navigation', { name: 'Explore' })
  expect(within(explore).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
  expect(within(explore).getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
})

test('explore column points home from a legal page', () => {
  window.history.pushState({}, '', '/terms/')
  render(<Footer />)
  const explore = screen.getByRole('navigation', { name: 'Explore' })
  expect(within(explore).getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
})

test('follow column has one link per social', () => {
  render(<Footer />)
  const follow = screen.getByRole('navigation', { name: 'Follow' })
  for (const link of socialLinks) {
    expect(within(follow).getByRole('link', { name: link.label })).toHaveAttribute('href', link.href)
  }
})

test('legal row has copyright, privacy and terms links', () => {
  render(<Footer />)
  const legal = screen.getByRole('navigation', { name: 'Legal' })
  expect(within(legal).getByText(`© ${new Date().getFullYear()} Ashterisk`)).toBeInTheDocument()
  expect(within(legal).getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy/')
  expect(within(legal).getByRole('link', { name: 'Terms of Use' })).toHaveAttribute('href', '/terms/')
})

test('back to top is a plain page-local link', () => {
  render(<Footer />)
  expect(screen.getByRole('link', { name: /back to top/i })).toHaveAttribute('href', '#top')
})
```

- [ ] **Step 2: Run** — `npx vitest run src/sections/Footer.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement** — `src/sections/Footer.tsx`

```tsx
import { ArrowUp, Mail } from 'lucide-react'
import { Reveal } from '../motion/Reveal'
import { Magnetic } from '../motion/Magnetic'
import { GradientText } from '../components/GradientText'
import { Button } from '../components/Button'
import { socialLinks, EMAIL } from '../data/links'
import { sectionHref } from '../lib/sectionHref'
import ash from '../assets/ash.png'

const exploreLinks = [
  { label: 'Projects', id: 'projects' },
  { label: 'About', id: 'about' },
]

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
// Separate size variants: Tailwind orders utilities by config, not class string,
// so appending text-xs to a text-sm class would not reliably win.
const linkBase = `rounded font-body text-text-secondary transition-colors hover:text-accent ${focusRing}`
const linkCls = `${linkBase} text-sm`
const smallLinkCls = `${linkBase} text-xs`
const columnHeading = 'font-display text-sm font-bold uppercase tracking-widest'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="connect" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-20">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Follow the <GradientText>journey</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-lg text-text-secondary">
            New builds and breakdowns land on YouTube first — everything else is a click away.
          </p>
          <div className="mt-8 flex justify-center">
            <Magnetic>
              <Button href={`mailto:${EMAIL}`} ariaLabel="Email Ashterisk">
                <Mail size={18} aria-hidden /> Say hello
              </Button>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid gap-10 border-t border-line pt-12 md:grid-cols-3">
            <div>
              <a href={sectionHref('top')} className={`inline-flex items-center gap-2 rounded-full ${focusRing}`}>
                <img src={ash} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
              </a>
              <p className="mt-3 font-body text-sm text-text-secondary">Build in public. Learn out loud.</p>
            </div>

            <nav aria-label="Explore">
              <h3 className={columnHeading}>Explore</h3>
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((l) => (
                  <li key={l.id}>
                    <a href={sectionHref(l.id)} className={linkCls}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <nav aria-label="Follow">
              <h3 className={columnHeading}>Follow</h3>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  const external = link.href.startsWith('http')
                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                        className={`inline-flex items-center gap-2 ${linkCls}`}
                      >
                        <span aria-hidden className="text-accent">
                          <Icon size={16} />
                        </span>
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <nav aria-label="Legal" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="font-body text-xs text-text-secondary">© {year} Ashterisk</span>
            <a href="/privacy/" className={smallLinkCls}>
              Privacy Policy
            </a>
            <a href="/terms/" className={smallLinkCls}>
              Terms of Use
            </a>
          </nav>
          <a href="#top" className={`inline-flex items-center gap-1 ${smallLinkCls}`}>
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Run** — `npx vitest run src/sections/Footer.test.tsx` → PASS.

- [ ] **Step 5: Swap into App and remove Connect**
  - `src/App.tsx`: replace `import { Connect } from './sections/Connect'` with `import { Footer } from './sections/Footer'`, and `<Connect />` with `<Footer />`.
  - `git rm src/sections/Connect.tsx src/sections/Connect.test.tsx`
  - `src/App.test.tsx`: add `expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy/')`.

- [ ] **Step 6: Run** — `npm test` → all PASS. `npm run lint` → no new warnings. `npx tsc -b` → no errors.

- [ ] **Step 7: Commit**

```bash
git add -A src/sections src/App.tsx src/App.test.tsx
git commit -m "feat: replace Connect with full site footer"
```

---

### Task 6: Multi-page build — `/privacy/` and `/terms/`

**Files:**
- Create: `src/pages/renderPage.tsx`, `src/pages/LegalLayout.tsx`, `src/pages/LegalLayout.test.tsx`, `src/pages/privacy.tsx`, `src/pages/terms.tsx`, `privacy/index.html`, `terms/index.html`
- Modify: `src/main.tsx`, `vite.config.ts`, `CLAUDE.md`, `README.md`

**Interfaces:**
- Consumes: `Nav`, `Footer` (Task 5), `LegalPage` (Task 4), `privacyPolicy`/`termsOfUse` (Task 3).
- Produces: `renderPage(node: ReactNode): void`; `LegalLayout({ doc }: { doc: LegalDoc })`.

- [ ] **Step 1: Write the failing test** — `src/pages/LegalLayout.test.tsx`

```tsx
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { LegalLayout } from './LegalLayout'
import { termsOfUse } from '../data/legal'

afterEach(() => window.history.pushState({}, '', '/'))

test('wraps the document with nav, footer and a #top anchor', () => {
  window.history.pushState({}, '', '/terms/')
  const { container } = render(
    <ThemeProvider>
      <LegalLayout doc={termsOfUse} />
    </ThemeProvider>,
  )
  expect(container.querySelector('#top')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 1, name: 'Terms of Use' })).toBeInTheDocument()
  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('contentinfo')).toBeInTheDocument() // <footer>
  for (const link of screen.getAllByRole('link', { name: 'Projects' })) {
    expect(link).toHaveAttribute('href', '/#projects')
  }
  expect(screen.queryByTestId('preloader')).toBeNull()
})
```

- [ ] **Step 2: Run** — `npx vitest run src/pages/LegalLayout.test.tsx` → FAIL (module not found).

- [ ] **Step 3: Implement layout** — `src/pages/LegalLayout.tsx`

```tsx
import { Nav } from '../components/Nav'
import { LegalPage } from '../components/LegalPage'
import { Footer } from '../sections/Footer'
import type { LegalDoc } from '../data/legal'

export function LegalLayout({ doc }: { doc: LegalDoc }) {
  return (
    <div id="top">
      <Nav />
      <main>
        <LegalPage doc={doc} />
      </main>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 4: Run** — same command → PASS.

- [ ] **Step 5: Shared renderer** — `src/pages/renderPage.tsx`

```tsx
import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '../theme/ThemeProvider'
import { SmoothScroll } from '../motion/SmoothScroll'
import '../index.css'

// Every HTML entry (home, /privacy/, /terms/) mounts through here so they
// share theme, smooth scroll, and global styles.
export function renderPage(node: ReactNode): void {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <SmoothScroll>{node}</SmoothScroll>
      </ThemeProvider>
    </StrictMode>,
  )
}
```

`src/main.tsx` becomes:
```tsx
import App from './App.tsx'
import { renderPage } from './pages/renderPage.tsx'

renderPage(<App />)
```

`src/pages/privacy.tsx`:
```tsx
import { renderPage } from './renderPage.tsx'
import { LegalLayout } from './LegalLayout.tsx'
import { privacyPolicy } from '../data/legal.ts'

renderPage(<LegalLayout doc={privacyPolicy} />)
```

`src/pages/terms.tsx`:
```tsx
import { renderPage } from './renderPage.tsx'
import { LegalLayout } from './LegalLayout.tsx'
import { termsOfUse } from '../data/legal.ts'

renderPage(<LegalLayout doc={termsOfUse} />)
```

- [ ] **Step 6: HTML entries**

`privacy/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="How Ashterisk handles your data: no tracking, no cookies, no personal data collected." />
    <title>Privacy Policy — ashterisk</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/privacy.tsx"></script>
  </body>
</html>
```

`terms/index.html`:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.png" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Terms of Use for the Ashterisk website." />
    <title>Terms of Use — ashterisk</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/terms.tsx"></script>
  </body>
</html>
```

- [ ] **Step 7: Vite config** — `vite.config.ts`

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

const page = (path: string) => fileURLToPath(new URL(path, import.meta.url))

export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      // Multi-page: each legal page is a real HTML file so /privacy/ and
      // /terms/ work on GitHub Pages without a SPA 404 redirect hack.
      input: {
        main: page('./index.html'),
        privacy: page('./privacy/index.html'),
        terms: page('./terms/index.html'),
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
})
```

- [ ] **Step 8: Build check**

Run: `npm run build && ls dist/index.html dist/privacy/index.html dist/terms/index.html`
Expected: build succeeds; all three files listed.

- [ ] **Step 9: Docs** — `CLAUDE.md` Layout section: add
  `- Multi-page build: \`index.html\` (home), \`privacy/index.html\`, \`terms/index.html\` → entries in \`src/pages/\` mounted via \`renderPage()\`. Legal copy lives in \`src/data/legal.ts\` (bump \`LEGAL_LAST_UPDATED\` on any wording change).`
  and add `src/lib/` (`sectionHref` — use it for any link to a home-page section).
  `README.md`: add a short "Legal pages" section pointing to `src/data/legal.ts`.

- [ ] **Step 10: Run** — `npm test && npm run lint && npm run build` → all pass.

- [ ] **Step 11: Commit**

```bash
git add privacy terms src/pages src/main.tsx vite.config.ts CLAUDE.md README.md
git commit -m "feat: add /privacy/ and /terms/ pages via multi-page build"
```

---

### Task 7: Browser verification, push, PR

**Files:** none (verification only; fix-ups get their own commits).

- [ ] **Step 1: Dev server** — `preview_start {name: "ashterisk-dev"}`. Check, with `read_page` / `read_console_messages`:
  - Home: footer renders CTA, 3 columns, legal row; no console errors.
  - Click Privacy Policy → `/privacy/` loads; title "Privacy Policy — ashterisk"; all sections render.
  - On `/privacy/`: Nav "Projects" and footer "Projects" → land on home Projects section (Review Focus 1).
  - Back to top on home and on `/terms/` → scrolls to top.
  - Hard reload of `/privacy/` and `/terms/` → page renders (Review Focus 4).
- [ ] **Step 2: Production build** — `npm run build`, then serve `dist/` with `npx vite preview --port 4173 --strictPort` (add an `ashterisk-preview` entry to `.claude/launch.json` if needed) and repeat the `/privacy/` + `/terms/` direct-load and cross-page-link checks.
- [ ] **Step 3: Themes & mobile** — `resize_window` colorScheme dark/light and preset mobile (375px): no horizontal scroll, columns stack, legal text readable. Screenshot home footer + `/privacy/` (both themes, mobile). Reset to desktop.
- [ ] **Step 4: Reduced motion** — not emulable via tool; covered by unit tests + plain `href="#top"`.
- [ ] **Step 5: Push and open PR** (do **not** merge)

```bash
git push -u origin feat/footer-legal
gh pr create --base main --title "feat: full footer with Privacy Policy and Terms of Use pages" --body "<summary + test results + screenshots note + 🤖 Generated with [Claude Code](https://claude.com/claude-code)>"
```
Share the PR link and wait for the owner's approval before merging.
