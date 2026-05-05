# Blog post publication wiring

- Added metadata entry for `you-are-not-building-airplanes` in `blog-post-manifest` with HU title, excerpt, and publish date.
- Marked the post as HU-only (`availableLangs: ['hu']`) so it can be previewed immediately without EN content.
- Updated blog data loading and page rendering to support posts that only have `hu.md`.
- Updated prerender path generation to skip EN blog detail URLs for HU-only posts.
