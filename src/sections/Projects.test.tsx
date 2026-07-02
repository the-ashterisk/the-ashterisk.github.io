import { render, screen } from '@testing-library/react'
import { Projects } from './Projects'
import { projects } from '../data/projects'

test('renders a card per project with a github link', () => {
  render(<Projects />)
  for (const p of projects) {
    expect(screen.getByText(p.title)).toBeInTheDocument()
  }
  const githubLinks = screen.getAllByRole('link', { name: /view on github/i })
  expect(githubLinks).toHaveLength(projects.length)
})
