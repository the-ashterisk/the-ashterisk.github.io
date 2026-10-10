import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { INSTAGRAM_PROFILE, pagePath, type ToolkitResource } from '../data/toolkit'
import { ToolkitLayout } from './ToolkitLayout'
import { focusRing, NoBreakHyphens, TypeTag } from './ui'

function HubCard({ resource: r }: { resource: ToolkitResource }) {
  return (
    <li className="group relative flex flex-col rounded-2xl border border-line bg-surface p-5 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:border-accent/40 hover:shadow-[0_16px_40px_-16px_rgba(255,82,68,0.35)] motion-safe:hover:-translate-y-1 sm:p-6">
      <TypeTag type={r.type} />
      <h2 className="mt-4 font-display text-2xl font-bold leading-tight">
        {/* Stretched link: the whole card opens the freebie; the reel link sits above it. */}
        <a href={pagePath(r)} className={`rounded after:absolute after:inset-0 after:rounded-2xl after:content-[''] ${focusRing}`}>
          <NoBreakHyphens text={r.title} />
        </a>
      </h2>
      <p className="mt-2 flex-1 font-body text-text-secondary">{r.description}</p>
      <div className="mt-5 flex items-center justify-between gap-4">
        <span aria-hidden className="inline-flex items-center gap-1.5 font-display text-sm font-medium">
          Open <ArrowRight size={16} className="text-accent transition-transform motion-safe:group-hover:translate-x-0.5" />
        </span>
        <a
          href={r.reel.instagram ?? INSTAGRAM_PROFILE}
          target="_blank"
          rel="noreferrer"
          className={`relative z-10 inline-flex min-h-[44px] items-center gap-1 rounded px-1 font-body text-sm text-text-secondary transition-colors hover:text-text ${focusRing}`}
        >
          From reel {r.reel.number} <ArrowUpRight size={14} aria-hidden />
        </a>
      </div>
    </li>
  )
}

export function HubPage({ resources }: { resources: ToolkitResource[] }) {
  return (
    <ToolkitLayout>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-5 sm:pt-16">
        <h1 className="font-display text-5xl font-bold leading-tight sm:text-6xl">
          The Toolkit
        </h1>
        <p className="mt-4 max-w-xl font-body text-lg leading-relaxed text-text-secondary">
          Templates, checklists and prompts I use when building with AI. Copy them straight into your next project.
        </p>
        <ul className="mt-10 grid gap-4">
          {resources.map((r) => (
            <HubCard key={r.slug} resource={r} />
          ))}
        </ul>
      </div>
    </ToolkitLayout>
  )
}
