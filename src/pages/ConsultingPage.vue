<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'

const { t } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('consulting.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('consulting.intro') }}
      </p>
    </header>

    <section class="section grid grid--three">
      <BaseCard>
        <template #title>{{ t('consulting.auditsTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('consulting.audits')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('consulting.decisionsTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('consulting.decisions')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('consulting.mentoringTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('consulting.mentoring')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <BaseCard>
        <template #title>
          {{ t('consulting.complementsTitle') }}
        </template>
        <p class="body">
          {{ t('consulting.complementsBody') }}
        </p>
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.25rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
}

.page-intro {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.section {
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.body {
  margin: 0;
  font-size: 0.9rem;
}
</style>

