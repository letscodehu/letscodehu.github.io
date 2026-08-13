<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import AiDevReport from '../components/report/AiDevReport.vue'
import reportData from '../data/report_data.json'
import { useDarkMode } from '../composables/useDarkMode'
import { absoluteUrl } from '../site'

const PDF_PATH = '/state-of-ai-dev-2026.pdf'

const route = useRoute()
const router = useRouter()
const { theme } = useDarkMode()

/**
 * A riport a `theme` propból veszi a témát, a site viszont a <html> osztályából.
 * Prerendereléskor nincs böngésző, tehát nincs mit kiolvasni — ilyenkor 'auto'
 * megy ki, és a riport az OS beállítását követi. Hidratálás után átveszi a site
 * kapcsolóját. Így nincs SSR/kliens attribútum-eltérés a gyökéren.
 */
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
const reportTheme = computed(() => (mounted.value ? theme.value : 'auto'))

/**
 * A kiemelt szegmens az URL-ben él, hogy egy-egy nézet linkelhető legyen.
 * `replace`, mert a szegmensváltogatás nem navigáció — ne szemetelje tele a
 * vissza gombot.
 */
const segment = computed<string>({
  get: () => (typeof route.query.segment === 'string' ? route.query.segment : ''),
  set: (value) => {
    void router.replace({
      query: { ...route.query, segment: value || undefined },
      hash: route.hash,
    })
  },
})

const title = 'State of AI Dev 2026 – magyar fejlesztői körkép | letscode.hu'
const description =
  'Mennyit ír már a gép, mit vett át az agent, ki ellenőrzi, és mennyi governance van mögötte? ' +
  'Magyar fejlesztők és mérnöki vezetők válaszai alapján.'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ],
  link: [{ rel: 'alternate', type: 'application/pdf', href: absoluteUrl(PDF_PATH) }],
})
</script>

<template>
  <AiDevReport
    v-model:segment="segment"
    :data="reportData"
    :theme="reportTheme"
    :pdf-url="PDF_PATH"
  />
</template>
