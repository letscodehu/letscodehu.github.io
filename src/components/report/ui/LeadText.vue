<script setup>
// Fejezet- és szakaszbevezető. A `[&_b]:` variánsok a slotból érkező
// <b> kiemeléseket stílusozzák, amikre utility-t közvetlenül nem lehet tenni.
</script>

<template>
  <p
    class="rp-lead mb-1 max-w-[60ch] text-[clamp(18px,2.1vw,21px)] leading-[1.5] text-ink2 [&_b]:font-[650] [&_b]:text-ink"
  >
    <slot />
  </p>
</template>
