import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router'
import type { Language } from './composables/useI18n'
import {
  detectBrowserLanguage,
  readStoredLanguage,
  writeStoredLanguage,
} from './composables/useI18n'
import { caseStudies } from './data/case-studies'
import { trackPageView } from './tracking'

export const createApp = ViteSSG(App, { routes }, ({ router }) => {
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
})

export async function includedRoutes() {
  const langs: ('en' | 'hu')[] = ['en', 'hu']
  const staticPaths = ['training', 'consulting', 'about', 'contact', 'case-studies']

  const paths: string[] = []

  for (const lang of langs) {
    paths.push(`/${lang}`)
    for (const p of staticPaths) {
      paths.push(`/${lang}/${p}`)
    }
    for (const cs of caseStudies) {
      paths.push(`/${lang}/case-studies/${cs.slug}`)
    }
  }

  return paths
}
