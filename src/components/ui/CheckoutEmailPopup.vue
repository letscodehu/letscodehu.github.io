<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'
import { CHECKOUT_EMAIL_CAPTURE_API_URL, CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS } from '../../config'
import { trackTrainingWorkshopStripeRedirect } from '../../tracking'

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
const emailInput = ref<HTMLInputElement | null>(null)

let activeAbortController: AbortController | null = null
let activeTimeoutId = 0

const canSubmit = computed(() => !isSubmitting.value)

function handleClose() {
  if (isSubmitting.value) {
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
  if (activeTimeoutId) {
    window.clearTimeout(activeTimeoutId)
    activeTimeoutId = 0
  }
  if (activeAbortController) {
    activeAbortController.abort()
    activeAbortController = null
  }
}

function resetState() {
  email.value = ''
  emailError.value = ''
  submitError.value = ''
  isSubmitting.value = false
  clearPendingRequest()
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
  activeTimeoutId = window.setTimeout(() => {
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
  redirectToStripe(email.value)
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
  clearPendingRequest()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="popup-layer" role="presentation">
      <div class="popup-backdrop" aria-hidden="true" @click="handleClose" />
      <div class="modal" role="dialog" aria-modal="true" :aria-label="t('checkoutEmailPopup.title')">
        <button type="button" class="close-button" :aria-label="t('checkoutEmailPopup.closeLabel')" @click="handleClose">
          x
        </button>
        <h2 class="title">{{ t('checkoutEmailPopup.title') }}</h2>
        <p class="intro">{{ t('checkoutEmailPopup.intro') }}</p>

        <form class="form" @submit.prevent="submitAndRedirect">
          <div class="form-row">
            <label class="label" for="checkout-email">{{ t('checkoutEmailPopup.emailLabel') }}</label>
            <input
              id="checkout-email"
              ref="emailInput"
              v-model="email"
              type="email"
              class="input"
              autocomplete="email"
              :aria-invalid="emailError ? 'true' : 'false'"
            />
            <p v-if="emailError" class="error">{{ emailError }}</p>
          </div>

          <p v-if="submitError" class="error">{{ submitError }}</p>

          <div class="actions">
            <BaseButton variant="ghost" type="button" @click="handleClose">
              {{ t('checkoutEmailPopup.cancelCta') }}
            </BaseButton>
            <BaseButton type="submit" :disabled="!canSubmit" :aria-disabled="!canSubmit">
              {{ isSubmitting ? t('checkoutEmailPopup.submitLoading') : t('checkoutEmailPopup.submitCta') }}
            </BaseButton>
          </div>
        </form>
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
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
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
</style>
