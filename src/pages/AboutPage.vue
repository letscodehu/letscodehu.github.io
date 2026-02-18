<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import VideoEmbed from '../components/ui/VideoEmbed.vue'

const { t, currentLang } = useI18n()
const isEn = currentLang.value === 'en'
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('about.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('about.intro') }}
      </p>
    </header>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('about.backgroundTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('about.background')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('about.approachTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('about.approach')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('about.talksTitle') }}</h2>
        <p class="section-intro">
          {{ t('about.talksIntro') }}
        </p>
      </header>
      <div class="grid grid--two">
        <BaseCard>
          <template #title>{{ t('about.talk1Title') }}</template>
          <p class="body">
            {{ isEn ? 'Conference session on Architecture Decision Records in practice.' : 'Konferencia-session az ADR-ekről a gyakorlatban.' }}
          </p>
          <VideoEmbed
            :url="t('about.talk1Url')"
            :title="t('about.talk1Title')"
            :link-label="t('about.talk1Label')"
          />
        </BaseCard>
        <BaseCard>
          <template #title>{{ t('about.talk2Title') }}</template>
          <p class="body">
            {{ t('about.talk2Description') }}
          </p>
          <VideoEmbed
            :url="t('about.talk2Url')"
            :title="t('about.talk2Title')"
            :link-label="t('about.talk2Label')"
          />
        </BaseCard>
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

.grid--three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
  margin: 0 0 0.75rem;
  font-size: 0.92rem;
}
</style>

