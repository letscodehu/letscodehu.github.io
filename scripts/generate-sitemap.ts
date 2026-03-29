import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_ORIGIN } from '../src/site'
import { getPrerenderPathnames } from '../src/seo/prerender-paths'

const distDir = resolve(import.meta.dirname, '..', 'dist')
const urls = getPrerenderPathnames()

const body = urls
  .map((pathname) => `  <url><loc>${SITE_ORIGIN}${pathname}</loc></url>`)
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(resolve(distDir, 'sitemap.xml'), xml, 'utf8')
