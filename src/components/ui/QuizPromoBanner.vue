<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'

// A felmérés csak magyarul érhető el, ezért a promó is csak a HU oldalon jelenik meg.
const { currentLang } = useI18n()
</script>

<template>
  <section v-if="currentLang === 'hu'" class="quiz-promo">
    <div class="quiz-promo-text">
      <p class="quiz-promo-eyebrow">Felmérés · 2026</p>
      <h2 class="quiz-promo-title">Magyar fejlesztők és az AI</h2>
      <p class="quiz-promo-body">
        Töltsd ki a 2026-os AI adoption felmérést – 5 perc –, és e-mailben megkapod a magyar
        fejlesztői benchmark riportot.
      </p>
    </div>
    <RouterLink :to="{ name: 'quiz', params: { lang: 'hu' } }" class="quiz-promo-cta">
      <BaseButton>Kitöltöm</BaseButton>
    </RouterLink>
  </section>
</template>

<style scoped>
.quiz-promo {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.4rem 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  background: radial-gradient(circle at top right, var(--color-gradient-start) 0%, var(--color-gradient-end) 55%);
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.quiz-promo-text {
  max-width: 40rem;
}

.quiz-promo-eyebrow {
  margin: 0 0 0.4rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
}

.quiz-promo-title {
  margin: 0 0 0.5rem;
  font-size: 1.35rem;
}

.quiz-promo-body {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
}

.quiz-promo-cta {
  text-decoration: none;
}
</style>
