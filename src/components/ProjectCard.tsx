import { Play, ArrowUpRight } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import type { Project } from '../data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-6 transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:border-accent/40 hover:shadow-[0_16px_40px_-16px_rgba(255,82,68,0.35)]">
      <h3 className="flex items-start justify-between gap-2 font-display text-xl font-bold">
        {project.title}
        <ArrowUpRight
          size={18}
          aria-hidden
          className="mt-1 shrink-0 text-text-secondary transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
        />
      </h3>
      <p className="mt-3 flex-1 font-body text-text-secondary">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-accent-light/40 px-3 py-1 font-body text-xs text-accent">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-5 flex gap-4">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded font-display text-sm font-medium hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <SiGithub size={16} /> View on GitHub
        </a>
        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded font-display text-sm font-medium text-text-secondary hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Play size={16} /> Watch the build
          </a>
        )}
      </div>
    </article>
  )
}
