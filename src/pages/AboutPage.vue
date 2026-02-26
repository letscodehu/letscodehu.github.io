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
      <img src="/me.jpg" :alt="t('about.photoAlt')" class="about-photo" />
      <div class="page-header-text">
        <h1 class="page-title">
          {{ t('about.pageTitle') }}
        </h1>
        <p class="page-intro">
          {{ t('about.intro') }}
        </p>
      </div>
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

    <section class="section credly-badge-section">
      <BaseCard>
        <!-- Badge images live in public/; update files and hrefs if credentials change. -->
        <div class="credly-badge-list">
          <a
            href="https://www.credly.com/badges/e6e6a6b2-e385-461a-a97d-171c84c24585/public_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/aws-certified-cloud-practitioner.png"
              :alt="t('about.credlyBadgeAlt')"
              class="credly-badge-image"
            />
          </a>
          <a
            href="https://www.credly.com/badges/c984d7f3-bf75-4cef-8ab2-3e7d738c7e0d/public_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/aws-certified-ai-practitioner.png"
              :alt="t('about.credlyBadgeAiAlt')"
              class="credly-badge-image"
            />
          </a>
        </div>
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}

.about-photo {
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.page-header-text {
  min-width: 0;
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

.credly-badge-section {
  text-align: center;
}

.credly-badge-list {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.credly-badge-image {
  width: 150px;
  height: auto;
  display: block;
  margin: 0 auto;
}
</style>
