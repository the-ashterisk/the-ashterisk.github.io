import { renderPage } from './renderPage.tsx'
import { LegalLayout } from './LegalLayout.tsx'
import { privacyPolicy } from '../data/legal.ts'

renderPage(<LegalLayout doc={privacyPolicy} />)
