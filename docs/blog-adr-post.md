# ADR Blog Post Addition

## Change

Added a new bilingual blog entry (manifest in [`src/data/blog-post-manifest.ts`](../src/data/blog-post-manifest.ts), bodies under [`content/blog/adrs-are-useful-only-if-they-shape-the-decision/`](../content/blog/adrs-are-useful-only-if-they-shape-the-decision/)) with slug `adrs-are-useful-only-if-they-shape-the-decision`.
Refined the post afterward to reduce separator-heavy formatting, expand the KMS/CloudHSM narrative section, and align CTA links to internal contact routes.

## Architectural Relevance

- No routing or rendering-layer change was required; the existing blog pipeline already supports markdown content per language.
- The post follows the existing content contract (`title*`, `excerpt*`, `content*`) and therefore automatically works with list/detail pages and ToC generation on [`BlogPostDetailPage.vue`](../src/pages/BlogPostDetailPage.vue).
- The article includes an intro video link and a language-specific internal CTA route (`/en/contact`, `/hu/contact`) in markdown content, consistent with current content-driven behavior.
- Structural simplification stays within markdown-content boundaries only (no rendering logic changes), preserving existing ToC behavior based on `##` headings.
