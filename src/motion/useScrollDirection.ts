import { useEffect, useState } from 'react'

export function useScrollDirection(threshold = 8): 'up' | 'down' {
  const [dir, setDir] = useState<'up' | 'down'>('up')

  useEffect(() => {
    let last = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      if (Math.abs(y - last) < threshold) return
      setDir(y > last && y > 80 ? 'down' : 'up')
      last = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return dir
}
