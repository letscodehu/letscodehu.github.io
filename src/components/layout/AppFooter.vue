<script setup lang="ts">
import { useI18n } from '../../composables/useI18n'

const { currentLang } = useI18n()
</script>

<template>
  <footer class="footer">
    <div class="footer-inner">
      <p class="footer-text">
        <span>© {{ new Date().getFullYear() }} Letscode.</span>
        <span class="separator">·</span>
        <span v-if="currentLang === 'en'">
          Independent consultant and trainer for software engineering teams.
        </span>
        <span v-else>
          Független tanácsadó és tréner szoftverfejlesztő csapatok számára.
        </span>
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--color-border);
  background-color: var(--color-bg);
  margin-top: 3rem;
}

.footer-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 1.5rem;
}

.footer-text {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  align-items: center;
}

.separator {
  opacity: 0.6;
}
</style>

