<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from '../composables/useI18n'
import { blogPostManifest } from '../data/blog-post-manifest'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const { t, currentLang } = useI18n()

/** AI-tagged posts double as the credibility proof for this page. */
const aiPosts = computed(() =>
  blogPostManifest
    .filter((post) => post.tags.includes('ai'))
    .map((post) => ({
      slug: post.slug,
      title: currentLang.value === 'hu' ? post.titleHu : post.titleEn,
    }))
)

/** AI-framed variant of the contact page, so the booking step matches what was promised here. */
const contactRoute = computed(() => ({
  name: 'contact-ai-en',
  params: { lang: currentLang.value },
}))

/** The quiz is Hungarian-only, so the secondary CTA only makes sense on the HU page. */
const showQuizCta = computed(() => currentLang.value === 'hu')
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('aiConsulting.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('aiConsulting.intro') }}
      </p>
      <RouterLink class="page-intro-cta" :to="contactRoute">
        <BaseButton>
          {{ t('aiConsulting.cta') }}
        </BaseButton>
      </RouterLink>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('aiConsulting.problemsTitle') }}</h2>
      </header>
      <BaseCard>
        <template #title>{{ t('aiConsulting.problemsCardTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('aiConsulting.problems')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section grid grid--three">
      <BaseCard>
        <template #title>{{ t('aiConsulting.assessmentTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('aiConsulting.assessment')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('aiConsulting.decisionsTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('aiConsulting.decisions')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('aiConsulting.practicesTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('aiConsulting.practices')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <div class="ai-highlight">
        <p class="ai-eyebrow">{{ t('aiConsulting.offerEyebrow') }}</p>
        <h2 class="ai-title">{{ t('aiConsulting.offerTitle') }}</h2>
        <p class="ai-intro">{{ t('aiConsulting.offerBody') }}</p>
        <p class="ai-intro ai-intro--last">{{ t('aiConsulting.offerBodySecondary') }}</p>
        <RouterLink :to="contactRoute">
          <BaseButton>
            {{ t('aiConsulting.cta') }}
          </BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="section">
      <BaseCard>
        <template #title>{{ t('aiConsulting.noTitle') }}</template>
        <p class="body body--lead">{{ t('aiConsulting.noIntro') }}</p>
        <ul class="list">
          <li v-for="item in t('aiConsulting.no')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section v-if="showQuizCta" class="section">
      <div class="quiz-cta">
        <div class="quiz-cta-copy">
          <h2 class="quiz-cta-title">{{ t('aiConsulting.quizTitle') }}</h2>
          <p class="quiz-cta-body">{{ t('aiConsulting.quizBody') }}</p>
        </div>
        <RouterLink class="quiz-cta-link" :to="{ name: 'quiz', params: { lang: currentLang } }">
          <BaseButton variant="ghost">
            {{ t('aiConsulting.quizCta') }}
          </BaseButton>
        </RouterLink>
      </div>
    </section>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('aiConsulting.credibilityTitle') }}</template>
        <p class="body">{{ t('aiConsulting.credibilityBody') }}</p>
        <!-- Badge images live in public/; update files and hrefs if credentials change. -->
        <div class="credly-badge-list">
          <a
            href="https://www.credly.com/badges/b7004ded-799d-44cc-9bd0-c98456f28c4a/public_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/aws-certified-solutions-architect-associate.png"
              :alt="t('about.credlyBadgeSaaAlt')"
              class="credly-badge-image"
            />
          </a>
          <a
            href="https://www.credly.com/badges/146e44d2-967f-412a-9e60-2a21b5d73373/public_url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/claude-certified-architect-foundations.png"
              :alt="t('about.credlyBadgeClaudeArchitectAlt')"
              class="credly-badge-image"
            />
          </a>
        </div>
      </BaseCard>

      <BaseCard>
        <template #title>{{ t('aiConsulting.leadershipTitle') }}</template>
        <p class="body">{{ t('aiConsulting.leadershipBody') }}</p>
      </BaseCard>
    </section>

    <section class="section cta">
      <div class="cta-actions">
        <RouterLink :to="contactRoute">
          <BaseButton>
            {{ t('aiConsulting.cta') }}
          </BaseButton>
        </RouterLink>
        <RouterLink :to="{ name: 'consulting-en', params: { lang: currentLang } }">
          <BaseButton variant="ghost">
            {{ t('nav.consulting') }}
          </BaseButton>
        </RouterLink>
      </div>
      <p class="cta-note">
        {{ t('aiConsulting.ctaNote') }}
      </p>
    </section>

    <!-- Reading list sits after the CTA on purpose: these links lead away from the funnel,
         so they open in a new tab and never stand between the reader and the booking step. -->
    <section class="section">
      <header class="section-header">
        <h2>{{ t('aiConsulting.readingTitle') }}</h2>
        <p class="section-intro">{{ t('aiConsulting.readingIntro') }}</p>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="post in aiPosts" :key="post.slug">
            <RouterLink
              class="reading-link"
              target="_blank"
              rel="noopener"
              :to="{
                name: 'blog-post-detail-en',
                params: { lang: currentLang, slug: post.slug },
              }"
            >
              {{ post.title }}
            </RouterLink>
          </li>
        </ul>
        <RouterLink
          class="reading-all"
          target="_blank"
          rel="noopener"
          :to="{ name: 'blog-list-en', params: { lang: currentLang }, query: { tag: 'ai' } }"
        >
          {{ t('aiConsulting.readingAllTag') }}
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

.section-intro {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 44rem;
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

.reading-link {
  color: var(--color-primary-strong);
  text-decoration: none;
}

.reading-link:hover {
  text-decoration: underline;
}

.reading-all {
  display: inline-block;
  margin-top: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.credly-badge-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1.1rem;
}

.credly-badge-image {
  width: 5.5rem;
  height: auto;
  display: block;
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
  margin: 0 0 0.7rem;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.ai-intro--last {
  margin-bottom: 1.2rem;
}

.quiz-cta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  border: 1px solid var(--color-border-strong);
  border-radius: var(--radius-md);
  padding: 1.4rem 1.6rem;
}

.quiz-cta-copy {
  flex: 1 1 22rem;
}

.quiz-cta-title {
  margin: 0 0 0.4rem;
  font-size: 1.1rem;
}

.quiz-cta-body {
  margin: 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 40rem;
}

.quiz-cta-link {
  display: inline-block;
}
</style>
