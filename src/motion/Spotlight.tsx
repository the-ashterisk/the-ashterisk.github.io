import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'
import { usePointerFine } from './usePointerFine'

export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null)
  // Call both hooks unconditionally — && would short-circuit and change hook order.
  const fine = usePointerFine()
  const reduced = usePrefersReducedMotion()
  const enabled = fine && !reduced

  useEffect(() => {
    if (!enabled) return
    const el = ref.current
    const parent = el?.parentElement
    if (!el || !parent) return

    const move = (e: globalThis.MouseEvent) => {
      const r = parent.getBoundingClientRect()
      el.style.transform = `translate(${e.clientX - r.left}px, ${e.clientY - r.top}px) translate(-50%, -50%)`
      el.style.opacity = '1'
    }
    const leave = () => {
      el.style.opacity = '0'
    }
    parent.addEventListener('mousemove', move)
    parent.addEventListener('mouseleave', leave)
    return () => {
      parent.removeEventListener('mousemove', move)
      parent.removeEventListener('mouseleave', leave)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      ref={ref}
      data-testid="spotlight"
      aria-hidden
      className="pointer-events-none absolute left-0 top-0 h-[480px] w-[480px] rounded-full opacity-0 transition-opacity duration-500 will-change-transform"
      style={{ background: 'radial-gradient(circle, rgba(255, 82, 68, 0.1) 0%, transparent 60%)' }}
    />
  )
}
