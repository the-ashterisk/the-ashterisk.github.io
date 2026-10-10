import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { LegalLayout } from './LegalLayout'
import { termsOfUse } from '../data/legal'

afterEach(() => window.history.pushState({}, '', '/'))

test('wraps the document with nav, footer and a #top anchor', () => {
  window.history.pushState({}, '', '/terms/')
  const { container } = render(
    <ThemeProvider>
      <LegalLayout doc={termsOfUse} />
    </ThemeProvider>,
  )
  expect(container.querySelector('#top')).not.toBeNull()
  expect(screen.getByRole('heading', { level: 1, name: 'Terms of Use' })).toBeInTheDocument()
  expect(screen.getByRole('main')).toBeInTheDocument()
  expect(screen.getByRole('contentinfo')).toBeInTheDocument() // <footer>
  for (const link of screen.getAllByRole('link', { name: 'Projects' })) {
    expect(link).toHaveAttribute('href', '/#projects')
  }
  expect(screen.queryByTestId('preloader')).toBeNull()
})
