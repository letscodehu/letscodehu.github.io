import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import en from '../i18n/en.json'
import hu from '../i18n/hu.json'

type Language = 'en' | 'hu'

const messages: Record<Language, any> = {
  en,
  hu,
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

