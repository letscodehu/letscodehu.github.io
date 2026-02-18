<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import { caseStudies } from '../data/case-studies'

const { t, currentLang } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('caseStudies.pageTitle') }}
      </h1>
      <p v-if="t('caseStudies.intro')" class="page-intro">
        {{ t('caseStudies.intro') }}
      </p>
    </header>

    <section class="section">
      <div class="grid grid--two">
        <RouterLink
          v-for="cs in caseStudies"
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
