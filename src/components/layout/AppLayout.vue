<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import CookieBanner from '../ui/CookieBanner.vue'
import { useI18n } from '../../composables/useI18n'
import { SITE_ORIGIN, absoluteUrl, DEFAULT_OG_IMAGE_PATH } from '../../site'
import { alternateLangPathname, canonicalPathname } from '../../seo/canonical-path'

const route = useRoute()
const { t, currentLang } = useI18n()

const isContentDetail = computed(
  () => route.name === 'blog-post-detail-en' || route.name === 'case-study-detail-en'
)

const useChildTitle = computed(() => Boolean(route.meta.useChildTitle))

const pageTitle = computed(() => {
  const titleKey = typeof route.meta.titleKey === 'string' ? route.meta.titleKey : undefined
  const brand = t('common.companyName')
  const localizedTitle = titleKey ? t(titleKey) : undefined
  return localizedTitle ? `${localizedTitle} | ${brand}` : brand
})

const pageDescription = computed(() => {
  const key = typeof route.meta.descriptionKey === 'string' ? route.meta.descriptionKey : undefined
  if (!key) return ''
  const v = t(key)
  return typeof v === 'string' ? v : ''
})

const canonicalHref = computed(() => absoluteUrl(canonicalPathname(route.path)))

const hrefEn = computed(() => absoluteUrl(alternateLangPathname(route.path, 'en')))
const hrefHu = computed(() => absoluteUrl(alternateLangPathname(route.path, 'hu')))

const ogLocale = computed(() => (currentLang.value === 'hu' ? 'hu_HU' : 'en_US'))
const ogLocaleAlt = computed(() => (currentLang.value === 'hu' ? 'en_US' : 'hu_HU'))

const fullOgImage = computed(() => absoluteUrl(DEFAULT_OG_IMAGE_PATH))

const organizationLd = computed(() =>
  JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t('common.companyName'),
    url: SITE_ORIGIN,
    logo: absoluteUrl('/logo.png'),
  })
)

useHead(
  computed(() => {
    const meta: { name?: string; property?: string; content: string }[] = [
      { property: 'og:image', content: fullOgImage.value },
      { property: 'og:image:alt', content: String(t('seo.defaultOgImageAlt')) },
      { property: 'og:url', content: canonicalHref.value },
      { property: 'og:locale', content: ogLocale.value },
      { property: 'og:locale:alternate', content: ogLocaleAlt.value },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:image', content: fullOgImage.value },
    ]

    if (!isContentDetail.value) {
      meta.push({ property: 'og:type', content: 'website' })
      meta.push({ property: 'og:title', content: pageTitle.value })
      meta.push({ name: 'twitter:title', content: pageTitle.value })
      if (pageDescription.value) {
        meta.push({ name: 'description', content: pageDescription.value })
        meta.push({ property: 'og:description', content: pageDescription.value })
        meta.push({ name: 'twitter:description', content: pageDescription.value })
      }
    }

    const head: Record<string, unknown> = {
      htmlAttrs: {
        lang: currentLang.value,
      },
      meta,
      link: [
        { rel: 'canonical', href: canonicalHref.value },
        { rel: 'alternate', hreflang: 'en', href: hrefEn.value },
        { rel: 'alternate', hreflang: 'hu', href: hrefHu.value },
        { rel: 'alternate', hreflang: 'x-default', href: hrefEn.value },
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: organizationLd.value,
        },
      ],
    }

    if (!useChildTitle.value) {
      head.title = pageTitle.value
    }

    return head
  })
)
</script>

<template>
  <div class="layout" contenteditable="false">
    <AppHeader />
    <main class="main">
      <div class="main-inner">
        <RouterView />
      </div>
    </main>
    <AppFooter />
    <CookieBanner />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.main {
  flex: 1;
}

.main-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2.8rem 1.5rem 3.25rem;
}
</style>
