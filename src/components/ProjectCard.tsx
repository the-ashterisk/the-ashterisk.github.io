import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import type { Project } from '../data/projects'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex h-full flex-col rounded-2xl border border-white/10 bg-surface p-6"
    >
      <h3 className="font-display text-xl font-bold">{project.title}</h3>
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
          className="inline-flex items-center gap-2 font-display text-sm font-medium hover:text-accent"
        >
          <SiGithub size={16} /> View on GitHub
        </a>
        {project.videoUrl && (
          <a
            href={project.videoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-display text-sm font-medium text-text-secondary hover:text-accent"
          >
            <Play size={16} /> Watch the build
          </a>
        )}
      </div>
    </motion.article>
  )
}
