import { useEffect, type ReactNode } from 'react'
import Lenis from 'lenis'
import { usePrefersReducedMotion } from '../theme/useReducedMotion'

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true, anchors: true })
    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)
    return () => {
      cancelAnimationFrame(frame)
      lenis.destroy()
    }
  }, [reduced])

  return <>{children}</>
}
