// toolkit.css @imports the site's index.css so these pages get one self-contained stylesheet.
import './toolkit.css'
import { initAnalytics, track } from '../lib/analytics'
import { isInAppBrowser } from '../lib/trafficSource'

// The only JS on the /toolkit pages. Everything is readable without it;
// this adds Copy, the panel chevron, the theme toggle and analytics.

const THEME_KEY = 'ashterisk-theme'
const COPIED_MS = 2000

// Some webviews never settle writeText when the permission is denied; give up
// after this and fall back rather than leaving the button dead.
const CLIPBOARD_TIMEOUT_MS = 1000

async function writeClipboard(text: string, source: HTMLTextAreaElement): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await Promise.race([
        navigator.clipboard.writeText(text),
        new Promise((_, reject) => window.setTimeout(() => reject(new Error('clipboard timeout')), CLIPBOARD_TIMEOUT_MS)),
      ])
      return true
    }
  } catch {
    // Instagram's webview often rejects or hangs the async clipboard; fall through.
  }
  // Older webviews: select a temporarily visible textarea and use execCommand.
  const wrapper = source.parentElement as HTMLElement
  const wasHidden = wrapper.hidden
  wrapper.hidden = false
  source.focus()
  source.select()
  source.setSelectionRange(0, text.length)
  let ok = false
  try {
    ok = document.execCommand('copy')
  } catch {
    ok = false
  }
  wrapper.hidden = wasHidden
  return ok
}

export function initFilePanel(panel: HTMLElement): void {
  const copyBtn = panel.querySelector<HTMLButtonElement>('[data-copy]')
  const label = panel.querySelector<HTMLElement>('[data-copy-label]')
  const status = panel.querySelector<HTMLElement>('[data-copy-status]')
  const source = panel.querySelector<HTMLTextAreaElement>('[data-copy-source]')
  const fallback = panel.querySelector<HTMLElement>('[data-copy-fallback]')
  const expandBtn = panel.querySelector<HTMLButtonElement>('[data-expand]')
  const toggle = panel.querySelector<HTMLDetailsElement>('details.file-toggle')
  const { slug = '', type = '' } = panel.dataset

  let resetTimer: number | undefined
  copyBtn?.addEventListener('click', async () => {
    if (!source || !label || !status || !fallback) return
    const ok = await writeClipboard(source.value, source)
    track('toolkit_copied', { slug, type, success: ok })
    if (ok) {
      fallback.hidden = true
      label.textContent = 'Copied'
      copyBtn.classList.add('is-copied')
      status.textContent = 'Copied to clipboard'
      window.clearTimeout(resetTimer)
      resetTimer = window.setTimeout(() => {
        label.textContent = 'Copy'
        copyBtn.classList.remove('is-copied')
        status.textContent = ''
      }, COPIED_MS)
    } else {
      // Last resort: leave the text visible and selected for a manual copy.
      fallback.hidden = false
      source.focus()
      source.select()
      status.textContent = 'Copy is blocked here. The text is selected so you can copy it yourself.'
    }
  })

  const sync = () => {
    const open = Boolean(toggle?.open)
    panel.classList.toggle('is-open', open)
    expandBtn?.setAttribute('aria-expanded', String(open))
    expandBtn?.setAttribute('aria-label', open ? 'Show less' : 'Show full file')
  }
  toggle?.addEventListener('toggle', sync)
  expandBtn?.addEventListener('click', () => {
    if (toggle) toggle.open = !toggle.open
    sync()
  })
  sync()
}

/** Instagram's webview often blocks downloads; only there do we explain the way out. */
export function initInAppHint(hint: HTMLElement, userAgent = navigator.userAgent): void {
  hint.hidden = !isInAppBrowser(userAgent)
}

export function initThemeToggle(button: HTMLElement): void {
  button.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark')
    try {
      localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
    } catch {
      // Storage blocked (private mode): the toggle still works for this page.
    }
  })
}

export function initDownload(link: HTMLAnchorElement): void {
  // Beacon, because the download can navigate away in Instagram's webview.
  link.addEventListener('click', () => {
    track('toolkit_downloaded', { slug: link.dataset.slug ?? '', type: link.dataset.type ?? '' }, { beacon: true })
  })
}

/**
 * Keeps the campaign tag (utm_*) on links between toolkit pages, so a bio → hub → item
 * visit still counts as Instagram. Nothing is stored; file links stay untouched.
 */
export function carryCampaign(root: ParentNode, search = location.search): void {
  const campaign = [...new URLSearchParams(search)].filter(([key]) => key.startsWith('utm_'))
  if (campaign.length === 0) return
  root.querySelectorAll<HTMLAnchorElement>('a[href^="/toolkit/"]').forEach((link) => {
    const url = new URL(link.getAttribute('href')!, location.origin)
    if (!url.pathname.endsWith('/')) return
    for (const [key, value] of campaign) url.searchParams.set(key, value)
    link.setAttribute('href', url.pathname + url.search + url.hash)
  })
}

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-file-panel]').forEach(initFilePanel)
  root.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach(initThemeToggle)
  root.querySelectorAll<HTMLElement>('[data-inapp-hint]').forEach((hint) => initInAppHint(hint))
  root.querySelectorAll<HTMLAnchorElement>('[data-download]').forEach(initDownload)
  carryCampaign(root)
}

if (!import.meta.env.VITEST) {
  init()
  initAnalytics()
}
