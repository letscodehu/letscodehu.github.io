<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import BaseButton from '../components/ui/BaseButton.vue'
import { useI18n } from '../composables/useI18n'
import {
  trackTrainingWorkshopCtaClick,
  trackTrainingWorkshopStripeRedirect,
  type TrainingWorkshopCtaPlacement,
} from '../tracking'

const MOBILE_MAX_PX = 768
const STRIPE_CHECKOUT_URL =
  'https://buy.stripe.com/8x2eVde7b9Te3Xv7tVaVa02?prefilled_promo_code=EARLYBIRD'

const { t, currentLang } = useI18n()
const instructorImages = ['/webconf.jpg', '/cldrmeetup.jpg'] as const
const currentImageIndex = ref(0)
const heroCtaEl = ref<HTMLElement | null>(null)
const middleCtaEl = ref<HTMLElement | null>(null)
const bottomCtaEl = ref<HTMLElement | null>(null)
const heroCtaVisible = ref(true)
const middleCtaVisible = ref(false)
const bottomCtaVisible = ref(false)
const isMobileViewport = ref(false)
/** Set in onMounted after feature detection; sticky CTA visibility relies on IntersectionObserver. */
const intersectionObserverSupported = ref(false)

let imageRotationInterval: ReturnType<typeof setInterval> | null = null
let heroObserver: IntersectionObserver | null = null
let middleObserver: IntersectionObserver | null = null
let bottomObserver: IntersectionObserver | null = null
let sectionRevealObserver: IntersectionObserver | null = null
let mediaQuery: MediaQueryList | null = null

function syncMobileViewport() {
  if (typeof window === 'undefined') {
    return
  }

  isMobileViewport.value = window.matchMedia(`(max-width: ${MOBILE_MAX_PX}px)`).matches
}

const showStickyWaitlistCta = computed(
  () =>
    intersectionObserverSupported.value &&
    isMobileViewport.value &&
    !heroCtaVisible.value &&
    !middleCtaVisible.value &&
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

  middleObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    middleCtaVisible.value = entry ? entry.isIntersecting : false
  }, options)

  bottomObserver = new IntersectionObserver((entries) => {
    const entry = entries[0]
    bottomCtaVisible.value = entry ? entry.isIntersecting : false
  }, options)

  const heroEl = heroCtaEl.value
  const middleEl = middleCtaEl.value
  const bottomEl = bottomCtaEl.value
  if (heroEl) {
    heroObserver.observe(heroEl)
  }
  if (middleEl) {
    middleObserver.observe(middleEl)
  }
  if (bottomEl) {
    bottomObserver.observe(bottomEl)
  }
}

function teardownObservers() {
  heroObserver?.disconnect()
  middleObserver?.disconnect()
  bottomObserver?.disconnect()
  heroObserver = null
  middleObserver = null
  bottomObserver = null
}

function applySectionRevealFallbackNoIntersectionObserver() {
  if (typeof document === 'undefined') {
    return
  }
  const root = document.querySelector('.ads-landing')
  if (!root) {
    return
  }
  root.classList.add('ads-landing--no-intersection-observer')
}

function setupSectionRevealObserver() {
  if (typeof IntersectionObserver === 'undefined' || typeof document === 'undefined') {
    return
  }

  const root = document.querySelector('.ads-landing')
  if (!root) {
    return
  }

  const elements = root.querySelectorAll('[data-section-reveal]')
  if (elements.length === 0) {
    return
  }

  const revealOptions: IntersectionObserverInit = {
    root: null,
    threshold: 0.08,
    rootMargin: '0px 0px -8% 0px',
  }

  sectionRevealObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) {
        continue
      }
      entry.target.classList.add('section-reveal--visible')
      sectionRevealObserver?.unobserve(entry.target)
    }
  }, revealOptions)

  for (const el of elements) {
    sectionRevealObserver.observe(el)
  }
}

function teardownSectionRevealObserver() {
  sectionRevealObserver?.disconnect()
  sectionRevealObserver = null
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
    const ioSupported = typeof IntersectionObserver !== 'undefined'
    intersectionObserverSupported.value = ioSupported
    if (!ioSupported) {
      applySectionRevealFallbackNoIntersectionObserver()
      return
    }
    setupObservers()
    setupSectionRevealObserver()
  })
})

onUnmounted(() => {
  teardownObservers()
  teardownSectionRevealObserver()
  mediaQuery?.removeEventListener('change', syncMobileViewport)
  mediaQuery = null

  if (imageRotationInterval == null) {
    return
  }

  window.clearInterval(imageRotationInterval)
  imageRotationInterval = null
})

function handlePrimaryCtaClick(placement: TrainingWorkshopCtaPlacement) {
  trackTrainingWorkshopCtaClick({ placement, nextStep: 'stripe_checkout' })
  trackTrainingWorkshopStripeRedirect({ source: 'cta_direct' })
  window.location.assign(STRIPE_CHECKOUT_URL)
}

const faqItemsList = computed(() => {
  const raw = t('trainingB2cAds.faqItems')
  return Array.isArray(raw) ? raw : []
})

const fullProgramLocation = computed(() => ({
  name: 'training-b2c-ads-en',
  params: { lang: currentLang.value },
  hash: '#workshop-detailed-program',
}))

type ProgramSlot = { time: string; title: string; body: string }
type ProgramDay = { title: string; slots: ProgramSlot[] }

const detailedProgram = computed(() => {
  const raw = t('trainingB2cAds.detailedProgram')
  if (raw && typeof raw === 'object' && Array.isArray((raw as { days?: unknown }).days)) {
    return raw as { sectionTitle: string; days: ProgramDay[] }
  }
  return { sectionTitle: '', days: [] as ProgramDay[] }
})

type InstructorBody2Parts = {
  beforeDevops: string
  betweenDevopsAndAdr: string
  betweenAdrAndKrisztian: string
  betweenKrisztianAndCommunity: string
  afterCommunity: string
  beforePodcast: string
  afterPodcast: string
}

type InstructorLinks = {
  devopsPracticesLabel: string
  devopsPracticesUrl: string
  adrLabel: string
  adrUrl: string
  krisztianLabel: string
  krisztianUrl: string
  communityLabel: string
  communityUrl: string
  soundcloudLabel: string
  soundcloudUrl: string
}

const instructorBody2Parts = computed(() => t('trainingB2cAds.instructorBody2Parts') as InstructorBody2Parts)
const instructorLinks = computed(() => t('trainingB2cAds.instructorLinks') as InstructorLinks)
</script>

<template>
  <article class="ads-landing">
    <section class="hero">
      <p class="eyebrow fade fade--1">{{ t('trainingB2cAds.eyebrow') }}</p>
      <h1 class="hero-title fade fade--2">{{ t('trainingB2cAds.heroTitle') }}</h1>
      <div class="hero-pain fade fade--3">
        <p class="hero-pain-title">{{ t('trainingB2cAds.heroPainTitle') }}</p>
        <ul class="hero-pain-list">
          <li v-for="point in t('trainingB2cAds.heroPainPoints')" :key="point">{{ point }}</li>
        </ul>
        <p class="hero-pain-closing">{{ t('trainingB2cAds.heroPainClosing') }}</p>
      </div>
      <div class="offer-meta fade fade--4">
        <p class="offer-meta__early">
          <span class="offer-meta__badge">{{ t('trainingB2cAds.offerMeta.earlyBirdLabel') }}</span>
          <strong class="offer-meta__price">{{ t('trainingB2cAds.offerMeta.earlyBirdPrice') }}</strong>
          <span class="offer-meta__deadline">{{ t('trainingB2cAds.offerMeta.earlyBirdDeadline') }}</span>
        </p>
        <p class="offer-meta__compare">{{ t('trainingB2cAds.offerMeta.priceComparison') }}</p>
      </div>

      <div ref="heroCtaEl" class="hero-actions fade fade--5">
        <BaseButton @click="handlePrimaryCtaClick('hero')">
          {{ t('trainingB2cAds.ctaPrimary') }}
        </BaseButton>
        <RouterLink class="full-program-link" :to="fullProgramLocation">
          {{ t('trainingB2cAds.fullProgramLinkLabel') }}
        </RouterLink>
      </div>
      <p class="cta-seats-left fade fade--5">{{ t('trainingB2cAds.ctaSeatsLeft') }}</p>
    </section>

    <section class="hero-reassurance-panel section-reveal" data-section-reveal>
      <ul class="hero-reassurance-panel__list">
        <li v-for="point in t('trainingB2cAds.heroReassurancePoints')" :key="point">{{ point }}</li>
      </ul>
      <p class="checkout-note">{{ t('trainingB2cAds.checkoutNote') }}</p>
      <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
        {{ t('trainingB2cAds.termsLinkLabel') }}
      </RouterLink>
    </section>

    <section class="outcomes section-reveal" data-section-reveal>
      <h2 class="section-title">{{ t('trainingB2cAds.outcomesTitle') }}</h2>
      <ul class="outcome-grid">
        <li v-for="item in t('trainingB2cAds.outcomes')" :key="item" class="outcome-card">
          {{ item }}
        </li>
      </ul>
    </section>

    <section class="instructor section-reveal" data-section-reveal>
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
        <p>
          {{ instructorBody2Parts.beforeDevops }}
          <a
            class="instructor-inline-link"
            :href="instructorLinks.devopsPracticesUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ instructorLinks.devopsPracticesLabel }}
          </a>
          {{ instructorBody2Parts.betweenDevopsAndAdr }}
          <a
            class="instructor-inline-link"
            :href="instructorLinks.adrUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ instructorLinks.adrLabel }}
          </a>
          {{ instructorBody2Parts.betweenAdrAndKrisztian }}
          <a
            class="instructor-inline-link"
            :href="instructorLinks.krisztianUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ instructorLinks.krisztianLabel }}
          </a>
          {{ instructorBody2Parts.betweenKrisztianAndCommunity }}
          <a
            class="instructor-inline-link"
            :href="instructorLinks.communityUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ instructorLinks.communityLabel }}
          </a>
          {{ instructorBody2Parts.afterCommunity }}
          {{ instructorBody2Parts.beforePodcast }}
          <a
            class="instructor-inline-link"
            :href="instructorLinks.soundcloudUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ instructorLinks.soundcloudLabel }}
          </a>
          {{ instructorBody2Parts.afterPodcast }}
        </p>
      </div>
    </section>

    <section id="ads-faq" class="faq section-reveal" data-section-reveal aria-labelledby="ads-faq-title">
      <h2 id="ads-faq-title" class="section-title">{{ t('trainingB2cAds.faqTitle') }}</h2>
      <div class="faq-accordion">
        <template v-for="(item, faqIndex) in faqItemsList" :key="faqIndex">
          <details v-if="item.variant !== 'cancellation'" class="faq-item">
            <summary class="faq-summary">
              <span class="faq-summary__text">{{ item.question }}</span>
            </summary>
            <div class="faq-panel">
              <p v-for="(para, pIdx) in item.paragraphs" :key="pIdx" class="faq-p">{{ para }}</p>
            </div>
          </details>
          <details v-else class="faq-item">
            <summary class="faq-summary">
              <span class="faq-summary__text">{{ item.question }}</span>
            </summary>
            <div class="faq-panel">
              <p class="faq-p">{{ t('trainingB2cAds.faqCancellationLead') }}</p>
              <p v-for="(point, pointIndex) in t('trainingB2cAds.faqCancellationPoints')" :key="pointIndex" class="faq-p">
                {{ point }}
              </p>
              <p class="faq-p faq-terms-link-wrap">
                {{ t('trainingB2cAds.faqTermsLinkIntro') }}
                <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
                  {{ t('trainingB2cAds.termsLinkLabel') }}
                </RouterLink>
              </p>
            </div>
          </details>
        </template>
      </div>
    </section>

    <section class="final-cta section-reveal" data-section-reveal>
      <h2>{{ t('trainingB2cAds.ctaSecondaryTitle') }}</h2>
      <p>{{ t('trainingB2cAds.ctaSecondaryBody') }}</p>
      <div ref="middleCtaEl" class="final-cta-actions">
        <BaseButton @click="handlePrimaryCtaClick('middle')">
          {{ t('trainingB2cAds.ctaPrimary') }}
        </BaseButton>
        <RouterLink class="full-program-link" :to="fullProgramLocation">
          {{ t('trainingB2cAds.fullProgramLinkLabel') }}
        </RouterLink>
        <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.termsLinkLabel') }}
        </RouterLink>
      </div>
      <p class="cta-seats-left">{{ t('trainingB2cAds.ctaSeatsLeft') }}</p>
      <p class="checkout-note">{{ t('trainingB2cAds.checkoutNote') }}</p>
    </section>

    <section
      id="workshop-detailed-program"
      class="detailed-program section-reveal"
      data-section-reveal
      aria-labelledby="detailed-program-title"
    >
      <h2 id="detailed-program-title" class="section-title">{{ detailedProgram.sectionTitle }}</h2>
      <div v-for="(day, dayIndex) in detailedProgram.days" :key="dayIndex" class="program-day">
        <h3 class="program-day__title">{{ day.title }}</h3>
        <ul class="program-slots">
          <li v-for="(slot, slotIndex) in day.slots" :key="slotIndex" class="program-slot">
            <div class="program-slot__time">{{ slot.time }}</div>
            <div class="program-slot__main">
              <div class="program-slot__heading">{{ slot.title }}</div>
              <p v-if="slot.body" class="program-slot__body">{{ slot.body }}</p>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <section class="program-footer-cta section-reveal" data-section-reveal>
      <h2>{{ t('trainingB2cAds.programFooterCtaTitle') }}</h2>
      <p>{{ t('trainingB2cAds.programFooterCtaBody') }}</p>
      <div ref="bottomCtaEl" class="program-footer-cta-actions">
        <BaseButton @click="handlePrimaryCtaClick('bottom')">
          {{ t('trainingB2cAds.ctaPrimary') }}
        </BaseButton>
        <RouterLink class="terms-link" :to="{ name: 'training-b2c-terms-en', params: { lang: currentLang } }">
          {{ t('trainingB2cAds.termsLinkLabel') }}
        </RouterLink>
      </div>
      <p class="cta-seats-left">{{ t('trainingB2cAds.ctaSeatsLeft') }}</p>
      <p class="checkout-note">{{ t('trainingB2cAds.checkoutNote') }}</p>
    </section>

    <Teleport to="body">
      <div
        v-show="showStickyWaitlistCta"
        class="training-b2c-ads-sticky-waitlist"
        role="region"
        :aria-label="t('trainingB2cAds.ctaPrimary')"
      >
        <div class="training-b2c-ads-sticky-waitlist__inner">
          <BaseButton @click="handlePrimaryCtaClick('sticky')">
            {{ t('trainingB2cAds.ctaPrimary') }}
          </BaseButton>
          <p class="training-b2c-ads-sticky-waitlist__seats-left">{{ t('trainingB2cAds.ctaSeatsLeft') }}</p>
        </div>
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
  --landing-c4-opacity: 0.18;
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

.section-reveal {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 720ms cubic-bezier(0.2, 0.8, 0.2, 1),
    transform 720ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.section-reveal.section-reveal--visible {
  opacity: 1;
  transform: translateY(0);
}

.ads-landing--no-intersection-observer .section-reveal {
  opacity: 1;
  transform: none;
  transition: none;
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
.hero-pain,
.hero-pain-title,
.hero-pain-closing,
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

.hero-pain {
  margin: 1rem 0 0;
  max-width: 62ch;
}

.hero-pain-title {
  margin: 0 0 0.45rem;
  font-size: clamp(1rem, 2.2vw, 1.12rem);
  font-weight: 700;
  line-height: 1.35;
  color: var(--color-text);
}

.hero-pain-list {
  margin: 0;
  padding-left: 1.2rem;
  font-size: clamp(0.95rem, 2vw, 1.05rem);
  line-height: 1.55;
  color: var(--color-text-muted);
}

.hero-pain-list li + li {
  margin-top: 0.35rem;
}

.hero-pain-list li::marker {
  color: var(--landing-accent);
}

.hero-pain-closing {
  margin: 0.85rem 0 0;
  max-width: 62ch;
  font-size: clamp(1rem, 2.2vw, 1.12rem);
  font-weight: 700;
  line-height: 1.45;
  color: var(--color-text);
}

.hero-trust-badge-wrap {
  position: relative;
  z-index: 2;
  margin-top: 1rem;
  display: inline-flex;
  max-width: min(100%, 44rem);
}

.hero-trust-badge {
  margin: 0;
  display: inline-flex;
  border: 1px solid color-mix(in srgb, var(--landing-accent) 58%, var(--landing-border));
  background: color-mix(in srgb, var(--landing-accent-soft) 78%, var(--color-surface));
  border-radius: 0.5rem;
  transform: skewX(-12deg);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--landing-accent) 18%, transparent);
}

.hero-trust-badge__text {
  display: inline-block;
  padding: 0.52rem 0.88rem;
  transform: skewX(12deg);
  font-size: 0.88rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--color-text);
  letter-spacing: 0.01em;
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

.offer-meta__compare {
  margin: 0.45rem 0 0;
  font-size: 0.88rem;
  line-height: 1.5;
  color: var(--color-text-muted);
}

.hero-reassurance-panel {
  border: 1px solid var(--landing-border);
  border-radius: var(--radius-lg);
  background: var(--landing-panel-bg);
  padding: clamp(0.9rem, 2.2vw, 1.2rem);
}

.hero-reassurance-panel__list {
  margin: 0;
  padding-left: 1.25rem;
  display: grid;
  gap: 0.32rem;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--color-text-muted);
}

.hero-reassurance-panel__list li::marker {
  content: '✓ ';
  color: var(--landing-accent);
  font-weight: 700;
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
.testimonials,
.faq,
.final-cta,
.detailed-program,
.program-footer-cta {
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

.instructor-inline-link {
  color: var(--color-primary-strong);
  text-decoration: underline;
  text-underline-offset: 0.15em;
  text-decoration-thickness: 1.5px;
  transition: color var(--transition-fast), text-decoration-color var(--transition-fast);
}

.instructor-inline-link:hover {
  color: var(--landing-accent);
  text-decoration-color: var(--landing-accent);
}

.testimonials-grid {
  margin: 0.95rem 0 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.testimonial-card {
  border-radius: var(--radius-md);
  border: 1px solid var(--landing-border);
  background: var(--landing-card-bg);
  padding: 0.95rem;
}

.testimonial-quote {
  margin: 0;
  font-size: 0.94rem;
  line-height: 1.55;
  color: var(--color-text);
}

.faq-accordion {
  margin-top: 0.95rem;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.faq-item {
  border: 1px solid var(--landing-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  overflow: hidden;
}

.faq-summary {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
  list-style: none;
  transition: background-color var(--transition-fast);
}

.faq-summary__text {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.faq-summary::after {
  content: '';
  flex-shrink: 0;
  cursor: pointer;
  width: 0.45rem;
  height: 0.45rem;
  margin-top: 0.12em;
  border-right: 2px solid var(--color-text-muted);
  border-bottom: 2px solid var(--color-text-muted);
  transform: rotate(45deg);
  transform-origin: 50% 50%;
  opacity: 0.92;
  transition:
    transform 0.2s ease,
    border-color var(--transition-fast),
    opacity var(--transition-fast);
}

.faq-item[open] .faq-summary::after {
  transform: rotate(-135deg);
  margin-top: 0.28em;
}

.faq-summary:hover {
  background-color: color-mix(in srgb, var(--color-text) 6%, transparent);
}

.faq-summary::-webkit-details-marker {
  display: none;
}

.faq-summary:focus-visible {
  outline: none;
  box-shadow: inset 0 0 0 2px var(--color-primary-soft);
}

.faq-panel {
  padding: 0 1rem 1rem;
  border-top: 1px solid var(--landing-border);
}

.faq-p {
  margin: 0.65rem 0 0;
  font-size: 0.93rem;
  line-height: 1.55;
  color: var(--color-text);
}

.faq-p:first-child {
  margin-top: 0.75rem;
}

.faq-p--strong {
  font-weight: 600;
  color: var(--color-text);
}

.faq-ul {
  margin: 0.45rem 0 0;
  padding-left: 1.15rem;
  font-size: 0.93rem;
  line-height: 1.55;
}

.faq-ul li + li {
  margin-top: 0.35rem;
}

.faq-terms-link-wrap {
  margin-top: 0.85rem;
}

.detailed-program {
  scroll-margin-top: 1.25rem;
}

.detailed-program .section-title {
  margin-bottom: 1.75rem;
}

@media (min-width: 40rem) {
  .detailed-program .section-title {
    margin-bottom: 2.15rem;
  }
}

.program-day + .program-day {
  margin-top: 1.35rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--landing-border);
}

.program-day__title {
  margin: 0 0 0.75rem;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.05rem, 2.8vw, 1.35rem);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: var(--color-text);
}

.program-slots {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.program-slot {
  display: grid;
  grid-template-columns: minmax(0, 7.5rem) minmax(0, 1fr);
  gap: 0.65rem 1rem;
  align-items: start;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--landing-border);
  background: var(--color-surface);
}

.program-slot__time {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--landing-accent);
  line-height: 1.35;
}

.program-slot__heading {
  font-weight: 600;
  font-size: 0.98rem;
  line-height: 1.35;
  color: var(--color-text);
}

.program-slot__body {
  margin: 0.45rem 0 0;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--color-text-muted);
}

.program-footer-cta {
  background: linear-gradient(120deg, var(--color-surface) 0%, var(--landing-accent-soft) 120%);
}

.program-footer-cta h2 {
  margin: 0;
  font-family: 'Bricolage Grotesque', sans-serif;
  font-size: clamp(1.25rem, 3.2vw, 1.7rem);
}

.program-footer-cta > p {
  margin: 0.7rem 0 0;
  max-width: 65ch;
}

.program-footer-cta-actions {
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem;
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

.cta-seats-left {
  margin: 0.6rem 0 0;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--landing-accent);
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

  .hero-actions,
  .final-cta-actions,
  .program-footer-cta-actions {
    justify-content: center;
  }

  .hero-actions :deep(.button),
  .final-cta-actions :deep(.button),
  .program-footer-cta-actions :deep(.button) {
    width: min(22rem, 100%);
    max-width: 100%;
  }

  .program-slot {
    grid-template-columns: 1fr;
  }

  .program-slot__time {
    font-size: 0.78rem;
  }

  .outcome-grid {
    grid-template-columns: 1fr;
  }

  .testimonials-grid {
    grid-template-columns: 1fr;
  }

  .instructor {
    grid-template-columns: 1fr;
  }

  .instructor-media {
    height: clamp(12rem, 56vw, 16rem);
  }

  .hero-trust-badge-wrap {
    max-width: 100%;
  }

  .hero-trust-badge {
    width: 100%;
    transform: skewX(-8deg);
  }

  .hero-trust-badge__text {
    transform: skewX(8deg);
    font-size: 0.83rem;
    padding: 0.5rem 0.72rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .section-reveal {
    opacity: 1;
    transform: none;
    transition: none;
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
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
    width: min(100%, var(--max-width));
    max-width: var(--max-width);
    z-index: 70;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.65rem 1.5rem;
    padding-bottom: max(0.65rem, env(safe-area-inset-bottom));
    pointer-events: none;
  }

  .training-b2c-ads-sticky-waitlist__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }

  .training-b2c-ads-sticky-waitlist__seats-left {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 700;
    color: var(--landing-accent);
    pointer-events: auto;
  }

  .training-b2c-ads-sticky-waitlist .button {
    pointer-events: auto;
    width: min(22rem, 100%);
    max-width: 100%;
  }
}
</style>
