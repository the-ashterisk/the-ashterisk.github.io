import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  SITE_URL,
  filePath,
  ogImagePath,
  pagePath,
  resourceContent,
  sortedResources,
  type FreeResource,
} from '../data/free'
import { renderMarkdown } from './markdown'
import { ResourcePage } from './ResourcePage'
import { HubPage } from './HubPage'
import { NotFoundPage } from './NotFoundPage'

/** One file to write into dist/, path relative to the site root. */
export interface StaticFile {
  fileName: string
  source: string
}

interface Meta {
  title: string
  description: string
  /** Site path of the page this one represents (its canonical). */
  path?: string
  ogImage: string
  ogType?: 'website' | 'article'
  noindex?: boolean
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// Runs before paint: drops .no-js and applies the same stored theme as the main
// site (ThemeProvider). Without JS, tokens.css follows prefers-color-scheme.
export const THEME_SCRIPT =
  "(function(){var d=document.documentElement,t;d.classList.remove('no-js');" +
  "try{t=localStorage.getItem('ashterisk-theme')}catch(e){}" +
  "if(t!=='light'&&t!=='dark')t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';" +
  "d.classList.toggle('dark',t==='dark')})()"

function metaTags(m: Meta): string {
  const tags = [
    `<title>${escapeHtml(m.title)}</title>`,
    `<meta name="description" content="${escapeHtml(m.description)}" />`,
    m.path && `<link rel="canonical" href="${SITE_URL}${m.path}" />`,
    m.noindex && '<meta name="robots" content="noindex" />',
    `<meta property="og:site_name" content="ashterisk" />`,
    `<meta property="og:type" content="${m.ogType ?? 'website'}" />`,
    `<meta property="og:title" content="${escapeHtml(m.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(m.description)}" />`,
    m.path && `<meta property="og:url" content="${SITE_URL}${m.path}" />`,
    `<meta property="og:image" content="${SITE_URL}${m.ogImage}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta name="twitter:card" content="summary_large_image" />',
  ]
  return tags.filter(Boolean).join('\n    ')
}

function documentHtml(meta: Meta, assetTags: string, body: string, extraHead = ''): string {
  return `<!doctype html>
<html lang="en" class="no-js">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script>${THEME_SCRIPT}</script>
    <link rel="icon" type="image/png" href="/favicon.png" />
    ${metaTags(meta)}${extraHead}
    ${assetTags}
  </head>
  <body>
    ${body}
  </body>
</html>
`
}

const render = (el: ReactElement) => renderToStaticMarkup(el)

export const resourceMeta = (r: FreeResource): Meta => ({
  title: `${r.title} — free from ashterisk`,
  description: r.description,
  path: pagePath(r),
  ogImage: ogImagePath(r.slug),
  ogType: 'article',
})

export const hubMeta: Meta = {
  title: 'Free stuff — ashterisk',
  description: 'Templates, checklists and prompts from the Ashterisk reels. No signup: copy it, download it, use it.',
  path: '/free/',
  ogImage: ogImagePath('hub'),
}

// Short links keep the target's preview tags so a pasted /audit still previews
// properly, then hand off instantly. meta refresh covers no-JS webviews.
function redirectHtml(r: FreeResource): string {
  const target = pagePath(r)
  const body = `<p style="font-family:system-ui,sans-serif;padding:2rem 1rem">Taking you to <a href="${target}">${escapeHtml(r.title)}</a>…</p>
    <script>location.replace(${JSON.stringify(target)} + location.hash)</script>`
  return documentHtml(
    { ...resourceMeta(r), noindex: true },
    '',
    body,
    `\n    <meta http-equiv="refresh" content="0; url=${target}" />`,
  )
}

/**
 * Every static file under /free, the short links and 404.html.
 * `assetTags` is the <link>/<script> markup for the free-pages client bundle;
 * the Vite plugin passes hashed build files or dev-server module paths.
 */
export function buildPages(assetTags: string): StaticFile[] {
  const resources = sortedResources()
  const files: StaticFile[] = []

  files.push({
    fileName: 'free/index.html',
    source: documentHtml(hubMeta, assetTags, render(<HubPage resources={resources} />)),
  })

  for (const r of resources) {
    const raw = resourceContent(r.slug)
    const others = resources.filter((o) => o.slug !== r.slug)
    files.push({
      fileName: `free/${r.slug}/index.html`,
      source: documentHtml(
        resourceMeta(r),
        assetTags,
        render(<ResourcePage resource={r} raw={raw} html={renderMarkdown(raw)} others={others} />),
      ),
    })
    files.push({ fileName: filePath(r).slice(1), source: raw })
    files.push({ fileName: `${r.shortLink}/index.html`, source: redirectHtml(r) })
  }

  files.push({
    fileName: '404.html',
    source: documentHtml(
      {
        title: 'Page not found — ashterisk',
        description: "That page doesn't exist. Find the free templates, checklists and prompts here.",
        ogImage: ogImagePath('hub'),
        noindex: true,
      },
      assetTags,
      render(<NotFoundPage resources={resources} />),
    ),
  })

  return files
}
