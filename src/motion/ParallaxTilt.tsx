import { useRef, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import { usePointerFine } from './usePointerFine'

interface ParallaxTiltProps {
  children: ReactNode
  className?: string
}

const clamp = (v: number) => Math.max(-1.2, Math.min(1.2, v))

// Sets --px/--py (normalized cursor offset) on the zone; children consume
// the vars in their own transforms so one listener drives every layer.
export function ParallaxTilt({ children, className = '' }: ParallaxTiltProps) {
  const ref = useRef<HTMLDivElement>(null)
  // Call both hooks unconditionally — && would short-circuit and change hook order.
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', String(clamp((e.clientX - (r.left + r.width / 2)) / Math.max(r.width, 1))))
    el.style.setProperty('--py', String(clamp((e.clientY - (r.top + r.height / 2)) / Math.max(r.height, 1))))
  }

  const onMouseLeave = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--px', '0')
    el.style.setProperty('--py', '0')
  }

  if (!enabled) return <div className={className}>{children}</div>

  return (
    <div
      ref={ref}
      data-testid="parallax-zone"
      className={className}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ '--px': 0, '--py': 0 } as CSSProperties}
    >
      {children}
    </div>
  )
}
