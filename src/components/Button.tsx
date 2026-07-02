import type { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  href?: string
  variant?: 'primary' | 'outline'
  className?: string
  ariaLabel?: string
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-display font-medium transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent'

const variants = {
  primary: 'bg-accent text-white hover:brightness-110',
  outline: 'border border-white/20 text-text hover:border-accent',
}

export function Button({ children, href, variant = 'primary', className = '', ariaLabel }: ButtonProps) {
  const cls = `${base} ${variants[variant]} ${className}`
  if (href) {
    return (
      <a href={href} className={cls} aria-label={ariaLabel} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} aria-label={ariaLabel}>
      {children}
    </button>
  )
}
