<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import { blogPosts } from '../data/blog-posts'
import { blogTags, getBlogTagLabel } from '../data/blog-tags'
import { caseStudies, localizeCaseStudy } from '../data/case-studies'

const { t, currentLang } = useI18n()
const route = useRoute()
const router = useRouter()

const selectedTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' ? tag : null
})

const usedTags = computed(() => {
  const usedSlugs = new Set(blogPosts.flatMap((post) => post.tags))
  return blogTags.filter((tag) => usedSlugs.has(tag.slug))
})

function selectTag(tag: string | null): void {
  const query = { ...route.query }
  if (tag) {
    query.tag = tag
  } else {
    delete query.tag
  }
  router.push({ name: route.name ?? undefined, params: route.params, query })
}

function formatPublishedAt(date: string, locale: string): string {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return date
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const value = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat(locale === 'hu' ? 'hu-HU' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(value)
}

const postsWithLabels = computed(() =>
  blogPosts
    .filter((post) => !selectedTag.value || post.tags.includes(selectedTag.value))
    .map((post) => ({
      slug: post.slug,
      title: currentLang.value === 'en' ? post.titleEn : post.titleHu,
      excerpt: currentLang.value === 'en' ? post.excerptEn : post.excerptHu,
      publishedAt: formatPublishedAt(post.publishedAt, currentLang.value),
      featuredImagePath: post.featuredImagePath,
      thumbnailPath: post.featuredImagePath ? `/thumbnails/${post.slug}.webp` : undefined,
      tags: post.tags.map((slug) => ({ slug, label: getBlogTagLabel(slug, currentLang.value) })),
    }))
)

const displayedCaseStudies = computed(() =>
  caseStudies.map((cs) => localizeCaseStudy(cs, currentLang.value))
)
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('blog.pageTitle') }}
      </h1>
      <p v-if="t('blog.intro')" class="page-intro">
        {{ t('blog.intro') }}
      </p>
    </header>

    <section class="section">
      <h2 class="section-title">{{ t('nav.blogArticles') }}</h2>
      <nav class="tag-filter" :aria-label="t('blog.filterByTagAriaLabel')">
        <button
          type="button"
          class="tag-filter-pill"
          :class="{ 'tag-filter-pill--active': !selectedTag }"
          @click="selectTag(null)"
        >
          {{ t('blog.filterAllLabel') }}
        </button>
        <button
          v-for="tag in usedTags"
          :key="tag.slug"
          type="button"
          class="tag-filter-pill"
          :class="{ 'tag-filter-pill--active': selectedTag === tag.slug }"
          @click="selectTag(tag.slug)"
        >
          {{ currentLang === 'en' ? tag.labelEn : tag.labelHu }}
        </button>
      </nav>
      <div class="grid grid--two">
        <RouterLink
          v-for="post in postsWithLabels"
          :key="post.slug"
          :to="{
            name: 'blog-post-detail-en',
            params: { lang: currentLang, slug: post.slug },
          }"
          class="card-link"
        >
          <BaseCard class="blog-post-card">
            <template #media>
              <div v-if="post.thumbnailPath" class="post-featured-image-wrap">
                <img
                  :src="post.thumbnailPath"
                  :alt="post.title"
                  class="post-featured-image"
                  loading="lazy"
                  decoding="async"
                >
              </div>
            </template>
            <template #title>{{ post.title }}</template>
            <template #subtitle>{{ post.excerpt }}</template>
            <small class="post-date">{{ t('blog.publishedOnLabel') }}: {{ post.publishedAt }}</small>
            <div v-if="post.tags.length" class="post-tags">
              <span v-for="tag in post.tags" :key="tag.slug" class="post-tag-badge">{{ tag.label }}</span>
            </div>
          </BaseCard>
        </RouterLink>
      </div>
    </section>

    <section v-if="currentLang === 'hu'" class="section">
      <RouterLink :to="{ name: 'archive-list', params: { lang: 'hu' } }" class="archive-banner-link">
        <BaseCard class="archive-banner">
          <template #title>Archívum</template>
          <template #subtitle>
            A letscode.hu korábbi verziójából visszahozott, régebbi bejegyzések - csak
            magyarul, változatlan tartalommal.
          </template>
        </BaseCard>
      </RouterLink>
    </section>

    <section class="section">
      <h2 class="section-title">{{ t('caseStudies.pageTitle') }}</h2>
      <p v-if="t('caseStudies.intro')" class="section-intro">
        {{ t('caseStudies.intro') }}
      </p>
      <div class="grid grid--two">
        <RouterLink
          v-for="cs in displayedCaseStudies"
          :key="cs.slug"
          :to="{
            name: 'case-study-detail-en',
            params: { lang: currentLang, slug: cs.slug },
          }"
          class="card-link"
        >
          <BaseCard>
            <template #title>{{ cs.title }}</template>
            <template #subtitle>{{ cs.excerpt }}</template>
          </BaseCard>
        </RouterLink>
      </div>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.5rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.85rem;
}

.page-intro {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.section {
  margin-bottom: 2.6rem;
}

.section-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
}

.section-intro {
  margin: -0.35rem 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.tag-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-bottom: 1.35rem;
}

.tag-filter-pill {
  padding: 0.4rem 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text-muted);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.16s ease, color 0.16s ease, background-color 0.16s ease;
}

.tag-filter-pill:hover {
  border-color: var(--color-border-strong);
  color: var(--color-text);
}

.tag-filter-pill--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-button-solid-fg);
}

.grid {
  display: grid;
  gap: 1.35rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  align-items: stretch;
}

.card-link {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.card-link :deep(.blog-post-card.card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.card-link :deep(.blog-post-card .card-body) {
  margin-top: auto;
}

.card-link :deep(.blog-post-card .post-featured-image-wrap) {
  width: calc(100% + 3rem);
  margin: -1.45rem -1.5rem 0.95rem;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-soft);
}

.card-link :deep(.blog-post-card .post-featured-image) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.post-date {
  display: inline-block;
  margin-top: 0.3rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.6rem;
}

.post-tag-badge {
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 0.76rem;
  font-weight: 600;
}

.archive-banner-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.archive-banner-link :deep(.card) {
  border-left: 3px solid var(--color-border-strong);
}
</style>
