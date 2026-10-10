import { useEffect } from 'react'

// Back/forward and reload restore the visitor's previous scroll position;
// jumping to the hash then would undo it.
function isRestoredNavigation(): boolean {
  const [nav] = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[]
  return nav?.type === 'reload' || nav?.type === 'back_forward'
}

// Arriving at /#projects from another page: the browser's native fragment
// scroll can run before React has rendered the target, so retry once mounted.
export function useScrollToHashOnLoad(): void {
  useEffect(() => {
    if (isRestoredNavigation()) return
    const raw = window.location.hash.slice(1)
    if (!raw) return
    let id = raw
    try {
      id = decodeURIComponent(raw)
    } catch {
      // Malformed escape (e.g. a mangled share link) — fall back to the raw hash.
    }
    document.getElementById(id)?.scrollIntoView()
  }, [])
}
