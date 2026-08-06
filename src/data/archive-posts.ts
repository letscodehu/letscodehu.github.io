import { archivePostsManifest } from './archive-posts-data'

/**
 * Recovered posts from the pre-2026 Jekyll blog (Hungarian only, no English translation).
 * Bodies live in content/archive/<slug>/hu.md (loaded via import.meta.glob for the Vite bundle).
 */
export interface ArchivePost {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  content: string
  featuredImagePath?: string
  oldPermalink: string
}

const huMarkdownModules = import.meta.glob<string>('../../content/archive/*/hu.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function archiveMarkdownSlug(path: string): string {
  const m = path.match(/archive\/([^/]+)\/hu\.md$/)
  if (!m || m[1] === undefined) {
    throw new Error(`Unexpected archive markdown path: ${path}`)
  }
  return m[1]
}

const archiveBodies: Record<string, string> = {}
for (const [path, raw] of Object.entries(huMarkdownModules)) {
  archiveBodies[archiveMarkdownSlug(path)] = raw
}

export const archivePosts: ArchivePost[] = archivePostsManifest
  .map((meta) => {
    const content = archiveBodies[meta.slug]
    if (content === undefined) {
      throw new Error(`No archive markdown for slug "${meta.slug}" (expected content/archive/${meta.slug}/hu.md)`)
    }
    return { ...meta, content }
  })
  .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

export function getArchivePostBySlug(slug: string): ArchivePost | undefined {
  return archivePosts.find((post) => post.slug === slug)
}
