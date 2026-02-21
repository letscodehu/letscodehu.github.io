import { computed, ref } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'dark-mode-preference'
const COOKIE_KEY = 'dark-mode-preference'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year
const LIGHT_CLASS = 'theme-light'
const DARK_CLASS = 'theme-dark'

function getHtmlElement(): HTMLElement | null {
  return typeof document === 'undefined' ? null : document.documentElement
}

function applyThemeClass(theme: Theme) {
  const html = getHtmlElement()
  if (!html) return
  html.classList.remove(LIGHT_CLASS, DARK_CLASS)
  html.classList.add(theme === 'dark' ? DARK_CLASS : LIGHT_CLASS)
  html.dataset.theme = theme
}

function readStoredPreference(): Theme | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  } catch {
    // ignore
  }

  if (typeof document === 'undefined') {
    return null
  }

  const cookieMatch = document.cookie.match(
    new RegExp('(?:^|;\\s*)' + COOKIE_KEY + '=(dark|light)(?:;|$)')
  )
  return (cookieMatch ? (cookieMatch[1] as Theme) : null)
}

function detectSystemPreference(): Theme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light'
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function persistPreference(theme: Theme) {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // ignore
    }
  }

  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + COOKIE_MAX_AGE * 1000).toUTCString()
    document.cookie = `${COOKIE_KEY}=${theme}; path=/; expires=${expires}; SameSite=Lax`
  }
}

function getInitialTheme(): Theme {
  const html = getHtmlElement()
  if (html) {
    const existing = html.dataset.theme
    if (existing === 'dark' || existing === 'light') {
      return existing
    }
  }

  const resolved = readStoredPreference()
  if (resolved) {
    return resolved
  }

  return detectSystemPreference()
}

const activeTheme = ref<Theme>(getInitialTheme())
applyThemeClass(activeTheme.value)

export function useDarkMode() {
  const isDark = computed(() => activeTheme.value === 'dark')

  function setTheme(theme: Theme) {
    if (activeTheme.value === theme) {
      return
    }

    activeTheme.value = theme
    applyThemeClass(theme)
    persistPreference(theme)
  }

  function toggleTheme() {
    setTheme(activeTheme.value === 'dark' ? 'light' : 'dark')
  }

  return {
    theme: activeTheme,
    isDark,
    setTheme,
    toggleTheme,
  }
}
