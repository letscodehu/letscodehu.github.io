<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'

// A riport magyar nyelvű, ezért a promó is csak a HU oldalon jelenik meg.
const { currentLang } = useI18n()
</script>

<template>
  <section v-if="currentLang === 'hu'" class="report-promo">
    <div class="report-promo-text">
      <p class="report-promo-eyebrow">Riport · 2026</p>
      <h2 class="report-promo-title">State of AI Dev 2026</h2>
      <p class="report-promo-body">
        Mennyit ír már a gép, mit vett át az agent, ki ellenőrzi, és mennyi governance van mögötte?
        Magyar fejlesztők és mérnöki vezetők válaszai alapján.
      </p>
    </div>
    <RouterLink :to="{ name: 'ai-report', params: { lang: 'hu' } }" class="report-promo-cta">
      <BaseButton variant="ghost">Elolvasom</BaseButton>
    </RouterLink>
  </section>
</template>

<style scoped>
.report-promo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1rem 1.25rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  background-color: var(--color-surface-soft);
}

.report-promo-text {
  max-width: 40rem;
}

.report-promo-eyebrow {
  margin: 0 0 0.3rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.report-promo-title {
  margin: 0 0 0.35rem;
  font-size: 1.05rem;
}

.report-promo-body {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.report-promo-cta {
  text-decoration: none;
}
</style>
