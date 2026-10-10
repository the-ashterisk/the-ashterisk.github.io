import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('links to the toolkit', () => {
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  expect(screen.getByRole('link', { name: 'Toolkit' })).toHaveAttribute('href', '/toolkit/')
})

test('mobile menu toggles the section links and closes on Escape or a link tap', async () => {
  const user = userEvent.setup()
  render(
    <ThemeProvider>
      <Nav />
    </ThemeProvider>,
  )
  const toggle = screen.getByRole('button', { name: 'Open menu' })
  expect(toggle).toHaveAttribute('aria-expanded', 'false')
  expect(document.getElementById('mobile-menu')).toBeNull()

  await user.click(toggle)
  expect(screen.getByRole('button', { name: 'Close menu' })).toHaveAttribute('aria-expanded', 'true')
  const menu = document.getElementById('mobile-menu')!
  expect(within(menu).getByRole('link', { name: 'Toolkit' })).toHaveAttribute('href', '/toolkit/')

  await user.keyboard('{Escape}')
  expect(document.getElementById('mobile-menu')).toBeNull()

  await user.click(screen.getByRole('button', { name: 'Open menu' }))
  await user.click(within(document.getElementById('mobile-menu')!).getByRole('link', { name: 'About' }))
  expect(document.getElementById('mobile-menu')).toBeNull()
})
