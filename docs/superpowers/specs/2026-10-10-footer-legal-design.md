# Footer + Privacy Policy + Terms of Use — Design

Date: 2026-10-10 · Branch: `feat/footer-legal`

## Goal
Replace the current `Connect` section with a full site footer, and add standalone Privacy Policy
and Terms of Use pages with real, shareable URLs (`/privacy/`, `/terms/`) on GitHub Pages.

## Decisions (from requirements Q&A)
| Topic | Decision |
|---|---|
| Footer structure | Merge the "Follow the journey" CTA into one larger footer (replaces `Connect.tsx`). |
| Footer contents | CTA · Brand column (mascot + wordmark + tagline) · Explore column (Projects, About) · Follow column (socials) · legal row · back-to-top. |
| Data collection | None, now or planned. Site stays static. |
| Operator | Brand only: "Ashterisk". Governing law: India. |
| Legal contact | `ashterisk.official@gmail.com` (existing `EMAIL` in `src/data/links.ts`). |
| Terms scope | Content & IP · no-advice disclaimer · third-party links (+ standard liability, law, changes). |
| Delivery | Vite multi-page build — no router, no 404 redirect hack. |

## 1. Page architecture
- `vite.config.ts` → `build.rollupOptions.input`:
  `{ main: 'index.html', privacy: 'privacy/index.html', terms: 'terms/index.html' }`.
- `privacy/index.html` and `terms/index.html`: same skeleton as `index.html` (favicon, viewport),
  each with its own `<title>` and `<meta name="description">`, loading `src/pages/privacy.tsx` /
  `src/pages/terms.tsx`.
- `src/pages/renderPage.tsx`: `renderPage(node)` mounts into `#root` wrapped in
  `StrictMode > ThemeProvider > SmoothScroll`, and imports `index.css`. `src/main.tsx` uses it too.
- Legal entries render `<div id="top"><Nav /><main><LegalPage doc={…} /></main><Footer /></div>`.
  No `Preloader` on legal pages.
- `src/lib/sectionHref.ts`: `sectionHref(id)` → `#id` when `location.pathname === '/'`, otherwise
  `/#id`. Used by `Nav` (anchors + logo) and `Footer` (Explore column). `#top` stays page-local.

## 2. Footer — `src/sections/Footer.tsx` (deletes `src/sections/Connect.tsx`)
`<footer id="connect">` (id kept so existing `#connect` nav link still works), top border.
1. **CTA** (unchanged copy): "Follow the *journey*", subtitle, magnetic "Say hello" mailto button.
2. **Columns** — `grid` 1 col on mobile, 3 cols from `md`:
   - Brand: mascot avatar, `ashterisk` wordmark, "Build in public. Learn out loud."
   - Explore: Projects, About (via `sectionHref`).
   - Follow: one link per entry in `socialLinks` (icon + label; external links open in new tab).
3. **Bottom row** — `© {year} Ashterisk` · `Privacy Policy` (`/privacy/`) · `Terms of Use`
   (`/terms/`), and `Back to top ↑` (`href="#top"`; Lenis `anchors: true` smooth-scrolls it; works
   without JS; Lenis is disabled under reduced motion so the jump is instant).
- Styling uses tokens only; links get `focus-visible:ring-2 focus-visible:ring-accent`; decorative
  icons `aria-hidden`. Footer `<nav>` regions get `aria-label`s ("Footer", "Legal").
- Wrapped in `Reveal` like the rest of the site.

## 3. Legal content
- `src/data/legal.ts`:
  ```ts
  export interface LegalSection { id: string; heading: string; paragraphs: string[] }
  export interface LegalDoc { title: string; lastUpdated: string; intro: string; sections: LegalSection[] }
  export const privacyPolicy: LegalDoc
  export const termsOfUse: LegalDoc
  export const LEGAL_LAST_UPDATED = '10 October 2026'
  ```
  Contact text interpolates `EMAIL` from `links.ts`.
- `src/components/LegalPage.tsx`: renders `h1` title, "Last updated" line, intro, then each section as
  `<section aria-labelledby>` with `<h2 id={section.id}>` and paragraphs. `max-w-3xl` reading column,
  `font-display` headings, `font-body text-text-secondary` body.
- **Privacy Policy sections:** Who we are · Information we collect (none) · Data stored on your
  device (`ashterisk-theme` in localStorage, `ashterisk-preloader-shown` in sessionStorage; never
  sent anywhere; clearable via browser) · Cookies, analytics & tracking (none; fonts self-hosted) ·
  Hosting (GitHub Pages may log IPs for security/operations under GitHub's Privacy Statement) ·
  Third-party links (YouTube/Instagram/GitHub have their own policies) · Email (if you write to us, we
  use your message only to reply) · Children's privacy · Changes to this policy · Contact.
- **Terms of Use sections:** Acceptance · Content & intellectual property (videos, writing, branding,
  mascot © Ashterisk; open-source repos governed by their own licenses) · Informational purposes only
  (no professional advice; use tools/code at your own risk) · Third-party links · Disclaimer &
  limitation of liability ("as is") · Governing law (India) · Changes to these terms · Contact.
- Plain-English template text; not legal advice.

## 4. Testing
- Unit (Vitest, co-located):
  - `Footer.test.tsx` — CTA heading + mailto; Explore links; one link per social; Privacy/Terms
    hrefs; back-to-top `href="#top"`; current year.
  - `sectionHref.test.ts` — home path → `#id`; `/privacy/` → `/#id`.
  - `LegalPage.test.tsx` — renders title, last-updated, every section heading.
  - `legal.test.ts` — both docs: title, lastUpdated, ≥1 section, unique section ids, contact email present.
  - Update `App.test.tsx` / `Nav.test.tsx`; delete `Connect.test.tsx` (moved into Footer test).
- Build: `npm run build` emits `dist/privacy/index.html` and `dist/terms/index.html`.
- Browser (dev + `vite preview`): all footer links; Explore/Nav links from legal pages land on the
  home section; hard refresh of `/privacy/` and `/terms/`; back-to-top; light/dark; 375px width.

## Out of scope
Mobile hamburger menu, 404 page, sitemap, cookie banner (no cookies), analytics.
