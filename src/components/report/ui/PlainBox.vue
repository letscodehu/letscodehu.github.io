<script setup>
// „Így olvasd” / „Amit ez nem jelent” típusú magyarázó doboz.
defineProps({
  /** A doboz kis fejléce (a pötty utáni felirat). */
  heading: { type: String, required: true },
})
</script>

<template>
  <div
    class="rp-plain mt-[18px] mb-1 max-w-[72ch] rounded-xl border border-dashed border-brd bg-[color-mix(in_srgb,var(--accent)_3%,var(--surface))] px-[18px] py-[14px] text-[15px] leading-[1.6] text-ink2"
  >
    <span
      class="mb-1.5 flex items-center gap-[7px] font-mono text-[10.5px] font-semibold uppercase tracking-[0.11em] text-accent"
    >
      <span class="inline-block size-2 shrink-0 rounded-full bg-accent" aria-hidden="true"></span>
      {{ heading }}
    </span>
    <div
      class="[&_b]:font-[650] [&_b]:text-ink [&_code]:rounded-[5px] [&_code]:bg-accent-soft [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink [&_p]:mt-1.5 [&_p]:mb-0"
    >
      <slot />
    </div>
  </div>
</template>
