import { blogPostManifest } from '../data/blog-post-manifest'
import { caseStudies } from '../data/case-studies'

const LANGS = ['en', 'hu'] as const

const STATIC_SEGMENTS = [
  'training',
  'training/architect-mindset',
  'training/workshop-budapest',
  'training/workshop-adr',
  'consulting',
  'about',
  'contact',
  'case-studies',
  'blog',
  'privacy',
] as const

/** Hungarian vanity URLs that mirror STATIC_SEGMENTS (for static HTML on each path). */
/** HU vanity URLs; `/hu/adatkezeles` is already emitted from the main HU loop (privacy segment). */
const HU_STATIC_ALIASES: string[] = [
  'kepzes',
  'kepzes/architect-gondolkodas',
  'kepzes/workshop-budapest',
  'kepzes/workshop-adr',
  'tanacsadas',
  'rolam',
  'kapcsolat',
  'esettanulmanyok',
  'cikkek',
]

/**
 * All pathnames to prerender (vite-ssg) and include in sitemap.
 * HU privacy is only `/hu/adatkezeles`, not `/hu/privacy`.
 */
export function getPrerenderPathnames(): string[] {
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

  return [...new Set(paths)].sort()
}
