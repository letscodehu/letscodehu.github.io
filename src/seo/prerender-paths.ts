import { blogPostManifest } from '../data/blog-post-manifest'
import { caseStudies } from '../data/case-studies'
import { archivePostsManifest } from '../data/archive-posts-data'
import { archiveRedirects } from '../data/archive-redirects'

const LANGS = ['en', 'hu'] as const

const STATIC_SEGMENTS = [
  'training',
  'training/workshop-budapest',
  'training/workshop-terms',
  'training/workshop-adr',
  'consulting',
  'ai-consulting',
  'about',
  'contact',
  'contact/ai',
  'blog',
  'privacy',
] as const

/** Hungarian vanity URLs that mirror STATIC_SEGMENTS (for static HTML on each path). */
/** HU vanity URLs; `/hu/adatkezeles` is already emitted from the main HU loop (privacy segment). */
const HU_STATIC_ALIASES: string[] = [
  'kepzes',
  'kepzes/workshop-budapest',
  'kepzes/workshop-terms',
  'kepzes/workshop-adr',
  'tanacsadas',
  'ai-tanacsadas',
  'rolam',
  'kapcsolat',
  'kapcsolat/ai',
  'cikkek',
  'quiz',
  'slack',
  'blog/archiv',
]

/**
 * Indexable pathnames: prerendered (vite-ssg) and listed in the sitemap.
 * HU privacy is only `/hu/adatkezeles`, not `/hu/privacy`.
 */
export function getSitemapPathnames(): string[] {
  const paths: string[] = []

  for (const lang of LANGS) {
    paths.push(`/${lang}`)
    for (const segment of STATIC_SEGMENTS) {
      if (lang === 'hu' && segment === 'privacy') {
        paths.push('/hu/adatkezeles')
      } else {
        paths.push(`/${lang}/${segment}`)
      }
    }
  }

  for (const alias of HU_STATIC_ALIASES) {
    paths.push(`/hu/${alias}`)
  }

  for (const lang of LANGS) {
    for (const cs of caseStudies) {
      paths.push(`/${lang}/case-studies/${cs.slug}`)
    }
    for (const post of blogPostManifest) {
      paths.push(`/${lang}/blog/p/${post.slug}`)
    }
  }

  for (const post of archivePostsManifest) {
    paths.push(`/hu/blog/archiv/${post.slug}`)
  }

  return [...new Set(paths)].sort()
}

/**
 * Old Jekyll permalinks (bare paths, no /en|hu prefix) that only render a static
 * meta-refresh + canonical redirect to their archive URL. Must be prerendered so the
 * already-indexed URLs resolve, but they are not real pages, so they're excluded from
 * the sitemap.
 */
function getLegacyRedirectPathnames(): string[] {
  return archiveRedirects.map((redirect) => `/${redirect.path}`)
}

/** All pathnames to prerender (vite-ssg): sitemap pages plus legacy redirect stubs. */
export function getPrerenderPathnames(): string[] {
  return [...new Set([...getSitemapPathnames(), ...getLegacyRedirectPathnames()])].sort()
}
