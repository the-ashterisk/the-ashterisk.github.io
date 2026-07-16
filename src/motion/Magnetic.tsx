import { useRef, type MouseEvent, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import { usePointerFine } from './usePointerFine'

interface MagneticProps {
  children: ReactNode
  strength?: number
  className?: string
}

export function Magnetic({ children, strength = 18, className = '' }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Call both hooks unconditionally — && would short-circuit and change hook order.
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1)) * strength
    const y = ((e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1)) * strength
    el.style.transform = `translate(${x}px, ${y}px)`
  }

  const onMouseLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  if (!enabled) return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      data-testid="magnetic"
      className={`magnetic ${className}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
}
