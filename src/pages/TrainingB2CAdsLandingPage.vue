<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import { useI18n } from '../composables/useI18n'

const MOBILE_MAX_PX = 768
const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQ6oHbZ3ghCfGdaG7aVa00'

const { t, currentLang } = useI18n()
const instructorImages = ['/webconf.jpg', '/cldrmeetup.jpg'] as const
const currentImageIndex = ref(0)
const heroCtaEl = ref<HTMLElement | null>(null)
const bottomCtaEl = ref<HTMLElement | null>(null)
const heroCtaVisible = ref(true)
const bottomCtaVisible = ref(false)
const isMobileViewport = ref(false)

let imageRotationInterval: ReturnType<typeof setInterval> | null = null
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
    const entry = entries[0]
    heroCtaVisible.value = entry ? entry.isIntersecting : false
  }, options)

  bottomObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    bottomCtaVisible.value = entry ? entry.isIntersecting : false
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

  imageRotationInterval = window.setInterval(() => {
    currentImageIndex.value = (currentImageIndex.value + 1) % instructorImages.length
  }, 10000)

  void nextTick(() => {
    setupObservers()
  })
})

onUnmounted(() => {
  teardownObservers()
  mediaQuery?.removeEventListener('change', syncMobileViewport)
  mediaQuery = null

  if (imageRotationInterval == null) {
    return
  }

  window.clearInterval(imageRotationInterval)
  imageRotationInterval = null
})
</script>

<template>
  <article class="ads-landing">
    <section class="hero">
      <p class="eyebrow fade fade--1">{{ t('trainingB2cAds.eyebrow') }}</p>
      <h1 class="hero-title fade fade--2">{{ t('trainingB2cAds.heroTitle') }}</h1>
      <p class="hero-body fade fade--3">{{ t('trainingB2cAds.heroBody') }}</p>
      <p class="hero-sub fade fade--4">{{ t('trainingB2cAds.heroSub') }}</p>
      <div class="offer-meta fade fade--4">
        <p class="offer-meta__early">
          <span class="offer-meta__badge">{{ t('trainingB2cAds.offerMeta.earlyBirdLabel') }}</span>
          <strong class="offer-meta__price">{{ t('trainingB2cAds.offerMeta.earlyBirdPrice') }}</strong>
          <span class="offer-meta__deadline">{{ t('trainingB2cAds.offerMeta.earlyBirdDeadline') }}</span>
        </p>
        <p class="offer-meta__regular">
          <span class="offer-meta__regular-label">{{ t('trainingB2cAds.offerMeta.regularPriceLabel') }}:</span>
          <span class="offer-meta__regular-price">{{ t('trainingB2cAds.offerMeta.regularPrice') }}</span>
        </p>
      </div>

      <div ref="heroCtaEl" class="hero-actions fade fade--5">
        <BaseButton as="a" :href="STRIPE_CHECKOUT_URL">
          {{ t('trainingB2cAds.ctaPrimary') }}
        </BaseButton>
        <RouterLink class="full-program-link" :to="{ name: 'training-b2c-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.fullProgramLinkLabel') }}
        </RouterLink>
        <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.termsLinkLabel') }}
        </RouterLink>
      </div>
      <p class="checkout-note fade fade--5">{{ t('trainingB2cAds.checkoutNote') }}</p>
    </section>

    <section class="proof">
      <h2 class="section-title">{{ t('trainingB2cAds.proofTitle') }}</h2>
      <ul class="proof-list">
        <li v-for="point in t('trainingB2cAds.proofPoints')" :key="point">
          {{ point }}
        </li>
      </ul>
    </section>

    <section class="outcomes">
      <h2 class="section-title">{{ t('trainingB2cAds.outcomesTitle') }}</h2>
      <ul class="outcome-grid">
        <li v-for="item in t('trainingB2cAds.outcomes')" :key="item" class="outcome-card">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="instructor">
      <div class="instructor-media" role="img" :aria-label="t('trainingB2cAds.instructorImagePlaceholderAria')">
        <Transition name="instructor-fade" mode="out-in">
          <img
            :key="instructorImages[currentImageIndex]"
            class="instructor-image"
            :src="instructorImages[currentImageIndex]"
            :alt="t('trainingB2cAds.instructorImagePlaceholderAria')"
            loading="lazy"
            decoding="async"
          />
        </Transition>
      </div>
      <div class="instructor-copy">
        <h2 class="section-title">{{ t('trainingB2cAds.instructorTitle') }}</h2>
        <p>{{ t('trainingB2cAds.instructorBody1') }}</p>
        <p>{{ t('trainingB2cAds.instructorBody2') }}</p>
      </div>
    </section>

    <section class="final-cta">
      <h2>{{ t('trainingB2cAds.ctaSecondaryTitle') }}</h2>
      <p>{{ t('trainingB2cAds.ctaSecondaryBody') }}</p>
      <div ref="bottomCtaEl" class="final-cta-actions">
        <BaseButton as="a" :href="STRIPE_CHECKOUT_URL">
          {{ t('trainingB2cAds.ctaSecondaryButton') }}
        </BaseButton>
        <RouterLink class="full-program-link" :to="{ name: 'training-b2c-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.fullProgramLinkLabel') }}
        </RouterLink>
        <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.termsLinkLabel') }}
        </RouterLink>
      </div>
      <p class="checkout-note">{{ t('trainingB2cAds.checkoutNote') }}</p>
    </section>

    <Teleport to="body">
      <div
        v-show="showStickyWaitlistCta"
        class="training-b2c-ads-sticky-waitlist"
        role="region"
        :aria-label="t('trainingB2cAds.ctaSecondaryButton')"
      >
        <BaseButton as="a" :href="STRIPE_CHECKOUT_URL">
          {{ t('trainingB2cAds.ctaSecondaryButton') }}
        </BaseButton>
      </div>
    </Teleport>
  </article>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&display=swap');

.ads-landing {
  --landing-accent: #f97316;
  --landing-accent-soft: rgba(249, 115, 22, 0.22);
  --landing-border: rgba(15, 23, 42, 0.18);
  --landing-grid-line: rgba(15, 23, 42, 0.08);
  --landing-shadow: 0 18px 40px rgba(15, 23, 42, 0.15);
  --landing-panel-bg: var(--color-surface);
  --landing-hero-bg: linear-gradient(130deg, var(--color-surface) 0%, var(--color-surface-soft) 45%, var(--landing-accent-soft) 100%);
  --landing-card-bg: linear-gradient(140deg, var(--color-surface) 0%, var(--landing-accent-soft) 170%);
  --landing-instructor-bg: linear-gradient(150deg, var(--landing-accent-soft) 0%, transparent 100%),
    var(--color-surface-soft);
  --landing-c4-opacity: 0.48;
  font-family: 'IBM Plex Sans', sans-serif;
  display: grid;
  gap: 1.8rem;
}

:global(html.theme-dark) .ads-landing,
:global(html[data-theme='dark']) .ads-landing {
  --landing-accent: #fb923c;
  --landing-accent-soft: rgba(251, 146, 60, 0.22);
  --landing-border: rgba(148, 163, 184, 0.36);
  --landing-grid-line: rgba(148, 163, 184, 0.22);
  --landing-shadow: 0 22px 52px rgba(0, 0, 0, 0.45);
  --landing-panel-bg: color-mix(in srgb, var(--color-surface) 92%, black 8%);
  --landing-hero-bg: linear-gradient(
    130deg,
    color-mix(in srgb, var(--color-surface) 90%, black 10%) 0%,
    color-mix(in srgb, var(--color-surface-soft) 90%, black 10%) 48%,
    var(--landing-accent-soft) 100%
  );
  --landing-card-bg: linear-gradient(140deg, color-mix(in srgb, var(--color-surface) 92%, black 8%) 0%, var(--landing-accent-soft) 180%);
  --landing-instructor-bg: linear-gradient(150deg, var(--landing-accent-soft) 0%, transparent 100%),
    color-mix(in srgb, var(--color-surface-soft) 88%, black 12%);
  --landing-c4-opacity: 0.12;
}

.hero {
  position: relative;
  overflow: hidden;
  border: 1px solid var(--landing-border);
  border-radius: var(--radius-lg);
  padding: clamp(1.3rem, 2.8vw, 2rem);
  box-shadow: var(--landing-shadow);
  background: var(--landing-hero-bg);
}

/* C4 diagram: subtle watermark over the gradient, under the square grid */
.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/c4.png');
  background-repeat: no-repeat;
  background-position: 88% 42%;
  background-size: min(46vw, 360px) auto;
  opacity: var(--landing-c4-opacity);
  pointer-events: none;
  z-index: 0;
  mask-image: radial-gradient(ellipse 65% 70% at 86% 44%, black 0%, transparent 72%);
  -webkit-mask-image: radial-gradient(ellipse 65% 70% at 86% 44%, black 0%, transparent 72%);
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  background-image: linear-gradient(var(--landing-grid-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--landing-grid-line) 1px, transparent 1px);
  background-size: 24px 24px;
  mask-image: radial-gradient(circle at 85% 15%, black 22%, transparent 78%);
  pointer-events: none;
}

.eyebrow,
.hero-title,
.hero-body,
.hero-sub,
.section-title,
.final-cta h2 {
  position: relative;
  z-index: 2;
}

.eyebrow {
  margin: 0 0 0.6rem;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  font-size: 0.76rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.hero-title {
  margin: 0;
  max-width: 17ch;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.05;
  font-size: clamp(1.9rem, 6.2vw, 3.4rem);
}

.hero-body {
  margin: 1rem 0 0;
  max-width: 62ch;
  font-size: clamp(1rem, 2.2vw, 1.12rem);
  line-height: 1.58;
  color: var(--color-text);
}

.hero-sub {
  margin: 0.7rem 0 0;
  max-width: 60ch;
  color: var(--color-text-muted);
}

.offer-meta {
  margin: 0.85rem 0 0;
  max-width: 60ch;
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
  border: 1px solid var(--landing-border);
  border-radius: 999px;
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

.offer-meta__price {
  font-size: 1.15rem;
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
  position: relative;
  z-index: 2;
  margin-top: 1.2rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.8rem;
}

.full-program-link,
.terms-link {
  font-weight: 600;
  color: var(--color-primary-strong);
  text-decoration: underline;
  text-decoration-thickness: 1.5px;
  text-underline-offset: 0.2em;
  transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
}

.full-program-link:hover,
.terms-link:hover {
  color: var(--landing-accent);
  text-decoration-color: var(--landing-accent);
}

.proof,
.outcomes,
.instructor,
.final-cta {
  border: 1px solid var(--landing-border);
  border-radius: var(--radius-lg);
  background: var(--landing-panel-bg);
  padding: clamp(1rem, 2.4vw, 1.45rem);
}

.section-title {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.25rem, 3.6vw, 1.75rem);
  letter-spacing: -0.01em;
}

.proof-list {
  margin: 0.95rem 0 0;
  padding-left: 1.2rem;
  display: grid;
  gap: 0.65rem;
}

.proof-list li::marker {
  color: var(--landing-accent);
}

.outcome-grid {
  margin: 0.95rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.outcome-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--landing-border);
  background: var(--landing-card-bg);
  padding: 0.9rem;
  line-height: 1.5;
}

.instructor {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: 1rem;
  align-items: start;
}

.instructor-media {
  border-radius: var(--radius-md);
  background: var(--landing-instructor-bg);
  height: clamp(18rem, 34vw, 24rem);
  overflow: hidden;
}

.instructor-image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.instructor-fade-enter-active,
.instructor-fade-leave-active {
  transition: opacity 540ms ease;
}

.instructor-fade-enter-from,
.instructor-fade-leave-to {
  opacity: 0;
}

.instructor-copy p {
  margin: 0.7rem 0 0;
  line-height: 1.6;
}

.final-cta {
  background: linear-gradient(120deg, var(--color-surface) 0%, var(--landing-accent-soft) 120%);
}

.final-cta h2 {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.25rem, 3.2vw, 1.7rem);
}

.final-cta p {
  margin: 0.7rem 0 0;
  max-width: 65ch;
}

.checkout-note {
  margin: 0.75rem 0 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.final-cta-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
}

.fade {
  opacity: 0;
  transform: translateY(16px);
  animation: riseIn 640ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

.fade--1 {
  animation-delay: 70ms;
}
.fade--2 {
  animation-delay: 120ms;
}
.fade--3 {
  animation-delay: 180ms;
}
.fade--4 {
  animation-delay: 230ms;
}
.fade--5 {
  animation-delay: 300ms;
}

@keyframes riseIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 46rem) {
  .ads-landing {
    padding-bottom: 5rem;
  }

  .outcome-grid {
    grid-template-columns: 1fr;
  }

  .instructor {
    grid-template-columns: 1fr;
  }

  .instructor-media {
    height: clamp(12rem, 56vw, 16rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .instructor-fade-enter-active,
  .instructor-fade-leave-active {
    transition: none;
  }

  .full-program-link {
    transition: none;
  }
}
</style>

<style>
@media (max-width: 768px) {
  .training-b2c-ads-sticky-waitlist {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 70;
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

  .training-b2c-ads-sticky-waitlist .button {
    pointer-events: auto;
    width: min(22rem, calc(100vw - 2rem));
    max-width: 100%;
  }
}
</style>
