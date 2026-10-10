import { expect, test } from 'vitest'
import { entryAssetTags } from './toolkitPages.ts'

test('toolkit pages preload the client entry’s shared chunks so they load in parallel', () => {
  const tags = entryAssetTags({
    fileName: 'assets/toolkit-abc.js',
    imports: ['assets/analytics-def.js'],
    css: ['assets/toolkit-ghi.css'],
  })
  expect(tags).toBe(
    [
      '<link rel="stylesheet" crossorigin href="/assets/toolkit-ghi.css" />',
      '<script type="module" crossorigin src="/assets/toolkit-abc.js"></script>',
      '<link rel="modulepreload" crossorigin href="/assets/analytics-def.js" />',
    ].join('\n    '),
  )
})

test('no shared chunks, no preload tags', () => {
  const tags = entryAssetTags({ fileName: 'assets/toolkit-abc.js', imports: [], css: ['assets/t.css'] })
  expect(tags).not.toContain('modulepreload')
})
