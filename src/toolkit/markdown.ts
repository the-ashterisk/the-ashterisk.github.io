import { Marked } from 'marked'

const escapeAttr = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

// Rendered once at build time; the browser never parses markdown.
const marked = new Marked({
  gfm: true,
  renderer: {
    link({ href, title, tokens }) {
      const text = this.parser.parseInline(tokens)
      const external = /^https?:\/\//.test(href)
      const titleAttr = title ? ` title="${escapeAttr(title)}"` : ''
      const target = external ? ' target="_blank" rel="noreferrer"' : ''
      return `<a href="${escapeAttr(href)}"${titleAttr}${target}>${text}</a>`
    },
  },
})

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false })
}
