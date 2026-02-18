import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import en from '../i18n/en.json'
import hu from '../i18n/hu.json'

export type Language = 'en' | 'hu'
export const LANGUAGE_STORAGE_KEY = 'letscode_language_v1'

const messages: Record<Language, any> = {
  en,
  hu,
}

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'hu'
}

export function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') {
    return null
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
  if (!stored) {
    return null
  }

  if (isLanguage(stored)) {
    return stored
  }

  window.localStorage.removeItem(LANGUAGE_STORAGE_KEY)
  return null
}

export function writeStoredLanguage(language: Language): void {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

export function detectBrowserLanguage(): Language | null {
  if (typeof navigator === 'undefined') {
    return null
  }

  const browserLanguage = navigator.language.toLowerCase()
  if (browserLanguage.startsWith('hu')) {
    return 'hu'
  }

  if (browserLanguage.startsWith('en')) {
    return 'en'
  }

  return null
}

export function useI18n() {
  const route = useRoute()
  const router = useRouter()

  const currentLang = computed<Language>(() => {
    const param = route.params.lang
    if (param === 'hu') return 'hu'
    return 'en'
  })

  function t(path: string): any {
    const lang = currentLang.value
    const segments = path.split('.')
    let value: any = messages[lang]

    for (const segment of segments) {
      value = value?.[segment]
      if (value === undefined) {
        return path
      }
    }

    return value
  }

  function switchLanguage(target: Language) {
    if (target === currentLang.value) return

    writeStoredLanguage(target)
    router.push({
      name: (route.name as string) || 'home',
      params: {
        ...route.params,
        lang: target,
      },
      query: route.query,
    })
  }

  return {
    t,
    currentLang,
    switchLanguage,
  }
}

