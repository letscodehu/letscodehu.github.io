<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import { useI18n } from '../composables/useI18n'
import { getCaseStudyBySlug } from '../data/case-studies'
import { marked } from 'marked'
import { absoluteUrl } from '../site'
import { canonicalPathname } from '../seo/canonical-path'

const route = useRoute()
const router = useRouter()
const { t, currentLang } = useI18n()

const slug = computed(() => route.params.slug as string)
const caseStudy = computed(() => getCaseStudyBySlug(slug.value))

const fullTitle = computed(() => {
  const cs = caseStudy.value
  const brand = t('common.companyName')
  return cs ? `${cs.title} | ${brand}` : brand
})

const canonicalHref = computed(() => absoluteUrl(canonicalPathname(route.path)))

const articleLd = computed(() => {
  const cs = caseStudy.value
  if (!cs) return ''
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: cs.title,
    description: cs.excerpt,
    url: canonicalHref.value,
    inLanguage: currentLang.value === 'hu' ? 'hu' : 'en',
  })
})

useHead(
  computed(() => {
    const cs = caseStudy.value
    const excerpt = cs?.excerpt ?? ''
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
    if (cs) {
      head.script = [
        {
          type: 'application/ld+json',
          innerHTML: articleLd.value,
        },
      ]
    }
    return head
  })
)

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
}

interface TocEntry {
  slug: string
  text: string
}

const tocEntries = computed((): TocEntry[] => {
  const content = caseStudy.value?.content
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
  const content = caseStudy.value?.content
  if (!content) return ''
  const h2Slugs = tocEntries.value.map((e) => e.slug)
  return marked.parse(content, getMarkedOptions(h2Slugs)) as string
})

watch(
  caseStudy,
  (cs) => {
    if (route.name === 'case-study-detail-en' && slug.value && !cs) {
      router.replace({ name: 'case-studies-en', params: { lang: currentLang.value } })
    }
  },
  { immediate: true }
)
</script>

<template>
  <article v-if="caseStudy" class="case-study">
    <div class="case-study-main">
      <header class="page-header-block">
        <RouterLink
          :to="{ name: 'case-studies-en', params: { lang: currentLang } }"
          class="back-link"
        >
          ← {{ t('caseStudies.backToList') }}
        </RouterLink>
        <p class="eyebrow">
          {{ t('caseStudies.eyebrow') }}
        </p>
        <h1 class="page-title">
          {{ caseStudy.title }}
        </h1>
      </header>

      <div class="content-card">
        <div class="markdown-body" v-html="contentHtml" />
      </div>
    </div>

    <aside class="sidebar">
      <div v-if="tocEntries.length > 0" class="sidebar-block sidebar-toc">
        <h2 class="sidebar-title">{{ t('caseStudies.tocTitle') }}</h2>
        <nav :aria-label="t('caseStudies.tocAriaLabel')">
          <ul class="toc-list">
            <li v-for="entry in tocEntries" :key="entry.slug">
              <a :href="`#${entry.slug}`" class="toc-link">{{ entry.text }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="sidebar-block sidebar-cta">
        <h2 class="sidebar-cta-title">{{ t('caseStudies.sidebarCtaTitle') }}</h2>
        <p class="sidebar-cta-body">{{ t('caseStudies.sidebarCtaBody') }}</p>
        <RouterLink
          :to="{ name: 'contact-en', params: { lang: currentLang } }"
          class="sidebar-cta-button"
        >
          {{ t('caseStudies.sidebarCtaLabel') }}
        </RouterLink>
      </div>
    </aside>
  </article>
</template>

<style scoped>
.case-study {
  padding-bottom: 2rem;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 2rem;
  align-items: start;
}

@media (max-width: 900px) {
  .case-study {
    grid-template-columns: 1fr;
  }
}

.case-study-main {
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

.eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.page-title {
  margin: 0;
  font-size: 1.85rem;
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
