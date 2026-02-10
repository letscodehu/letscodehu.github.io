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
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  padding: 1.5rem 1.6rem;
  background-color: #fff;
}

.card-header {
  margin-bottom: 0.75rem;
}

.card-title {
  font-size: 1.05rem;
  margin: 0 0 0.15rem;
}

.card-subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.card-body {
  font-size: 0.9rem;
  color: var(--color-text);
}
</style>

