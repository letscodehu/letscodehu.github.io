<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from '../../composables/useI18n'

const { t, currentLang, switchLanguage } = useI18n()
const route = useRoute()

const navItems = computed(() => [
  { name: t('nav.home'), to: { name: 'home', params: { lang: currentLang.value } } },
  { name: t('nav.training'), to: { name: 'training-en', params: { lang: currentLang.value } } },
  { name: t('nav.consulting'), to: { name: 'consulting-en', params: { lang: currentLang.value } } },
  { name: t('nav.about'), to: { name: 'about-en', params: { lang: currentLang.value } } },
  { name: t('nav.caseStudies'), to: { name: 'case-studies-en', params: { lang: currentLang.value } } },
  { name: t('nav.contact'), to: { name: 'contact-en', params: { lang: currentLang.value } } },
])

const currentPathName = computed(() => (route.name as string) || 'home')

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && menuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <header class="header">
    <div class="header-inner">
      <RouterLink
        :to="{ name: 'home', params: { lang: currentLang } }"
        class="brand"
      >
        <img src="/logo.png" alt="Letscode Solutions" class="brand-logo" />
        <span class="brand-text">
          <span class="brand-name">Letscode Solutions</span>
          <span class="brand-tagline">Training &amp; consulting for engineering teams</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="hamburger"
        :class="{ 'hamburger--open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-controls="main-nav"
        aria-label="Menü"
        @click="toggleMenu"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>

      <div
        id="main-nav"
        class="nav-wrapper"
        :class="{ 'nav-wrapper--open': menuOpen }"
      >
        <nav class="nav" aria-label="Main navigation">
          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link--active': item.to.name === currentPathName }"
            @click="closeMenu"
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
    </div>
  </header>
</template>

<style scoped>
.header {
  border-bottom: 1px solid var(--color-border);
  background-color: rgba(243, 246, 251, 0.9);
  backdrop-filter: blur(8px);
}

.header-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1.15rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.brand {
  text-decoration: none;
  color: inherit;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.brand-logo {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
}

.brand-text {
  display: flex;
  flex-direction: column;
}

.brand-name {
  font-weight: 700;
  letter-spacing: 0.03em;
}

.brand-tagline {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-around;
  width: 1.75rem;
  height: 1.75rem;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 10;
}

.hamburger-line {
  width: 100%;
  height: 2px;
  background-color: var(--color-text);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.hamburger--open .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger--open .hamburger-line:nth-child(2) {
  opacity: 0;
}

.hamburger--open .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.nav-wrapper {
  display: flex;
  flex: 1;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
}

.nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: color 0.16s ease, border-color 0.16s ease;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link--active {
  color: var(--color-text);
  font-weight: 500;
  border-color: var(--color-primary);
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
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  .hamburger {
    display: flex;
    margin-left: auto;
  }

  .nav-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: stretch;
    background-color: rgba(243, 246, 251, 0.98);
    backdrop-filter: blur(8px);
    border-top: 1px solid var(--color-border);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
    padding: 0 1.5rem;
    gap: 0;
  }

  .nav-wrapper--open {
    max-height: 90vh;
    opacity: 1;
    padding: 1rem 1.5rem;
  }

  .nav {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    width: 100%;
  }

  .nav-link {
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .nav-link:last-child {
    border-bottom: none;
  }

  .lang-switch {
    margin-left: 0;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    justify-content: center;
  }
}
</style>

