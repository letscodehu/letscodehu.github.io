<script setup>
// Egy diagram kerete: cím, kérdés-alcím, opcionális átlag-plakett, a diagram
// mount-eleme (default slot) és egy opcionális lábjegyzet.
//
// A diagramot nem ez a komponens rajzolja: a slotba tett üres mount-elemet
// (`data-bar`, `data-stack`, `data-chart` …) a useCharts() tölti fel.
defineProps({
  title: { type: String, required: true },
  /** A cím alatti kis metasor: melyik kérdésből, milyen normálással. */
  meta: { type: String, required: true },
  /** Opcionális plakett a cím mellett, pl. „átlag 3,12/5”. */
  pill: { type: String, default: '' },
})
</script>

<template>
  <div class="rp-card mt-[22px] overflow-hidden rounded-2xl border border-brd bg-surface px-5 pt-5 pb-[15px]">
    <h3 class="rp-card-h mb-[3px] text-[15.5px] leading-[1.3] font-bold tracking-[-0.01em]">
      {{ title }}
      <span
        v-if="pill"
        class="ml-2 inline-block rounded-md bg-accent-soft px-2 py-0.5 align-middle font-mono text-[11px] font-semibold tracking-[0.01em] text-accent normal-case"
        >{{ pill }}</span
      >
    </h3>
    <p class="rp-card-q mb-4 font-mono text-[11px] tracking-[0.01em] text-muted lowercase">{{ meta }}</p>
    <slot />
    <p
      v-if="$slots.note"
      class="rp-note mt-[13px] mb-[1em] max-w-[64ch] font-mono text-[11.5px] leading-[1.6] text-muted [&_b]:text-ink2"
    >
      <slot name="note" />
    </p>
  </div>
</template>
