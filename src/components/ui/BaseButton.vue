<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'primary' | 'ghost'
    as?: 'button' | 'a' | 'span'
    href?: string
  }>(),
  {
    variant: 'primary',
    as: 'button',
    href: '',
  },
)
</script>

<template>
  <component
    :is="as"
    :href="as === 'a' ? href : undefined"
    class="button"
    :class="[`button--${variant}`]"
  >
    <slot />
  </component>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.6rem 1.3rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-size: 0.9rem;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.16s ease, color 0.16s ease, border-color 0.16s ease,
    box-shadow 0.16s ease;
}

.button--primary {
  background-color: var(--color-primary);
  color: #fff;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.button--primary:hover {
  background-color: var(--color-primary-strong);
}

.button--ghost {
  background-color: transparent;
  color: var(--color-text);
  border-color: var(--color-border-strong);
}

.button--ghost:hover {
  border-color: var(--color-text);
}
</style>

