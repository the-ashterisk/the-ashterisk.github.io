import { INSTAGRAM_PROFILE, SITE_URL, filePath, toolkitResources, pagePath, resourceContent, sortedResources } from '../data/toolkit'
import { buildPages, type StaticFile } from './pages'

const ASSETS = '<link rel="stylesheet" href="/assets/toolkit.css" />'
const files = buildPages(ASSETS)
const byName = new Map(files.map((f) => [f.fileName, f]))

const parse = (f: StaticFile) => new DOMParser().parseFromString(f.source, 'text/html')
const meta = (doc: Document, key: string) =>
  doc.querySelector(`meta[property="${key}"], meta[name="${key}"]`)?.getAttribute('content')

function page(fileName: string): Document {
  const f = byName.get(fileName)
  if (!f) throw new Error(`not emitted: ${fileName}`)
  return parse(f)
}

/** Resolve a site path to the file GitHub Pages would serve for it. */
function resolves(href: string): boolean {
  const path = href.split(/[?#]/)[0].replace(/^\//, '')
  if (['', 'privacy/', 'terms/', 'favicon.png'].includes(path)) return true
  return byName.has(path.endsWith('/') ? `${path}index.html` : path)
}

test('emits the hub, every page, raw file, short link and 404', () => {
  const expected = ['toolkit/index.html', '404.html']
  for (const r of toolkitResources) {
    expected.push(`toolkit/${r.slug}/index.html`, filePath(r).slice(1), `${r.shortLink}/index.html`)
  }
  expect(files.map((f) => f.fileName).sort()).toEqual(expected.sort())
})

test('the raw file is byte-identical to the source markdown', () => {
  for (const r of toolkitResources) {
    expect(byName.get(filePath(r).slice(1))?.source).toBe(resourceContent(r.slug))
  }
})

test('every html page has its own title, description, preview tags and the client assets', () => {
  const titles = new Set<string>()
  for (const f of files.filter((f) => f.fileName.endsWith('.html'))) {
    const doc = parse(f)
    expect(doc.title).not.toBe('')
    expect(meta(doc, 'description')).toBeTruthy()
    expect(meta(doc, 'og:title')).toBeTruthy()
    expect(meta(doc, 'og:description')).toBeTruthy()
    expect(meta(doc, 'og:image')).toMatch(new RegExp(`^${SITE_URL}/toolkit/og/[a-z-]+\\.png$`))
    expect(doc.documentElement.classList.contains('no-js')).toBe(true)
    if (!f.fileName.match(/^[a-z]+\/index\.html$/) || f.fileName === 'toolkit/index.html') {
      // Short links reuse their target's title on purpose; everything else is unique.
      expect(titles.has(doc.title)).toBe(false)
      titles.add(doc.title)
    }
    if (f.source.includes('<main')) expect(f.source).toContain(ASSETS)
  }
})

test('resource page follows the agreed order and links its file', () => {
  for (const r of toolkitResources) {
    const doc = page(`toolkit/${r.slug}/index.html`)
    expect(doc.querySelector('link[rel=canonical]')?.getAttribute('href')).toBe(`${SITE_URL}${pagePath(r)}`)
    const main = doc.querySelector('main')!
    const order = [
      main.querySelector('h1'),
      main.querySelector('[data-file-panel]'),
      main.querySelector('a[download]'),
      main.querySelector('#how-to'),
      main.querySelector('#from-reel'),
      main.querySelector('time'),
    ]
    order.forEach((el) => expect(el).not.toBeNull())
    for (let i = 1; i < order.length; i++) {
      expect(order[i - 1]!.compareDocumentPosition(order[i]!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    }
    expect(doc.querySelector('h1')?.textContent).toBe(r.title)
    const download = main.querySelector('a[download]')!
    expect(download.getAttribute('href')).toBe(filePath(r))
    expect(download.getAttribute('download')).toBe(r.fileName)
    // The Instagram hint ships hidden; client.ts reveals it only in the in-app browser.
    const hint = main.querySelector<HTMLElement>('[data-inapp-hint]')!
    expect(hint.hidden).toBe(true)
    expect(hint.textContent).toMatch(/Open in browser/)
    expect(main.querySelectorAll('#how-to ~ ol li, section[aria-labelledby=how-to] li')).toHaveLength(3)
    // Copy reads the embedded raw markdown, not the rendered HTML.
    expect(doc.querySelector<HTMLTextAreaElement>('[data-copy-source]')?.value).toBe(resourceContent(r.slug))
    // Footer lists the other freebies but not this one.
    const more = doc.querySelector('nav[aria-label="More from the toolkit"]')!
    expect(more.querySelectorAll('a')).toHaveLength(toolkitResources.length - 1)
    expect(more.querySelector(`a[href="${pagePath(r)}"]`)).toBeNull()
  }
})

test('content is readable without JS: rendered markdown is in the HTML, JS-only controls are marked', () => {
  const doc = page('toolkit/audit/index.html')
  expect(doc.querySelector('#file-body h2, #file-body h1')).not.toBeNull()
  expect(doc.querySelector('[data-copy]')?.classList.contains('js-only')).toBe(true)
  expect(doc.querySelector('[data-expand]')?.classList.contains('js-only')).toBe(true)
  expect(doc.querySelector('details.file-toggle summary')).not.toBeNull()
})

test('hub lists every freebie newest first, each with its reel', () => {
  const doc = page('toolkit/index.html')
  const titles = [...doc.querySelectorAll('main h2')].map((h) => h.textContent)
  expect(titles).toEqual(sortedResources().map((r) => r.title))
  for (const r of toolkitResources) {
    expect(doc.querySelector(`main a[href="${pagePath(r)}"]`)).not.toBeNull()
  }
  expect(doc.querySelectorAll('main a[target=_blank]')).toHaveLength(toolkitResources.length)
})

test('short links redirect to their page without JS and stay out of search', () => {
  for (const r of toolkitResources) {
    const doc = page(`${r.shortLink}/index.html`)
    expect(doc.querySelector('meta[http-equiv=refresh]')?.getAttribute('content')).toBe(`0; url=${pagePath(r)}`)
    expect(doc.querySelector('link[rel=canonical]')?.getAttribute('href')).toBe(`${SITE_URL}${pagePath(r)}`)
    expect(meta(doc, 'robots')).toBe('noindex')
    expect(doc.querySelector(`a[href="${pagePath(r)}"]`)).not.toBeNull()
  }
})

test('every internal link and asset on every page resolves', () => {
  for (const f of files.filter((f) => f.fileName.endsWith('.html'))) {
    const doc = parse(f)
    for (const a of doc.querySelectorAll('a[href^="/"], img[src^="/"]')) {
      const href = a.getAttribute('href') ?? a.getAttribute('src')!
      expect(resolves(href), `${f.fileName} → ${href}`).toBe(true)
    }
  }
})

test('external links open in a new tab safely, and no link is empty', () => {
  for (const f of files.filter((f) => f.fileName.endsWith('.html'))) {
    for (const a of parse(f).querySelectorAll('a')) {
      const href = a.getAttribute('href')
      expect(href, f.fileName).toBeTruthy()
      expect(href).not.toBe('#')
      if (href!.startsWith('http')) {
        expect(a.getAttribute('target')).toBe('_blank')
        expect(a.getAttribute('rel')).toContain('noreferrer')
      }
    }
  }
})

test('the header asks visitors to follow on Instagram', () => {
  for (const f of files.filter((f) => f.source.includes('<main'))) {
    const follow = parse(f).querySelector('header a[aria-label="Follow @the.ashterisk on Instagram"]')
    expect(follow?.getAttribute('href'), f.fileName).toBe(INSTAGRAM_PROFILE)
  }
})
