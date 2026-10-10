import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { About } from './sections/About'
import { Connect } from './sections/Connect'
import { Preloader } from './motion/Preloader'
import { useScrollToHashOnLoad } from './lib/useScrollToHashOnLoad'

export default function App() {
  useScrollToHashOnLoad()

  return (
    <div id="top" data-testid="app-root">
      <Preloader />
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
