<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useHead } from '@unhead/vue'
import BaseButton from '../components/ui/BaseButton.vue'
import SingleChoiceQuestion from '../components/ui/SingleChoiceQuestion.vue'
import MultiChoiceQuestion from '../components/ui/MultiChoiceQuestion.vue'
import ScaleQuestion from '../components/ui/ScaleQuestion.vue'
import { quizQuestions } from '../data/quiz-questions'
import { QUIZ_SUBMIT_API_URL, QUIZ_SUBMIT_TIMEOUT_MS } from '../config'

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (siteKey: string, opts: { action: string }) => Promise<string>
    }
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

useHead({
  title: 'Magyar fejlesztők és az AI – 2026-os felmérés | letscode.hu',
  meta: [
    {
      name: 'description',
      content:
        'Töltsd ki a 2026-os AI adoption felmérést, és megkapod a magyar fejlesztői benchmark riportot e-mailben.',
    },
    { property: 'og:title', content: 'Magyar fejlesztők és az AI – 2026-os felmérés' },
    {
      property: 'og:description',
      content:
        'Töltsd ki a 2026-os AI adoption felmérést, és megkapod a magyar fejlesztői benchmark riportot e-mailben.',
    },
  ],
})

// reCAPTCHA v3 script csak böngészőben töltődik be (SSR/prerender alatt nem).
if (!import.meta.env.SSR && RECAPTCHA_SITE_KEY) {
  useHead({
    script: [
      {
        src: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`,
        async: true,
        defer: true,
      },
    ],
  })
}

const RECAPTCHA_TIMEOUT_MS = 5000

// Visszaad egy reCAPTCHA tokent, vagy null-t, ha nincs konfigurálva / nem
// töltött be / időtúllépés (utóbbinál a Lambda dönt a beengedésről). Az időkorlát
// megakadályozza, hogy a beküldés örökre beragadjon, ha a grecaptcha nem rendeződik.
function getRecaptchaToken(): Promise<string | null> {
  const tokenPromise = new Promise<string | null>((resolve) => {
    const g = window.grecaptcha
    if (!RECAPTCHA_SITE_KEY || !g) {
      resolve(null)
      return
    }
    g.ready(() => {
      g.execute(RECAPTCHA_SITE_KEY, { action: 'quiz_submit' })
        .then((token) => resolve(token))
        .catch(() => resolve(null))
    })
  })

  const timeoutPromise = new Promise<string | null>((resolve) => {
    window.setTimeout(() => resolve(null), RECAPTCHA_TIMEOUT_MS)
  })

  return Promise.race([tokenPromise, timeoutPromise])
}

const currentStep = ref(0)
type AnswerValue = string | number | string[]
const answers = ref<Record<string, AnswerValue>>({})
const email = ref('')
const emailError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)

const totalQuestions = quizQuestions.length
const isEmailStep = computed(() => currentStep.value === totalQuestions)
const currentQuestion = computed(() => (!isEmailStep.value ? quizQuestions[currentStep.value] : null))
const progressPercent = computed(() => Math.round((currentStep.value / (totalQuestions + 1)) * 100))
const currentAnswer = computed(() => {
  const q = currentQuestion.value
  return q ? answers.value[q.id] : undefined
})
const canGoNext = computed(() => {
  const value = currentAnswer.value
  if (value === undefined) return false
  // multi-choice: legalább egy kijelölt elem kell
  if (Array.isArray(value)) return value.length > 0
  return true
})

let activeTimeoutId = 0

function setAnswer(value: AnswerValue) {
  const q = currentQuestion.value
  if (q) answers.value = { ...answers.value, [q.id]: value }
}

function goNext() {
  if (!isEmailStep.value) currentStep.value++
}

function goBack() {
  if (currentStep.value > 0) currentStep.value--
}

function validateEmail() {
  emailError.value = ''
  const val = email.value.trim()
  email.value = val
  if (!val) {
    emailError.value = 'Az e-mail cím megadása kötelező.'
    return false
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    emailError.value = 'Érvénytelen e-mail cím.'
    return false
  }
  return true
}

async function submitQuiz() {
  if (!validateEmail()) return

  isSubmitting.value = true
  submitError.value = ''

  const recaptchaToken = await getRecaptchaToken()

  const abortController = new AbortController()
  activeTimeoutId = window.setTimeout(() => abortController.abort(), QUIZ_SUBMIT_TIMEOUT_MS)

  try {
    const response = await fetch(QUIZ_SUBMIT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, answers: answers.value, recaptchaToken }),
      signal: abortController.signal,
    })

    window.clearTimeout(activeTimeoutId)
    isSubmitting.value = false

    if (response.ok) {
      isSuccess.value = true
      return
    }

    if (response.status === 409) {
      submitError.value = 'Ezzel az e-mail címmel már töltötted ki a kvízt.'
      return
    }

    if (response.status === 422) {
      submitError.value = 'Nem sikerült ellenőrizni, hogy nem robot vagy-e. Kérjük, próbáld újra.'
      return
    }

    submitError.value = 'Valami hiba történt. Kérjük, próbáld újra.'
  } catch (error) {
    window.clearTimeout(activeTimeoutId)
    isSubmitting.value = false

    const isAbort = error instanceof DOMException && error.name === 'AbortError'
    submitError.value = isAbort
      ? 'A kérés túllépte az időkorlátot. Próbáld újra.'
      : 'Hálózati hiba. Ellenőrizd az internetkapcsolatod.'
  }
}
</script>

<template>
  <article class="quiz-page">
    <div v-if="!isSuccess" class="quiz-card">
      <header class="quiz-header">
        <h1 class="quiz-title">Magyar fejlesztők és az AI – 2026-os felmérés</h1>
        <div class="quiz-meta">
          <span class="quiz-step">{{ currentStep + 1 }} / {{ totalQuestions + 1 }}</span>
          <div
            class="progress-bar"
            role="progressbar"
            :aria-valuenow="progressPercent"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            <div class="progress-fill" :style="{ width: `${progressPercent}%` }" />
          </div>
        </div>
      </header>

      <!-- Kérdés lépések -->
      <template v-if="!isEmailStep && currentQuestion">
        <SingleChoiceQuestion
          v-if="currentQuestion.type === 'single-choice'"
          :question-id="currentQuestion.id"
          :text="currentQuestion.text"
          :options="currentQuestion.options ?? []"
          :model-value="currentAnswer as string | undefined"
          @update:model-value="setAnswer"
        />
        <MultiChoiceQuestion
          v-else-if="currentQuestion.type === 'multi-choice'"
          :question-id="currentQuestion.id"
          :text="currentQuestion.text"
          :options="currentQuestion.options ?? []"
          :max-selections="currentQuestion.maxSelections"
          :exclusive-option="currentQuestion.exclusiveOption"
          :model-value="currentAnswer as string[] | undefined"
          @update:model-value="setAnswer"
        />
        <ScaleQuestion
          v-else-if="currentQuestion.type === 'scale'"
          :question-id="currentQuestion.id"
          :text="currentQuestion.text"
          :min="currentQuestion.min"
          :max="currentQuestion.max"
          :min-label="currentQuestion.minLabel"
          :max-label="currentQuestion.maxLabel"
          :model-value="currentAnswer as number | undefined"
          @update:model-value="setAnswer"
        />

        <div class="nav-actions">
          <BaseButton v-if="currentStep > 0" variant="ghost" type="button" @click="goBack">
            Vissza
          </BaseButton>
          <BaseButton type="button" :disabled="!canGoNext" @click="goNext">
            Következő
          </BaseButton>
        </div>
      </template>

      <!-- E-mail lépés -->
      <template v-else>
        <div class="email-step">
          <p class="email-title">Hova küldjük el az összesített eredményeket?</p>
          <p class="email-hint">
            Ha összegyűlt elegendő válasz, e-mailben megkapod a 2026-os magyar fejlesztői AI adoption benchmark riportot. Spam nem lesz.
          </p>
          <div class="form-row">
            <label class="form-label" for="quiz-email">E-mail cím</label>
            <input
              id="quiz-email"
              v-model="email"
              type="email"
              class="form-input"
              autocomplete="email"
              placeholder="te@ceg.hu"
              :aria-invalid="emailError ? 'true' : 'false'"
              @input="emailError = ''"
            />
            <p v-if="emailError" class="field-error">{{ emailError }}</p>
          </div>
          <p v-if="submitError" class="submit-error">{{ submitError }}</p>
        </div>

        <div class="nav-actions">
          <BaseButton variant="ghost" type="button" :disabled="isSubmitting" @click="goBack">
            Vissza
          </BaseButton>
          <BaseButton type="button" :disabled="isSubmitting" @click="submitQuiz">
            <span v-if="isSubmitting" class="spinner" aria-hidden="true" />
            {{ isSubmitting ? 'Küldés...' : 'Eredmények kérése' }}
          </BaseButton>
        </div>
      </template>
    </div>

    <!-- Köszönő képernyő -->
    <div v-else class="success-card">
      <div class="success-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="check-bg" cx="24" cy="24" r="22" stroke-width="1.5" />
          <path class="check-mark" d="M14 24.5l7 7 13-14" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="success-title">Köszönjük a válaszaid!</h1>
      <p class="success-text">
        Ha összegyűlt elegendő kitöltés, e-mailben elküldjük a 2026-os magyar fejlesztői AI adoption benchmark riportot.
      </p>
      <p class="success-text">
        Amíg vársz, nézz körül a blogon – gyakorlati cikkek AI-ról, fejlesztésről és karrierről.
      </p>
      <RouterLink class="success-link" :to="{ name: 'blog-list-en', params: { lang: 'hu' } }">
        Irány a blog
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.quiz-page {
  min-height: 60vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 2rem 1rem 4rem;
}

.quiz-card,
.success-card {
  width: 100%;
  max-width: 42rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.quiz-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.quiz-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.35;
}

.quiz-meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.quiz-step {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.progress-bar {
  height: 4px;
  background: var(--color-border);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: 99px;
  transition: width var(--transition-smooth);
}

.nav-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.spinner {
  width: 0.95em;
  height: 0.95em;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-top-color: transparent;
  animation: spinner-rotate 0.6s linear infinite;
}

@keyframes spinner-rotate {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 1.5s;
  }
}

/* E-mail lépés */
.email-step {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.email-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.5;
}

.email-hint {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.55;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.85rem;
  font-weight: 600;
}

.form-input {
  box-sizing: border-box;
  width: 100%;
  border-radius: 0.4rem;
  border: 1px solid var(--color-border-strong);
  padding: 0.6rem 0.75rem;
  font-size: 0.95rem;
  font-family: inherit;
  background: var(--color-surface);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary-soft);
}

.field-error,
.submit-error {
  margin: 0;
  font-size: 0.82rem;
  color: #dc2626;
}

/* Success */
.success-card {
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  gap: 1.25rem;
}

.success-icon svg {
  width: 3.5rem;
  height: 3.5rem;
}

.check-bg {
  fill: #dcfce7;
  stroke: #86efac;
}

.check-mark {
  stroke: #16a34a;
  fill: none;
}

:global(html.theme-dark) .check-bg {
  fill: rgba(34, 197, 94, 0.22);
  stroke: rgba(74, 222, 128, 0.45);
}

:global(html.theme-dark) .check-mark {
  stroke: #4ade80;
}

.success-title {
  margin: 0;
  font-size: 1.4rem;
}

.success-text {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  max-width: 30rem;
}

.success-link {
  margin-top: 0.25rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.64rem 1.35rem;
  border-radius: 999px;
  background-color: var(--color-button-solid-bg);
  color: var(--color-button-solid-fg);
  box-shadow: var(--color-button-solid-shadow);
  font-size: 0.92rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.16s ease, transform 0.16s ease;
}

.success-link:hover {
  background-color: var(--color-button-solid-bg-hover);
  transform: translateY(-1px);
}

.success-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

@media (max-width: 28rem) {
  .quiz-card,
  .success-card {
    padding: 1.25rem;
    gap: 1.25rem;
  }

  .nav-actions {
    flex-direction: column;
  }

  .nav-actions :deep(.button) {
    width: 100%;
    text-align: center;
  }
}
</style>
