# New blog post skill

- Added project skill `.cursor/skills/new-blog-post/SKILL.md` for creating bilingual blog post pairs from an idea or outline.
- The skill follows the existing blog architecture: markdown bodies under `content/blog/<slug>/`, metadata in `src/data/blog-post-manifest.ts`, and prerender validation through `src/seo/prerender-paths.ts`.
- The workflow requires reading recent post pairs and `.cursor/rules/blog-style.mdc` before drafting, then running `npm run build` after implementation.
