<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'

const { t } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('blog.pageTitle') }}
      </h1>
    </header>

    <section class="section">
      <BaseCard>
        <template #title>{{ t('blog.emptyTitle') }}</template>
        <p class="body">
          {{ t('blog.emptyBody') }}
        </p>
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 1.75rem;
}

.page-title {
  margin: 0;
  font-size: 1.5rem;
}

.section {
  margin-bottom: 2rem;
}

.body {
  margin: 0;
  font-size: 0.9rem;
}
</style>

