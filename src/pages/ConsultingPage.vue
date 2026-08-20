<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import ReportPromoBanner from '../components/ui/ReportPromoBanner.vue'

const { t, currentLang } = useI18n()

const contactRoute = computed(() => ({
  name: 'contact-en',
  params: { lang: currentLang.value },
}))

/** The only published case study — the page's single piece of outside proof. */
const CASE_STUDY_SLUG = 'rebuilding-engineering-trust-30k-dau-backoffice'
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
      <RouterLink class="page-intro-cta" :to="contactRoute">
        <BaseButton>
          {{ t('consulting.cta') }}
        </BaseButton>
      </RouterLink>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('consulting.problemsTitle') }}</h2>
      </header>
      <BaseCard>
        <template #title>{{ t('consulting.problemsCardTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('consulting.problems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

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

    <!-- The entry offer: the one concrete, bounded thing a visitor can say yes to. -->
    <section class="section">
      <div class="offer-highlight">
        <p class="offer-eyebrow">{{ t('consulting.offerEyebrow') }}</p>
        <h2 class="offer-title">{{ t('consulting.offerTitle') }}</h2>
        <p class="offer-body">{{ t('consulting.offerBody') }}</p>
        <p class="offer-body offer-body--last">{{ t('consulting.offerBodySecondary') }}</p>
        <RouterLink :to="contactRoute">
          <BaseButton>
            {{ t('consulting.cta') }}
          </BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('consulting.remoteTitle') }}</template>
        <p class="body">{{ t('consulting.remoteBody') }}</p>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('consulting.offerContinuationTitle') }}</template>
        <p class="body">{{ t('consulting.offerContinuationBody') }}</p>
      </BaseCard>
    </section>

    <section class="section">
      <BaseCard>
        <template #title>{{ t('consulting.noTitle') }}</template>
        <p class="body body--lead">{{ t('consulting.noIntro') }}</p>
        <ul class="list">
          <li v-for="item in t('consulting.no')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <!-- A lower-threshold step for visitors not ready to put a stranger in their
         calendar: without it the only way off this page is a booked call. -->
    <ReportPromoBanner class="section" />

    <section class="section">
      <BaseCard>
        <template #title>{{ t('consulting.credibilityTitle') }}</template>
        <!-- Photo last in the DOM: it sits on the right on desktop, and wraps below
             the copy on narrow screens instead of pushing the text down. -->
        <div class="credibility">
          <p class="body">{{ t('consulting.credibilityBody') }}</p>
          <!-- Same photo and treatment as the About page, so the two pages show the
               same person the same way. Alt text is shared rather than duplicated. -->
          <img src="/weblica.jpg" :alt="t('about.photoAlt')" class="credibility-photo" />
        </div>
      </BaseCard>
    </section>

    <!-- Proof lives on the blog page otherwise, where nobody on the consulting path finds it. -->
    <section class="section">
      <div class="case-study">
        <div class="case-study-copy">
          <p class="case-study-eyebrow">{{ t('consulting.caseStudyEyebrow') }}</p>
          <h2 class="case-study-title">{{ t('consulting.caseStudyTitle') }}</h2>
          <p class="case-study-body">{{ t('consulting.caseStudyBody') }}</p>
        </div>
        <RouterLink
          class="case-study-link"
          :to="{
            name: 'case-study-detail-en',
            params: { lang: currentLang, slug: CASE_STUDY_SLUG },
          }"
        >
          <BaseButton variant="ghost">
            {{ t('consulting.caseStudyCta') }}
          </BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="section">
      <div class="ai-highlight">
        <p class="ai-eyebrow">{{ t('consulting.aiTransformationEyebrow') }}</p>
        <h2 class="ai-title">{{ t('consulting.aiTransformationTitle') }}</h2>
        <p class="ai-intro">{{ t('consulting.aiTransformationIntro') }}</p>
        <RouterLink :to="{ name: 'ai-consulting-en', params: { lang: currentLang } }">
          <BaseButton>
            {{ t('consulting.aiTransformationCta') }}
          </BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="section cta">
      <div class="cta-actions">
        <RouterLink :to="contactRoute">
          <BaseButton>
            {{ t('consulting.cta') }}
          </BaseButton>
        </RouterLink>
      </div>
      <p class="cta-note">
        {{ t('consulting.ctaNote') }}
      </p>
    </section>

    <!-- Training sits after the CTA on purpose: it is the fallback, not the offer. -->
    <section class="section">
      <BaseCard>
        <template #title>{{ t('consulting.trainingNoteTitle') }}</template>
        <p class="body">{{ t('consulting.trainingNoteBody') }}</p>
        <RouterLink
          class="training-note-link"
          :to="{ name: 'training-en', params: { lang: currentLang } }"
        >
          {{ t('consulting.trainingNoteCta') }}
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
  font-size: 1.6rem;
}

.page-intro {
  margin: 0 0 1.1rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.page-intro-cta {
  display: inline-block;
}

.section {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
}

.cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.cta-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--three {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
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

.body--lead {
  margin-bottom: 0.85rem;
  font-weight: 600;
}

.credibility {
  display: flex;
  flex-wrap: wrap;
  /* Centred, not top-aligned: the copy is shorter than the photo, and aligning to
     the top left an empty band under the text. */
  align-items: center;
  gap: 1.5rem;
}

/* Same shape and crop as .about-photo, but smaller: here it sits beside a short
   paragraph inside a card, not next to a full page header. */
.credibility-photo {
  flex: 0 0 auto;
  width: clamp(7rem, 12vw, 10rem);
  max-width: 100%;
  aspect-ratio: 1;
  border-radius: 28% 72% 62% 38% / 36% 36% 64% 64%;
  object-fit: cover;
  object-position: center 25%;
  display: block;
}

.credibility .body {
  flex: 1 1 20rem;
}

.offer-highlight {
  border: 1px solid var(--color-primary-soft);
  border-left: 4px solid var(--color-primary);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-md);
  padding: 1.6rem 1.75rem;
}

.offer-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary-strong);
}

.offer-title {
  margin: 0 0 0.6rem;
  font-size: 1.3rem;
}

.offer-body {
  margin: 0 0 0.7rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.offer-body--last {
  margin-bottom: 1.2rem;
}

.case-study {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 1.4rem 1.6rem;
}

.case-study-copy {
  flex: 1 1 22rem;
}

.case-study-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
}

.case-study-title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
}

.case-study-body {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 40rem;
}

.case-study-link {
  display: inline-block;
}

.training-note-link {
  display: inline-block;
  margin-top: 0.9rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.ai-highlight {
  border: 1px solid var(--color-primary-soft);
  border-left: 4px solid var(--color-primary);
  background-color: var(--color-primary-soft);
  border-radius: var(--radius-md);
  padding: 1.6rem 1.75rem;
}

.ai-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary-strong);
}

.ai-title {
  margin: 0 0 0.6rem;
  font-size: 1.3rem;
}

.ai-intro {
  margin: 0 0 1.2rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}
</style>
