# Blog

## Overview

Article **bodies** are markdown files under [`content/blog/`](../content/blog/): each post has a folder `content/blog/<slug>/` with `en.md` and `hu.md`. Vite loads them at build time via `import.meta.glob(..., { query: '?raw' })` in [`src/data/blog-posts.ts`](../src/data/blog-posts.ts), which merges them with metadata into the `BlogPost` shape consumed by the app.

**Metadata** (slug, titles, excerpts, optional `videoUrl`, and list order) lives in [`src/data/blog-post-manifest.ts`](../src/data/blog-post-manifest.ts). That module has no `import.meta.glob`, so it is safe to import from Node scripts (e.g. sitemap generation).

[`src/seo/prerender-paths.ts`](../src/seo/prerender-paths.ts) uses **`blogPostManifest`** only (slugs) so `tsx scripts/generate-sitemap.ts` does not load `blog-posts.ts`.

The markdown is rendered to HTML with `marked` on [`BlogPostDetailPage.vue`](../src/pages/BlogPostDetailPage.vue).

Optional `videoUrl` (YouTube watch or youtu.be URL): when set, the post detail page shows a dedicated block above the article body with localized copy and a text link that opens the video on YouTube in a new tab. Do not duplicate the video link inside markdown.

## Adding a post

1. Add one entry to `blogPostManifest` in [`blog-post-manifest.ts`](../src/data/blog-post-manifest.ts) (same fields as before, without body text).
2. Create `content/blog/<slug>/en.md` and `content/blog/<slug>/hu.md` with the article markdown.
3. Register prerender routes: [`includedRoutes`](../src/main.ts) must include each `blog/p/<slug>` path for both languages (existing pattern).

If `en.md` or `hu.md` is missing for a manifest slug, the Vite build throws when assembling `blogPosts`.

## Routes

- List: `/en/blog`, `/hu/blog` (Hungarian alias: `/hu/cikkek`).
- Post: `/en/blog/p/:slug`, `/hu/blog/p/:slug` (alias: `/hu/cikkek/p/:slug`). The `p` segment avoids a filesystem clash between a `blog.html` list file and a `blog/` directory for post HTML during static prerender.

[`includedRoutes`](../src/main.ts) must list both `blog` in `staticPaths` and each `blog/p/:slug` post path. Post URLs use the `p` segment so prerender can emit `blog.html` (list) alongside the `blog/p/` directory without a path conflict.

Navigation: [`AppHeader.vue`](../src/components/layout/AppHeader.vue). Copy: `blog.*` keys in [`en.json`](../src/i18n/en.json) and [`hu.json`](../src/i18n/hu.json).
