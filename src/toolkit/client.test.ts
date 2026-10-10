import { renderToStaticMarkup } from 'react-dom/server'
import { createElement } from 'react'
import { FilePanel } from './FilePanel'
import { StaticThemeToggle } from './ui'
import { init, initInAppHint } from './client'

const RAW = '# Hello\n\n- [ ] raw markdown'

function mount() {
  document.body.innerHTML =
    renderToStaticMarkup(createElement(StaticThemeToggle)) +
    renderToStaticMarkup(createElement(FilePanel, { fileName: 'CLAUDE.md', raw: RAW, html: '<h1>Hello</h1>' }))
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
  }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

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
