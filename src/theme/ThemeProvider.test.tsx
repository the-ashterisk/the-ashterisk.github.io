import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from './ThemeProvider'

function Probe() {
  const { theme, toggleTheme } = useTheme()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.remove('dark')
})

test('defaults to dark and sets the dark class', () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  )
  expect(screen.getByTestId('theme')).toHaveTextContent('dark')
  expect(document.documentElement).toHaveClass('dark')
})

test('toggles to light, removes dark class, and persists', async () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  )
  await act(async () => {
    await userEvent.click(screen.getByText('toggle'))
  })
  expect(screen.getByTestId('theme')).toHaveTextContent('light')
  expect(document.documentElement).not.toHaveClass('dark')
  expect(localStorage.getItem('ashterisk-theme')).toBe('light')
})
