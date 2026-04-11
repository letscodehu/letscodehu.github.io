<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'
import CheckoutEmailPopup from '../components/ui/CheckoutEmailPopup.vue'
import { useI18n } from '../composables/useI18n'

const MOBILE_MAX_PX = 768
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQ6oHbZ3ghCfGdaG7aVa00'

const { t, currentLang } = useI18n()

const heroCtaEl = ref<HTMLElement | null>(null)
const bottomCtaEl = ref<HTMLElement | null>(null)
const heroCtaVisible = ref(true)
const bottomCtaVisible = ref(false)
const isMobileViewport = ref(false)
const isCheckoutPopupOpen = ref(false)

let heroObserver: IntersectionObserver | null = null
let bottomObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null

function syncMobileViewport() {
  if (typeof window === 'undefined') {
    return
  }
  isMobileViewport.value = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches
}

const showStickyWaitlistCta = computed(
  () =>
    isMobileViewport.value &&
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

function openCheckoutPopup() {
  isCheckoutPopupOpen.value = true
}

function closeCheckoutPopup() {
  isCheckoutPopupOpen.value = false
}
</script>

<template>
  <article class="b2c-page">
    <header class="hero">
      <p class="hero-eyebrow">{{ t('trainingB2c.eyebrow') }}</p>
      <h1 class="hero-title">{{ t('trainingB2c.pageTitle') }}</h1>
      <p class="hero-workshop-date">{{ t('trainingB2c.heroWorkshopDate') }}</p>
      <div class="hero-intro">
        <p v-for="(paragraph, index) in t('trainingB2c.intro')" :key="index" class="hero-subtitle">
          {{ paragraph }}
        </p>
      </div>
      <div class="offer-meta">
        <p class="offer-meta__early">
          <span class="offer-meta__badge">{{ t('trainingB2c.offerMeta.earlyBirdLabel') }}</span>
          <strong class="offer-meta__price">{{ t('trainingB2c.offerMeta.earlyBirdPrice') }}</strong>
          <span class="offer-meta__deadline">{{ t('trainingB2c.offerMeta.earlyBirdDeadline') }}</span>
        </p>
        <p class="offer-meta__regular">
          <span class="offer-meta__regular-label">{{ t('trainingB2c.offerMeta.regularPriceLabel') }}:</span>
          <span class="offer-meta__regular-price">{{ t('trainingB2c.offerMeta.regularPrice') }}</span>
        </p>
      </div>
      <div ref="heroCtaEl" class="hero-actions">
        <BaseButton @click="openCheckoutPopup">
          {{ t('trainingB2c.cta') }}
        </BaseButton>
        <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
          {{ t('trainingB2c.termsLinkLabel') }}
        </RouterLink>
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
        <p class="problem-patch">{{ t('trainingB2c.problemImmediateHelp') }}</p>
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
          <li v-for="item in t('trainingB2c.takeaways')" :key="item.lead">
            <strong>{{ item.lead }}</strong>
            {{ item.body }}
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
        <div class="cta-gift-box">
          <p class="cta-gift-title">
            <span class="cta-gift-emoji" aria-hidden="true">🎁</span>
            {{ t('trainingB2c.ctaGiftTitle') }}
          </p>
          <p class="cta-gift-body">{{ t('trainingB2c.ctaGiftBody') }}</p>
        </div>
        <div ref="bottomCtaEl" class="cta-inline-actions">
          <BaseButton @click="openCheckoutPopup">
            {{ t('trainingB2c.cta') }}
          </BaseButton>
          <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
            {{ t('trainingB2c.termsLinkLabel') }}
          </RouterLink>
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
        <BaseButton @click="openCheckoutPopup">
          {{ t('trainingB2c.cta') }}
        </BaseButton>
      </div>
    </Teleport>
    <CheckoutEmailPopup
      :open="isCheckoutPopupOpen"
      :stripe-checkout-url="STRIPE_CHECKOUT_URL"
      @close="closeCheckoutPopup"
    />
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
  margin: 0 0 0.55rem;
  font-size: 1.8rem;
  line-height: 1.3;
}

.hero-workshop-date {
  margin: 0 0 1rem;
  max-width: 36rem;
  padding: 0.55rem 0.85rem;
  font-size: 1.12rem;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;
  color: var(--color-text);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-md);
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

.offer-meta {
  margin: 0.8rem 0 0;
}

.offer-meta__early {
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.45rem;
}

.offer-meta__badge {
  display: inline-flex;
  align-items: center;
  padding: 0.12rem 0.5rem;
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.offer-meta__price {
  font-size: 1.12rem;
  font-weight: 800;
}

.offer-meta__deadline {
  font-weight: 600;
  color: var(--color-text-muted);
}

.offer-meta__regular {
  margin: 0.2rem 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem;
  color: var(--color-text-muted);
}

.offer-meta__regular-label {
  font-size: 0.9rem;
}

.offer-meta__regular-price {
  font-size: 0.95rem;
  text-decoration: line-through;
  text-decoration-thickness: 1.5px;
}

.hero-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
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

.problem-patch {
  margin: 1rem 0 0;
  padding: 0.85rem 1rem;
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--color-text);
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-primary);
  border-radius: var(--radius-md);
  overflow-wrap: break-word;
  word-break: break-word;
}

.cta-gift-box {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  margin: 1rem 0 0.75rem;
  padding: 1rem 1.1rem;
  background: var(--color-surface-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.cta-gift-title {
  margin: 0 0 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  display: flex;
  align-items: flex-start;
  gap: 0.4rem;
  line-height: 1.35;
}

.cta-gift-emoji {
  flex-shrink: 0;
  font-size: 1.1rem;
  line-height: 1.35;
}

.cta-gift-body {
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.55;
  color: var(--color-text-muted);
  overflow-wrap: break-word;
  word-break: break-word;
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
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.85rem;
}

.terms-link {
  font-weight: 600;
  color: var(--color-primary-strong);
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 0.2em;
}

.terms-link:hover {
  color: var(--color-primary);
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
