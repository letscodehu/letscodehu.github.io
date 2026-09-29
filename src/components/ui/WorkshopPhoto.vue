<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <figure class="workshop-photo">
    <img
      src="/workshop-team.jpg"
      width="1400"
      height="1050"
      loading="lazy"
      decoding="async"
      :alt="t('workshopPhoto.alt')"
    >
    <figcaption>{{ t('workshopPhoto.caption') }}</figcaption>
  </figure>
</template>

<style scoped>
.workshop-photo {
  margin: 0;
}

.workshop-photo img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: center 40%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.workshop-photo figcaption {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}
</style>
