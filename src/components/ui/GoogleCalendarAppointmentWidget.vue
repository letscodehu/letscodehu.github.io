<script setup lang="ts">
withDefaults(
  defineProps<{
    /** The `?gv=true` schedule URL — the only form Google allows in a frame. */
    embedUrl: string
    /** Short link opened by the phone button; Google's own page handles small screens far better. */
    bookingUrl: string
    /** Label for the phone button. */
    buttonLabel: string
    height?: number
  }>(),
  {
    height: 600,
  },
)
</script>

<template>
  <!--
    Two presentations of the same booking step, switched in CSS rather than JS so
    the prerendered page is correct without hydration and works with JS disabled.
    On a phone the frame ends up ~318px wide with its own inner scrollbar, which is
    where bookings get lost; the button hands that job to Google's mobile page.
  -->
  <iframe
    :src="embedUrl"
    class="google-calendar-host"
    :style="{ height: `${height}px` }"
    loading="lazy"
    frameborder="0"
  />

  <a class="google-calendar-button" :href="bookingUrl" target="_blank" rel="noopener noreferrer">
    {{ buttonLabel }}
  </a>
</template>

<style scoped>
.google-calendar-host {
  display: block;
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background-color: var(--color-surface);
}

/*
  Google renders its own white page inside the frame and gives us no way to theme
  it, so in dark mode a bright plate cuts straight into the dark card. Layered
  shadows fade that edge outwards instead: a thin rim, a wider soft ring, then a
  broad halo that dissolves into the card. Phones never see this — the frame is
  display:none there and the button takes over.
*/
.theme-dark .google-calendar-host {
  border-color: rgba(255, 255, 255, 0.35);
  box-shadow:
    0 0 0 7px rgba(255, 255, 255, 0.2),
    0 0 18px 8px rgba(255, 255, 255, 0.12),
    0 0 50px 18px rgba(255, 255, 255, 0.1);
}

.google-calendar-button {
  display: none;
}

@media (max-width: 640px) {
  .google-calendar-host {
    display: none;
  }

  .google-calendar-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.9rem 1.25rem;
    border-radius: 999px;
    background-color: var(--color-button-solid-bg);
    color: var(--color-button-solid-fg);
    font-size: 1rem;
    font-weight: 600;
    text-align: center;
    text-decoration: none;
  }

  .google-calendar-button:hover {
    background-color: var(--color-button-solid-bg-hover);
  }
}
</style>
