# Blog git-date ordering

- Added generated publish-date source: `src/data/blog-post-published-at.ts`.
- Added generator script: `scripts/generate-blog-published-dates.ts`, wired to `npm run build` via `npm run generate:blog-dates`.
- Extended blog manifest model with `publishedAt` and mapped each slug to generated git first-commit dates.
- Blog list ordering now uses descending `publishedAt` in `src/data/blog-posts.ts`.
- Rendered localized publish date on blog list cards and blog detail header.
