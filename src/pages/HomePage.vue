<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'
import VideoEmbed from '../components/ui/VideoEmbed.vue'

const { t, currentLang } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="hero-main">
      <p class="eyebrow">
        {{ t('home.heroEyebrow') }}
      </p>
      <h1 class="hero-title">
        {{ t('home.heroTitle') }}
      </h1>
      <p class="hero-subtitle">
        {{ t('home.heroSubtitle') }}
      </p>

      <div class="hero-actions">
        <RouterLink :to="{ name: 'contact-en', params: { lang: currentLang } }">
          <BaseButton>
            {{ t('home.ctaPrimary') }}
          </BaseButton>
        </RouterLink>
        <RouterLink :to="{ name: 'training-en', params: { lang: currentLang } }">
          <BaseButton variant="ghost">
            {{ t('home.ctaSecondary') }}
          </BaseButton>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="section">
    <header class="section-header">
      <h2>{{ t('home.problemsTitle') }}</h2>
    </header>
    <div class="grid grid--two">
      <BaseCard>
        <template #title>
          {{ t('home.problemsCardTitle') }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.problems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ t('home.focusCardTitle') }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.focusOn')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <header class="section-header">
      <h2>{{ t('home.offeringsTitle') }}</h2>
    </header>
    <div class="grid grid--three">
      <BaseCard>
        <template #title>
          {{ t('home.offeringsEngineeringTitle') }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offeringsEngineering')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ t('home.offeringsDevOpsTitle') }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offeringsDevOps')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ t('home.offeringsArchitectureTitle') }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offeringsArchitecture')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <header class="section-header">
      <h2>{{ t('home.whyDifferentTitle') }}</h2>
    </header>
    <div class="grid grid--two">
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('home.whyDifferent')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ t('home.practiceCardTitle') }}
        </template>
        <p class="body">
          {{ t('home.practiceIntro') }}
        </p>
        <ul class="list">
          <li v-for="item in t('home.practiceExamples')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <header class="section-header">
      <h2>{{ t('home.engagementModelsTitle') }}</h2>
      <p class="section-intro">
        {{ t('home.engagementModelsIntro') }}
      </p>
    </header>
    <div class="grid grid--two">
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('home.engagementModels')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </div>
  </section>

  <section class="section">
    <header class="section-header">
      <h2>{{ t('home.talksTitle') }}</h2>
      <p class="section-intro">
        {{ t('home.talksIntro') }}
      </p>
    </header>
    <div class="talks">
      <BaseCard>
        <template #title>{{ t('home.talk1Title') }}</template>
        <p class="body">
          {{ t('home.talk1Description') }}
        </p>
        <VideoEmbed
          :url="t('home.talk1Url')"
          :title="t('home.talk1Title')"
          :link-label="t('home.talk1Label')"
        />
      </BaseCard>
      <BaseCard>
        <template #title>{{ t('home.talk2Title') }}</template>
        <p class="body">
          {{ t('home.talk2Description') }}
        </p>
        <VideoEmbed
          :url="t('home.talk2Url')"
          :title="t('home.talk2Title')"
          :link-label="t('home.talk2Label')"
        />
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 1.3rem 1.3rem 2.2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at top right, var(--color-gradient-start) 0%, var(--color-gradient-end) 55%);
  box-shadow: var(--shadow-sm);
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2.5rem;
  background-color: var(--color-surface);
}

.hero-main {
  max-width: 720px;
}

.eyebrow {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  margin: 0 0 0.6rem;
}

.hero-title {
  font-size: 2.2rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0 0 0.75rem;
}

.hero-subtitle {
  margin: 0 0 1.5rem;
  font-size: 1rem;
  color: var(--color-text-muted);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.section {
  margin-bottom: var(--section-gap);
}

.section-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.45rem;
}

.section-intro {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  gap: 1.35rem;
  margin-top: 1.15rem;
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
  color: var(--color-text);
}

.list li + li {
  margin-top: 0.4rem;
}

.body {
  margin: 0;
  font-size: 0.92rem;
  color: var(--color-text);
}

.talks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.35rem;
  margin-top: 1.15rem;
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.78rem;
  }
}
</style>
