import { Button } from './Button'
import { ThemeToggle } from './ThemeToggle'
import ash from '../assets/ash.png'

const anchors = [
  { label: 'Projects', href: '#projects' },
  { label: 'About', href: '#about' },
  { label: 'Connect', href: '#connect' },
]

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-bg/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <img src={ash} alt="Ashterisk mascot" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display text-lg font-bold tracking-widest">ashterisk</span>
        </a>
        <div className="hidden items-center gap-8 md:flex">
          {anchors.map((a) => (
            <a key={a.href} href={a.href} className="font-body text-sm text-text-secondary transition-colors hover:text-text">
              {a.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button href="https://www.youtube.com/@the.ashterisk" className="hidden px-5 py-2 text-sm sm:inline-flex">
            Subscribe
          </Button>
        </div>
      </nav>
    </header>
  )
}
