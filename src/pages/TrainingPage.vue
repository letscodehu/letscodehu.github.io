<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import BaseButton from '../components/ui/BaseButton.vue'

const { t, currentLang } = useI18n()
const isEn = currentLang.value === 'en'
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('training.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('training.intro') }}
      </p>
    </header>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('training.formatTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('training.format')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section grid grid--two">
      <div>
        <header class="section-header">
          <h2>{{ t('training.forWhoTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.forWho')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
      <div>
        <header class="section-header">
          <h2>{{ t('training.notForTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.notFor')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('training.topicsTitle') }}</h2>
      </header>
      <BaseCard>
        <ul class="list">
          <li v-for="item in t('training.topics')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section grid grid--two">
      <div>
        <header class="section-header">
          <h2>{{ t('training.engagementTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.engagement')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
      <div>
        <header class="section-header">
          <h2>{{ t('training.outcomesTitle') }}</h2>
        </header>
        <BaseCard>
          <ul class="list">
            <li v-for="item in t('training.outcomes')" :key="item">
              {{ item }}
            </li>
          </ul>
        </BaseCard>
      </div>
    </section>

    <section class="section cta">
      <BaseButton
        as="a"
        :href="isEn ? 'mailto:placeholder@example.com' : 'mailto:placeholder@example.com'"
      >
        {{ t('training.cta') }}
      </BaseButton>
      <p class="cta-note">
        {{
          isEn
            ? 'For training requests, a short description of your team, stack, and current challenges is more useful than a long RFP.'
            : 'Képzési igény esetén többet segít egy rövid leírás a csapatról, stackről és a jelenlegi kihívásokról, mint egy hosszú RFP.'
        }}
      </p>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.25rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.7rem;
}

.page-intro {
  margin: 0;
  font-size: 0.96rem;
  color: var(--color-text-muted);
  max-width: 48rem;
}

.section {
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0 0 0.6rem;
  font-size: 1.2rem;
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.cta {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.cta-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>

