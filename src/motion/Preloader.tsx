import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const KEY = 'ashterisk-preloader-shown'
const EASE = [0.22, 1, 0.36, 1] as const

export function shouldShowPreloader(): boolean {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  // Arriving at a specific section (e.g. /#projects from a legal page): don't
  // hold the visitor behind the intro.
  if (window.location.hash) return false
  try {
    return sessionStorage.getItem(KEY) === null
  } catch {
    return false
  }
}

export function Preloader() {
  const [show, setShow] = useState(() => shouldShowPreloader())

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      // private browsing — showing it every load is fine
    }
    const t = setTimeout(() => setShow(false), 1100)
    return () => clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          data-testid="preloader"
          aria-hidden
          className="fixed inset-0 z-[100] grid place-items-center bg-bg"
          exit={{ y: '-100%' }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-3 font-display text-2xl font-bold tracking-widest"
          >
            <motion.span
              className="text-4xl text-accent"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              *
            </motion.span>
            ashterisk
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
