# Blog featured image rollout

## Architecturally relevant changes

- Standardized blog image metadata to `featuredImagePath` in the blog manifest/data model.
- Wired blog post social metadata (`og:image`, `twitter:image`, JSON-LD image) to the same `featuredImagePath` source with existing default fallback.
- Added optional featured image rendering on blog list cards so list and social previews share the same source of truth.

## Files touched

- `src/data/blog-post-manifest.ts`
- `src/data/blog-posts.ts`
- `src/pages/BlogPostDetailPage.vue`
- `src/pages/BlogPage.vue`
- `docs/blog.md`
