import { Nav } from '../components/Nav'
import { LegalPage } from '../components/LegalPage'
import { Footer } from '../sections/Footer'
import type { LegalDoc } from '../data/legal'

export function LegalLayout({ doc }: { doc: LegalDoc }) {
  return (
    <div id="top">
      <Nav />
      <main>
        <LegalPage doc={doc} />
      </main>
      <Footer />
    </div>
  )
}
