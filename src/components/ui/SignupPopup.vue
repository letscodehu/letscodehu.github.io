<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'
import { MAILCHIMP_JSONP_TIMEOUT_MS, MAILCHIMP_SIGNUP_URL } from '../../config'

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

let activeCallbackName = ''
let activeScript: HTMLScriptElement | null = null
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

function buildMailchimpJsonpUrl(callbackName: string) {
  const formUrl = new URL(MAILCHIMP_SIGNUP_URL)
  formUrl.pathname = formUrl.pathname.replace(/\/post$/, '/post-json')
  formUrl.searchParams.set('EMAIL', email.value)
  formUrl.searchParams.set('FNAME', firstName.value)
  formUrl.searchParams.set('c', callbackName)
  return formUrl.toString()
}

function clearPendingJsonp() {
  if (!canUseDom) {
    return
  }

  if (activeTimeoutId) {
    window.clearTimeout(activeTimeoutId)
    activeTimeoutId = 0
  }
  if (activeScript) {
    activeScript.remove()
    activeScript = null
  }
  if (activeCallbackName) {
    const dynamicWindow = window as unknown as Record<string, unknown>
    delete dynamicWindow[activeCallbackName]
    activeCallbackName = ''
  }
}

function resetState() {
  firstName.value = ''
  email.value = ''
  emailError.value = ''
  submitError.value = ''
  isSubmitting.value = false
  isSuccess.value = false
  clearPendingJsonp()
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

async function submitToMailchimp() {
  if (!canUseDom) {
    submitError.value = t('signupPopup.errorGeneric')
    return
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  submitError.value = ''

  const callbackName = `mailchimpCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`
  const script = document.createElement('script')
  script.src = buildMailchimpJsonpUrl(callbackName)
  script.async = true

  activeCallbackName = callbackName
  activeScript = script

  const dynamicWindow = window as unknown as Record<string, unknown>
  dynamicWindow[callbackName] = (response: { result?: string; msg?: string }) => {
    clearPendingJsonp()
    isSubmitting.value = false

    if (response.result === 'success') {
      isSuccess.value = true
      return
    }

    const message = response.msg ?? ''
    if (message.toLowerCase().includes('already subscribed')) {
      isSuccess.value = true
      return
    }

    submitError.value = t('signupPopup.errorGeneric')
  }

  activeTimeoutId = window.setTimeout(() => {
    clearPendingJsonp()
    isSubmitting.value = false
    submitError.value = t('signupPopup.errorTimeout')
  }, MAILCHIMP_JSONP_TIMEOUT_MS)

  script.onerror = () => {
    clearPendingJsonp()
    isSubmitting.value = false
    submitError.value = t('signupPopup.errorNetwork')
  }

  document.body.appendChild(script)
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
  clearPendingJsonp()
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="overlay" @click.self="handleClose">
      <div class="modal" role="dialog" aria-modal="true" :aria-label="t('signupPopup.title')">
        <button type="button" class="close-button" :aria-label="t('signupPopup.closeLabel')" @click="handleClose">
          x
        </button>

        <h2 class="title">{{ t('signupPopup.title') }}</h2>
        <p class="intro">{{ t('signupPopup.intro') }}</p>

        <div v-if="isSuccess" class="result result--success">
          <p>{{ t('signupPopup.successMessage') }}</p>
          <BaseButton variant="ghost" @click="handleClose">
            {{ t('signupPopup.closeCta') }}
          </BaseButton>
        </div>

        <form v-else class="form" @submit.prevent="submitToMailchimp">
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
  width: min(100%, 30rem);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.25rem;
  position: relative;
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
  font-size: 1.2rem;
}

.intro {
  margin: 0 0 1rem;
  color: var(--color-text-muted);
  font-size: 0.9rem;
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

.input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary-soft);
}

.error {
  margin: 0;
  color: #dc2626;
  font-size: 0.8rem;
}

.error-hint {
  margin: 0.35rem 0 0;
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 0.2rem;
}

.result {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.result--success p {
  margin: 0;
}
</style>
