import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'

export default function App() {
  return (
    <div id="top" data-testid="app-root">
      <Nav />
      <main>
        <Hero />
        <Projects />
      </main>
    </div>
  )
}
