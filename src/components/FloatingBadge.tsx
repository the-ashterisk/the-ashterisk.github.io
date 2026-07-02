import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'

interface FloatingBadgeProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function FloatingBadge({ children, className = '', delay = 0 }: FloatingBadgeProps) {
  const reduced = usePrefersReducedMotion()
  const cls = `absolute grid h-12 w-12 place-items-center rounded-xl border border-white/10 bg-surface shadow-lg ${className}`
  if (reduced) return <div className={cls}>{children}</div>
  return (
    <motion.div
      className={cls}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  )
}
