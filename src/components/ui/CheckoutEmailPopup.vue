<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'
import { CHECKOUT_EMAIL_CAPTURE_API_URL, CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS } from '../../config'
import { trackTrainingWorkshopStripeRedirect } from '../../tracking'

const STRIPE_REDIRECT_DELAY_MS = 4000

const props = defineProps<{
  open: boolean
  stripeCheckoutUrl: string
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()
const canUseDom = typeof window !== 'undefined' && typeof document !== 'undefined'

const email = ref('')
const emailError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)
const isRedirecting = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)

let activeAbortController: AbortController | null = null
let activeRequestTimeoutId = 0
let activeRedirectTimeoutId = 0

const canSubmit = computed(() => !isSubmitting.value && !isRedirecting.value)
const isInteractionLocked = computed(() => isSubmitting.value || isRedirecting.value)

function handleClose() {
  if (isInteractionLocked.value) {
    return
  }
  emit('close')
}

function validateForm() {
  emailError.value = ''
  submitError.value = ''

  const normalizedEmail = email.value.trim()
  email.value = normalizedEmail
  if (!normalizedEmail) {
    emailError.value = t('checkoutEmailPopup.validationEmailRequired')
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(normalizedEmail)) {
    emailError.value = t('checkoutEmailPopup.validationEmailInvalid')
    return false
  }

  return true
}

function clearPendingRequest() {
  if (activeRequestTimeoutId) {
    window.clearTimeout(activeRequestTimeoutId)
    activeRequestTimeoutId = 0
  }
  if (activeAbortController) {
    activeAbortController.abort()
    activeAbortController = null
  }
}

function clearRedirectTimeout() {
  if (activeRedirectTimeoutId) {
    window.clearTimeout(activeRedirectTimeoutId)
    activeRedirectTimeoutId = 0
  }
}

function resetState() {
  email.value = ''
  emailError.value = ''
  submitError.value = ''
  isSubmitting.value = false
  isRedirecting.value = false
  clearPendingRequest()
  clearRedirectTimeout()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

function redirectToStripe(emailAddress: string) {
  if (!canUseDom) {
    return
  }
  trackTrainingWorkshopStripeRedirect({ source: 'email_popup' })
  const checkoutUrl = new URL(props.stripeCheckoutUrl)
  checkoutUrl.searchParams.set('prefilled_email', emailAddress)
  window.location.assign(checkoutUrl.toString())
}

function beginRedirectToStripe(emailAddress: string) {
  isRedirecting.value = true
  clearRedirectTimeout()
  activeRedirectTimeoutId = window.setTimeout(() => {
    activeRedirectTimeoutId = 0
    redirectToStripe(emailAddress)
  }, STRIPE_REDIRECT_DELAY_MS)
}

async function submitAndRedirect() {
  if (!canUseDom) {
    submitError.value = t('checkoutEmailPopup.errorGeneric')
    return
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  const abortController = new AbortController()
  activeAbortController = abortController
  activeRequestTimeoutId = window.setTimeout(() => {
    abortController.abort()
  }, CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS)

  try {
    await fetch(CHECKOUT_EMAIL_CAPTURE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
      }),
      signal: abortController.signal,
    })

    clearPendingRequest()
  } catch {
    clearPendingRequest()
  }

  isSubmitting.value = false
  beginRedirectToStripe(email.value)
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!canUseDom) {
      return
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      await nextTick()
      emailInput.value?.focus()
      return
    }

    document.body.style.overflow = ''
    resetState()
  },
)

watch(
  () => email.value,
  () => {
    if (emailError.value) {
      emailError.value = ''
    }
  },
)

watch(
  () => props.open,
  (isOpen) => {
    if (!canUseDom) {
      return
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return
    }
    document.removeEventListener('keydown', handleEscape)
  },
  { immediate: true },
)

onUnmounted(() => {
  if (!canUseDom) {
    return
  }

  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
  resetState()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="popup-layer" role="presentation">
      <div class="popup-backdrop" aria-hidden="true" @click="handleClose" />
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-busy="isInteractionLocked ? 'true' : 'false'"
        :aria-label="
          isRedirecting ? t('checkoutEmailPopup.redirectAriaLabel') : t('checkoutEmailPopup.title')
        "
      >
        <button
          v-if="!isRedirecting"
          type="button"
          class="close-button"
          :aria-label="t('checkoutEmailPopup.closeLabel')"
          :disabled="isSubmitting"
          @click="handleClose"
        >
          x
        </button>

        <div v-if="isRedirecting" class="result result--redirect">
          <div
            class="status-panel"
            role="status"
            aria-live="polite"
            :aria-label="t('checkoutEmailPopup.redirectAriaLabel')"
          >
            <span class="spinner" aria-hidden="true" />
            <h2 class="title">{{ t('checkoutEmailPopup.redirectTitle') }}</h2>
            <p class="redirect-body">{{ t('checkoutEmailPopup.redirectBody') }}</p>
          </div>
        </div>

        <template v-else>
          <h2 class="title">{{ t('checkoutEmailPopup.title') }}</h2>
          <p class="intro">{{ t('checkoutEmailPopup.intro') }}</p>

          <form class="form" :class="{ 'form--submitting': isSubmitting }" @submit.prevent="submitAndRedirect">
            <div
              v-if="isSubmitting"
              class="form-loader"
              role="status"
              aria-live="polite"
              :aria-label="t('checkoutEmailPopup.submitLoading')"
            >
              <span class="spinner" aria-hidden="true" />
              <p class="form-loader__text">{{ t('checkoutEmailPopup.submitLoading') }}</p>
            </div>

            <div class="form-row">
              <label class="label" for="checkout-email">{{ t('checkoutEmailPopup.emailLabel') }}</label>
              <input
                id="checkout-email"
                ref="emailInput"
                v-model="email"
                type="email"
                class="input"
                autocomplete="email"
                :disabled="isSubmitting"
                :aria-invalid="emailError ? 'true' : 'false'"
              />
              <p v-if="emailError" class="error">{{ emailError }}</p>
            </div>

            <p v-if="submitError" class="error">{{ submitError }}</p>

            <div class="actions">
              <BaseButton variant="ghost" type="button" :disabled="isSubmitting" @click="handleClose">
                {{ t('checkoutEmailPopup.cancelCta') }}
              </BaseButton>
              <BaseButton type="submit" :disabled="!canSubmit" :aria-disabled="!canSubmit">
                {{ isSubmitting ? t('checkoutEmailPopup.submitLoading') : t('checkoutEmailPopup.submitCta') }}
              </BaseButton>
            </div>
          </form>
        </template>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.popup-layer {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 90;
}

.popup-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

.modal {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(30rem, calc(100vw - 2rem));
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.25rem;
}

.close-button {
  position: absolute;
  right: 0.75rem;
  top: 0.65rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  cursor: pointer;
}

.close-button:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.title {
  margin: 0 0 0.4rem;
  padding-right: 2.25rem;
  font-size: 1.2rem;
  line-height: 1.35;
}

.intro {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
}

.form {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.form--submitting .form-row,
.form--submitting .actions {
  opacity: 0.45;
  pointer-events: none;
}

.form-loader {
  position: absolute;
  inset: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.5rem;
}

.form-loader__text {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.label {
  font-size: 0.84rem;
  font-weight: 600;
}

.input {
  border-radius: 0.4rem;
  border: 1px solid var(--color-text-muted);
  padding: 0.55rem 0.65rem;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
}

.actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.2rem;
}

.status-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.85rem;
}

.result--redirect .title {
  margin: 0;
  padding-right: 0;
}

.redirect-body {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.5;
}

.spinner {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid color-mix(in srgb, var(--color-primary) 22%, var(--color-border));
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: popup-spin 720ms linear infinite;
}

@keyframes popup-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation: none;
    border-top-color: var(--color-primary);
    opacity: 0.85;
  }
}
</style>
