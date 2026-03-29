<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from '../composables/useI18n'
import { getBlogPostBySlug } from '../data/blog-posts'
import { marked } from 'marked'
import { absoluteUrl } from '../site'
import { canonicalPathname } from '../seo/canonical-path'

const route = useRoute()
const router = useRouter()
const { t, currentLang } = useI18n()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getBlogPostBySlug(slug.value))

const postTitle = computed(() => {
  const p = post.value
  if (!p) return ''
  return currentLang.value === 'en' ? p.titleEn : p.titleHu
})

const postContent = computed(() => {
  const p = post.value
  if (!p) return ''
  return currentLang.value === 'en' ? p.contentEn : p.contentHu
})

const postExcerpt = computed(() => {
  const p = post.value
  if (!p) return ''
  return currentLang.value === 'en' ? p.excerptEn : p.excerptHu
})

const fullTitle = computed(() => {
  const title = postTitle.value
  const brand = t('common.companyName')
  return title ? `${title} | ${brand}` : brand
})

const canonicalHref = computed(() => absoluteUrl(canonicalPathname(route.path)))

const blogPostingLd = computed(() => {
  const p = post.value
  if (!p) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: currentLang.value === 'en' ? p.titleEn : p.titleHu,
    description: postExcerpt.value,
    url: canonicalHref.value,
    inLanguage: currentLang.value === 'hu' ? 'hu' : 'en',
  })
})

useHead(
  computed(() => {
    const p = post.value
    const excerpt = postExcerpt.value
    const head: Record<string, unknown> = {
      title: fullTitle.value,
      meta: [
        { name: 'description', content: excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: fullTitle.value },
        { property: 'og:description', content: excerpt },
        { name: 'twitter:title', content: fullTitle.value },
        { name: 'twitter:description', content: excerpt },
      ],
    }
    if (p) {
      head.script = [
        {
          type: 'application/ld+json',
          innerHTML: blogPostingLd.value,
        },
      ]
    }
    return head
  })
)

const HUNGARIAN_CHAR_MAP: Record<string, string> = {
  á: 'a',
  é: 'e',
  í: 'i',
  ó: 'o',
  ö: 'o',
  ő: 'o',
  ú: 'u',
  ü: 'u',
  ű: 'u',
  Á: 'a',
  É: 'e',
  Í: 'i',
  Ó: 'o',
  Ö: 'o',
  Ő: 'o',
  Ú: 'u',
  Ü: 'u',
  Ű: 'u',
}

function slugify(text: string): string {
  let s = text
  for (const [from, to] of Object.entries(HUNGARIAN_CHAR_MAP)) {
    s = s.split(from).join(to)
  }
  return s
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

interface TocEntry {
  slug: string
  text: string
}

const tocEntries = computed((): TocEntry[] => {
  const content = postContent.value
  if (!content) return []
  const matches = content.matchAll(/^## (.+)$/gm)
  const entries: TocEntry[] = []
  for (const m of matches) {
    const raw = m[1]
    if (raw != null) {
      const text = raw.trim()
      entries.push({ slug: slugify(text), text })
    }
  }
  return entries
})

function getMarkedOptions(h2Slugs: string[]) {
  let h2Index = 0
  const renderer = new marked.Renderer()
  const originalHeading = renderer.heading.bind(renderer)
  renderer.heading = (token) => {
    const html = originalHeading(token as Parameters<typeof originalHeading>[0])
    if (token.depth === 2) {
      const id = h2Slugs[h2Index]
      h2Index += 1
      if (id) return html.replace(/^<h2>/, `<h2 id="${id}">`)
    }
    return html
  }
  return { gfm: true, renderer }
}

const contentHtml = computed(() => {
  const content = postContent.value
  if (!content) return ''
  const h2Slugs = tocEntries.value.map((e) => e.slug)
  return marked.parse(content, getMarkedOptions(h2Slugs)) as string
})

watch(
  post,
  (p) => {
    if (route.name === 'blog-post-detail-en' && slug.value && !p) {
      router.replace({ name: 'blog-list-en', params: { lang: currentLang.value } })
    }
  },
  { immediate: true }
)
</script>

<template>
  <article v-if="post" class="blog-post">
    <div class="blog-post-main">
      <header class="page-header-block">
        <RouterLink
          :to="{ name: 'blog-list-en', params: { lang: currentLang } }"
          class="back-link"
        >
          ← {{ t('blog.backToList') }}
        </RouterLink>
        <h1 class="page-title">
          {{ postTitle }}
        </h1>
      </header>

      <div
        v-if="post.videoUrl"
        class="video-block"
        role="region"
        :aria-label="t('blog.videoBlockAriaLabel')"
      >
        <div class="video-block-header">
          <svg
            class="video-block-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="4"
              width="20"
              height="16"
              rx="3"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
            />
            <path
              d="M10 8.5v7l5.5-3.5L10 8.5z"
              fill="currentColor"
            />
          </svg>
          <div class="video-block-headings">
            <p class="video-block-title">
              {{ t('blog.videoBlockTitle') }}
            </p>
            <p class="video-block-body">
              {{ t('blog.videoBlockBody') }}
            </p>
            <a
              :href="post.videoUrl"
              class="video-block-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ t('blog.videoWatchButton') }}
              <span class="video-block-link-external" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>

      <div class="content-card">
        <div class="markdown-body" v-html="contentHtml" />
      </div>
    </div>

    <aside class="sidebar">
      <div v-if="tocEntries.length > 0" class="sidebar-block sidebar-toc">
        <h2 class="sidebar-title">{{ t('blog.tocTitle') }}</h2>
        <nav :aria-label="t('blog.tocAriaLabel')">
          <ul class="toc-list">
            <li v-for="entry in tocEntries" :key="entry.slug">
              <a :href="`#${entry.slug}`" class="toc-link">{{ entry.text }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sidebar-block sidebar-cta">
        <h2 class="sidebar-cta-title">{{ t('blog.sidebarCtaTitle') }}</h2>
        <p class="sidebar-cta-body">{{ t('blog.sidebarCtaBody') }}</p>
        <RouterLink
          :to="{ name: 'contact-en', params: { lang: currentLang } }"
          class="sidebar-cta-button"
        >
          {{ t('blog.sidebarCtaLabel') }}
        </RouterLink>
      </div>
    </aside>
  </article>
</template>

<style scoped>
.blog-post {
  padding-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .blog-post {
    grid-template-columns: 1fr;
  }
}

.blog-post-main {
  min-width: 0;
}

.page-header-block {
  margin-bottom: 2rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface-soft);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.back-link {
  display: inline-block;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  margin-bottom: 0.5rem;
}

.back-link:hover {
  color: var(--color-primary);
}

.page-title {
  margin: 0;
  font-size: 1.85rem;
}

.video-block {
  margin-bottom: 1.25rem;
  padding: 1.25rem 1.5rem;
  max-width: 65ch;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.video-block-header {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  margin-bottom: 1rem;
}

.video-block-icon {
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  color: var(--color-primary);
}

.video-block-headings {
  min-width: 0;
}

.video-block-title {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.video-block-body {
  margin: 0 0 0.5rem;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.video-block-link {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
  width: fit-content;
}

.video-block-link:hover {
  color: var(--color-primary-strong);
}

.video-block-link:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}

.video-block-link-external {
  font-size: 0.82rem;
  opacity: 0.85;
  text-decoration: none;
}

.content-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem 1.75rem;
  max-width: 65ch;
}

.markdown-body {
  font-size: 0.92rem;
  line-height: 1.6;
}

.markdown-body :deep(p:first-child) {
  font-size: 1rem;
  color: var(--color-text);
  margin-top: 0;
}

.markdown-body :deep(h2) {
  margin: 2.25rem 0 0.75rem;
  font-size: 1.4rem;
  color: var(--color-primary);
  padding-bottom: 0.35rem;
  border-bottom: 1px solid var(--color-border);
}

.markdown-body :deep(h2:first-child) {
  margin-top: 0;
}

.markdown-body :deep(h3) {
  margin: 1.25rem 0 0.5rem;
  font-size: 1.15rem;
  color: var(--color-text-muted);
}

.markdown-body :deep(p) {
  margin: 0 0 0.75rem;
}

.markdown-body :deep(ul) {
  margin: 0 0 0.75rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.markdown-body :deep(ul li::marker) {
  color: var(--color-primary);
}

.markdown-body :deep(li + li) {
  margin-top: 0.35rem;
}

.markdown-body :deep(strong) {
  font-weight: 600;
}

.markdown-body :deep(a) {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.markdown-body :deep(a:hover) {
  color: var(--color-primary-strong);
}

.markdown-body :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

/* Sidebar */
.sidebar {
  position: sticky;
  top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .sidebar {
    position: static;
  }
}

.sidebar-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.25rem 1.35rem;
}

.sidebar-title {
  margin: 0 0 0.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.toc-list {
  margin: 0;
  padding-left: 1.1rem;
  list-style: none;
}

.toc-list li {
  margin-bottom: 0.4rem;
}

.toc-link {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.toc-link:hover {
  color: var(--color-primary);
}

.sidebar-cta {
  border-left: 3px solid var(--color-primary);
}

.sidebar-cta-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.sidebar-cta-body {
  margin: 0 0 1rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.sidebar-cta-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.64rem 1.35rem;
  border-radius: 999px;
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  background-color: var(--color-button-solid-bg);
  color: var(--color-button-solid-fg);
  transition: background-color 0.16s ease, transform 0.16s ease;
}

.sidebar-cta-button:hover {
  background-color: var(--color-button-solid-bg-hover);
  color: var(--color-button-solid-fg);
  transform: translateY(-1px);
}
</style>
