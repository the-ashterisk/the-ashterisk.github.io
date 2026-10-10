export const SITE_URL = 'https://the-ashterisk.github.io'
export const INSTAGRAM_PROFILE = 'https://www.instagram.com/the.ashterisk'
export const YOUTUBE_PROFILE = 'https://www.youtube.com/@the.ashterisk'

export type ToolkitType = 'Template' | 'Checklist' | 'Prompts'

export interface ToolkitResource {
  /** Page lives at /toolkit/<slug>/ and its markdown at src/content/toolkit/<slug>.md. */
  slug: string
  /** Typeable redirect at /<shortLink>/, used in YouTube Shorts. */
  shortLink: string
  title: string
  description: string
  type: ToolkitType
  /** Name the file is copied/downloaded as. */
  fileName: string
  howTo: [string, string, string]
  reel: {
    number: number
    /** ISO date the reel posts; orders the hub, newest first. */
    postedOn: string
    /** Fill in once the reel is live; until then the profile is linked. */
    instagram?: string
    youtube?: string
  }
  /** Set by hand whenever the markdown changes. */
  lastUpdated: string
}

const content = import.meta.glob<string>('../content/toolkit/*.md', { query: '?raw', import: 'default', eager: true })

/** Raw markdown for a resource — the one source for the page, Copy and Download. */
export function resourceContent(slug: string): string {
  const raw = content[`../content/toolkit/${slug}.md`]
  if (raw === undefined) throw new Error(`Missing src/content/toolkit/${slug}.md`)
  return raw
}

// Add a freebie: drop its markdown in src/content/toolkit/<slug>.md and append one entry here.
export const toolkitResources: ToolkitResource[] = [
  {
    slug: 'claude-md',
    shortLink: 'claude',
    title: 'CLAUDE.md template',
    description: 'My own CLAUDE.md, cleaned up as a template: the rules that stop your AI changing more than you asked.',
    type: 'Template',
    fileName: 'CLAUDE.md',
    howTo: [
      'Put CLAUDE.md in the root of your project.',
      'Edit the parts marked ✏️ so they fit your project.',
      'Start a new session so your AI reads the file.',
    ],
    reel: { number: 11, postedOn: '2026-10-19' },
    lastUpdated: '2026-10-10',
  },
  {
    slug: 'audit',
    shortLink: 'audit',
    title: 'Before you ship an AI-built site',
    description: 'Ten minutes, eight checks for the parts of an AI-built site that only look finished.',
    type: 'Checklist',
    fileName: 'ship-checklist.md',
    howTo: [
      'Build your site and open the live version, not the dev server.',
      'Go down the list and do each check in order.',
      'Fix anything that fails before you share the link.',
    ],
    reel: { number: 13, postedOn: '2026-10-21' },
    lastUpdated: '2026-10-10',
  },
  {
    slug: 'prompts',
    shortLink: 'prompts',
    title: 'Make your AI disagree',
    description: 'Five prompts that make your AI push back instead of telling you what you want to hear.',
    type: 'Prompts',
    fileName: 'prompt-pack.md',
    howTo: [
      'Pick the prompt that fits what you are working on.',
      'Paste it into the same chat as your idea or plan.',
      'Push back on the answer and see whether it holds.',
    ],
    reel: { number: 14, postedOn: '2026-10-22' },
    lastUpdated: '2026-10-10',
  },
]

/** Hub order: newest reel first. */
export function sortedResources(): ToolkitResource[] {
  return [...toolkitResources].sort((a, b) => b.reel.postedOn.localeCompare(a.reel.postedOn))
}

export const pagePath = (r: ToolkitResource) => `/toolkit/${r.slug}/`
export const filePath = (r: ToolkitResource) => `/toolkit/${r.slug}/${r.fileName}`
export const ogImagePath = (slug: string) => `/toolkit/og/${slug}.png`

/** Top-level paths that already exist; a short link must never take one of these. */
export const RESERVED_ROOT_PATHS = ['toolkit', 'privacy', 'terms', 'assets', 'src', '404', 'index']

/** "2026-10-19" → "19 Oct 2026", without timezone drift. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${d} ${months[m - 1]} ${y}`
}
