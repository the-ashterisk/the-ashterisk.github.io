import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'

interface FloatingBadgeProps {
  children: ReactNode
  className?: string
  delay?: number
  depth?: number
}

export function FloatingBadge({ children, className = '', delay = 0, depth = 1 }: FloatingBadgeProps) {
  const reduced = usePrefersReducedMotion()
  const cls = `absolute grid h-12 w-12 place-items-center rounded-xl border border-line bg-surface shadow-lg ${className}`
  if (reduced) return <div className={cls}>{children}</div>
  return (
    <motion.div
      className={cls}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
      style={{
        // Drift with the cursor via ParallaxTilt's --px/--py; deeper badges move more.
        translateX: `calc(var(--px, 0) * ${depth * 6}px)`,
        transition: 'translate 0.4s cubic-bezier(0.22, 1, 0.36, 1)',
      }}
    >
      {children}
    </motion.div>
  )
}
