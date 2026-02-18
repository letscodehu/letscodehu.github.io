import { computed, ref } from 'vue'
import { applyTrackingConsent } from './tracking'

type ConsentCategories = {
  analytics: boolean
  marketing: boolean
}

export type CookieConsentState = ConsentCategories & {
  decided: boolean
}

const STORAGE_KEY = 'letscode_cookie_consent_v1'

const consent = ref<CookieConsentState>({
  decided: false,
  analytics: false,
  marketing: false,
})

const preferencesOpen = ref(false)
let initialized = false

function persistConsent() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(consent.value))
}

function loadConsentFromStorage() {
  if (typeof window === 'undefined') {
    return
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    return
  }

  try {
    const parsed = JSON.parse(stored) as Partial<CookieConsentState>
    consent.value = {
      decided: Boolean(parsed.decided),
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    }
  } catch {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}

export function initCookieConsent() {
  if (initialized) {
    return
  }

  loadConsentFromStorage()
  applyTrackingConsent(consent.value)
  initialized = true
}

export function acceptAllCookies() {
  consent.value = {
    decided: true,
    analytics: true,
    marketing: true,
  }
  preferencesOpen.value = false
  persistConsent()
  applyTrackingConsent(consent.value)
}

export function saveCookiePreferences(categories: ConsentCategories) {
  consent.value = {
    decided: true,
    analytics: categories.analytics,
    marketing: categories.marketing,
  }
  preferencesOpen.value = false
  persistConsent()
  applyTrackingConsent(consent.value)
}

export function openCookieSettings() {
  preferencesOpen.value = true
}

export function closeCookieSettings() {
  preferencesOpen.value = false
}

export function useCookieConsent() {
  return {
    consent,
    preferencesOpen,
    isBannerVisible: computed(() => !consent.value.decided || preferencesOpen.value),
    acceptAllCookies,
    saveCookiePreferences,
    openCookieSettings,
    closeCookieSettings,
  }
}
