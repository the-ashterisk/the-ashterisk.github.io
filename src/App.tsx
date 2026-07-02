import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'

export default function App() {
  return (
    <div id="top" data-testid="app-root">
      <Nav />
      <main>
        <Hero />
      </main>
    </div>
  )
}
