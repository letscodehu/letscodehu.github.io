import { blogPostManifest } from './blog-post-manifest'

export interface BlogPost {
  slug: string
  publishedAt: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  contentEn: string
  contentHu: string
  videoUrl?: string
  featuredImagePath?: string
}

const enMarkdownModules = import.meta.glob<string>('../../content/blog/*/en.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

const huMarkdownModules = import.meta.glob<string>('../../content/blog/*/hu.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function blogMarkdownSlug(path: string): string {
  const m = path.match(/blog\/([^/]+)\/(?:en|hu)\.md$/)
  if (!m || m[1] === undefined) {
    throw new Error(`Unexpected blog markdown path: ${path}`)
  }
  return m[1]
}

function collectBlogBodies(): Record<string, { en: string; hu: string }> {
  const bySlug: Record<string, { en?: string; hu?: string }> = {}
  for (const [path, raw] of Object.entries(enMarkdownModules)) {
    const slug = blogMarkdownSlug(path)
    bySlug[slug] = { ...bySlug[slug], en: raw }
  }
  for (const [path, raw] of Object.entries(huMarkdownModules)) {
    const slug = blogMarkdownSlug(path)
    bySlug[slug] = { ...bySlug[slug], hu: raw }
  }
  const out: Record<string, { en: string; hu: string }> = {}
  for (const [slug, pair] of Object.entries(bySlug)) {
    if (typeof pair.en !== 'string' || typeof pair.hu !== 'string') {
      throw new Error(`Blog markdown incomplete for "${slug}": need en.md and hu.md`)
    }
    out[slug] = { en: pair.en, hu: pair.hu }
  }
  return out
}

const blogBodies = collectBlogBodies()

export const blogPosts: BlogPost[] = blogPostManifest
  .map((meta) => {
    const body = blogBodies[meta.slug]
    if (!body) {
      throw new Error(`No blog markdown folder for slug "${meta.slug}" (expected content/blog/${meta.slug}/en.md and hu.md)`)
    }
    return { ...meta, contentEn: body.en, contentHu: body.hu }
  })
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
