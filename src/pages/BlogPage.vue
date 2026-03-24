<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import { blogPosts } from '../data/blog-posts'

const { t, currentLang } = useI18n()

const postsWithLabels = computed(() =>
  blogPosts.map((post) => ({
    slug: post.slug,
    title: currentLang.value === 'en' ? post.titleEn : post.titleHu,
    excerpt: currentLang.value === 'en' ? post.excerptEn : post.excerptHu,
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
          <BaseCard>
            <template #title>{{ post.title }}</template>
            <template #subtitle>{{ post.excerpt }}</template>
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
}

.card-link {
  text-decoration: none;
  color: inherit;
}
</style>
