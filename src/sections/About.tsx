import { Reveal } from '../motion/Reveal'
import { GradientText } from '../components/GradientText'
import { DotGrid } from '../components/DotGrid'

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-surface">
      <DotGrid className="opacity-40" />
      <div className="relative mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-bold sm:text-4xl">
            The <GradientText>channel</GradientText>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-6 font-body text-lg leading-relaxed text-text-secondary">
            I'm Akash — a mobile engineer moving into AI systems engineering. Ashterisk is where I
            document that transition in the open: real AI project builds, honest tool reviews, and the
            lessons in between. No polished-guru act — just the work, as it happens.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 font-display text-xl font-medium">
            Build in public. Learn out loud.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
