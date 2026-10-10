// Generates the 1200×630 link-preview images for /free into public/free/og/.
// Run by hand after adding or renaming a toolkit entry: `npm run og`. The PNGs are
// committed, so the normal build never needs Chrome.
//
// Renders an HTML card per image with the brand fonts and screenshots it with
// headless Chrome. Set CHROME_PATH if Chrome lives somewhere else.
import { execFileSync } from 'node:child_process'
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { runnerImport } from 'vite'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const outDir = path.join(root, 'public/free/og')
const chrome = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

const { module: data } = await runnerImport(path.join(root, 'src/data/free.ts'), { configFile: false, root, logLevel: 'warn' })

const font = (pkg, file) => pathToFileURL(path.join(root, 'node_modules/@fontsource', pkg, 'files', file)).href
const mascot = pathToFileURL(path.join(root, 'src/assets/ash.png')).href
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function card({ eyebrow, title, subtitle }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Space Grotesk'; font-weight: 700; src: url(${font('space-grotesk', 'space-grotesk-latin-700-normal.woff2')}); }
@font-face { font-family: 'Space Grotesk'; font-weight: 500; src: url(${font('space-grotesk', 'space-grotesk-latin-500-normal.woff2')}); }
@font-face { font-family: 'DM Sans'; font-weight: 400; src: url(${font('dm-sans', 'dm-sans-latin-400-normal.woff2')}); }
* { margin: 0; box-sizing: border-box; }
html, body { width: 1200px; height: 630px; overflow: hidden; }
body {
  background: #fff radial-gradient(#e0e0e0 1.5px, transparent 1.5px) 0 0 / 28px 28px;
  color: #111; font-family: 'DM Sans', sans-serif;
  padding: 72px 80px; display: flex; flex-direction: column;
}
.eyebrow { display: inline-flex; align-items: center; gap: 12px; align-self: flex-start;
  font: 500 26px 'Space Grotesk'; background: #fff; border: 2px solid rgba(17,17,17,.14);
  border-radius: 999px; padding: 10px 24px; }
.dot { width: 12px; height: 12px; border-radius: 50%; background: #ff5244; }
h1 { font: 700 84px/1.04 'Space Grotesk'; letter-spacing: -1.5px; margin-top: 40px; max-width: 1000px; }
p { font-size: 32px; line-height: 1.35; color: #555; margin-top: 24px; max-width: 900px; }
.brand { margin-top: auto; display: flex; align-items: center; gap: 16px;
  font: 700 32px 'Space Grotesk'; letter-spacing: 5px; }
.brand img { width: 64px; height: 64px; border-radius: 50%; }
.brand span.url { margin-left: auto; font: 500 26px 'Space Grotesk'; letter-spacing: 0; color: #555; }
</style></head><body>
<div class="eyebrow"><span class="dot"></span>${esc(eyebrow)}</div>
<h1>${esc(title).replace(/-/g, "\u2011")}</h1>
<p>${esc(subtitle)}</p>
<div class="brand"><img src="${mascot}" alt=""><span>ashterisk</span><span class="url">the-ashterisk.github.io/free</span></div>
</body></html>`
}

const cards = [
  ...data.freeResources.map((r) => ({
    slug: r.slug,
    eyebrow: `The Toolkit · ${r.type}`,
    title: r.title,
    subtitle: r.description,
  })),
  { slug: 'hub', eyebrow: 'Templates · Checklists · Prompts', title: 'The Toolkit', subtitle: 'Templates, checklists and prompts for building with AI.' },
]

mkdirSync(outDir, { recursive: true })
const tmp = mkdtempSync(path.join(tmpdir(), 'ashterisk-og-'))
try {
  for (const c of cards) {
    const html = path.join(tmp, `${c.slug}.html`)
    writeFileSync(html, card(c))
    const out = path.join(outDir, `${c.slug}.png`)
    execFileSync(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=1',
      '--window-size=1200,630',
      '--virtual-time-budget=2000',
      `--screenshot=${out}`,
      pathToFileURL(html).href,
    ], { stdio: 'ignore' })
    console.log(`✓ ${path.relative(root, out)}`)
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
