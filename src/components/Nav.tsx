import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'
import { Magnetic } from '../motion/Magnetic'
import { useScrollDirection } from '../motion/useScrollDirection'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import { sectionHref } from '../lib/sectionHref'
import ash from '../assets/ash.png'

// Projects/About live only on the home page; the footer (#connect) is on every page;
// The toolkit is its own static section at /toolkit/.
const anchors = [
  { label: 'Projects', href: () => sectionHref('projects') },
  { label: 'About', href: () => sectionHref('about') },
  { label: 'Toolkit', href: () => '/toolkit/' },
  { label: 'Connect', href: () => '#connect' },
]

const YOUTUBE_SUBSCRIBE = 'https://www.youtube.com/@the.ashterisk'
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

export function Nav() {
  const dir = useScrollDirection()
  const reduced = usePrefersReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  // Keep the header in view while the mobile menu is open.
  const hidden = !reduced && dir === 'down' && !menuOpen

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav aria-label="Main" className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-3">
          <a href={sectionHref('top')} className={`flex items-center gap-2 rounded-full ${focusRing}`}>
            <img src={ash} alt="Ashterisk mascot" className="h-9 w-9 rounded-full object-cover" />
            <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
          </a>
          <div className="hidden items-center gap-8 md:flex">
            {anchors.map((a) => (
              <a
                key={a.label}
                href={a.href()}
                className={`relative rounded font-body text-sm text-text-secondary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-text hover:after:scale-x-100 ${focusRing}`}
              >
                {a.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Magnetic className="hidden sm:inline-block">
              <Button href={YOUTUBE_SUBSCRIBE} className="px-5 py-2 text-sm">
                Subscribe
              </Button>
            </Magnetic>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className={`grid h-10 w-10 place-items-center rounded-full border border-line bg-surface text-text transition-colors hover:border-accent md:hidden ${focusRing}`}
            >
              {menuOpen ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div id="mobile-menu" className="border-t border-line py-2 md:hidden">
            <ul>
              {anchors.map((a) => (
                <li key={a.label}>
                  <a
                    href={a.href()}
                    onClick={closeMenu}
                    className={`flex min-h-[44px] items-center rounded font-display text-base font-medium text-text-secondary transition-colors hover:text-accent ${focusRing}`}
                  >
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="pb-3 pt-2 sm:hidden">
              <Button href={YOUTUBE_SUBSCRIBE} className="w-full px-5 py-2 text-sm">
                Subscribe
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
