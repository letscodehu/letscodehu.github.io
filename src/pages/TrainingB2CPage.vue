<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SignupPopup from '../components/ui/SignupPopup.vue'
import { useI18n } from '../composables/useI18n'
import { B2C_PAYMENT_EARLY_BIRD_URL, B2C_PAYMENT_REGULAR_URL } from '../config'

const MOBILE_MAX_PX = 768
const EARLY_BIRD_DEADLINE_MS = Date.parse('2026-05-17T23:59:59.999+02:00')
const INACTIVITY_TIMEOUT_MS = 120000
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart']

const { t, currentLang } = useI18n()
const isSignupOpen = ref(false)
const paymentUnavailableNote = ref('')
const hasAutoPopupShown = ref(false)
const isEarlyBird = computed(() => Date.now() <= EARLY_BIRD_DEADLINE_MS)
const activePaymentUrl = computed(() =>
  (isEarlyBird.value ? B2C_PAYMENT_EARLY_BIRD_URL : B2C_PAYMENT_REGULAR_URL).trim()
)
const isPaymentReady = computed(() => activePaymentUrl.value.length > 0)
const inactivityTimerId = ref<number | null>(null)

const heroCtaEl = ref<HTMLElement | null>(null)
const midCtaEl = ref<HTMLElement | null>(null)
const bottomCtaEl = ref<HTMLElement | null>(null)
const heroCtaVisible = ref(true)
const midCtaVisible = ref(false)
const bottomCtaVisible = ref(false)
const isMobileViewport = ref(false)

let heroObserver: IntersectionObserver | null = null
let midObserver: IntersectionObserver | null = null
let bottomObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null

function openSignup() {
  paymentUnavailableNote.value = ''
  isSignupOpen.value = true
}

function closeSignup() {
  isSignupOpen.value = false
}

function openSignupFromAutoTrigger() {
  if (hasAutoPopupShown.value || isSignupOpen.value) {
    return
  }

  hasAutoPopupShown.value = true
  openSignup()
}

function handleExitIntent(event: MouseEvent) {
  if (event.relatedTarget) {
    return
  }

  if (event.clientY > 0) {
    return
  }

  openSignupFromAutoTrigger()
}

function clearInactivityTimer() {
  if (inactivityTimerId.value === null) {
    return
  }

  window.clearTimeout(inactivityTimerId.value)
  inactivityTimerId.value = null
}

function resetInactivityTimer() {
  if (typeof window === 'undefined') {
    return
  }

  clearInactivityTimer()
  inactivityTimerId.value = window.setTimeout(() => {
    openSignupFromAutoTrigger()
  }, INACTIVITY_TIMEOUT_MS)
}

function handlePayClick() {
  if (!isPaymentReady.value) {
    paymentUnavailableNote.value = t('trainingB2c.launch.paymentFallback')
    openSignup()
    return
  }

  window.location.href = activePaymentUrl.value
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
    !midCtaVisible.value &&
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

  midObserver = new IntersectionObserver((entries) => {
    const e = entries[0]
    midCtaVisible.value = e ? e.isIntersecting : false
  }, options)

  bottomObserver = new IntersectionObserver((entries) => {
    const e = entries[0]
    bottomCtaVisible.value = e ? e.isIntersecting : false
  }, options)

  const heroEl = heroCtaEl.value
  const midEl = midCtaEl.value
  const bottomEl = bottomCtaEl.value
  if (heroEl) {
    heroObserver.observe(heroEl)
  }
  if (midEl) {
    midObserver.observe(midEl)
  }
  if (bottomEl) {
    bottomObserver.observe(bottomEl)
  }
}

function teardownObservers() {
  heroObserver?.disconnect()
  midObserver?.disconnect()
  bottomObserver?.disconnect()
  heroObserver = null
  midObserver = null
  bottomObserver = null
}

onMounted(() => {
  syncMobileViewport()
  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`)
    mediaQuery.addEventListener('change', syncMobileViewport)
    window.addEventListener('mouseout', handleExitIntent)
    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, resetInactivityTimer, { passive: true })
    })
    resetInactivityTimer()
  }
  void nextTick(() => {
    setupObservers()
  })
})

onUnmounted(() => {
  teardownObservers()
  mediaQuery?.removeEventListener('change', syncMobileViewport)
  window.removeEventListener('mouseout', handleExitIntent)
  ACTIVITY_EVENTS.forEach((eventName) => {
    window.removeEventListener(eventName, resetInactivityTimer)
  })
  clearInactivityTimer()
  mediaQuery = null
})
</script>

<template>
  <article class="b2c-page">
    <header class="hero">
      <p class="hero-eyebrow">{{ t('trainingB2c.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('trainingB2c.pageTitle') }}</h1>
      <p class="hero-outcome">{{ t('trainingB2c.heroOutcome') }}</p>
      <div class="hero-intro">
        <p v-for="(paragraph, index) in t('trainingB2c.intro')" :key="index" class="hero-subtitle">
          {{ paragraph }}
        </p>
      </div>
      <div class="launch-meta">
        <p class="launch-meta-line">
          <strong>{{ t('trainingB2c.launch.dateLabel') }}:</strong> {{ t('trainingB2c.launch.dateValue') }}
        </p>
        <p class="launch-meta-line">
          <strong>{{ t('trainingB2c.launch.capacityLabel') }}:</strong> {{ t('trainingB2c.launch.capacityValue') }}
        </p>
      </div>
      <div class="price-box">
        <p class="price-title">{{ t('trainingB2c.launch.priceLabel') }}</p>
        <p class="price-line" :class="{ 'price-line--active': isEarlyBird }">
          {{ t('trainingB2c.launch.earlyBirdLabel') }} - {{ t('trainingB2c.launch.earlyBirdPrice') }}
        </p>
        <p class="price-line" :class="{ 'price-line--active': !isEarlyBird }">
          {{ t('trainingB2c.launch.regularLabel') }} - {{ t('trainingB2c.launch.regularPrice') }}
        </p>
      </div>
      <div ref="heroCtaEl" class="hero-actions">
        <BaseButton @click="handlePayClick">
          {{ t('trainingB2c.payCta') }}
        </BaseButton>
        <p v-if="!isPaymentReady" class="payment-note">{{ t('trainingB2c.paymentPendingNote') }}</p>
        <p v-if="paymentUnavailableNote" class="payment-note">{{ paymentUnavailableNote }}</p>
      </div>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.immediateOutcomesTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.immediateOutcomes')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

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
        <h2>{{ t('trainingB2c.whatItIsTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.whatItIs')" :key="item">
            {{ item }}
          </li>
        </ul>
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

    <section class="section section--mid-cta">
      <BaseCard>
        <template #title>{{ t('trainingB2c.midCtaTitle') }}</template>
        <p class="section-intro">{{ t('trainingB2c.midCtaBody') }}</p>
        <div ref="midCtaEl" class="cta-inline-actions">
          <BaseButton @click="handlePayClick">
            {{ t('trainingB2c.payCta') }}
          </BaseButton>
          <p v-if="!isPaymentReady" class="payment-note">{{ t('trainingB2c.paymentPendingNote') }}</p>
        </div>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('trainingB2c.trustTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('trainingB2c.trust')" :key="item">
            {{ item }}
          </li>
        </ul>
        <p class="trust-about">
          <RouterLink class="trust-about-link" :to="{ name: 'about-en', params: { lang: currentLang } }">
            {{ t('trainingB2c.trustAboutLabel') }}
          </RouterLink>
        </p>
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

    <section class="section cta">
      <BaseCard>
        <template #title>{{ t('trainingB2c.ctaTitle') }}</template>
        <p class="section-intro">{{ t('trainingB2c.ctaBody') }}</p>
        <div ref="bottomCtaEl" class="cta-inline-actions">
          <BaseButton @click="handlePayClick">
            {{ t('trainingB2c.payCta') }}
          </BaseButton>
          <BaseButton variant="ghost" @click="openSignup">
            {{ t('trainingB2c.leadMagnetCta') }}
          </BaseButton>
        </div>
        <p v-if="!isPaymentReady" class="payment-note">{{ t('trainingB2c.paymentPendingNote') }}</p>
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

.hero-outcome {
  margin: 0 0 0.75rem;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.45;
  color: var(--color-text);
  max-width: 50rem;
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

.launch-meta {
  margin-top: 0.9rem;
}

.launch-meta-line {
  margin: 0.25rem 0 0;
  font-size: 0.92rem;
  color: var(--color-text);
}

.price-box {
  margin-top: 0.9rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-soft);
}

.price-title {
  margin: 0 0 0.45rem;
  font-weight: 600;
  font-size: 0.92rem;
}

.price-line {
  margin: 0.2rem 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.price-line--active {
  color: var(--color-text);
  font-weight: 600;
}

.payment-note {
  margin: 0.5rem 0 0;
  font-size: 0.84rem;
  color: var(--color-text-muted);
}

.section {
  margin-bottom: 2rem;
}

.section--mid-cta {
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

.trust-about {
  margin: 0.85rem 0 0;
  font-size: 0.92rem;
}

.trust-about-link {
  color: var(--color-primary);
  text-decoration: underline;
  text-underline-offset: 0.15em;
}

.trust-about-link:hover {
  text-decoration-thickness: 0.1em;
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
  align-items: center;
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
