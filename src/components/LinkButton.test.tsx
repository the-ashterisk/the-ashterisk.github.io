import { render, screen } from '@testing-library/react'
import { LinkButton } from './LinkButton'
import type { SocialLink } from '../data/links'

// Mock lucide-react icon
const MockIcon = Object.assign(
  () => <svg data-testid="mock-icon" />,
  { $$typeof: Symbol.for('react.memo') }
) as any

test('renders a social link with label and href', () => {
  const youtube: SocialLink = {
    id: 'youtube',
    label: 'YouTube',
    href: 'https://www.youtube.com/@the.ashterisk',
    icon: MockIcon,
  }
  render(<LinkButton link={youtube} />)
  const anchor = screen.getByRole('link', { name: /youtube/i })
  expect(anchor).toHaveAttribute('href', youtube.href)
})
