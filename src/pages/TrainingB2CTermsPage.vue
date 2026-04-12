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
  router.push({ name: 'training-b2c-ads-en', params: { lang: currentLang.value } })
}
</script>

<template>
  <article class="terms-page">
    <div class="terms-page__back-wrap">
      <button type="button" class="back-link" @click="goBackToPreviousPage">
        ← {{ t('trainingB2cTerms.backLabel') }}
      </button>
    </div>
    <header class="hero">
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

.terms-page__back-wrap {
  margin: 0 0 0.25rem;
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
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin: 0;
  padding: 0.55rem 1rem 0.55rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
  box-shadow: 0 1px 0 color-mix(in srgb, var(--color-text) 6%, transparent);
  font: inherit;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition:
    background-color var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast),
    box-shadow var(--transition-fast);
}

.back-link:hover {
  color: var(--color-primary-strong);
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary-soft) 55%, var(--color-surface-soft));
}

.back-link:focus-visible {
  outline: none;
  box-shadow:
    0 1px 0 color-mix(in srgb, var(--color-text) 6%, transparent),
    0 0 0 2px var(--color-primary-soft);
}

@media (max-width: 768px) {
  .terms-page__back-wrap {
    position: sticky;
    top: 0;
    z-index: 50;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    margin-bottom: 0.75rem;
    padding: 0.65rem 1.5rem 0.75rem;
    background: color-mix(in srgb, var(--color-surface) 92%, var(--color-bg));
    border-bottom: 1px solid var(--color-border-strong);
    box-shadow: 0 10px 28px color-mix(in srgb, var(--color-text) 12%, transparent);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  :global(.theme-dark) .terms-page__back-wrap {
    background: color-mix(in srgb, var(--color-surface) 88%, #000);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
  }

  .terms-page__back-wrap .back-link {
    width: 100%;
    justify-content: center;
    min-height: 3rem;
    padding: 0.65rem 1.25rem;
    border: none;
    border-radius: var(--radius-md);
    background: var(--color-button-solid-bg);
    color: var(--color-button-solid-fg);
    font-size: 1.02rem;
    font-weight: 700;
    letter-spacing: 0.01em;
    box-shadow: var(--color-button-solid-shadow);
    text-align: center;
  }

  .terms-page__back-wrap .back-link:hover {
    background: var(--color-button-solid-bg-hover);
    color: var(--color-button-solid-fg);
    border-color: transparent;
  }

  .terms-page__back-wrap .back-link:focus-visible {
    box-shadow:
      var(--color-button-solid-shadow),
      0 0 0 3px var(--color-primary-soft);
  }
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
