import { useEffect } from 'react'

// Arriving at /#projects from another page: the browser's native fragment
// scroll can run before React has rendered the target, so retry once mounted.
export function useScrollToHashOnLoad(): void {
  useEffect(() => {
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
