<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { getArchivePostBySlug } from '../data/archive-posts'
import { useMarkdownContent } from '../composables/useMarkdownContent'
import { useMermaidRender } from '../composables/useMermaidDiagrams'
import { absoluteUrl, DEFAULT_OG_IMAGE_PATH } from '../site'

const route = useRoute()
const router = useRouter()

const slug = computed(() => route.params.slug as string)
const post = computed(() => getArchivePostBySlug(slug.value))

const publishedAt = computed(() => {
  const p = post.value
  if (!p) return ''
  const m = p.publishedAt.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return p.publishedAt
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const value = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' }).format(value)
})

const publishedYear = computed(() => post.value?.publishedAt.slice(0, 4) ?? '')

const fullTitle = computed(() => {
  const title = post.value?.title
  return title ? `${title} | Letscode Solutions Kft` : 'Letscode Solutions Kft'
})

const postOgImageUrl = computed(() => {
  const path = post.value?.featuredImagePath ?? DEFAULT_OG_IMAGE_PATH
  const normalized = path.startsWith('/') ? path : `/${path}`
  return absoluteUrl(normalized)
})

useHead(
  computed(() => {
    const p = post.value
    const excerpt = p?.excerpt ?? ''
    return {
      title: fullTitle.value,
      meta: [
        { name: 'description', content: excerpt },
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: fullTitle.value },
        { property: 'og:description', content: excerpt },
        { property: 'og:image', content: postOgImageUrl.value },
        { name: 'twitter:title', content: fullTitle.value },
        { name: 'twitter:description', content: excerpt },
        { name: 'twitter:image', content: postOgImageUrl.value },
      ],
    }
  })
)

const { tocEntries, contentHtml } = useMarkdownContent(computed(() => post.value?.content ?? ''))

const markdownBodyRef = ref<HTMLElement | null>(null)
useMermaidRender(markdownBodyRef, contentHtml)

watch(
  post,
  (p) => {
    if (route.name === 'archive-detail' && slug.value && !p) {
      router.replace({ name: 'archive-list', params: { lang: 'hu' } })
    }
  },
  { immediate: true }
)
</script>

<template>
  <article v-if="post" class="archive-post">
    <div class="archive-post-main">
      <header class="page-header-block">
        <div v-if="post.featuredImagePath" class="post-featured-image-wrap">
          <img
            :src="post.featuredImagePath"
            :alt="post.title"
            class="post-featured-image"
            loading="eager"
            decoding="async"
          >
        </div>
        <RouterLink :to="{ name: 'archive-list', params: { lang: 'hu' } }" class="back-link">
          ← Vissza az archívumhoz
        </RouterLink>
        <h1 class="page-title">{{ post.title }}</h1>
        <p class="published-at">Eredetileg közzétéve: {{ publishedAt }}</p>
      </header>

      <div class="disclaimer-block" role="note">
        <p class="disclaimer-title">Archív bejegyzés</p>
        <p class="disclaimer-body">
          Ez a cikk {{ publishedYear }}-ben jelent meg a letscode.hu korábbi, azóta megszűnt
          verziójában. A benne szereplő eszközök, verziószámok vagy gyakorlatok azóta
          elavulhattak - történeti értékét megőrizve, változtatás nélkül tesszük újra elérhetővé.
        </p>
      </div>

      <div class="content-card">
        <div ref="markdownBodyRef" class="markdown-body" v-html="contentHtml" />
      </div>
    </div>

    <aside v-if="tocEntries.length > 0" class="sidebar">
      <div class="sidebar-block sidebar-toc">
        <h2 class="sidebar-title">Ebben a cikkben</h2>
        <nav aria-label="Tartalomjegyzék">
          <ul class="toc-list">
            <li v-for="entry in tocEntries" :key="entry.slug">
              <a :href="`#${entry.slug}`" class="toc-link">{{ entry.text }}</a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  </article>
</template>

<style scoped>
.archive-post {
  padding-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .archive-post {
    grid-template-columns: 1fr;
  }
}

.archive-post-main {
  min-width: 0;
}

.page-header-block {
  margin-bottom: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: var(--color-surface-soft);
  border-left: 3px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.post-featured-image-wrap {
  width: calc(100% + 3rem);
  margin: -1.25rem -1.5rem 1rem;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
}

.post-featured-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
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

.published-at {
  margin: 0.5rem 0 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.disclaimer-block {
  margin-bottom: 1.25rem;
  padding: 1rem 1.25rem;
  max-width: 65ch;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
}

.disclaimer-title {
  margin: 0 0 0.35rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text);
}

.disclaimer-body {
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-muted);
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

.markdown-body :deep(blockquote) {
  position: relative;
  margin: 1.4rem 0;
  padding: 1.15rem 1.25rem 1.05rem 1.5rem;
  color: var(--color-text);
  background: linear-gradient(135deg, var(--color-primary-soft), var(--color-surface-soft));
  border: 1px solid var(--color-border);
  border-left: 0.28rem solid var(--color-primary);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
}

.markdown-body :deep(ul) {
  margin: 0 0 0.75rem;
  padding-left: 1.25rem;
  list-style: disc;
}

.markdown-body :deep(li + li) {
  margin-top: 0.35rem;
}

.markdown-body :deep(strong) {
  font-weight: 600;
}

.markdown-body :deep(pre) {
  margin: 1rem 0;
  padding: 1rem;
  overflow-x: hidden;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  background: var(--color-surface-strong);
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-sm);
}

.markdown-body :deep(code) {
  padding: 0.1rem 0.28rem;
  background: var(--color-surface-strong);
  border-radius: 0.35rem;
  font-size: 0.88em;
}

.markdown-body :deep(pre code) {
  padding: 0;
  background: transparent;
  border-radius: 0;
  white-space: inherit;
  overflow-wrap: inherit;
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

.markdown-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
}

.markdown-body :deep(.mermaid-diagram) {
  margin: 1.25rem 0;
  display: flex;
  justify-content: center;
  overflow-x: auto;
}

.markdown-body :deep(.mermaid-diagram svg) {
  max-width: 100%;
  height: auto;
}

.markdown-body :deep(.mermaid-diagram--zoomable) {
  cursor: zoom-in;
}

.sidebar {
  position: sticky;
  top: 1.5rem;
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
</style>
