# Blog

## Overview

Long-form articles live in [`src/data/blog-posts.ts`](../src/data/blog-posts.ts). Each post has a shared `slug`, separate English and Hungarian fields (`titleEn` / `titleHu`, `excerptEn` / `excerptHu`, `contentEn` / `contentHu`), and markdown body content rendered with `marked` on [`BlogPostDetailPage.vue`](../src/pages/BlogPostDetailPage.vue).

## Routes

- List: `/en/blog`, `/hu/blog` (Hungarian alias: `/hu/cikkek`).
- Post: `/en/blog/p/:slug`, `/hu/blog/p/:slug` (alias: `/hu/cikkek/p/:slug`). The `p` segment avoids a filesystem clash between a `blog.html` list file and a `blog/` directory for post HTML during static prerender.

[`includedRoutes`](../src/main.ts) must list both `blog` in `staticPaths` and each `blog/p/:slug` post path. Post URLs use the `p` segment so prerender can emit `blog.html` (list) alongside the `blog/p/` directory without a path conflict.

Navigation: [`AppHeader.vue`](../src/components/layout/AppHeader.vue). Copy: `blog.*` keys in [`en.json`](../src/i18n/en.json) and [`hu.json`](../src/i18n/hu.json).
