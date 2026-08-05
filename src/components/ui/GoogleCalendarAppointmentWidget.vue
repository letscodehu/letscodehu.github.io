<script setup lang="ts">
withDefaults(
  defineProps<{
    url: string
    height?: number
  }>(),
  {
    height: 600,
  },
)
</script>

<template>
  <iframe
    :src="url"
    class="google-calendar-host"
    :style="{ height: `${height}px` }"
    frameborder="0"
  />
</template>

<style scoped>
.google-calendar-host {
  display: block;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
}
</style>
