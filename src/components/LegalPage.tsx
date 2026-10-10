import type { LegalDoc } from '../data/legal'

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">{doc.title}</h1>
      <p className="mt-3 font-body text-sm text-text-secondary">Last updated: {doc.lastUpdated}</p>
      <p className="mt-8 font-body text-lg leading-relaxed text-text-secondary">{doc.intro}</p>
      {doc.sections.map((section) => (
        <section key={section.id} aria-labelledby={section.id} className="mt-12">
          <h2 id={section.id} className="scroll-mt-24 font-display text-2xl font-bold">
            {section.heading}
          </h2>
          {section.paragraphs.map((p, i) => (
            <p key={i} className="mt-4 font-body leading-relaxed text-text-secondary">
              {p}
            </p>
          ))}
        </section>
      ))}
    </article>
  )
}
