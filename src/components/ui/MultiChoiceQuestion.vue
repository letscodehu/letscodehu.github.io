<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  questionId: string
  text: string
  options: string[]
  /** legfeljebb ennyi opció választható egyszerre */
  maxSelections?: number
  /** ezt választva a többi opció törlődik (pl. „Nem használok AI eszközt") */
  exclusiveOption?: string
  modelValue: string[] | undefined
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

const selected = computed(() => props.modelValue ?? [])

function isSelected(option: string) {
  return selected.value.includes(option)
}

function isDisabled(option: string) {
  if (isSelected(option)) return false
  if (props.maxSelections !== undefined && selected.value.length >= props.maxSelections) return true
  return false
}

function toggle(option: string) {
  if (isDisabled(option)) return

  // Kizáró opció: ha azt választják, csak az marad; bármi más választása törli.
  if (option === props.exclusiveOption) {
    emit('update:modelValue', isSelected(option) ? [] : [option])
    return
  }

  const next = selected.value.filter((o) => o !== props.exclusiveOption)
  emit(
    'update:modelValue',
    isSelected(option) ? next.filter((o) => o !== option) : [...next, option],
  )
}
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
        :class="{ 'option-btn--selected': isSelected(option), 'option-btn--disabled': isDisabled(option) }"
        :aria-pressed="isSelected(option)"
        :disabled="isDisabled(option)"
        @click="toggle(option)"
      >
        <span class="checkbox" aria-hidden="true" />
        <span>{{ option }}</span>
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
  display: flex;
  align-items: center;
  gap: 0.7rem;
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

.checkbox {
  flex-shrink: 0;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 0.3rem;
  border: 1.5px solid var(--color-border-strong);
  position: relative;
  transition: border-color var(--transition-fast), background var(--transition-fast);
}

.option-btn--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}

.option-btn--selected .checkbox {
  border-color: var(--color-primary);
  background: var(--color-primary);
}

.option-btn--disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.option-btn--selected .checkbox::after {
  content: '';
  position: absolute;
  left: 0.32rem;
  top: 0.12rem;
  width: 0.26rem;
  height: 0.52rem;
  border: solid #fff;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}
</style>
