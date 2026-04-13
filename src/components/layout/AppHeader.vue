<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useI18n } from '../../composables/useI18n'
import { useDarkMode } from '../../composables/useDarkMode'

const { t, currentLang, switchLanguage } = useI18n()
const route = useRoute()

const trainingSubItems = computed(() => [
  {
    name: t('nav.trainingGeneral'),
    to: { name: 'training-en', params: { lang: currentLang.value } },
  },
  {
    name: t('nav.trainingArchitectMindset'),
    to: { name: 'training-b2c-ads-en', params: { lang: currentLang.value } },
  },
])

const primaryNavItems = computed(() => [
  { name: t('nav.home'), to: { name: 'home', params: { lang: currentLang.value } } },
])

const navItems = computed(() => [
  { name: t('nav.consulting'), to: { name: 'consulting-en', params: { lang: currentLang.value } } },
  { name: t('nav.about'), to: { name: 'about-en', params: { lang: currentLang.value } } },
  { name: t('nav.caseStudies'), to: { name: 'case-studies-en', params: { lang: currentLang.value } } },
  { name: t('nav.blog'), to: { name: 'blog-list-en', params: { lang: currentLang.value } } },
  { name: t('nav.contact'), to: { name: 'contact-en', params: { lang: currentLang.value } } },
])

const currentPathName = computed(() => (route.name as string) || 'home')

/** Routes that should keep the main “Training” nav item highlighted. */
const TRAINING_NAV_ACTIVE_NAMES = new Set([
  'training-en',
  'training-b2c-ads-en',
  'training-b2c-terms-en',
  'workshop-en',
])

function isNavLinkActive(item: (typeof navItems)['value'][number]): boolean {
  const routeName = currentPathName.value
  return item.to.name === routeName
}

function isPrimaryNavLinkActive(item: (typeof primaryNavItems)['value'][number]): boolean {
  return item.to.name === currentPathName.value
}

const isTrainingParentActive = computed(() => TRAINING_NAV_ACTIVE_NAMES.has(currentPathName.value))

function isTrainingSubItemActive(item: (typeof trainingSubItems)['value'][number]): boolean {
  return item.to.name === currentPathName.value
}

const menuOpen = ref(false)
const trainingSubmenuOpen = ref(false)

const { theme, toggleTheme } = useDarkMode()
const isDarkMode = computed(() => theme.value === 'dark')
const toggleAriaLabel = computed(() =>
  isDarkMode.value ? t('common.lightMode') : t('common.darkMode')
)
const themeIcon = computed(() => (isDarkMode.value ? '☀️' : '🌙'))

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function closeMenu() {
  menuOpen.value = false
}

function openTrainingSubmenu() {
  trainingSubmenuOpen.value = true
}

function closeTrainingSubmenu() {
  trainingSubmenuOpen.value = false
}

function handleTrainingSubmenuClick() {
  closeTrainingSubmenu()
  closeMenu()
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
        <img src="/logo.png" :alt="t('common.brandLogoAlt')" class="brand-logo" />
        <span class="brand-text">
          <span class="brand-name">{{ t('common.brandLogoAlt') }}</span>
          <span class="brand-tagline">{{ t('common.brandTagline') }}</span>
        </span>
      </RouterLink>

      <button
        type="button"
        class="hamburger"
        :class="{ 'hamburger--open': menuOpen }"
        :aria-expanded="menuOpen"
        aria-controls="main-nav"
        :aria-label="t('common.menuAriaLabel')"
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
        <nav class="nav" :aria-label="t('common.mainNavigationAriaLabel')">
          <RouterLink
            v-for="item in primaryNavItems"
            :key="item.name"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link--active': isPrimaryNavLinkActive(item) }"
            @click="closeMenu"
          >
            {{ item.name }}
          </RouterLink>

          <div
            class="nav-group"
            :class="{
              'nav-group--active': isTrainingParentActive,
              'nav-group--submenu-open': trainingSubmenuOpen,
            }"
            @mouseenter="openTrainingSubmenu"
            @mouseleave="closeTrainingSubmenu"
            @focusin="openTrainingSubmenu"
            @focusout="closeTrainingSubmenu"
          >
            <span class="nav-link nav-link--group">{{ t('nav.training') }}</span>
            <div class="nav-submenu">
              <RouterLink
                v-for="item in trainingSubItems"
                :key="item.name"
                :to="item.to"
                class="nav-submenu-link"
                :class="{ 'nav-submenu-link--active': isTrainingSubItemActive(item) }"
                @click="handleTrainingSubmenuClick"
              >
                {{ item.name }}
              </RouterLink>
            </div>
          </div>

          <RouterLink
            v-for="item in navItems"
            :key="item.name"
            :to="item.to"
            class="nav-link"
            :class="{ 'nav-link--active': isNavLinkActive(item) }"
            @click="closeMenu"
          >
            {{ item.name }}
          </RouterLink>
        </nav>

        <div class="header-actions">
          <div class="theme-toggle">
            <button
              type="button"
              class="theme-toggle__button"
              :aria-pressed="isDarkMode"
              :aria-label="toggleAriaLabel"
              @click="toggleTheme"
            >
              <span class="theme-toggle__icon" aria-hidden="true">{{ themeIcon }}</span>
              <span class="sr-only">{{ toggleAriaLabel }}</span>
            </button>
          </div>

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
    </div>
  </header>
</template>

<style scoped>
.header {
  position: relative;
  z-index: 80;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.theme-toggle {
  display: flex;
  align-items: center;
}

.theme-toggle__button {
  border: 1px solid var(--color-border-strong);
  background-color: var(--color-surface);
  color: var(--color-text);
  border-radius: 999px;
  padding: 0.35rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: border-color var(--transition-fast), color var(--transition-fast), background-color var(--transition-fast);
}

.theme-toggle__icon {
  font-size: 1rem;
}

.theme-toggle__button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary-strong);
}

.theme-toggle__button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.nav-link {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  text-decoration: none;
  padding-bottom: 0.2rem;
  border-bottom: 2px solid transparent;
  transition: color 0.16s ease, border-color 0.16s ease;
}

.nav-link--group {
  display: inline-flex;
  align-items: center;
  cursor: default;
}

.nav-link:hover {
  color: var(--color-text);
}

.nav-link--active {
  color: var(--color-text);
  font-weight: 500;
  border-color: var(--color-primary);
}

.nav-group {
  position: relative;
}

.nav-group--active .nav-link--group {
  color: var(--color-text);
  font-weight: 500;
  border-color: var(--color-primary);
}

.nav-submenu {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  min-width: 14rem;
  display: flex;
  flex-direction: column;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 0.6rem;
  padding: 0.35rem;
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.16s ease, transform 0.16s ease, visibility 0.16s ease;
}

.nav-group--submenu-open .nav-submenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.nav-submenu-link {
  text-decoration: none;
  color: var(--color-text-muted);
  padding: 0.45rem 0.6rem;
  border-radius: 0.45rem;
  font-size: 0.86rem;
  transition: color 0.16s ease, background-color 0.16s ease;
}

.nav-submenu-link:hover {
  color: var(--color-text);
  background-color: var(--color-surface-muted);
}

.nav-submenu-link--active {
  color: var(--color-text);
  font-weight: 600;
  background-color: var(--color-surface-muted);
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
    z-index: 90;
    flex-direction: column;
    align-items: stretch;
    background-color: var(--color-surface);
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

  .nav-group {
    position: static;
  }

  .nav-link--group {
    width: 100%;
    padding: 0.75rem 0;
    border-bottom: 1px solid var(--color-border);
  }

  .nav-submenu {
    position: static;
    min-width: 0;
    box-shadow: none;
    border: none;
    border-radius: 0;
    padding: 0 0 0.5rem 0.9rem;
    opacity: 1;
    visibility: visible;
    transform: none;
    gap: 0.1rem;
  }

  .nav-submenu-link {
    border-bottom: 1px solid var(--color-border);
    border-radius: 0;
    padding: 0.6rem 0;
  }

  .nav-group--active .nav-link--group {
    border-color: var(--color-primary);
  }

  .nav-link:last-child {
    border-bottom: none;
  }

  .header-actions {
    width: 100%;
    margin-top: 1rem;
    flex-direction: column;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid var(--color-border);
    gap: 0.75rem;
  }

  .lang-switch {
    margin-left: 0;
    margin-top: 0;
    padding-top: 0;
    border-top: none;
    justify-content: center;
  }
}
</style>
