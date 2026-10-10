import { motion } from 'framer-motion'
import { Sparkles, Bot, Code2, Smartphone } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { Button } from '../components/Button'
import { GradientText } from '../components/GradientText'
import { LinkButton } from '../components/LinkButton'
import { DotGrid } from '../components/DotGrid'
import { FloatingBadge } from '../components/FloatingBadge'
import { Magnetic } from '../motion/Magnetic'
import { Spotlight } from '../motion/Spotlight'
import { ParallaxTilt } from '../motion/ParallaxTilt'
import { shouldShowPreloader } from '../motion/Preloader'
import { socialLinks } from '../data/links'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import ash from '../assets/ash.png'

const EASE = [0.22, 1, 0.36, 1] as const

const line = {
  hidden: { y: '110%' },
  show: { y: '0%', transition: { duration: 0.9, ease: EASE } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
}

export function Hero() {
  const reduced = usePrefersReducedMotion()
  // Wait for the preloader curtain before starting the entrance.
  const introDelay = shouldShowPreloader() ? 1.3 : 0.1

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: introDelay } },
  }
  const motionProps = reduced
    ? {}
    : { variants: container, initial: 'hidden' as const, animate: 'show' as const }
  const childProps = reduced ? {} : { variants: item }
  const lineProps = reduced ? {} : { variants: line }

  const headlineLines = [
    <>I build AI projects</>,
    <>
      <GradientText>in public</GradientText> and
    </>,
    <>
      <GradientText>learn out loud</GradientText>.
    </>,
  ]

  return (
    <section className="relative overflow-hidden">
      <DotGrid className="opacity-60" />
      <Spotlight />
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 md:grid-cols-2 md:py-24">
        <motion.div {...motionProps}>
          <motion.span
            {...childProps}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-line bg-surface py-1.5 pl-3 pr-4 font-body text-sm text-text-secondary"
          >
            {/* Live-status dot; the ping ring is skipped under reduced motion. */}
            <span aria-hidden className="relative flex h-2 w-2">
              {!reduced && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span>
              Mobile engineer, now building <span className="font-medium text-text">AI systems</span>
            </span>
          </motion.span>

          <h1 className="font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            {headlineLines.map((content, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span {...lineProps} className="block will-change-transform">
                  {content}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p {...childProps} className="mt-6 max-w-md font-body text-lg text-text-secondary">
            AI build breakdowns, tool reviews, and one engineer's jump from mobile to AI systems —
            documented as it happens.
          </motion.p>

          <motion.div {...childProps} className="mt-8 flex flex-wrap gap-4">
            <Magnetic>
              <Button href="https://www.youtube.com/@the.ashterisk">Watch on YouTube</Button>
            </Magnetic>
            <Magnetic>
              <Button href="#projects" variant="outline">View Projects</Button>
            </Magnetic>
          </motion.div>

          <motion.div {...childProps} className="mt-10 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <LinkButton key={link.id} link={link} />
            ))}
          </motion.div>
        </motion.div>

        <ParallaxTilt className="relative mx-auto aspect-square w-full max-w-sm">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-3xl" aria-hidden />
          <div
            className="absolute inset-4 overflow-hidden rounded-full border-4 border-accent/40 will-change-transform"
            style={{
              transform:
                'perspective(600px) rotateY(calc(var(--px, 0) * 7deg)) rotateX(calc(var(--py, 0) * -7deg))',
              transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <img src={ash} alt="Ash, the Ashterisk mascot" className="h-full w-full object-cover" />
          </div>
          <FloatingBadge className="right-0 top-6" delay={0} depth={1.6}>
            <Bot size={22} className="text-accent" aria-hidden />
          </FloatingBadge>
          <FloatingBadge className="left-0 top-1/3" delay={0.8} depth={1}>
            <Smartphone size={22} className="text-accent" aria-hidden />
          </FloatingBadge>
          <FloatingBadge className="bottom-8 right-4" delay={1.6} depth={1.2}>
            <Code2 size={22} className="text-accent" aria-hidden />
          </FloatingBadge>
          <FloatingBadge className="bottom-0 left-8" delay={2.2} depth={0.8}>
            <SiGithub size={22} className="text-accent" aria-hidden />
          </FloatingBadge>
          <FloatingBadge className="left-1/2 top-0" delay={1.2} depth={1.4}>
            <Sparkles size={22} className="text-accent" aria-hidden />
          </FloatingBadge>
        </ParallaxTilt>
      </div>
    </section>
  )
}
