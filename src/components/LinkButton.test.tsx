import { render, screen } from '@testing-library/react'
import { LinkButton } from './LinkButton'
import { socialLinks } from '../data/links'

test('renders a social link with label and href', () => {
  const youtube = socialLinks.find((l) => l.id === 'youtube')!
  render(<LinkButton link={youtube} />)
  const anchor = screen.getByRole('link', { name: /youtube/i })
  expect(anchor).toHaveAttribute('href', youtube.href)
})
