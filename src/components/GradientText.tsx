import type { ReactNode } from 'react'

export function GradientText({ children }: { children: ReactNode }) {
  return (
    <span className="bg-gradient-to-r from-accent to-[#ff9a5c] bg-clip-text text-transparent">
      {children}
    </span>
  )
}
