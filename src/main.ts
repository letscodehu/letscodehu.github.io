import { ViteSSG } from 'vite-ssg'
import './style.css'
import './highlight-theme.css'
import App from './App.vue'
import { routes } from './router'
import type { Language } from './composables/useI18n'
import {
  detectBrowserLanguage,
  readStoredLanguage,
  writeStoredLanguage,
} from './composables/useI18n'
import { getPrerenderPathnames } from './seo/prerender-paths'
import { trackPageView } from './tracking'

export const createApp = ViteSSG(
  App,
  {
    routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      }
      if (to.hash) {
        return { el: to.hash }
      }
      // Same page, only query changed (e.g. AI survey segment picker) — don't
      // jerk the scroll position around, the user is mid-interaction.
      if (to.path === from.path) {
        return false
      }
      return { left: 0, top: 0 }
    },
  },
  ({ router }) => {
  router.beforeEach((to) => {
    // Redirect trailing slash URLs to non-trailing slash (except root)
    if (to.path !== '/' && to.path.endsWith('/')) {
      return {
        path: to.path.replace(/\/$/, ''),
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    }

    if (to.path === '/hu/privacy') {
      return {
        path: '/hu/adatkezeles',
        query: to.query,
        hash: to.hash,
        replace: true,
      }
    }

    // Bare (non-lang-prefixed) legacy Jekyll permalinks resolve to their own top-level
    // redirect route (see legacyArchiveRedirectRoutes in router/index.ts) and must not be
    // forced under /en or /hu.
    if (to.matched.some((record) => record.meta.archiveSlug)) {
      return true
    }

    const languagePathMatch = to.path.match(/^\/(en|hu)(?:\/|$)/)
    if (languagePathMatch) {
      const languageFromPath: Language = languagePathMatch[1] === 'hu' ? 'hu' : 'en'
      writeStoredLanguage(languageFromPath)
      return true
    }

    const preferredLanguage = readStoredLanguage() ?? detectBrowserLanguage() ?? 'en'
    const fullPath = to.fullPath === '/' ? '/' : to.fullPath

    return {
      path: `/${preferredLanguage}${fullPath}`,
      replace: true,
    }
  })

  router.afterEach((to) => {
    // Track page view for Google Analytics
    trackPageView(to.fullPath)
  })
  },
)

export async function includedRoutes() {
  return getPrerenderPathnames()
}
