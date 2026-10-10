import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'
import { Magnetic } from '../motion/Magnetic'
import { useScrollDirection } from '../motion/useScrollDirection'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import { sectionHref } from '../lib/sectionHref'
import ash from '../assets/ash.png'

// Projects/About live only on the home page; the footer (#connect) is on every page.
const anchors = [
  { label: 'Projects', href: () => sectionHref('projects') },
  { label: 'About', href: () => sectionHref('about') },
  { label: 'Connect', href: () => '#connect' },
]

export function Nav() {
  const dir = useScrollDirection()
  const reduced = usePrefersReducedMotion()
  const hidden = !reduced && dir === 'down'

  return (
    <header
      className={`sticky top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-md transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a
          href={sectionHref('top')}
          className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <img src={ash} alt="Ashterisk mascot" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {anchors.map((a) => (
            <a
              key={a.label}
              href={a.href()}
              className="relative rounded font-body text-sm text-text-secondary transition-colors after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:text-text hover:after:scale-x-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {a.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Magnetic className="hidden sm:inline-block">
            <Button href="https://www.youtube.com/@the.ashterisk" className="px-5 py-2 text-sm">
              Subscribe
            </Button>
          </Magnetic>
        </div>
      </nav>
    </header>
  )
}
