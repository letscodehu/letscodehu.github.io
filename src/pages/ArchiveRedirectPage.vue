<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useHead } from '@unhead/vue'
import { absoluteUrl } from '../site'

const route = useRoute()
const router = useRouter()

const targetSlug = computed(() => route.meta.archiveSlug as string)
const targetPath = computed(() => `/hu/blog/archiv/${targetSlug.value}`)

useHead(
  computed(() => ({
    title: 'Átirányítás… | Letscode Solutions Kft',
    link: [{ rel: 'canonical', href: absoluteUrl(targetPath.value) }],
    meta: [{ 'http-equiv': 'refresh', content: `0;url=${targetPath.value}` }],
  }))
)

onMounted(() => {
  router.replace({ name: 'archive-detail', params: { lang: 'hu', slug: targetSlug.value } })
})
</script>

<template>
  <main class="redirect-page">
    <p>
      Ez a cikk átköltözött az archívumba:
      <a :href="targetPath">{{ targetPath }}</a>
    </p>
  </main>
</template>

<style scoped>
.redirect-page {
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.redirect-page a {
  color: var(--color-primary);
}
</style>
