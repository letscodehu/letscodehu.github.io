<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import CookieBanner from '../ui/CookieBanner.vue'
import { useI18n } from '../../composables/useI18n'

const route = useRoute()
const { t } = useI18n()

useHead({
  title: computed(() => {
    const titleKey = typeof route.meta.titleKey === 'string' ? route.meta.titleKey : undefined
    const brand = t('common.companyName')
    const localizedTitle = titleKey ? t(titleKey) : undefined
    return localizedTitle ? `${localizedTitle} | ${brand}` : brand
  }),
})
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

