<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from '../../composables/useI18n'

const { t, currentLang, switchLanguage } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { name: t('nav.home'), to: { name: 'home', params: { lang: currentLang.value } } },
  { name: t('nav.training'), to: { name: 'training-en', params: { lang: currentLang.value } } },
  { name: t('nav.consulting'), to: { name: 'consulting-en', params: { lang: currentLang.value } } },
  { name: t('nav.about'), to: { name: 'about-en', params: { lang: currentLang.value } } },
  { name: t('nav.blog'), to: { name: 'blog-en', params: { lang: currentLang.value } } },
  { name: t('nav.contact'), to: { name: 'contact-en', params: { lang: currentLang.value } } },
])

const currentPathName = computed(() => (route.name as string) || 'home')
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink
        :to="{ name: 'home', params: { lang: currentLang } }"
        class="brand"
      >
        <span class="brand-name">Letscode Solutions</span>
        <span class="brand-tagline">Training &amp; consulting for engineering teams</span>
      </RouterLink>

      <nav class="nav" aria-label="Main navigation">
        <RouterLink
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="nav-link"
          :class="{ 'nav-link--active': item.to.name === currentPathName }"
        >
          {{ item.name }}
        </RouterLink>
      </nav>

      <div class="lang-switch">
        <button
          type="button"
          class="lang-button"
          :class="{ 'lang-button--active': currentLang === 'en' }"
          @click="switchLanguage('en')"
        >
          EN
        </button>
        <span class="lang-separator">/</span>
        <button
          type="button"
          class="lang-button"
          :class="{ 'lang-button--active': currentLang === 'hu' }"
          @click="switchLanguage('hu')"
        >
          HU
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-bg);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 600;
  letter-spacing: 0.03em;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  justify-content: flex-end;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
}

.nav-link--active {
  color: var(--color-text);
  font-weight: 500;
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-left: 1rem;
}

.lang-button {
  border: none;
  background: transparent;
  padding: 0.15rem 0.35rem;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  cursor: pointer;
}

.lang-button--active {
  color: var(--color-text);
  font-weight: 600;
}

.lang-separator {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

@media (max-width: 768px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .nav {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>

