/**
 * One-off migration: recovers the old Jekyll blog posts (lost when the site moved to
 * Vue/vite-ssg) from the git object database, where they are still readable at commit
 * `JEKYLL_COMMIT` even though that commit is not an ancestor of the current branch tip.
 *
 * Writes:
 *  - content/archive/<slug>/hu.md            cleaned post body (HU only)
 *  - public/archive-images/<slug>/<file>      images referenced by that post
 *  - src/data/archive-posts-data.ts           generated ArchivePostManifest[]
 *  - src/data/archive-redirects.ts            generated old-permalink -> slug map
 *
 * Run once via: npx tsx scripts/migrate-jekyll-archive.ts
 */
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { resolve, join, basename } from 'node:path'

const JEKYLL_COMMIT = 'aed153f0c4a862914d4b1a3ec1b330f0932f6e3b'
const root = resolve(import.meta.dirname, '..')

function git(args: string[]): Buffer {
  return execFileSync('git', args, { cwd: root, maxBuffer: 1024 * 1024 * 50 })
}

function gitText(args: string[]): string {
  return git(args).toString('utf8')
}

function listPostFiles(): string[] {
  return gitText(['ls-tree', '-r', '--name-only', JEKYLL_COMMIT, '--', '_posts'])
    .split('\n')
    .filter(Boolean)
}

function readBlob(path: string): string {
  return gitText(['show', `${JEKYLL_COMMIT}:${path}`])
}

function readBlobBinary(path: string): Buffer {
  return git(['show', `${JEKYLL_COMMIT}:${path}`])
}

function blobExists(path: string): boolean {
  try {
    execFileSync('git', ['cat-file', '-e', `${JEKYLL_COMMIT}:${path}`], { cwd: root })
    return true
  } catch {
    return false
  }
}

function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

interface FrontMatter {
  title: string
  date: string
  permalink: string
  image?: string
}

function parseFrontMatter(raw: string): { meta: FrontMatter; body: string } {
  const lines = raw.split('\n')
  if (lines[0] !== '---') throw new Error('missing front matter start')
  let end = -1
  for (let i = 1; i < lines.length; i++) {
    if (lines[i] === '---') {
      end = i
      break
    }
  }
  if (end === -1) throw new Error('missing front matter end')

  const fields: Record<string, string> = {}
  for (const line of lines.slice(1, end)) {
    const m = line.match(/^(title|date|permalink|image):\s*(.*)$/)
    if (!m) continue
    const key = m[1] as string
    let value = (m[2] ?? '').trim()
    if (value.startsWith("'") && value.endsWith("'") && value.length >= 2) {
      value = value.slice(1, -1).replace(/''/g, "'")
    }
    fields[key] = decodeEntities(value)
  }

  const body = lines.slice(end + 1).join('\n').trim()

  if (!fields.title || !fields.date || !fields.permalink) {
    throw new Error(`missing required front matter fields: ${JSON.stringify(fields)}`)
  }

  return {
    meta: {
      title: fields.title,
      date: fields.date,
      permalink: fields.permalink,
      image: fields.image,
    },
    body,
  }
}

const HU_CHAR_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ö: 'o',
  ő: 'o',
  ú: 'u',
  ü: 'u',
  ű: 'u',
}

function slugify(text: string): string {
  let s = text.toLowerCase()
  for (const [from, to] of Object.entries(HU_CHAR_MAP)) {
    s = s.split(from).join(to)
  }
  return s
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function uniqueSlug(base: string, used: Set<string>): string {
  let slug = base
  let n = 2
  while (used.has(slug)) {
    slug = `${base}-${n}`
    n += 1
  }
  used.add(slug)
  return slug
}

function cleanBody(body: string): string {
  return body
    .replace(/\{\{\s*site\.url\s*\}\}/g, '')
    .replace(/```\n<pre data-language="([a-zA-Z0-9]*)"[^>]*>/g, '```$1\n')
    .replace(/<pre data-language="[a-zA-Z0-9]*"[^>]*>/g, '')
    .split('\n')
    .map((line) => decodeEntities(line))
    .join('\n')
    .trim()
}

function makeExcerpt(body: string): string {
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`]/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (plain.length <= 200) return plain
  return plain.slice(0, 200).replace(/\s\S*$/, '') + '…'
}

interface ArchivePostManifest {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  featuredImagePath?: string
  oldPermalink: string
}

const contentDir = join(root, 'content', 'archive')
const imagesDir = join(root, 'public', 'archive-images')

const usedSlugs = new Set<string>()
const manifest: ArchivePostManifest[] = []
const missingImages: string[] = []
let copiedImageCount = 0

function extractAndRewriteImages(body: string, slug: string): string {
  const matches = [...body.matchAll(/assets\/uploads\/[^\s)"'<>]+/g)]
  if (matches.length === 0) return body

  let outBody = body
  const seen = new Set<string>()
  for (const m of matches) {
    const raw = m[0]
    if (seen.has(raw)) continue
    seen.add(raw)

    if (!blobExists(raw)) {
      missingImages.push(`${slug}: ${raw}`)
      continue
    }
    const decodedPath = decodeURIComponent(raw)
    const fileName = basename(decodedPath)
    const destDir = join(imagesDir, slug)
    if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
    const destPath = join(destDir, fileName)
    if (!existsSync(destPath)) {
      writeFileSync(destPath, readBlobBinary(raw))
      copiedImageCount += 1
    }
    outBody = outBody.split(raw).join(`/archive-images/${slug}/${fileName}`)
  }
  return outBody
}

function extractFeaturedImage(imageField: string | undefined, slug: string): string | undefined {
  if (!imageField) return undefined
  if (!blobExists(imageField)) {
    missingImages.push(`${slug} (featured): ${imageField}`)
    return undefined
  }
  const decodedPath = decodeURIComponent(imageField)
  const fileName = basename(decodedPath)
  const destDir = join(imagesDir, slug)
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true })
  const destPath = join(destDir, fileName)
  if (!existsSync(destPath)) {
    writeFileSync(destPath, readBlobBinary(imageField))
    copiedImageCount += 1
  }
  return `/archive-images/${slug}/${fileName}`
}

if (!existsSync(contentDir)) mkdirSync(contentDir, { recursive: true })
if (!existsSync(imagesDir)) mkdirSync(imagesDir, { recursive: true })

const postFiles = listPostFiles()
console.log(`[migrate] found ${postFiles.length} old posts`)

for (const path of postFiles) {
  const raw = readBlob(path)
  const { meta, body } = parseFrontMatter(raw)

  const slug = uniqueSlug(slugify(meta.title), usedSlugs)
  const publishedAt = meta.date.match(/^(\d{4}-\d{2}-\d{2})/)?.[1] ?? meta.date

  let cleaned = cleanBody(body)
  cleaned = extractAndRewriteImages(cleaned, slug)
  const featuredImagePath = extractFeaturedImage(meta.image, slug)

  const postDir = join(contentDir, slug)
  if (!existsSync(postDir)) mkdirSync(postDir, { recursive: true })
  writeFileSync(join(postDir, 'hu.md'), cleaned + '\n', 'utf8')

  manifest.push({
    slug,
    title: meta.title,
    publishedAt,
    excerpt: makeExcerpt(cleaned),
    featuredImagePath,
    oldPermalink: meta.permalink,
  })
}

manifest.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))

const manifestHeader = `/**
 * AUTO-GENERATED by scripts/migrate-jekyll-archive.ts from the archived Jekyll blog.
 * Do not hand-edit; re-run the script if the source content needs to change.
 */
export interface ArchivePostManifest {
  slug: string
  title: string
  publishedAt: string
  excerpt: string
  featuredImagePath?: string
  oldPermalink: string
}

export const archivePostsManifest: ArchivePostManifest[] = `

writeFileSync(
  join(root, 'src', 'data', 'archive-posts-data.ts'),
  manifestHeader + JSON.stringify(manifest, null, 2) + '\n',
  'utf8'
)

const redirects = manifest.map((p) => ({
  path: p.oldPermalink.replace(/^\/+|\/+$/g, ''),
  slug: p.slug,
}))

const redirectsHeader = `/**
 * AUTO-GENERATED by scripts/migrate-jekyll-archive.ts.
 * Maps each old Jekyll permalink (already-indexed by Google) to its new archive slug.
 * Do not hand-edit; re-run the script if the source content needs to change.
 */
export interface ArchiveRedirect {
  path: string
  slug: string
}

export const archiveRedirects: ArchiveRedirect[] = `

writeFileSync(
  join(root, 'src', 'data', 'archive-redirects.ts'),
  redirectsHeader + JSON.stringify(redirects, null, 2) + '\n',
  'utf8'
)

console.log(`[migrate] wrote ${manifest.length} posts, copied ${copiedImageCount} images`)
if (missingImages.length > 0) {
  console.log(`[migrate] ${missingImages.length} missing images:`)
  for (const m of missingImages) console.log(`  - ${m}`)
}

const slugsCount = new Set(manifest.map((p) => p.slug)).size
if (slugsCount !== manifest.length) {
  console.error('[migrate] ERROR: slug collision detected after uniquification')
  process.exit(1)
}

const pathsCount = new Set(redirects.map((r) => r.path)).size
if (pathsCount !== redirects.length) {
  console.error('[migrate] ERROR: duplicate old permalink detected')
  process.exit(1)
}

console.log('[migrate] done')
