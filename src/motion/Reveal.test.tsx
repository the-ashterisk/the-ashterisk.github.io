import { render, screen } from '@testing-library/react'
import { Reveal } from './Reveal'

test('renders its children', () => {
  render(<Reveal>hello world</Reveal>)
  expect(screen.getByText('hello world')).toBeInTheDocument()
})
