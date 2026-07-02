import { Reveal } from '../motion/Reveal'
import { GradientText } from '../components/GradientText'
import { ProjectCard } from '../components/ProjectCard'
import { projects } from '../data/projects'

export function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-6xl px-5 py-20">
      <Reveal>
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Things I've <GradientText>built</GradientText>
        </h2>
        <p className="mt-3 max-w-lg font-body text-text-secondary">
          Open-source experiments from my AI systems journey. Code on GitHub, breakdowns on the channel.
        </p>
      </Reveal>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}
