import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { About } from './sections/About'
import { Connect } from './sections/Connect'

export default function App() {
  return (
    <div id="top" data-testid="app-root">
      <Nav />
      <main>
        <Hero />
        <Projects />
        <About />
      </main>
      <Connect />
    </div>
  )
}
