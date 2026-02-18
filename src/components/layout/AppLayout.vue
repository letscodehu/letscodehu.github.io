<script setup lang="ts">
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import CookieBanner from '../ui/CookieBanner.vue'
</script>

<template>
  <div class="layout" contenteditable="false">
    <AppHeader />
    <main class="main">
      <div class="main-inner">
        <RouterView />
      </div>
    </main>
    <AppFooter />
    <CookieBanner />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-bg);
  color: var(--color-text);
}

.main {
  flex: 1;
}

.main-inner {
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 2.8rem 1.5rem 3.25rem;
}
</style>

