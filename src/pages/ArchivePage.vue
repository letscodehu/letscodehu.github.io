<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import BaseCard from '../components/ui/BaseCard.vue'
import { archivePosts } from '../data/archive-posts'

useHead({
  title: 'Archívum | Letscode Solutions Kft',
  meta: [
    {
      name: 'description',
      content: 'A letscode.hu korábbi, Jekyll alapú verziójából visszahozott, archív bejegyzések.',
    },
  ],
})

function formatPublishedAt(date: string): string {
  const m = date.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return date
  const year = Number(m[1])
  const month = Number(m[2])
  const day = Number(m[3])
  const value = new Date(Date.UTC(year, month - 1, day))
  return new Intl.DateTimeFormat('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' }).format(value)
}

interface YearGroup {
  year: string
  posts: typeof archivePosts
}

const groupedByYear = computed((): YearGroup[] => {
  const byYear = new Map<string, typeof archivePosts>()
  for (const post of archivePosts) {
    const year = post.publishedAt.slice(0, 4)
    const list = byYear.get(year) ?? []
    list.push(post)
    byYear.set(year, list)
  }
  return [...byYear.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([year, posts]) => ({ year, posts }))
})
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">Archívum</h1>
      <p class="page-intro">
        A letscode.hu korábbi, Jekyll alapú verziójából származó bejegyzések. A tartalmuk
        elavult lehet - eszközök, verziószámok vagy gyakorlatok azóta megváltozhattak -, de
        történeti értékük miatt itt is elérhetőek maradnak. Csak magyarul olvashatók.
      </p>
      <RouterLink :to="{ name: 'blog-list-en', params: { lang: 'hu' } }" class="back-link">
        ← Vissza a bloghoz
      </RouterLink>
    </header>

    <section v-for="group in groupedByYear" :key="group.year" class="year-section">
      <h2 class="year-title">{{ group.year }}</h2>
      <div class="grid grid--two">
        <RouterLink
          v-for="post in group.posts"
          :key="post.slug"
          :to="{ name: 'archive-detail', params: { lang: 'hu', slug: post.slug } }"
          class="card-link"
        >
          <BaseCard class="archive-post-card">
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
            <small class="post-date">{{ formatPublishedAt(post.publishedAt) }}</small>
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
  margin: 0 0 1rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.back-link {
  display: inline-block;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.back-link:hover {
  color: var(--color-primary);
}

.year-section {
  margin-bottom: 2.6rem;
}

.year-title {
  margin: 0 0 1rem;
  font-size: 1.25rem;
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

.card-link :deep(.archive-post-card.card) {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
}

.card-link :deep(.archive-post-card .card-body) {
  margin-top: auto;
}

.card-link :deep(.archive-post-card .post-featured-image-wrap) {
  width: calc(100% + 3rem);
  margin: -1.45rem -1.5rem 0.95rem;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-soft);
}

.card-link :deep(.archive-post-card .post-featured-image) {
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
