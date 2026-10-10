import path from 'node:path'
import { runnerImport, type Plugin } from 'vite'

// Prerenders the /free hub, each freebie page, the raw .md files, the short-link
// redirects and 404.html as real static files. GitHub Pages has no rewrites, and
// link previews (Instagram DMs, WhatsApp, X) read raw HTML without running JS.
// The pages themselves are built by src/free/pages.tsx; this plugin only wires
// them into `vite build` (emitted assets) and `vite dev` (middleware).

export const FREE_CLIENT_ENTRY = 'src/free/client.ts'
const PAGES_MODULE = 'src/free/pages.tsx'

interface StaticFile {
  fileName: string
  source: string
}
interface PagesModule {
  buildPages(assetTags: string): StaticFile[]
}

/** Request path → emitted file, mirroring how GitHub Pages resolves directories. */
function requestToFile(url: string): string {
  const clean = decodeURIComponent(url.split(/[?#]/)[0]).replace(/^\/+/, '')
  if (clean === '' || clean.endsWith('/')) return `${clean}index.html`
  if (path.extname(clean)) return clean
  return `${clean}/index.html`
}

export function freePages(): Plugin {
  let root = process.cwd()

  return {
    name: 'ashterisk-free-pages',
    configResolved(config) {
      root = config.root
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const fileName = requestToFile(req.url ?? '/')
        // Only page and .md requests; skip Vite internals and source modules.
        if (fileName === 'index.html' || !/\.(html|md)$/.test(fileName) || /^(@|src\/|node_modules\/)/.test(fileName)) {
          return next()
        }
        try {
          const { buildPages } = (await server.ssrLoadModule(`/${PAGES_MODULE}`)) as PagesModule
          const file = buildPages(`<script type="module" src="/${FREE_CLIENT_ENTRY}"></script>`).find(
            (f) => f.fileName === fileName,
          )
          if (!file) return next()
          if (fileName.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html; charset=utf-8')
            res.end(await server.transformIndexHtml(req.url ?? '/', file.source))
          } else {
            res.setHeader('Content-Type', 'text/markdown; charset=utf-8')
            res.end(file.source)
          }
        } catch (err) {
          next(err)
        }
      })
    },

    async generateBundle(_options, bundle) {
      const entry = Object.values(bundle).find(
        (out) => out.type === 'chunk' && out.isEntry && out.facadeModuleId?.endsWith(FREE_CLIENT_ENTRY),
      )
      if (!entry || entry.type !== 'chunk') {
        this.error(`free pages: ${FREE_CLIENT_ENTRY} must be a build.rollupOptions.input entry`)
      }
      const css = [...(entry.viteMetadata?.importedCss ?? [])]
      if (css.length === 0) this.error('free pages: no CSS emitted for the client entry')
      const assetTags = [
        ...css.map((f) => `<link rel="stylesheet" crossorigin href="/${f}" />`),
        `<script type="module" crossorigin src="/${entry.fileName}"></script>`,
      ].join('\n    ')

      // Load the page builder through Vite so it gets TSX, import.meta.glob and ?raw.
      const { module } = await runnerImport<PagesModule>(path.join(root, PAGES_MODULE), {
        configFile: false,
        root,
        logLevel: 'warn',
      })
      for (const file of module.buildPages(assetTags)) {
        this.emitFile({ type: 'asset', fileName: file.fileName, source: file.source })
      }
    },
  }
}
