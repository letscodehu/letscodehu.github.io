# Blog post rollout: worth-solving-before-architecture

## Architectural relevance

- Added a new bilingual blog post using the existing content convention: `content/blog/<slug>/hu.md` and `content/blog/<slug>/en.md`.
- Reused the current runtime content loading model (`import.meta.glob`) without code-level routing changes.
- Registered the post in the manifest so it is discoverable in blog listings and detail pages.

## Changed files

- `content/blog/worth-solving-before-architecture/hu.md`
- `content/blog/worth-solving-before-architecture/en.md`
- `src/data/blog-post-manifest.ts`
