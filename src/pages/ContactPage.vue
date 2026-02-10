<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import BaseCard from '../components/ui/BaseCard.vue'
import ContactForm from '../components/ui/ContactForm.vue'

const { t } = useI18n()
</script>

<template>
  <article>
    <header class="page-header">
      <h1 class="page-title">
        {{ t('contact.pageTitle') }}
      </h1>
      <p class="page-intro">
        {{ t('contact.intro') }}
      </p>
    </header>

    <section class="section grid grid--two">
      <BaseCard>
        <template #title>{{ t('contact.expectationsTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('contact.expectations')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
      <BaseCard>
        <template #title>{{ t('contact.responseTitle') }}</template>
        <ul class="list">
          <li v-for="item in t('contact.response')" :key="item">
            {{ item }}
          </li>
        </ul>
      </BaseCard>
    </section>

    <section class="section">
      <header class="section-header">
        <h2>{{ t('contact.formTitle') }}</h2>
      </header>
      <BaseCard>
        <ContactForm />
      </BaseCard>
    </section>
  </article>
</template>

<style scoped>
.page-header {
  margin-bottom: 2.25rem;
}

.page-title {
  margin: 0 0 0.75rem;
  font-size: 1.6rem;
}

.page-intro {
  margin: 0;
  font-size: 0.95rem;
  color: var(--color-text-muted);
  max-width: 44rem;
}

.section {
  margin-bottom: 2rem;
}

.grid {
  display: grid;
  gap: 1.25rem;
}

.grid--two {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.list {
  margin: 0;
  padding-left: 1.25rem;
  font-size: 0.9rem;
}

.list li + li {
  margin-top: 0.35rem;
}
</style>

