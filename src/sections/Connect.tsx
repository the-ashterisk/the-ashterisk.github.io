import { Reveal } from '../motion/Reveal'
import { GradientText } from '../components/GradientText'
import { LinkButton } from '../components/LinkButton'
import { socialLinks } from '../data/links'
import ash from '../assets/ash.png'

export function Connect() {
  return (
    <footer id="connect" className="border-t border-white/5">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            Follow the <GradientText>journey</GradientText>
          </h2>
          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3 sm:grid-cols-4">
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
