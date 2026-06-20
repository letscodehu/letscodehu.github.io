import { existsSync, mkdirSync } from 'node:fs'
import { resolve, join } from 'node:path'
import sharp from 'sharp'
import { blogPostManifest } from '../src/data/blog-post-manifest'

const root = resolve(import.meta.dirname, '..')
const publicDir = join(root, 'public')
const outDir = join(publicDir, 'thumbnails')

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

const posts = blogPostManifest.filter((p) => p.featuredImagePath)

for (const post of posts) {
  const srcPath = join(publicDir, post.featuredImagePath!)
  const destPath = join(outDir, `${post.slug}.webp`)

  if (!existsSync(srcPath)) {
    console.error(`[thumbnails] source not found: ${post.featuredImagePath}`)
    process.exit(1)
  }

  if (existsSync(destPath)) {
    console.log(`[thumbnails] skip (exists): ${post.slug}.webp`)
    continue
  }

  await sharp(srcPath).resize({ width: 400 }).webp({ quality: 82 }).toFile(destPath)
  console.log(`[thumbnails] generated: ${post.slug}.webp`)
}
