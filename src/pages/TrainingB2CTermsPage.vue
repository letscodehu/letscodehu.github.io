<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from '../composables/useI18n'

const { t, currentLang } = useI18n()
const router = useRouter()

const contactEmail = computed(() => String(t('trainingB2cTerms.sections.contact.email')))
const contactEmailHref = computed(() => `mailto:${contactEmail.value}`)

function goBackToPreviousPage() {
  if (import.meta.env.SSR) {
    return
  }
  const historyState = window.history.state as { back?: string | null } | null
  if (historyState?.back != null && historyState.back !== '') {
    router.back()
    return
  }
  router.push({ name: 'training-b2c-en', params: { lang: currentLang.value } })
}
</script>

<template>
  <article class="terms-page">
    <header class="hero">
      <button type="button" class="back-link" @click="goBackToPreviousPage">
        ← {{ t('trainingB2cTerms.backLabel') }}
      </button>
      <p class="hero-eyebrow">{{ t('trainingB2cTerms.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('trainingB2cTerms.pageTitle') }}</h1>
      <p class="hero-subtitle">{{ t('trainingB2cTerms.intro') }}</p>
    </header>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.registration.title') }}</h2>
      <ul class="list">
        <li v-for="point in t('trainingB2cTerms.sections.registration.points')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.viability.title') }}</h2>
      <p>{{ t('trainingB2cTerms.sections.viability.intro') }}</p>
      <p class="inline-label">
        <strong>{{ t('trainingB2cTerms.sections.viability.decisionDeadlineLabel') }}:</strong>
        {{ t('trainingB2cTerms.sections.viability.decisionDeadlineValue') }}
      </p>
      <p class="inline-label">
        <strong>{{ t('trainingB2cTerms.sections.viability.ifCancelledLabel') }}:</strong>
      </p>
      <ul class="list">
        <li v-for="option in t('trainingB2cTerms.sections.viability.ifCancelledOptions')" :key="option">
          {{ option }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.participantCancellation.title') }}</h2>
      <p>{{ t('trainingB2cTerms.sections.participantCancellation.intro') }}</p>
      <p class="inline-label">
        <strong>{{ t('trainingB2cTerms.sections.participantCancellation.bandsTitle') }}</strong>
      </p>
      <ul class="list">
        <li v-for="band in t('trainingB2cTerms.sections.participantCancellation.bands')" :key="band.window">
          <strong>{{ band.window }}:</strong>
          {{ band.refund }}
        </li>
      </ul>
      <p class="callout">{{ t('trainingB2cTerms.sections.participantCancellation.transferNote') }}</p>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.noShowAndLate.title') }}</h2>
      <ul class="list">
        <li v-for="point in t('trainingB2cTerms.sections.noShowAndLate.points')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.conductAndLiability.title') }}</h2>
      <ul class="list">
        <li v-for="point in t('trainingB2cTerms.sections.conductAndLiability.points')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.mediaConsent.title') }}</h2>
      <ul class="list">
        <li v-for="point in t('trainingB2cTerms.sections.mediaConsent.points')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.forceMajeure.title') }}</h2>
      <ul class="list">
        <li v-for="point in t('trainingB2cTerms.sections.forceMajeure.points')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="section">
      <h2>{{ t('trainingB2cTerms.sections.contact.title') }}</h2>
      <p>{{ t('trainingB2cTerms.sections.contact.intro') }}</p>
      <p class="inline-label">
        <strong>{{ t('trainingB2cTerms.sections.contact.emailLabel') }}:</strong>
        <a :href="contactEmailHref" class="email-link">{{ contactEmail }}</a>
      </p>
    </section>
  </article>
</template>

<style scoped>
.terms-page {
  display: grid;
  gap: 1.6rem;
}

.hero,
.section {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.2rem;
  background: var(--color-surface);
}

.hero {
  background: radial-gradient(circle at top right, var(--color-gradient-start) 0%, var(--color-gradient-end) 55%);
}

.back-link {
  display: inline-block;
  margin: 0 0 0.65rem;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.back-link:hover {
  color: var(--color-primary);
}

.hero-eyebrow {
  margin: 0 0 0.45rem;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-text-muted);
}

.hero-title {
  margin: 0;
}

.hero-subtitle {
  margin: 0.75rem 0 0;
  max-width: 70ch;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.section h2 {
  margin: 0;
}

.section p {
  margin: 0.8rem 0 0;
  line-height: 1.6;
}

.list {
  margin: 0.75rem 0 0;
  padding-left: 1.2rem;
  line-height: 1.6;
}

.list li + li {
  margin-top: 0.45rem;
}

.inline-label {
  margin-top: 0.8rem;
}

.callout {
  padding: 0.8rem 0.95rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
}

.email-link {
  color: var(--color-primary-strong);
  text-decoration: underline;
  text-underline-offset: 0.18em;
}
</style>
