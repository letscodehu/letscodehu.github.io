# Blog: problem-with-best-practices

- Added bilingual post at `content/blog/problem-with-best-practices/{en,hu}.md`.
- Registered manifest entry in `src/data/blog-post-manifest.ts` (`publishedAt: 2026-05-21`).
- Prerender/sitemap picks up the slug automatically via `blogPostManifest` (no `prerender-paths.ts` change).
- Narrative: consulting case (event-driven adoption) → compressed-context model → AI-accelerated copy-paste → five-question decision frame → links to testing/delivery/debt patterns.
- CTAs: `/en/training` + `/en/contact`, `/hu/kepzes` + `/hu/contact`.
- No `featuredImagePath` until an OG asset is provided.
