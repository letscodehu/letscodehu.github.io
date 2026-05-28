<script setup lang="ts">
import { nextTick, onUnmounted, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'

const props = defineProps<{
  open: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'accept'): void
}>()

const { t } = useI18n()
const canUseDom = typeof window !== 'undefined' && typeof document !== 'undefined'

function handleClose() {
  emit('close')
}

function handleAccept() {
  emit('accept')
}

function handleEscape(event: KeyboardEvent) {
  if (event.key === 'Escape' && props.open) {
    handleClose()
  }
}

watch(
  () => props.open,
  async (isOpen) => {
    if (!canUseDom) {
      return
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.addEventListener('keydown', handleEscape)
      await nextTick()
      document.querySelector<HTMLElement>('.latebird-accept-button')?.focus()
      return
    }

    document.body.style.overflow = ''
    document.removeEventListener('keydown', handleEscape)
  },
)

onUnmounted(() => {
  if (!canUseDom) {
    return
  }

  document.removeEventListener('keydown', handleEscape)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="popup-layer" role="presentation">
      <div class="popup-backdrop" aria-hidden="true" @click="handleClose" />
      <div
        class="modal"
        role="dialog"
        aria-modal="true"
        :aria-label="t('trainingB2cAds.latebirdPopup.title')"
      >
        <button type="button" class="close-button" :aria-label="t('trainingB2cAds.latebirdPopup.closeLabel')" @click="handleClose">
          x
        </button>

        <p class="eyebrow">{{ t('trainingB2cAds.latebirdPopup.eyebrow') }}</p>
        <h2 class="title">{{ t('trainingB2cAds.latebirdPopup.title') }}</h2>
        <p class="intro">{{ t('trainingB2cAds.latebirdPopup.body') }}</p>
        <p class="coupon" aria-label="LATEBIRD kupon">LATEBIRD</p>

        <div class="actions">
          <BaseButton variant="ghost" type="button" @click="handleClose">
            {{ t('trainingB2cAds.latebirdPopup.cancelCta') }}
          </BaseButton>
          <BaseButton class="latebird-accept-button" type="button" @click="handleAccept">
            {{ t('trainingB2cAds.latebirdPopup.acceptCta') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.popup-layer {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  z-index: 92;
}

.popup-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(7px);
  -webkit-backdrop-filter: blur(7px);
}

:global(html.theme-dark) .popup-backdrop,
:global(html[data-theme='dark']) .popup-backdrop {
  background: rgba(0, 0, 0, 0.74);
}

.modal {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: min(30rem, calc(100vw - 2rem));
  box-sizing: border-box;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  padding: 1.35rem;
  overflow-wrap: break-word;
}

.close-button {
  position: absolute;
  right: 0.75rem;
  top: 0.65rem;
  border: none;
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  cursor: pointer;
}

.eyebrow {
  margin: 0 2.25rem 0.45rem 0;
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.title {
  margin: 0 2.25rem 0.6rem 0;
  font-size: 1.35rem;
  line-height: 1.25;
}

.intro {
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.95rem;
  line-height: 1.55;
}

.coupon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 1rem 0 0;
  padding: 0.45rem 0.8rem;
  border: 1px dashed var(--color-primary);
  border-radius: 0.6rem;
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 1.15rem;
}

@media (max-width: 28rem) {
  .popup-layer {
    padding: max(0.75rem, env(safe-area-inset-top)) max(0.75rem, env(safe-area-inset-right))
      max(0.75rem, env(safe-area-inset-bottom)) max(0.75rem, env(safe-area-inset-left));
  }

  .actions {
    flex-direction: column-reverse;
    align-items: stretch;
  }

  .actions :deep(.button) {
    width: 100%;
    max-width: 100%;
    white-space: normal;
  }
}
</style>
