<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    questionId: string
    text: string
    min?: number
    max?: number
    minLabel?: string
    maxLabel?: string
    modelValue: number | undefined
  }>(),
  { min: 1, max: 5 },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const steps = Array.from({ length: props.max - props.min + 1 }, (_, i) => props.min + i)
</script>

<template>
  <div class="question">
    <p class="question-text">{{ text }}</p>
    <div class="scale">
      <div v-if="minLabel || maxLabel" class="scale-labels">
        <span>{{ minLabel }}</span>
        <span>{{ maxLabel }}</span>
      </div>
      <div class="scale-options">
        <button
          v-for="n in steps"
          :key="n"
          type="button"
          class="scale-btn"
          :class="{ 'scale-btn--selected': modelValue === n }"
          :aria-label="`${n} – ${n === min ? minLabel : n === max ? maxLabel : ''}`"
          @click="emit('update:modelValue', n)"
        >
          {{ n }}
        </button>
      </div>
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

.scale {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.scale-options {
  display: flex;
  gap: 0.5rem;
}

.scale-btn {
  flex: 1;
  padding: 0.65rem 0.5rem;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  text-align: center;
}

.scale-btn:hover {
  border-color: var(--color-primary);
}

.scale-btn--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}
</style>
