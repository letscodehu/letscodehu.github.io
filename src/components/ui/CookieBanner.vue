<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useI18n } from '../../composables/useI18n'
import {
  acceptAllCookies,
  closeCookieSettings,
  initCookieConsent,
  saveCookiePreferences,
  useCookieConsent,
} from '../../cookieConsent'

const { t } = useI18n()
const { consent, preferencesOpen, isBannerVisible } = useCookieConsent()

const analyticsEnabled = ref(false)
const marketingEnabled = ref(false)

const showCompactBanner = computed(() => isBannerVisible.value && !preferencesOpen.value)

function syncToggles() {
  analyticsEnabled.value = consent.value.analytics
  marketingEnabled.value = consent.value.marketing
}

function openPreferences() {
  syncToggles()
  preferencesOpen.value = true
}

function savePreferences() {
  saveCookiePreferences({
    analytics: analyticsEnabled.value,
    marketing: marketingEnabled.value,
  })
}

function closePanel() {
  if (!consent.value.decided) {
    return
  }
  closeCookieSettings()
}

watch(preferencesOpen, (isOpen) => {
  if (isOpen) {
    syncToggles()
  }
})

onMounted(() => {
  initCookieConsent()
  syncToggles()
})
</script>

<template>
  <div v-if="isBannerVisible" class="cookie-wrap">
    <section v-if="showCompactBanner" class="cookie-banner" aria-live="polite">
      <h2 class="cookie-title">{{ t('cookies.title') }}</h2>
      <p class="cookie-text">{{ t('cookies.description') }}</p>
      <div class="cookie-actions">
        <button type="button" class="cookie-btn cookie-btn--primary" @click="acceptAllCookies">
          {{ t('cookies.acceptAll') }}
        </button>
        <button type="button" class="cookie-btn cookie-btn--secondary" @click="openPreferences">
          {{ t('cookies.managePreferences') }}
        </button>
      </div>
    </section>

    <section v-if="preferencesOpen" class="cookie-panel" aria-live="polite">
      <div class="cookie-panel-header">
        <h2 class="cookie-title">{{ t('cookies.preferencesTitle') }}</h2>
        <button
          v-if="consent.decided"
          type="button"
          class="cookie-close"
          @click="closePanel"
          :aria-label="t('cookies.closeLabel')"
        >
          ×
        </button>
      </div>
      <p class="cookie-text">{{ t('cookies.preferencesDescription') }}</p>

      <div class="cookie-option">
        <div>
          <p class="cookie-option-title">{{ t('cookies.essentialTitle') }}</p>
          <p class="cookie-option-text">{{ t('cookies.essentialDescription') }}</p>
        </div>
        <input type="checkbox" checked disabled aria-label="Essential cookies" />
      </div>

      <div class="cookie-option">
        <div>
          <p class="cookie-option-title">{{ t('cookies.analyticsTitle') }}</p>
          <p class="cookie-option-text">{{ t('cookies.analyticsDescription') }}</p>
        </div>
        <input v-model="analyticsEnabled" type="checkbox" :aria-label="t('cookies.analyticsTitle')" />
      </div>

      <div class="cookie-option">
        <div>
          <p class="cookie-option-title">{{ t('cookies.marketingTitle') }}</p>
          <p class="cookie-option-text">{{ t('cookies.marketingDescription') }}</p>
        </div>
        <input v-model="marketingEnabled" type="checkbox" :aria-label="t('cookies.marketingTitle')" />
      </div>

      <div class="cookie-actions">
        <button type="button" class="cookie-btn cookie-btn--primary" @click="savePreferences">
          {{ t('cookies.savePreferences') }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.cookie-wrap {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  width: min(36rem, calc(100vw - 2rem));
  z-index: 60;
}

.cookie-banner,
.cookie-panel {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-md);
  padding: 1rem 1rem 0.95rem;
}

.cookie-panel {
  max-height: min(82vh, 36rem);
  overflow-y: auto;
}

.cookie-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.cookie-title {
  margin: 0;
  font-size: 1rem;
}

.cookie-text {
  margin: 0.45rem 0 0.85rem;
  color: var(--color-text-muted);
  font-size: 0.88rem;
}

.cookie-option {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface-soft);
  padding: 0.7rem;
  margin-bottom: 0.65rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.cookie-option-title {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
}

.cookie-option-text {
  margin: 0.15rem 0 0;
  color: var(--color-text-muted);
  font-size: 0.83rem;
}

.cookie-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 0.35rem;
}

.cookie-btn {
  border: 1px solid var(--color-border-strong);
  border-radius: 999px;
  padding: 0.5rem 0.95rem;
  font-size: 0.84rem;
  font-weight: 600;
  cursor: pointer;
  background-color: var(--color-surface);
  color: var(--color-text);
}

.cookie-btn--primary {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.cookie-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.cookie-close {
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 1.2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.1rem 0.2rem;
}

@media (max-width: 640px) {
  .cookie-wrap {
    right: 0.75rem;
    left: 0.75rem;
    width: auto;
    bottom: 0.75rem;
  }
}
</style>
