# Blog post publication wiring

- Added metadata entry for `you-are-not-building-airplanes` in `blog-post-manifest` with HU title, excerpt, and publish date.
- Added English content and excerpt for the post so it follows the bilingual blog contract.
- Removed the HU-only blog path support from the manifest, content loader, list/detail pages, and prerender path generation.
- Blog posts now require both `content/blog/<slug>/en.md` and `content/blog/<slug>/hu.md`.
