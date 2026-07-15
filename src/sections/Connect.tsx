import { Mail } from 'lucide-react'
import { Reveal } from '../motion/Reveal'
import { GradientText } from '../components/GradientText'
import { LinkButton } from '../components/LinkButton'
import { Button } from '../components/Button'
import { Magnetic } from '../motion/Magnetic'
import { socialLinks, EMAIL } from '../data/links'
import ash from '../assets/ash.png'

export function Connect() {
  return (
    <footer id="connect" className="border-t border-line">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
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
          <div className="mx-auto mt-10 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
            {socialLinks.map((link) => (
              <LinkButton key={link.id} link={link} />
            ))}
          </div>
          <div className="mt-12 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <img src={ash} alt="Ashterisk mascot" className="h-8 w-8 rounded-full object-cover" />
              <span className="font-display font-bold tracking-widest">ashterisk</span>
            </div>
            <p className="font-body text-sm text-text-secondary">Build in public. Learn out loud.</p>
            <p className="mt-4 font-body text-xs text-text-secondary">
              © {new Date().getFullYear()} Ashterisk
            </p>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
