<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'
import { WAITLIST_SIGNUP_API_URL, WAITLIST_SIGNUP_TIMEOUT_MS } from '../../config'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
}>()

const { t } = useI18n()
const canUseDom = typeof window !== 'undefined' && typeof document !== 'undefined'

const firstName = ref('')
const email = ref('')
const emailError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)
const isSuccess = ref(false)
const emailInput = ref<HTMLInputElement | null>(null)

let activeAbortController: AbortController | null = null
let activeTimeoutId = 0

const canSubmit = computed(() => !isSubmitting.value && !isSuccess.value)

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
    emailError.value = t('signupPopup.validationEmailRequired')
    return false
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(normalizedEmail)) {
    emailError.value = t('signupPopup.validationEmailInvalid')
    return false
  }

  firstName.value = firstName.value.trim()
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
  firstName.value = ''
  email.value = ''
  emailError.value = ''
  submitError.value = ''
  isSubmitting.value = false
  isSuccess.value = false
  clearPendingRequest()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

async function submitToWaitlist() {
  if (!canUseDom) {
    submitError.value = t('signupPopup.errorGeneric')
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
  }, WAITLIST_SIGNUP_TIMEOUT_MS)

  try {
    const response = await fetch(WAITLIST_SIGNUP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        firstName: firstName.value,
      }),
      signal: abortController.signal,
    })

    clearPendingRequest()
    isSubmitting.value = false

    if (response.ok) {
      isSuccess.value = true
      return
    }

    submitError.value = t('signupPopup.errorGeneric')
  } catch (error) {
    clearPendingRequest()
    isSubmitting.value = false

    const isAbortError = error instanceof DOMException && error.name === 'AbortError'
    submitError.value = isAbortError ? t('signupPopup.errorTimeout') : t('signupPopup.errorNetwork')
  }
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
    <div v-if="open" class="overlay" @click.self="handleClose">
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="isSuccess ? t('signupPopup.successAriaLabel') : t('signupPopup.title')"
      >
        <button type="button" class="close-button" :aria-label="t('signupPopup.closeLabel')" @click="handleClose">
          x
        </button>

        <template v-if="!isSuccess">
          <h2 class="title">{{ t('signupPopup.title') }}</h2>
          <p class="intro">{{ t('signupPopup.introChecklist') }}</p>
          <p class="intro intro--follow">{{ t('signupPopup.introWaitlist') }}</p>
        </template>

        <div v-else class="result result--success">
          <div class="success-icon-wrap" aria-hidden="true">
            <svg class="success-check" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle class="success-check-bg" cx="24" cy="24" r="22" stroke-width="1.5" />
              <path
                class="success-check-mark"
                d="M14 24.5l7 7 13-14"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="success-text">{{ t('signupPopup.successMessage') }}</p>
          <BaseButton variant="ghost" @click="handleClose">
            {{ t('signupPopup.closeCta') }}
          </BaseButton>
        </div>

        <form v-if="!isSuccess" class="form" @submit.prevent="submitToWaitlist">
          <div class="form-row">
            <label class="label" for="signup-first-name">{{ t('signupPopup.firstNameLabel') }}</label>
            <input id="signup-first-name" v-model="firstName" type="text" class="input" autocomplete="given-name" />
          </div>

          <div class="form-row">
            <label class="label" for="signup-email">{{ t('signupPopup.emailLabel') }}</label>
            <input
              id="signup-email"
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
          <p v-if="submitError" class="error-hint">{{ t('signupPopup.errorBrowserHint') }}</p>

          <div class="actions">
            <BaseButton variant="ghost" type="button" @click="handleClose">
              {{ t('signupPopup.cancelCta') }}
            </BaseButton>
            <BaseButton type="submit" :disabled="!canSubmit" :aria-disabled="!canSubmit">
              {{ isSubmitting ? t('signupPopup.submitLoading') : t('signupPopup.submitCta') }}
            </BaseButton>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.56);
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 90;
}

.modal {
  width: 100%;
  max-width: min(30rem, calc(100vw - 2rem));
  min-width: 0;
  box-sizing: border-box;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.25rem;
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: min(90dvh, 100vh - 2rem);
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
  overflow-wrap: break-word;
  word-break: break-word;
}

.intro {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  line-height: 1.5;
  overflow-wrap: break-word;
  word-break: break-word;
}

.intro--follow {
  margin-top: -0.35rem;
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
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  max-width: 100%;
  border-radius: 0.4rem;
  border: 1px solid var(--color-text-muted);
  padding: 0.55rem 0.65rem;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary-soft);
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
  overflow-wrap: break-word;
  word-break: break-word;
}

.error-hint {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
  overflow-wrap: break-word;
}

.actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.2rem;
}

.result {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  min-width: 0;
}

.result--success {
  align-items: center;
  text-align: center;
  padding-top: 0.35rem;
}

.success-icon-wrap {
  flex-shrink: 0;
}

.success-check {
  display: block;
  width: 3rem;
  height: 3rem;
}

.success-check-bg {
  fill: #dcfce7;
  stroke: #86efac;
}

.success-check-mark {
  stroke: #16a34a;
  fill: none;
}

:global(html.theme-dark) .success-check-bg {
  fill: rgba(34, 197, 94, 0.22);
  stroke: rgba(74, 222, 128, 0.45);
}

:global(html.theme-dark) .success-check-mark {
  stroke: #4ade80;
}

.success-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: var(--color-text);
  overflow-wrap: break-word;
  word-break: break-word;
}

@media (max-width: 28rem) {
  .overlay {
    align-content: center;
    padding: max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right))
      max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
  }

  .actions {
    flex-direction: column;
    align-items: stretch;
  }

  .actions :deep(.button) {
    width: 100%;
    max-width: 100%;
    white-space: normal;
    text-align: center;
    line-height: 1.35;
    padding-left: 0.85rem;
    padding-right: 0.85rem;
  }
}
</style>
