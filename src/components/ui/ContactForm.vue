<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import { useI18n } from '../../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <form class="form" novalidate>
    <div class="form-row">
      <label class="label" for="name">{{ t('contact.nameLabel') }}</label>
      <input id="name" type="text" class="input" autocomplete="name" />
    </div>

    <div class="form-row">
      <label class="label" for="email">{{ t('contact.emailLabel') }}</label>
      <input id="email" type="email" class="input" autocomplete="email" />
    </div>

    <div class="form-row">
      <label class="label" for="company">{{ t('contact.companyLabel') }}</label>
      <input id="company" type="text" class="input" autocomplete="organization" />
    </div>

    <div class="form-row">
      <label class="label" for="message">{{ t('contact.messageLabel') }}</label>
      <textarea id="message" class="textarea" rows="4" />
    </div>

    <p class="hint">
      <!-- Placeholder only; no backend -->
      <span v-if="t('langCode') === 'en'">
        This is a placeholder form. In production, wire it to your preferred contact channel.
      </span>
      <span v-else>
        Ez egy helykitöltő űrlap. Éles használatban saját kapcsolatfelvételi csatornához érdemes kötni.
      </span>
    </p>

    <div class="actions">
      <BaseButton type="submit">
        {{ t('contact.submitLabel') }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.label {
  font-size: 0.85rem;
  font-weight: 500;
}

.input,
.textarea {
  border-radius: 0.4rem;
  border: 1px solid var(--color-border-strong);
  padding: 0.55rem 0.65rem;
  font-size: 0.9rem;
  font-family: inherit;
  background-color: #fff;
}

.input:focus,
.textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary-soft);
}

.textarea {
  resize: vertical;
  min-height: 6rem;
}

.hint {
  margin: 0;
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.actions {
  margin-top: 0.5rem;
}
</style>

