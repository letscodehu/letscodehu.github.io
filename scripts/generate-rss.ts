import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { SITE_ORIGIN } from '../src/site'
import { blogPostManifest, type BlogPostManifest } from '../src/data/blog-post-manifest'

const distDir = resolve(import.meta.dirname, '..', 'dist')

const posts = [...blogPostManifest].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function toRfc822(publishedAt: string): string {
  const m = publishedAt.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) throw new Error(`Unexpected publishedAt format: ${publishedAt}`)
  const [, year, month, day] = m
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day))).toUTCString()
}

function buildFeed(lang: 'en' | 'hu', title: string, description: string): string {
  const channelLink = `${SITE_ORIGIN}/${lang}/blog`
  const items = posts
    .map((post: BlogPostManifest) => {
      const postTitle = lang === 'en' ? post.titleEn : post.titleHu
      const postExcerpt = lang === 'en' ? post.excerptEn : post.excerptHu
      const link = `${SITE_ORIGIN}/${lang}/blog/p/${post.slug}`
      return `    <item>
      <title>${escapeXml(postTitle)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${toRfc822(post.publishedAt)}</pubDate>
      <description>${escapeXml(postExcerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${channelLink}</link>
    <description>${escapeXml(description)}</description>
    <language>${lang}</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${SITE_ORIGIN}/${lang === 'en' ? 'rss.xml' : 'rss-hu.xml'}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
}

writeFileSync(
  resolve(distDir, 'rss.xml'),
  buildFeed('en', 'letscode.hu Blog', 'Software architecture, AI engineering, and delivery — from letscode.hu.'),
  'utf8'
)

writeFileSync(
  resolve(distDir, 'rss-hu.xml'),
  buildFeed('hu', 'letscode.hu Blog', 'Szoftverarchitektúra, AI engineering és delivery — a letscode.hu-tól.'),
  'utf8'
)
