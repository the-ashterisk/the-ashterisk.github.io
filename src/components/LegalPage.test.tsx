import { render, screen } from '@testing-library/react'
import { LegalPage } from './LegalPage'
import { privacyPolicy } from '../data/legal'

test('renders title, last-updated date, intro and every section', () => {
  render(<LegalPage doc={privacyPolicy} />)
  expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
  expect(screen.getByText(`Last updated: ${privacyPolicy.lastUpdated}`)).toBeInTheDocument()
  expect(screen.getByText(privacyPolicy.intro)).toBeInTheDocument()
  for (const s of privacyPolicy.sections) {
    const heading = screen.getByRole('heading', { level: 2, name: s.heading })
    expect(heading).toHaveAttribute('id', s.id)
    expect(screen.getByRole('region', { name: s.heading })).toBeInTheDocument()
  }
})
