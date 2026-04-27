# Blog post publication note: overengineering vs underengineering

## Architecturally relevant changes

- Added new blog slug: `overengineering-vs-underengineering-compliance-nightmare`.
- Registered post metadata in `src/data/blog-post-manifest.ts` with `publishedAt: 2026-04-26`.
- Added localized markdown bodies:
  - `content/blog/overengineering-vs-underengineering-compliance-nightmare/hu.md`
  - `content/blog/overengineering-vs-underengineering-compliance-nightmare/en.md`

## Why no routing changes were needed

- Blog list/detail pages and prerender paths derive from `blogPostManifest`.
- Because of this data-driven setup, adding a manifest entry and both markdown files is sufficient for:
  - blog listing visibility,
  - detail route content loading,
  - prerender/sitemap inclusion.
