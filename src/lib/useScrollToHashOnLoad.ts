import { useEffect } from 'react'

// Arriving at /#projects from another page: the browser's native fragment
// scroll can run before React has rendered the target, so retry once mounted.
export function useScrollToHashOnLoad(): void {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    document.getElementById(id)?.scrollIntoView()
  }, [])
}
