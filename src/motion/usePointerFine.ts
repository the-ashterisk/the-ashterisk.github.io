import { useEffect, useState } from 'react'

export function usePointerFine(): boolean {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setFine(mq.matches)
    const handler = (e: MediaQueryListEvent) => setFine(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return fine
}
