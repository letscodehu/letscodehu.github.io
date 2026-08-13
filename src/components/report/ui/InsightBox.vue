<script setup>
// A diagramok alatti értelmező blokk. A tartalma majdnem mindig tartalmaz
// adatból számolt <b> kiemeléseket, ezért kell a `[&_b]:` variáns.
</script>

<template>
  <div
    class="rp-insight mt-6 mb-1 max-w-[66ch] rounded-r-xl border-l-[3px] border-accent bg-accent-soft px-5 py-[15px] text-[16.5px] text-ink2 [&_b]:font-[650] [&_b]:text-ink"
  >
    <slot />
  </div>
</template>
