import { ArrowUp, Mail } from 'lucide-react'
import { Reveal } from '../motion/Reveal'
import { Magnetic } from '../motion/Magnetic'
import { GradientText } from '../components/GradientText'
import { Button } from '../components/Button'
import { socialLinks, EMAIL } from '../data/links'
import { sectionHref } from '../lib/sectionHref'
import ash from '../assets/ash.png'

const exploreLinks = [
  { label: 'Projects', id: 'projects' },
  { label: 'About', id: 'about' },
]

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'
// Separate size variants: Tailwind orders utilities by config, not class string,
// so appending text-xs to a text-sm class would not reliably win.
const linkBase = `rounded font-body text-text-secondary transition-colors hover:text-accent ${focusRing}`
const linkCls = `${linkBase} text-sm`
const smallLinkCls = `${linkBase} text-xs`
const columnHeading = 'font-display text-sm font-bold uppercase tracking-widest'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="connect" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-20">
        <Reveal className="text-center">
          <h2 className="font-display text-4xl font-bold sm:text-5xl">
            Follow the <GradientText>journey</GradientText>
          </h2>
          <p className="mx-auto mt-4 max-w-md font-body text-lg text-text-secondary">
            New builds and breakdowns land on YouTube first — everything else is a click away.
          </p>
          <div className="mt-8 flex justify-center">
            <Magnetic>
              <Button href={`mailto:${EMAIL}`} ariaLabel="Email Ashterisk">
                <Mail size={18} aria-hidden /> Say hello
              </Button>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-12 md:grid-cols-3">
            {/* Brand spans the row on mobile so Explore and Follow sit side by side. */}
            <div className="col-span-2 md:col-span-1">
              <a href={sectionHref('top')} className={`inline-flex items-center gap-2 rounded-full ${focusRing}`}>
                <img src={ash} alt="" className="h-9 w-9 rounded-full object-cover" />
                <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
              </a>
              <p className="mt-3 font-body text-sm text-text-secondary">Build in public. Learn out loud.</p>
            </div>

            <nav aria-label="Explore">
              <h3 className={columnHeading}>Explore</h3>
              <ul className="mt-4 space-y-3">
                {exploreLinks.map((l) => (
                  <li key={l.id}>
                    <a href={sectionHref(l.id)} className={linkCls}>
                      {l.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href="/toolkit/" className={linkCls}>
                    Toolkit
                  </a>
                </li>
              </ul>
            </nav>

            <nav aria-label="Follow">
              <h3 className={columnHeading}>Follow</h3>
              <ul className="mt-4 space-y-3">
                {socialLinks.map((link) => {
                  const Icon = link.icon
                  const external = link.href.startsWith('http')
                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noreferrer' : undefined}
                        className={`inline-flex items-center gap-2 ${linkCls}`}
                      >
                        <span aria-hidden className="text-accent">
                          <Icon size={16} />
                        </span>
                        {link.label}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>
        </Reveal>

        <div className="mt-12 flex flex-col items-center gap-4 border-t border-line pt-6 sm:flex-row sm:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <span className="font-body text-xs text-text-secondary">© {year} Ashterisk</span>
            <nav aria-label="Legal" className="flex items-center gap-x-5">
              <a href="/privacy/" className={smallLinkCls}>
                Privacy Policy
              </a>
              <a href="/terms/" className={smallLinkCls}>
                Terms of Use
              </a>
            </nav>
          </div>
          <a href="#top" className={`inline-flex items-center gap-1 ${smallLinkCls}`}>
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  )
}
