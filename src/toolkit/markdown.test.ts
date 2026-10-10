import { renderMarkdown } from './markdown'

test('renders headings, lists and task-list checkboxes', () => {
  const html = renderMarkdown('# Title\n\n1. one\n2. two\n\n- [ ] check\n')
  expect(html).toContain('<h1>Title</h1>')
  expect(html).toContain('<ol>')
  expect(html).toMatch(/<input[^>]*type="checkbox"/)
})

test('external links open in a new tab; internal ones stay put', () => {
  expect(renderMarkdown('[x](https://example.org)')).toContain(
    '<a href="https://example.org" target="_blank" rel="noreferrer">x</a>',
  )
  expect(renderMarkdown('[y](/toolkit/)')).toContain('<a href="/toolkit/">y</a>')
})

test('single line breaks are kept, as the files are written line by line', () => {
  expect(renderMarkdown('**Ask what is wrong.**\n"List the problems first."')).toContain('<br>')
})
