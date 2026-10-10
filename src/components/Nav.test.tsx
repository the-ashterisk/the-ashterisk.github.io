import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '../theme/ThemeProvider'
import { Nav } from './Nav'

test('shows brand wordmark and a subscribe link to youtube', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByText(/ashterisk/i)).toBeInTheDocument()
  const subscribe = screen.getByRole('link', { name: /subscribe/i })
  expect(subscribe).toHaveAttribute('href', 'https://www.youtube.com/@the.ashterisk')
})

afterEach(() => window.history.pushState({}, '', '/'))

test('section links are page-local on the home page', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
})

test('section links and logo point home from a legal page', () => {
  window.history.pushState({}, '', '/privacy/')
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
  expect(screen.getByRole('link', { name: /ashterisk mascot/i })).toHaveAttribute('href', '/#top')
})

test('connect jumps to the footer on the current page, since every page has one', () => {
  window.history.pushState({}, '', '/privacy/')
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Connect' })).toHaveAttribute('href', '#connect')
})

test('header navigation is named for screen readers', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('navigation', { name: 'Main' })).toBeInTheDocument()
})
