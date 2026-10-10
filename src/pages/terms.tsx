import { renderPage } from './renderPage.tsx'
import { LegalLayout } from './LegalLayout.tsx'
import { termsOfUse } from '../data/legal.ts'

renderPage(<LegalLayout doc={termsOfUse} />)
