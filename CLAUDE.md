# CLAUDE.md

Single-page landing site for the Ashterisk YouTube channel. Vite 8 · React 19 · TypeScript ·
Tailwind 3 · Framer Motion · Lenis. Node 20 (`.nvmrc`). Live at https://the-ashterisk.github.io.

## Git workflow (mandatory)
- **Never push to `main` from local.** `main` auto-deploys to production (GitHub Pages).
- Every change goes on a feature branch (`feat/…`, `fix/…`, `docs/…`, `chore/…`), pushed to
  `origin`, then a PR into `main`. The merge is what deploys.
- `main` is protected by the "Protect main" ruleset: PR required, squash-merge only, the `verify`
  check (`.github/workflows/ci.yml`: test + lint + build) must pass, no force-push or deletion.
- **Never merge a PR without the owner's explicit approval.** Open the PR, share the link, and wait
  for the owner to approve it (on the PR or in chat) before merging.
- Before committing: `npm test && npm run lint && npm run build` must all pass.
- Specs and plans go in `docs/superpowers/` — it is git-ignored and stays local (the repo is public).

## Commands
```bash
npm run dev      # dev server (also .claude/launch.json → "ashterisk-dev", port 5173)
npm test         # vitest run (jsdom)
npm run lint     # oxlint
npm run build    # tsc -b && vite build → dist/
```

## Layout
- Multi-page build: `index.html` (home), `privacy/index.html`, `terms/index.html` → entries in
  `src/pages/`, all mounted via `renderPage()` (theme + smooth scroll + global CSS). New page = new HTML
  file + entry + `build.rollupOptions.input` in `vite.config.ts`.
- `src/App.tsx` — home page order: Preloader, Nav, Hero, Projects, About, Footer (`id="connect"`).
- `src/sections/` — page sections. `src/components/` — reusable UI primitives.
- `src/motion/` — motion primitives (Reveal, Magnetic, ParallaxTilt, Spotlight, Preloader, SmoothScroll).
- `src/data/` — all content. Add a project by appending to `projects.ts`; socials/email live in `links.ts`.
  Legal copy lives in `legal.ts` — bump `LEGAL_LAST_UPDATED` on any wording change.
- `src/lib/` — `sectionHref(id)`: use it for any link to a home-page section so it works from other pages.
  `analytics.ts` / `trafficSource.ts` — see **Analytics** below.
- `/toolkit` "The Toolkit" (freebies promised in reels) — **prerendered static HTML**, not React-mounted
  pages (link previews and direct DM links need real files). `build/toolkitPages.ts` (Vite plugin) emits
  `/toolkit/`, each `/toolkit/<slug>/`, the raw `.md`, short-link redirects (`/claude`, `/audit`,
  `/prompts`) and `404.html` from `src/toolkit/pages.tsx`; in dev it serves the same via middleware.
  Short links forward to `/toolkit/<slug>/?utm_source=youtube&utm_medium=shortlink` (`shortLinkTarget`):
  they only appear in YouTube Shorts. Profile links `/ig` (Instagram bio) and `/yt` (YouTube profile)
  forward to the hub, tagged `utm_medium=bio` / `profile` (`profileLinks` in `src/data/toolkit.ts`). The plugin also emits `modulepreload` tags for the client entry's
  shared chunks (`entryAssetTags`) so they don't load in a waterfall.
  - **Content:** `src/content/toolkit/<slug>.md` is the single source — the rendered panel, Copy and
    Download (`/toolkit/<slug>/<fileName>`) all read it. Edit content only there.
  - **Metadata:** `src/data/toolkit.ts` → `toolkitResources`, one entry per item: `slug`, `shortLink`,
    `title`, `description`, `type`, `fileName`, `howTo` (exactly 3), `reel` (`number`, `postedOn`,
    optional `instagram`/`youtube` URLs — profiles are linked until set), `lastUpdated` (bump by hand
    when the `.md` changes). Hub order is newest `reel.postedOn` first.
  - **Page `<title>`/meta/og tags:** built from that entry by `resourceMeta` in `src/toolkit/pages.tsx`
    (hub: `hubMeta`). **og images:** `public/toolkit/og/<slug>.png`, drawn from title/type/description —
    rerun `npm run og` (headless Chrome) after changing those.
  - **Add an item:** the `.md` + one entry + `npm run og`. Tests guard short-link collisions
    (`RESERVED_ROOT_PATHS`), missing files and broken internal links.
  - Browser JS for these pages is only `src/toolkit/client.ts` (Copy, expand, theme toggle, Instagram
    download hint, analytics events, and `carryCampaign`, which copies `utm_*` params onto links
    between toolkit pages so a hub → item visit keeps its source).
- `src/theme/` — `tokens.css` (CSS variables), `ThemeProvider` (`.dark` class on `<html>`, persisted in localStorage, defaults dark).

## Analytics (PostHog, cookieless)
- `src/lib/analytics.ts` is the **only** file that may import PostHog. It exposes `initAnalytics()`
  (called by `renderPage()` and `toolkit/client.ts`) and `track(event, props, { beacon })`.
- Runs **only in production builds** (`import.meta.env.PROD`): `npm run dev`, tests and CI send
  nothing. To test for real: `npm run build && npm run preview` (launch config `ashterisk-preview`).
- Performance contract: PostHog (`posthog-js/dist/module.slim.no-external`, pinned exact) is
  dynamically imported after `load` + idle; `track()` calls before that are queued (max 50); every
  failure is swallowed. Never import it statically or let it block Copy/Download.
- Lean config in `POSTHOG_CONFIG`: `cookieless_mode: 'always'`, no autocapture/replay/heatmaps/
  surveys/web vitals/flags. Pageview is sent by hand after `register()` so it carries `traffic_source`.
- Events: `$pageview`, `toolkit_copied` (`slug`, `type`, `success`), `toolkit_downloaded` (`slug`,
  `type`, sent via sendBeacon). Every event has `traffic_source` (`youtube`|`instagram`|`other`, from
  `trafficSource()`: utm tag → Instagram webview UA → referrer) and `in_app_browser`.
- PostHog project 656718 (US cloud) has cookieless server hash mode on and IPs discarded — events
  are dropped if hash mode is turned off. Adding an event or property? Update the privacy policy
  (`legal.ts`, bump `LEGAL_LAST_UPDATED`) in the same PR.

## Conventions
- **Colors via tokens only.** Use Tailwind's `bg`, `surface`, `text`, `text-secondary`, `accent`,
  `accent-light`, `line` (mapped to CSS vars in `tokens.css`); add new colors as vars for both themes.
  Fonts: `font-display` (Space Grotesk), `font-body` (DM Sans).
- **Motion must degrade.** Every animated component checks `usePrefersReducedMotion()` and renders a
  static fallback; pointer-driven effects also require `usePointerFine()`. Call these hooks
  unconditionally (never `a() && b()` — it changes hook order).
- **Icons:** generic UI icons from `lucide-react`; brand marks (YouTube/GitHub/…) from `react-icons/si`
  (lucide v1 removed them). Decorative icons get `aria-hidden`.
- **A11y:** interactive elements get `focus-visible:ring-2 focus-visible:ring-accent`; external links
  use `target="_blank" rel="noreferrer"`.
- **Tests:** each component/hook has a co-located `*.test.tsx`. jsdom mocks for `matchMedia` and
  `IntersectionObserver` are in `src/setupTests.ts`; use `mockMatchMedia([...])` from
  `src/testUtils.ts` to force media queries (e.g. reduced motion, `(pointer: fine)`).

## Deploy
`.github/workflows/deploy.yml` builds and publishes `dist/` on every push to `main`. It uses
`npm install`, **not** `npm ci`, on purpose: Rolldown's optional `@emnapi/*` deps drift across
platforms and break strict lockfile sync. Don't "fix" this back to `npm ci`.
