# SEO architecture

## Site origin

[`src/site.ts`](../src/site.ts) defines `SITE_ORIGIN` (`https://letscode.hu`) and `absoluteUrl()` for canonical links, Open Graph, Twitter cards, and JSON-LD.

## Head tags

[`AppLayout.vue`](../src/components/layout/AppLayout.vue) sets `html[lang]`, `meta description`, full OG/Twitter fields (except on content-detail routes), `link[rel=canonical]`, `hreflang` alternates (`en`, `hu`, `x-default` → English), `og:locale` / `og:locale:alternate`, default `og:image` (except on **blog** post detail, where [`BlogPostDetailPage.vue`](../src/pages/BlogPostDetailPage.vue) sets `og:image` / `twitter:image` to avoid duplicates), and sitewide `Organization` JSON-LD.

Blog and case study detail pages add article-type meta and `BlogPosting` / `Article` JSON-LD in their page components. Blog posts may set optional per-post `ogImagePath` in [`blog-post-manifest.ts`](../src/data/blog-post-manifest.ts); see [`docs/blog.md`](blog.md).

## Canonical and hreflang

[`src/seo/canonical-path.ts`](../src/seo/canonical-path.ts) maps Hungarian vanity paths (`/hu/kepzes`, …) to primary path segments (`/hu/training`, …). Hungarian privacy is canonical at `/hu/adatkezeles`; English stays `/en/privacy`. `alternateLangPathname()` pairs the correct localized URLs for `hreflang`.

## Prerender and sitemap

[`src/seo/prerender-paths.ts`](../src/seo/prerender-paths.ts) is the single source for:

- `includedRoutes()` in [`src/main.ts`](../src/main.ts) (vite-ssg)
- URL list for [`scripts/generate-sitemap.ts`](../scripts/generate-sitemap.ts) (runs after `vite-ssg build`, writes `dist/sitemap.xml`)

Hungarian static vanity routes are included so GitHub Pages serves HTML for those paths. `/hu/privacy` is not prerendered; the Hungarian notice lives at `/hu/adatkezeles`. [`src/main.ts`](../src/main.ts) redirects `/hu/privacy` to `/hu/adatkezeles` so named-route navigation and language toggles stay on the canonical URL.

## robots.txt

[`public/robots.txt`](../public/robots.txt) allows all crawlers and points to the absolute sitemap URL.

## i18n copy

Per-route meta descriptions live under `seo.descriptions` in [`src/i18n/en.json`](../src/i18n/en.json) and [`src/i18n/hu.json`](../src/i18n/hu.json), referenced from route `meta.descriptionKey` in [`src/router/index.ts`](../src/router/index.ts).
