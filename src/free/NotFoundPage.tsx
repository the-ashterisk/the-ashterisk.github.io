import { pagePath, type FreeResource } from '../data/free'
import { FreeLayout } from './FreeLayout'
import { focusRing, outlineButton, solidButton } from './ui'

export function NotFoundPage({ resources }: { resources: FreeResource[] }) {
  return (
    <FreeLayout>
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-12 sm:px-5 sm:pt-20">
        <p className="font-display text-sm font-bold uppercase tracking-widest text-text-secondary">404</p>
        <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-4 font-body text-lg text-text-secondary">
          The link might have a typo. Here&apos;s what you were probably looking for:
        </p>
        <ul className="mt-8 grid gap-3">
          {resources.map((r) => (
            <li key={r.slug}>
              <a
                href={pagePath(r)}
                className={`flex min-h-[56px] items-center justify-between gap-4 rounded-2xl border border-line bg-surface px-5 py-3 font-display font-medium transition-colors hover:border-accent ${focusRing}`}
              >
                <span>{r.title}</span>
                <span className="font-body text-sm text-text-secondary">{r.type}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/free/" className={solidButton}>
            Open the toolkit
          </a>
          <a href="/" className={outlineButton}>
            Home
          </a>
        </div>
      </div>
    </FreeLayout>
  )
}
