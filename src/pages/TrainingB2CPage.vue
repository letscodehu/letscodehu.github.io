<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SignupPopup from '../components/ui/SignupPopup.vue'
import { useI18n } from '../composables/useI18n'

const MOBILE_MAX_PX = 768

const { t } = useI18n()
const isSignupOpen = ref(false)

const heroCtaEl = ref<HTMLElement | null>(null)
const bottomCtaEl = ref<HTMLElement | null>(null)
const heroCtaVisible = ref(true)
const bottomCtaVisible = ref(false)
const isMobileViewport = ref(false)

let heroObserver: IntersectionObserver | null = null
let bottomObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null

function openSignup() {
  isSignupOpen.value = true
}

function closeSignup() {
  isSignupOpen.value = false
}

function syncMobileViewport() {
  if (typeof window === 'undefined') {
    return
  }
  isMobileViewport.value = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches
}

const showStickyWaitlistCta = computed(
  () =>
    isMobileViewport.value &&
    !isSignupOpen.value &&
    !heroCtaVisible.value &&
    !bottomCtaVisible.value
)

function setupObservers() {
  if (typeof IntersectionObserver === 'undefined') {
    return
  }

  const options: IntersectionObserverInit = {
    root: null,
    threshold: 0,
    rootMargin: '0px',
  }

  heroObserver = new IntersectionObserver((entries) => {
    const e = entries[0]
    heroCtaVisible.value = e ? e.isIntersecting : false
  }, options)

  bottomObserver = new IntersectionObserver((entries) => {
    const e = entries[0]
    bottomCtaVisible.value = e ? e.isIntersecting : false
  }, options)

  const heroEl = heroCtaEl.value
  const bottomEl = bottomCtaEl.value
  if (heroEl) {
    heroObserver.observe(heroEl)
  }
  if (bottomEl) {
    bottomObserver.observe(bottomEl)
  }
}

function teardownObservers() {
  heroObserver?.disconnect()
  bottomObserver?.disconnect()
  heroObserver = null
  bottomObserver = null
}

onMounted(() => {
  syncMobileViewport()
  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`)
    mediaQuery.addEventListener('change', syncMobileViewport)
  }
  void nextTick(() => {
    setupObservers()
  })
})

onUnmounted(() => {
  teardownObservers()
  mediaQuery?.removeEventListener('change', syncMobileViewport)
  mediaQuery = null
})
</script>

<template>
  <article class="b2c-page">
    <header class="hero">
      <p class="hero-eyebrow">{{ t('trainingB2c.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('trainingB2c.pageTitle') }}</h1>
      <div class="hero-intro">
        <p v-for="(paragraph, index) in t('trainingB2c.intro')" :key="index" class="hero-subtitle">
          {{ paragraph }}
        </p>
      </div>
      <div ref="heroCtaEl" class="hero-actions">
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
        <div ref="bottomCtaEl" class="cta-inline-actions">
          <BaseButton @click="openSignup">
            {{ t('trainingB2c.cta') }}
          </BaseButton>
        </div>
      </BaseCard>
    </section>

    <Teleport to="body">
      <div
        v-show="showStickyWaitlistCta"
        class="training-b2c-sticky-waitlist"
        role="region"
        :aria-label="t('trainingB2c.cta')"
      >
        <BaseButton @click="openSignup">
          {{ t('trainingB2c.cta') }}
        </BaseButton>
      </div>
    </Teleport>

    <SignupPopup :open="isSignupOpen" @close="closeSignup" />
  </article>
</template>

<style scoped>
.b2c-page {
  padding-bottom: 0;
}

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

.cta-inline-actions {
  margin-top: 0.25rem;
}

@media (max-width: 768px) {
  .b2c-page {
    padding-bottom: 5rem;
  }
}
</style>

<style>
@media (max-width: 768px) {
  .training-b2c-sticky-waitlist {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 50;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.65rem 1rem;
    padding-bottom: max(0.65rem, env(safe-area-inset-bottom));
    pointer-events: none;
    background: linear-gradient(to top, var(--color-bg) 72%, transparent);
    border-top: 1px solid var(--color-border);
    box-shadow: 0 -4px 20px rgba(15, 23, 42, 0.06);
  }

  .training-b2c-sticky-waitlist .button {
    pointer-events: auto;
    width: min(22rem, calc(100vw - 2rem));
    max-width: 100%;
  }
}
</style>
