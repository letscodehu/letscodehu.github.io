<template>
  <section class="card">
    <header v-if="$slots.title || $slots.subtitle" class="card-header">
      <h2 v-if="$slots.title" class="card-title">
        <slot name="title" />
      </h2>
      <p v-if="$slots.subtitle" class="card-subtitle">
        <slot name="subtitle" />
      </p>
    </header>
    <div class="card-body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.card {
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  padding: 1.45rem 1.5rem;
  background-color: var(--color-surface);
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}

.card:hover {
  border-color: var(--color-border-strong);
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.card-header {
  margin-bottom: 0.8rem;
}

.card-title {
  font-size: 1.06rem;
  margin: 0 0 0.15rem;
}

.card-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.card-body {
  font-size: 0.92rem;
  color: var(--color-text);
}
</style>

