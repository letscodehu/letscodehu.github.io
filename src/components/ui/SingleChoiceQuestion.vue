<script setup lang="ts">
defineProps<{
  questionId: string
  text: string
  options: string[]
  modelValue: string | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="question">
    <p class="question-text">{{ text }}</p>
    <div class="options">
      <button
        v-for="option in options"
        :key="option"
        type="button"
        class="option-btn"
        :class="{ 'option-btn--selected': modelValue === option }"
        @click="emit('update:modelValue', option)"
      >
        {{ option }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.question {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.question-text {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 600;
  line-height: 1.5;
}

.options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.option-btn {
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: inherit;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.option-btn:hover {
  border-color: var(--color-primary);
}

.option-btn--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}
</style>
