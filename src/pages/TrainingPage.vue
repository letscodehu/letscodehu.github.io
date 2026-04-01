<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { RouterLink } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const { t, currentLang } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('training.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('training.intro') }}
      </p>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('training.formatTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('training.format')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section grid grid--two">
      <div>
        <header class="section-header">
          <h2>{{ t('training.forWhoTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.forWho')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
      <div>
        <header class="section-header">
          <h2>{{ t('training.notForTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.notFor')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('training.topicsTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('training.topics')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section grid grid--two">
      <div>
        <header class="section-header">
          <h2>{{ t('training.engagementTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.engagement')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
      <div>
        <header class="section-header">
          <h2>{{ t('training.outcomesTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.outcomes')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section cta">
      <BaseButton
        as="a"
        href="mailto:fejlesztes@letscode.hu"
      >
        {{ t('training.cta') }}
      </BaseButton>
      <p class="cta-note">
        {{ t('training.ctaNote') }}
      </p>
    </section>

    <section class="section">
      <BaseCard>
        <template #title>{{ t('training.b2cCardTitle') }}</template>
        <p class="b2c-copy">{{ t('training.b2cCardBody') }}</p>
        <RouterLink :to="{ name: 'training-b2c-en', params: { lang: currentLang } }">
          <BaseButton>
            {{ t('training.b2cCardCta') }}
          </BaseButton>
        </RouterLink>
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
  font-size: 1.7rem;
}

.page-intro {
  margin: 0;
  font-size: 0.96rem;
  color: var(--color-text-muted);
  max-width: 48rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.b2c-copy {
  margin: 0 0 0.9rem;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cta-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>

