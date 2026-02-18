import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './router'
import type { Language } from './composables/useI18n'
import en from './i18n/en.json'
import hu from './i18n/hu.json'

const messages: Record<Language, any> = {
  en,
  hu,
}

function getNestedValue(source: Record<string, any>, path: string): string | undefined {
  const segments = path.split('.')
  let value: any = source

  for (const segment of segments) {
    value = value?.[segment]
    if (value === undefined) {
      return undefined
    }
  }

  return typeof value === 'string' ? value : undefined
}

const app = createApp(App)

app.use(router)

router.afterEach((to) => {
  const lang: Language = to.params.lang === 'hu' ? 'hu' : 'en'
  const titleKey = typeof to.meta.titleKey === 'string' ? to.meta.titleKey : undefined
  const brand = messages[lang].common.companyName
  const localizedTitle = titleKey ? getNestedValue(messages[lang], titleKey) : undefined

  document.title = localizedTitle ? `${localizedTitle} | ${brand}` : brand
})

app.mount('#app')
