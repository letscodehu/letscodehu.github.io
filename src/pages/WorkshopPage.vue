<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const { t, currentLang } = useI18n()
</script>

<template>
  <article>
    <header class="hero">
      <p class="hero-eyebrow">{{ t('workshop.eyebrow') }}</p>
      <p class="onsite-highlight">{{ t('workshop.onSiteHighlight') }}</p>
      <h1 class="hero-title">{{ t('workshop.title') }}</h1>
      <p class="hero-subtitle">{{ t('workshop.subtitle') }}</p>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('workshop.day1.title') }}</h2>
        <p class="section-intro">{{ t('workshop.day1.goal') }}</p>
      </header>
      <div class="session-grid">
        <BaseCard
          v-for="session in t('workshop.day1.sessions')"
          :key="`${session.time}-${session.title}`"
        >
          <template #title>{{ session.time }} - {{ session.title }}</template>
          <p class="goal">{{ session.goal }}</p>
          <ul class="list">
            <li v-for="point in session.points" :key="point">{{ point }}</li>
          </ul>
          <p v-if="session.exercise" class="exercise">
            <strong>{{ t('workshop.exerciseLabel') }}:</strong> {{ session.exercise }}
          </p>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('workshop.day2.title') }}</h2>
        <p class="section-intro">{{ t('workshop.day2.goal') }}</p>
      </header>
      <div class="session-grid">
        <BaseCard
          v-for="session in t('workshop.day2.sessions')"
          :key="`${session.time}-${session.title}`"
        >
          <template #title>{{ session.time }} - {{ session.title }}</template>
          <p class="goal">{{ session.goal }}</p>
          <ul class="list">
            <li v-for="point in session.points" :key="point">{{ point }}</li>
          </ul>
          <p v-if="session.exercise" class="exercise">
            <strong>{{ t('workshop.exerciseLabel') }}:</strong> {{ session.exercise }}
          </p>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <BaseCard>
        <template #title>{{ t('workshop.closing.title') }}</template>
        <p class="goal">{{ t('workshop.closing.intro') }}</p>
        <ul class="list">
          <li v-for="point in t('workshop.closing.points')" :key="point">{{ point }}</li>
        </ul>
      </BaseCard>
    </section>

    <section class="section cta">
      <BaseCard>
        <template #title>{{ t('workshop.cta.title') }}</template>
        <p class="goal">{{ t('workshop.cta.body') }}</p>
        <RouterLink :to="{ name: 'contact-en', params: { lang: currentLang } }">
          <BaseButton>{{ t('workshop.cta.button') }}</BaseButton>
        </RouterLink>
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.hero {
  padding: 1.3rem 1.3rem 2.1rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at top right, var(--color-gradient-start) 0%, var(--color-gradient-end) 55%);
}

.hero-eyebrow {
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.hero-title {
  margin: 0 0 0.7rem;
  font-size: 1.85rem;
  line-height: 1.3;
}

.onsite-highlight {
  margin: 0 0 0.55rem;
  display: inline-flex;
  align-items: center;
  padding: 0.2rem 0.6rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
}

.hero-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-muted);
  max-width: 52rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.55rem;
  font-size: 1.35rem;
}

.section-intro {
  margin: 0;
  font-size: 0.93rem;
  color: var(--color-text-muted);
}

.session-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.2rem;
  margin-top: 1rem;
}

.goal {
  margin: 0 0 0.65rem;
}

.list {
  margin: 0;
  padding-left: 1.2rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.exercise {
  margin: 0.8rem 0 0;
  font-size: 0.9rem;
}

.cta {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 1.55rem;
  }
}
</style>
