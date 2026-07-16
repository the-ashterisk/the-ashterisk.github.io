import { motion } from 'framer-motion'
import type { SocialLink } from '../data/links'

export function LinkButton({ link }: { link: SocialLink }) {
  const Icon = link.icon
  const external = link.href.startsWith('http')
  return (
    <motion.a
      href={link.href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      aria-label={link.label}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-5 py-4 font-display font-medium text-text transition-colors hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Icon size={22} className="shrink-0 text-accent" />
      <span>{link.label}</span>
    </motion.a>
  )
}
