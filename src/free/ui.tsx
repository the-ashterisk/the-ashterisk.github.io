import { Moon, Sun } from 'lucide-react'
import type { FreeType } from '../data/free'

export const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

// White on accent fails contrast (3.2:1), so the solid button inverts text/bg
// instead and keeps the accent for icons and borders.
const buttonBase = `inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-6 font-display font-medium transition-[transform,border-color,filter] duration-200 motion-safe:hover:-translate-y-0.5 ${focusRing}`
export const solidButton = `${buttonBase} bg-text text-bg hover:brightness-110`
export const outlineButton = `${buttonBase} border border-line text-text hover:border-accent`

export function TypeTag({ type }: { type: FreeType }) {
  return (
    <span className="inline-flex items-center gap-1.5 self-start rounded-full border border-line px-3 py-1 font-body text-xs font-medium text-text">
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
      {type}
    </span>
  )
}

/** Static twin of the main site's ThemeToggle; client.ts wires the click. Hidden without JS. */
export function StaticThemeToggle() {
  return (
    <button
      type="button"
      data-theme-toggle
      aria-label="Toggle light and dark theme"
      className={`js-only grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:border-accent ${focusRing}`}
    >
      <Sun size={18} aria-hidden className="hidden dark:block" />
      <Moon size={18} aria-hidden className="block dark:hidden" />
    </button>
  )
}

/** Keeps hyphenated words like "AI-built" on one line in big headings. */
export function NoBreakHyphens({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\S+-\S+)/).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  )
}
