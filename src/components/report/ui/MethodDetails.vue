<script setup>
// Összecsukható módszertani blokk. Nyomtatásban a print-réteg elrejti a
// summary-t és kinyitja a tartalmat, ezért a `.rp-method` horgony.
//
// A chevron valódi elem (nem ::before), így a nyitott állapotot a Tailwind
// `group-open:` variánsa forgatja — nem kell hozzá saját CSS-szabály.
defineProps({
  summary: { type: String, default: 'Hogyan számoltuk & mi következik belőle' },
  /** Képernyőn is nyitva legyen-e alaphelyzetben. */
  open: { type: Boolean, default: false },
})
</script>

<template>
  <details
    class="rp-method group mt-[22px] overflow-hidden rounded-xl border border-brd bg-[color-mix(in_srgb,var(--accent)_4%,var(--surface))]"
    :open="open"
  >
    <summary
      class="flex cursor-pointer items-center gap-[11px] px-4 py-[14px] font-mono text-[12.5px] tracking-[0.02em] text-ink2 select-none hover:text-ink focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span
        class="inline-block text-[17px] leading-none text-accent transition-transform duration-[0.18s] group-open:rotate-90 motion-reduce:transition-none"
        aria-hidden="true"
        >›</span
      >
      {{ summary }}
    </summary>
    <div
      class="rp-method-body px-[18px] pb-5 text-[14.5px] leading-[1.65] text-ink2 [&_b]:font-[650] [&_b]:text-ink [&_code]:rounded-[5px] [&_code]:bg-accent-soft [&_code]:px-[5px] [&_code]:py-px [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:text-ink [&_p]:mt-2 [&_p]:mb-0 [&_p]:max-w-[70ch]"
    >
      <slot />
    </div>
  </details>
</template>
