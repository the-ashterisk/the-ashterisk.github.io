import { ArrowLeft, Download } from 'lucide-react'
import { SiInstagram, SiYoutube } from 'react-icons/si'
import { INSTAGRAM_PROFILE, YOUTUBE_PROFILE, filePath, formatDate, type ToolkitResource } from '../data/toolkit'
import { FilePanel } from './FilePanel'
import { ToolkitLayout } from './ToolkitLayout'
import { focusRing, NoBreakHyphens, outlineButton, solidButton, TypeTag } from './ui'

interface ResourcePageProps {
  resource: ToolkitResource
  raw: string
  html: string
  others: ToolkitResource[]
}

const sectionHeading = 'font-display text-sm font-bold uppercase tracking-widest'

export function ResourcePage({ resource: r, raw, html, others }: ResourcePageProps) {
  return (
    <ToolkitLayout others={others}>
      <article className="mx-auto max-w-3xl px-4 pb-16 pt-8 sm:px-5 sm:pt-12">
        <a
          href="/toolkit/"
          className={`inline-flex min-h-[44px] items-center gap-1.5 rounded font-body text-sm text-text-secondary transition-colors hover:text-text ${focusRing}`}
        >
          <ArrowLeft size={16} aria-hidden /> Back to the toolkit
        </a>

        <header className="mt-4">
          <TypeTag type={r.type} />
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight sm:text-5xl"><NoBreakHyphens text={r.title} /></h1>
          <p className="mt-3 font-body text-lg leading-relaxed text-text-secondary">{r.description}</p>
        </header>

        <div className="mt-8">
          <FilePanel fileName={r.fileName} raw={raw} html={html} />
        </div>

        <div className="mt-5">
          <a href={filePath(r)} download={r.fileName} className={`${solidButton} w-full`}>
            <Download size={18} aria-hidden /> Download {r.fileName}
          </a>
          {/* Shown by client.ts only inside Instagram's in-app browser, which often blocks downloads. */}
          <p data-inapp-hint hidden className="mt-3 text-center font-body text-sm text-text-secondary">
            You&apos;re in Instagram&apos;s browser, which can block downloads. Use Copy instead, or tap the ⋯ menu
            (top right) and choose Open in browser.
          </p>
        </div>

        <section aria-labelledby="how-to" className="mt-14">
          <h2 id="how-to" className={sectionHeading}>
            How to use it
          </h2>
          <ol className="mt-5 space-y-4">
            {r.howTo.map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span
                  aria-hidden
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-accent font-display text-sm font-bold"
                >
                  {i + 1}
                </span>
                <span className="pt-1 font-body text-lg leading-snug">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="from-reel" className="mt-14">
          <h2 id="from-reel" className={sectionHeading}>
            From reel {r.reel.number}
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <a href={r.reel.instagram ?? INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className={outlineButton}>
              <SiInstagram size={18} aria-hidden className="text-accent" /> Watch on Instagram
            </a>
            <a href={r.reel.youtube ?? YOUTUBE_PROFILE} target="_blank" rel="noreferrer" className={outlineButton}>
              <SiYoutube size={18} aria-hidden className="text-accent" /> Watch on YouTube
            </a>
          </div>
        </section>

        <p className="mt-10 font-body text-sm text-text-secondary">
          Last updated <time dateTime={r.lastUpdated}>{formatDate(r.lastUpdated)}</time>
        </p>
      </article>
    </ToolkitLayout>
  )
}
