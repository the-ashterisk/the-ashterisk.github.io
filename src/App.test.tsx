import { render, screen } from '@testing-library/react'
import App from './App'
import { ThemeProvider } from './theme/ThemeProvider'

test('renders app root', () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>,
  )
  expect(screen.getByTestId('app-root')).toBeInTheDocument()
})
