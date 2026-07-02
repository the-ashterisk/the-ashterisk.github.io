# ashterisk.github.io

Landing page for [Ashterisk](https://www.youtube.com/@the.ashterisk) — AI build breakdowns,
tool reviews, and one engineer's Android → AI systems journey.

**Live:** https://the-ashterisk.github.io

## Stack
Vite · React · TypeScript · Tailwind CSS · Framer Motion · Lenis.

## Develop
```bash
npm install
npm run dev      # local dev server
npm test         # run unit tests
npm run build    # production build to dist/
```

## Add a project
Append one object to `src/data/projects.ts` — no component changes needed:
```ts
{ title: '...', description: '...', tags: ['...'], repoUrl: 'https://github.com/...', videoUrl: '...' }
```

## Deploy
Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds and publishes to
GitHub Pages. In the repo: Settings → Pages → Source = "GitHub Actions" (one-time setup).
