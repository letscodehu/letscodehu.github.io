<script setup lang="ts">
import { ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SignupPopup from '../components/ui/SignupPopup.vue'
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
const isSignupOpen = ref(false)

function openSignup() {
  isSignupOpen.value = true
}

function closeSignup() {
  isSignupOpen.value = false
}
</script>

<template>
  <article>
    <header class="hero">
      <p class="hero-eyebrow">{{ t('trainingB2c.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('trainingB2c.pageTitle') }}</h1>
      <div class="hero-intro">
        <p v-for="(paragraph, index) in t('trainingB2c.intro')" :key="index" class="hero-subtitle">
          {{ paragraph }}
        </p>
      </div>
      <div class="hero-actions">
        <BaseButton @click="openSignup">
          {{ t('trainingB2c.cta') }}
        </BaseButton>
      </div>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.problemTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.problem')" :key="item">
            {{ item }}
          </li>
        </ul>
        <p class="section-closing">{{ t('trainingB2c.problemClosing') }}</p>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.solutionTitle') }}</h2>
      </header>
      <BaseCard>
        <div class="prose">
          <p>{{ t('trainingB2c.solutionLead') }}</p>
          <p>{{ t('trainingB2c.solutionAdr') }}</p>
          <p>{{ t('trainingB2c.solutionC4') }}</p>
          <p>{{ t('trainingB2c.solutionClosing') }}</p>
        </div>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.takeawayTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.takeaways')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.howItWorksTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.howItWorks')" :key="item">
            {{ item }}
          </li>
        </ul>
        <p class="section-closing">{{ t('trainingB2c.howItWorksClosing') }}</p>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.day1.title') }}</h2>
        <p class="section-intro">{{ t('trainingB2c.day1.goal') }}</p>
      </header>
      <div class="session-grid">
        <BaseCard v-for="session in t('trainingB2c.day1.sessions')" :key="session.title">
          <template #title>{{ session.title }}</template>
          <ul class="list">
            <li v-for="point in session.points" :key="point">
              {{ point }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.day2.title') }}</h2>
        <p class="section-intro">{{ t('trainingB2c.day2.goal') }}</p>
      </header>
      <div class="session-grid">
        <BaseCard v-for="session in t('trainingB2c.day2.sessions')" :key="session.title">
          <template #title>{{ session.title }}</template>
          <ul class="list">
            <li v-for="point in session.points" :key="point">
              {{ point }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section grid grid--two">
      <div>
        <header class="section-header">
          <h2>{{ t('trainingB2c.forWhoTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('trainingB2c.forWho')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
      <div>
        <header class="section-header">
          <h2>{{ t('trainingB2c.notForTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('trainingB2c.notFor')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section cta">
      <BaseCard>
        <template #title>{{ t('trainingB2c.ctaTitle') }}</template>
        <p class="section-intro">{{ t('trainingB2c.ctaBody') }}</p>
        <BaseButton @click="openSignup">
          {{ t('trainingB2c.cta') }}
        </BaseButton>
      </BaseCard>
    </section>

    <SignupPopup :open="isSignupOpen" @close="closeSignup" />
  </article>
</template>

<style scoped>
.hero {
  padding: 1.3rem 1.3rem 2rem;
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
  font-size: 1.8rem;
  line-height: 1.3;
}

.hero-intro {
  max-width: 50rem;
}

.hero-subtitle {
  margin: 0;
  font-size: 1rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.hero-subtitle + .hero-subtitle {
  margin-top: 0.75rem;
}

.hero-actions {
  margin-top: 1rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.55rem;
  font-size: 1.3rem;
}

.section-intro {
  margin: 0 0 0.8rem;
  font-size: 0.93rem;
  color: var(--color-text-muted);
}

.section-closing {
  margin: 0.75rem 0 0;
  font-size: 0.93rem;
  color: var(--color-text-muted);
}

.prose {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.prose p {
  margin: 0;
  font-size: 0.93rem;
  line-height: 1.5;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.session-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(290px, 1fr));
  gap: 1.2rem;
}

.list {
  margin: 0;
  padding-left: 1.2rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.cta {
  margin-bottom: 0;
}
</style>
