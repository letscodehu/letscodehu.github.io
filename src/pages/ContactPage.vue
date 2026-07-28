<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import CalendlyInlineWidget from '../components/ui/CalendlyInlineWidget.vue'

const { t } = useI18n()
const route = useRoute()

/**
 * Visitors arriving from the AI consulting page get AI-specific copy instead of the
 * training-oriented default, so the CTA promise carries over into the booking step.
 * Same component and same calendar — only the framing changes.
 */
const isAiTopic = computed(() => route.name === 'contact-ai-en')

function topicKey(base: string): string {
  if (!isAiTopic.value) {
    return `contact.${base}`
  }

  return `contact.ai${base.charAt(0).toUpperCase()}${base.slice(1)}`
}
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t(topicKey('pageTitle')) }}
      </h1>
      <p class="page-intro">
        {{ t(topicKey('intro')) }}
      </p>
      <p class="page-intro">
        {{ t('contact.emailIntro') }}
        <a class="email-link" :href="`mailto:${t('contact.email')}`">{{ t('contact.email') }}</a>
      </p>
    </header>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t(topicKey('expectationsTitle')) }}</template>
        <ul class="list">
          <li v-for="item in t(topicKey('expectations'))" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>{{ t(topicKey('responseTitle')) }}</template>
        <ul class="list">
          <li v-for="item in t(topicKey('response'))" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t(topicKey('formTitle')) }}</h2>
      </header>
      <BaseCard>
        <CalendlyInlineWidget url="https://calendly.com/fejlesztes-letscode/30min" />
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.5rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.85rem;
}

.page-intro {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.page-intro + .page-intro {
  margin-top: 0.6rem;
}

.email-link {
  color: var(--color-primary);
  font-weight: 600;
}

.section {
  margin-bottom: 2.6rem;
}

.grid {
  display: grid;
  gap: 1.35rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.92rem;
}

.list li + li {
  margin-top: 0.35rem;
}

.section-header h2 {
  margin: 0 0 0.8rem;
  font-size: 1.4rem;
}
</style>

