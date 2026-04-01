# Kubernetes Scaling Blog Post Addition

## Change

Added a new bilingual blog entry (manifest in [`src/data/blog-post-manifest.ts`](../src/data/blog-post-manifest.ts), bodies under [`content/blog/your-scaling-problem-might-be-architecture-not-kubernetes/`](../content/blog/your-scaling-problem-might-be-architecture-not-kubernetes/)) with slug `your-scaling-problem-might-be-architecture-not-kubernetes`.

## Architectural Relevance

- The change is content-data only and reuses the existing blog post contract (`slug`, `title*`, `excerpt*`, `content*`) without modifying routing or rendering logic.
- Markdown structure keeps `##` headings so table-of-contents generation on [`BlogPostDetailPage.vue`](../src/pages/BlogPostDetailPage.vue) continues to work automatically.
- The post includes a video-first intro and language-specific internal CTA routes (`/en/contact`, `/hu/contact`) aligned with the current conversion flow.
