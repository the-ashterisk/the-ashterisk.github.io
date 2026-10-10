import { Check, ChevronDown, Copy, FileText } from 'lucide-react'
import { focusRing } from './ui'

interface FilePanelProps {
  fileName: string
  /** Reported with Copy so analytics knows which item it was. */
  slug: string
  type: string
  /** Raw markdown: what Copy puts on the clipboard. */
  raw: string
  /** Build-time rendered markdown, shown in the panel body. */
  html: string
}

// The body is always in the HTML (readable without JS) and clamped to a "peek".
// The <details> at the bottom expands it with no JS via :has(); client.ts adds
// Copy, the chevron toggle and an .is-open fallback for browsers without :has().
export function FilePanel({ fileName, slug, type, raw, html }: FilePanelProps) {
  return (
    <section data-file-panel data-slug={slug} data-type={type} aria-label={`${fileName} file`} className="file-panel overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex min-h-[56px] items-center gap-2 border-b border-line py-1.5 pl-4 pr-1.5">
        <FileText size={18} aria-hidden className="shrink-0 text-accent" />
        <h2 className="min-w-0 flex-1 truncate font-display text-sm font-medium">{fileName}</h2>
        <button
          type="button"
          data-copy
          className={`js-only group inline-flex min-h-[44px] shrink-0 items-center gap-2 rounded-full border border-line bg-bg px-3.5 font-display text-sm font-medium text-text transition-colors hover:border-accent [&.is-copied]:border-accent ${focusRing}`}
        >
          <Copy size={16} aria-hidden className="text-accent group-[.is-copied]:hidden" />
          <Check size={16} aria-hidden className="hidden text-accent group-[.is-copied]:block" />
          <span data-copy-label>Copy</span>
        </button>
        <button
          type="button"
          data-expand
          aria-controls="file-body"
          aria-expanded="false"
          aria-label="Show full file"
          className={`js-only grid h-11 w-11 place-items-center rounded-full text-text-secondary transition-colors hover:text-text ${focusRing}`}
        >
          <ChevronDown size={20} aria-hidden className="file-chevron" />
        </button>
      </div>

      <div data-copy-fallback hidden className="border-b border-line px-4 py-4">
        <p className="font-body text-sm text-text">Copy didn&apos;t work here. The text is selected below: press and hold it, then tap Copy.</p>
        <textarea
          data-copy-source
          readOnly
          defaultValue={raw}
          aria-label={`${fileName} contents`}
          className="mt-3 h-48 w-full resize-y rounded-xl border border-line bg-bg p-3 font-mono text-sm text-text"
        />
      </div>

      <div id="file-body" className="file-body md-prose px-4 py-5 sm:px-6" dangerouslySetInnerHTML={{ __html: html }} />

      <details className="file-toggle border-t border-line">
        <summary
          className={`flex min-h-[48px] cursor-pointer items-center justify-center gap-2 font-display text-sm font-medium text-text ${focusRing}`}
        >
          <span className="file-toggle-more">Show full file</span>
          <span className="file-toggle-less">Show less</span>
          <ChevronDown size={18} aria-hidden className="file-chevron text-accent" />
        </summary>
      </details>

      <p data-copy-status aria-live="polite" className="sr-only" />
    </section>
  )
}
