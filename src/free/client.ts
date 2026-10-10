// free.css @imports the site's index.css so these pages get one self-contained stylesheet.
import './free.css'

// The only JS on the /free pages. Everything is readable without it;
// this adds Copy, the panel chevron and the theme toggle.

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

  let resetTimer: number | undefined
  copyBtn?.addEventListener('click', async () => {
    if (!source || !label || !status || !fallback) return
    const ok = await writeClipboard(source.value, source)
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

const IN_APP_BROWSER = /Instagram|FBAN|FBAV/i

/** Instagram's webview often blocks downloads; only there do we explain the way out. */
export function initInAppHint(hint: HTMLElement, userAgent = navigator.userAgent): void {
  hint.hidden = !IN_APP_BROWSER.test(userAgent)
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

export function init(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-file-panel]').forEach(initFilePanel)
  root.querySelectorAll<HTMLElement>('[data-theme-toggle]').forEach(initThemeToggle)
  root.querySelectorAll<HTMLElement>('[data-inapp-hint]').forEach((hint) => initInAppHint(hint))
}

if (!import.meta.env.VITEST) init()
