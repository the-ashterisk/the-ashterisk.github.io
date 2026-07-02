import { motion } from 'framer-motion'
import { Sparkles, Bot, Code2, Smartphone } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { Button } from '../components/Button'
import { GradientText } from '../components/GradientText'
import { LinkButton } from '../components/LinkButton'
import { DotGrid } from '../components/DotGrid'
import { FloatingBadge } from '../components/FloatingBadge'
import { socialLinks } from '../data/links'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import ash from '../assets/ash.png'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  const motionProps = reduced
    ? {}
    : { variants: container, initial: 'hidden' as const, animate: 'show' as const }
  const childProps = reduced ? {} : { variants: item }

  return (
    <section className="relative overflow-hidden">
      <DotGrid className="opacity-60" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
        <motion.div {...motionProps}>
          <motion.span
            {...childProps}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent-light/40 px-4 py-1.5 font-body text-sm text-text-secondary"
          >
            <span className="text-accent">*</span> Android engineer → AI systems engineer
          </motion.span>

          <motion.h1 {...childProps} className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            I build AI projects <GradientText>in public</GradientText> and{' '}
            <GradientText>learn out loud</GradientText>.
          </motion.h1>

          <motion.p {...childProps} className="mt-6 max-w-md font-body text-lg text-text-secondary">
            AI build breakdowns, tool reviews, and one engineer's jump from Android to AI systems —
            documented as it happens.
          </motion.p>

          <motion.div {...childProps} className="mt-8 flex flex-wrap gap-4">
            <Button href="https://www.youtube.com/@the.ashterisk">Watch on YouTube</Button>
            <Button href="#projects" variant="outline">View Projects</Button>
          </motion.div>

          <motion.div {...childProps} className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {socialLinks.map((link) => (
              <LinkButton key={link.id} link={link} />
            ))}
          </motion.div>
        </motion.div>

        <div className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div className="absolute inset-4 overflow-hidden rounded-full border-4 border-accent/40">
            <img src={ash} alt="Ash, the Ashterisk mascot" className="h-full w-full object-cover" />
          </div>
          <FloatingBadge className="right-0 top-6" delay={0}>
            <Bot size={22} className="text-accent" />
          </FloatingBadge>
          <FloatingBadge className="left-0 top-1/3" delay={0.8}>
            <Smartphone size={22} className="text-accent" />
          </FloatingBadge>
          <FloatingBadge className="bottom-8 right-4" delay={1.6}>
            <Code2 size={22} className="text-accent" />
          </FloatingBadge>
          <FloatingBadge className="bottom-0 left-8" delay={2.2}>
            <SiGithub size={22} className="text-accent" />
          </FloatingBadge>
          <FloatingBadge className="left-1/2 top-0" delay={1.2}>
            <Sparkles size={22} className="text-accent" />
          </FloatingBadge>
        </div>
      </div>
    </section>
  )
}
