<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseButton from '../components/ui/BaseButton.vue'
import BaseCard from '../components/ui/BaseCard.vue'

const { t, currentLang } = useI18n()

const isEn = currentLang.value === 'en'
</script>

<template>
  <section class="hero">
    <div class="hero-main">
      <p class="eyebrow">
        {{ isEn ? 'Classroom training and consulting for software engineering teams.' : 'Képzések és tanácsadás szoftverfejlesztő csapatoknak.' }}
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
          {{ isEn ? 'What usually goes wrong' : 'Ami jellemzően félrecsúszik' }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.problems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ isEn ? 'What we focus on' : 'A fókusz a képzéseken' }}
        </template>
        <p class="body">
          {{
            isEn
              ? 'The goal is not a new framework, but everyday practices that reduce friction and make architecture decisions explicit.'
              : 'Nem új framework a cél, hanem olyan mindennapi gyakorlatok, amelyek csökkentik a súrlódást és láthatóvá teszik az architekturális döntéseket.'
          }}
        </p>
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
          {{ isEn ? 'Engineering practices' : 'Mérnöki gyakorlatok' }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offerings').slice(0, 1)" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ isEn ? 'DevOps and delivery' : 'DevOps és szállítás' }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offerings').slice(1, 2)" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>
          {{ isEn ? 'Architecture: ADR, C4, clean architecture' : 'Architektúra: ADR, C4, tiszta architektúra' }}
        </template>
        <ul class="list">
          <li v-for="item in t('home.offerings').slice(2)" :key="item">
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
          {{ isEn ? 'How this usually looks in practice' : 'Hogyan néz ez ki a gyakorlatban' }}
        </template>
        <p class="body">
          {{
            isEn
              ? 'We work with concrete examples from your context wherever possible: code, pipeline definitions, architecture sketches, and real trade-offs.'
              : 'Lehetőség szerint a ti kontextusotokból dolgozunk: kód, pipeline definíciók, architektúra-vázlatok és valódi trade-offok mentén.'
          }}
        </p>
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
        <template #title>Talk 1</template>
        <p class="body">
          {{ t('home.talkPlaceholder1') }}
        </p>
        <BaseButton
          as="a"
          href="#"
          variant="ghost"
        >
          {{ isEn ? 'Open on YouTube (placeholder)' : 'Megnyitás YouTube-on (helykitöltő)' }}
        </BaseButton>
      </BaseCard>
      <BaseCard>
        <template #title>Talk 2</template>
        <p class="body">
          {{ t('home.talkPlaceholder2') }}
        </p>
        <BaseButton
          as="a"
          href="#"
          variant="ghost"
        >
          {{ isEn ? 'Open on YouTube (placeholder)' : 'Megnyitás YouTube-on (helykitöltő)' }}
        </BaseButton>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-bottom: 2.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2.5rem;
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
  font-size: 2rem;
  line-height: 1.25;
  letter-spacing: -0.01em;
  margin: 0 0 0.75rem;
}

.hero-subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.98rem;
  color: var(--color-text-muted);
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.section {
  margin-bottom: 2.5rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.3rem;
}

.section-intro {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.1rem;
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
  font-size: 0.9rem;
  color: var(--color-text);
}

.list li + li {
  margin-top: 0.4rem;
}

.body {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.talks {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.25rem;
  margin-top: 1.1rem;
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 1.6rem;
  }
}
</style>

