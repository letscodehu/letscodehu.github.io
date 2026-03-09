<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'

const { t } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('privacy.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('privacy.intro') }}
      </p>
      <p class="last-updated">
        {{ t('privacy.lastUpdatedLabel') }}: {{ t('privacy.lastUpdatedValue') }}
      </p>
    </header>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('privacy.scopeTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('privacy.scopeItems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('privacy.legalTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('privacy.legalItems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('privacy.servicesTitle') }}</h2>
        <p class="section-intro">
          {{ t('privacy.servicesIntro') }}
        </p>
      </header>

      <div class="grid grid--two">
        <BaseCard>
          <template #title>{{ t('privacy.schedulingTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.schedulingItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('privacy.newsletterTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.newsletterItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('privacy.analyticsTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.analyticsItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('privacy.marketingTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.marketingItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('privacy.embedsTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.embedsItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>

        <BaseCard>
          <template #title>{{ t('privacy.externalLinksTitle') }}</template>
          <ul class="list">
            <li v-for="item in t('privacy.externalLinksItems')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('privacy.cookieControlsTitle') }}</template>
        <p class="body">
          {{ t('privacy.cookieControlsBody') }}
        </p>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('privacy.contactTitle') }}</template>
        <p class="body">
          {{ t('privacy.contactBody') }}
        </p>
      </BaseCard>
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
  margin: 0 0 0.5rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.last-updated {
  margin: 0;
  font-size: 0.84rem;
  color: var(--color-text-muted);
}

.section {
  margin-bottom: 2.6rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.4rem;
}

.section-intro {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  gap: 1.35rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.92rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.body {
  margin: 0;
  font-size: 0.92rem;
}
</style>
