import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { FilePanel } from './FilePanel'
import { StaticThemeToggle } from './ui'
import { carryCampaign, init, initInAppHint } from './client'
import { track } from '../lib/analytics'

vi.mock('../lib/analytics', () => ({ track: vi.fn(), initAnalytics: vi.fn() }))

const RAW = '# Hello\n\n- [ ] raw markdown'

function mount() {
  document.body.innerHTML =
    renderToStaticMarkup(createElement(StaticThemeToggle)) +
    renderToStaticMarkup(
      createElement(FilePanel, { fileName: 'CLAUDE.md', slug: 'claude-md', type: 'Template', raw: RAW, html: '<h1>Hello</h1>' }),
    ) +
    '<a data-download data-slug="claude-md" data-type="Template" href="/toolkit/claude-md/CLAUDE.md" download="CLAUDE.md">Download</a>'
  init(document)
  const q = <T extends Element>(sel: string) => document.querySelector<T>(sel)!
  return {
    panel: q<HTMLElement>('[data-file-panel]'),
    copy: q<HTMLButtonElement>('[data-copy]'),
    label: q<HTMLElement>('[data-copy-label]'),
    status: q<HTMLElement>('[data-copy-status]'),
    fallback: q<HTMLElement>('[data-copy-fallback]'),
    expand: q<HTMLButtonElement>('[data-expand]'),
    toggle: q<HTMLDetailsElement>('details.file-toggle'),
    theme: q<HTMLButtonElement>('[data-theme-toggle]'),
    download: q<HTMLAnchorElement>('[data-download]'),
  }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

beforeEach(() => vi.mocked(track).mockClear())

afterEach(() => {
  vi.restoreAllMocks()
  Object.defineProperty(navigator, 'clipboard', { value: undefined, configurable: true })
  document.documentElement.classList.remove('dark')
  localStorage.clear()
})

test('Copy writes the raw markdown and confirms', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
  const ui = mount()
  ui.copy.click()
  await flush()
  expect(writeText).toHaveBeenCalledWith(RAW)
  expect(ui.label.textContent).toBe('Copied')
  expect(ui.copy.classList.contains('is-copied')).toBe(true)
  expect(ui.status.textContent).toBe('Copied to clipboard')
  expect(ui.fallback.hidden).toBe(true)
})

test('falls back to execCommand when the clipboard API is blocked', async () => {
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) },
    configurable: true,
  })
  const exec = vi.fn().mockReturnValue(true)
  document.execCommand = exec
  const ui = mount()
  ui.copy.click()
  await flush()
  expect(exec).toHaveBeenCalledWith('copy')
  expect(ui.label.textContent).toBe('Copied')
  expect(ui.fallback.hidden).toBe(true)
})

test('a clipboard call that never settles times out into the fallback', async () => {
  vi.useFakeTimers()
  Object.defineProperty(navigator, 'clipboard', {
    value: { writeText: vi.fn().mockReturnValue(new Promise(() => {})) },
    configurable: true,
  })
  document.execCommand = vi.fn().mockReturnValue(false)
  const ui = mount()
  ui.copy.click()
  await vi.advanceTimersByTimeAsync(1000)
  expect(ui.fallback.hidden).toBe(false)
  vi.useRealTimers()
})

test('when every copy path fails, shows the text selected for a manual copy', async () => {
  document.execCommand = vi.fn().mockReturnValue(false)
  const ui = mount()
  ui.copy.click()
  await flush()
  expect(ui.fallback.hidden).toBe(false)
  expect(document.activeElement).toBe(document.querySelector('[data-copy-source]'))
  expect(ui.label.textContent).toBe('Copy')
  expect(ui.status.textContent).toMatch(/blocked/)
})

test('the chevron expands and collapses the panel in sync with the details toggle', () => {
  const ui = mount()
  expect(ui.expand.getAttribute('aria-expanded')).toBe('false')
  ui.expand.click()
  expect(ui.toggle.open).toBe(true)
  expect(ui.panel.classList.contains('is-open')).toBe(true)
  expect(ui.expand.getAttribute('aria-expanded')).toBe('true')
  ui.expand.click()
  expect(ui.toggle.open).toBe(false)
  expect(ui.panel.classList.contains('is-open')).toBe(false)
})

test('theme toggle flips .dark and remembers it like the main site', () => {
  const ui = mount()
  ui.theme.click()
  expect(document.documentElement.classList.contains('dark')).toBe(true)
  expect(localStorage.getItem('ashterisk-theme')).toBe('dark')
  ui.theme.click()
  expect(localStorage.getItem('ashterisk-theme')).toBe('light')
})

test('the download hint only shows inside Instagram and Facebook webviews', () => {
  const hint = document.createElement('p')
  hint.hidden = true
  initInAppHint(hint, 'Mozilla/5.0 (iPhone) AppleWebKit Mobile/15E148 Instagram 309.0.0')
  expect(hint.hidden).toBe(false)
  initInAppHint(hint, 'Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile Safari/537.36')
  expect(hint.hidden).toBe(true)
  initInAppHint(hint, 'Mozilla/5.0 (iPhone) [FBAN/FBIOS;FBAV/450.0]')
  expect(hint.hidden).toBe(false)
})

test('Copy reports which item was copied and that it worked', async () => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockResolvedValue(undefined) }, configurable: true })
  const ui = mount()
  ui.copy.click()
  await flush()
  expect(track).toHaveBeenCalledWith('toolkit_copied', { slug: 'claude-md', type: 'Template', success: true })
})

test('Copy reports a blocked clipboard as success: false', async () => {
  Object.defineProperty(navigator, 'clipboard', { value: { writeText: vi.fn().mockRejectedValue(new Error('denied')) }, configurable: true })
  document.execCommand = vi.fn(() => false)
  const ui = mount()
  ui.copy.click()
  await flush()
  expect(track).toHaveBeenCalledWith('toolkit_copied', { slug: 'claude-md', type: 'Template', success: false })
})

test('Download reports the item with a beacon and still downloads', () => {
  const ui = mount()
  const event = new MouseEvent('click', { bubbles: true, cancelable: true })
  ui.download.dispatchEvent(event)
  expect(track).toHaveBeenCalledWith('toolkit_downloaded', { slug: 'claude-md', type: 'Template' }, { beacon: true })
  expect(event.defaultPrevented).toBe(false)
})

describe('carryCampaign', () => {
  const links = () =>
    `<a id="hub" href="/toolkit/">Hub</a>
     <a id="item" href="/toolkit/ship-checklist/#how-to">Item</a>
     <a id="file" href="/toolkit/claude-md/CLAUDE.md">File</a>
     <a id="home" href="/">Home</a>
     <a id="ig" href="https://www.instagram.com/the.ashterisk">IG</a>`
  const href = (id: string) => document.getElementById(id)!.getAttribute('href')

  test('copies utm params onto toolkit page links only, keeping the hash', () => {
    document.body.innerHTML = links()
    carryCampaign(document, '?utm_source=instagram&utm_medium=bio&ref=x')
    expect(href('hub')).toBe('/toolkit/?utm_source=instagram&utm_medium=bio')
    expect(href('item')).toBe('/toolkit/ship-checklist/?utm_source=instagram&utm_medium=bio#how-to')
    expect(href('file')).toBe('/toolkit/claude-md/CLAUDE.md')
    expect(href('home')).toBe('/')
    expect(href('ig')).toBe('https://www.instagram.com/the.ashterisk')
  })

  test('leaves links alone when the page has no campaign tag', () => {
    document.body.innerHTML = links()
    carryCampaign(document, '?ref=x')
    expect(href('item')).toBe('/toolkit/ship-checklist/#how-to')
  })
})
