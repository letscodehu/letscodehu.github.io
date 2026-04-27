<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import { blogPosts } from '../data/blog-posts'

const { t, currentLang } = useI18n()

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
  blogPosts.map((post) => ({
    slug: post.slug,
    title: currentLang.value === 'en' ? post.titleEn : post.titleHu,
    excerpt: currentLang.value === 'en' ? post.excerptEn : post.excerptHu,
    publishedAt: formatPublishedAt(post.publishedAt, currentLang.value),
    featuredImagePath: post.featuredImagePath,
  }))
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
              <div v-if="post.featuredImagePath" class="post-featured-image-wrap">
                <img
                  :src="post.featuredImagePath"
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

.grid {
  display: grid;
  gap: 1.35rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
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
</style>
