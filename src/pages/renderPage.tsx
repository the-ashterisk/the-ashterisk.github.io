import { StrictMode, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '../theme/ThemeProvider'
import { SmoothScroll } from '../motion/SmoothScroll'
import { initAnalytics } from '../lib/analytics'
import '../index.css'

// Every HTML entry (home, /privacy/, /terms/) mounts through here so they
// share theme, smooth scroll, and global styles.
export function renderPage(node: ReactNode): void {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ThemeProvider>
        <SmoothScroll>{node}</SmoothScroll>
      </ThemeProvider>
    </StrictMode>,
  )
  initAnalytics()
}
