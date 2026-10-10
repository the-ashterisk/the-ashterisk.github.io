import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { SiInstagram, SiYoutube } from 'react-icons/si'
import { INSTAGRAM_PROFILE, YOUTUBE_PROFILE, pagePath, type FreeResource } from '../data/free'
import { focusRing, outlineButton, solidButton, StaticThemeToggle } from './ui'

const smallLink = `inline-flex min-h-[44px] items-center rounded font-body text-xs text-text-secondary transition-colors hover:text-text ${focusRing}`

function FreeHeader() {
  return (
    <header className="border-b border-line bg-bg">
      <nav aria-label="Main" className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-2 sm:px-5">
        <a href="/" className={`flex min-h-[44px] items-center gap-2 rounded-full ${focusRing}`}>
          {/* favicon.png is the same mascot as the main nav; it lives in public/ so static pages can use it. */}
          <img src="/favicon.png" alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
        </a>
        <div className="flex items-center gap-2">
          <a
            href="/free/"
            className={`grid min-h-[44px] place-items-center rounded-full px-3 font-body text-sm text-text-secondary transition-colors hover:text-text ${focusRing}`}
          >
            Free
          </a>
          <StaticThemeToggle />
        </div>
      </nav>
    </header>
  )
}

function FreeFooter({ others }: { others: FreeResource[] }) {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-3xl px-4 pb-10 pt-14 sm:px-5">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Follow <span className="text-accent">@</span>the.ashterisk
        </h2>
        <p className="mt-2 font-body text-text-secondary">New freebies drop with new reels.</p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={INSTAGRAM_PROFILE} target="_blank" rel="noreferrer" className={solidButton}>
            <SiInstagram size={18} aria-hidden /> Follow on Instagram
          </a>
          <a href={YOUTUBE_PROFILE} target="_blank" rel="noreferrer" className={outlineButton}>
            <SiYoutube size={18} aria-hidden className="text-accent" /> Subscribe on YouTube
          </a>
        </div>

        {others.length > 0 && (
          <nav aria-label="More freebies" className="mt-12">
            <h2 className="font-display text-sm font-bold uppercase tracking-widest">More freebies</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {others.map((r) => (
                <li key={r.slug}>
                  <a
                    href={pagePath(r)}
                    className={`group flex min-h-[56px] items-center justify-between gap-4 py-3 ${focusRing}`}
                  >
                    <span>
                      <span className="block font-display font-medium">{r.title}</span>
                      <span className="block font-body text-sm text-text-secondary">{r.type}</span>
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden
                      className="shrink-0 text-text-secondary transition-transform group-hover:text-accent motion-safe:group-hover:translate-x-0.5"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-line pt-6">
          <span className="font-body text-xs text-text-secondary">© {year} Ashterisk</span>
          <a href="/" className={smallLink}>
            Home
          </a>
          <a href="/privacy/" className={smallLink}>
            Privacy Policy
          </a>
          <a href="/terms/" className={smallLink}>
            Terms of Use
          </a>
        </div>
      </div>
    </footer>
  )
}

export function FreeLayout({ children, others = [] }: { children: ReactNode; others?: FreeResource[] }) {
  return (
    <div id="top" className="flex min-h-screen flex-col">
      <FreeHeader />
      <main className="flex-1">{children}</main>
      <FreeFooter others={others} />
    </div>
  )
}
