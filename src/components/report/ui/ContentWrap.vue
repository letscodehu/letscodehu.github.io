<script setup>
// A riport egységes tartalomsávja. Nyomtatásban a print-réteg oldja fel
// (`.rp-wrap`), ezért kell rajta a szemantikus horgony az utility-k mellett.
</script>

<template>
  <div class="rp-wrap mx-auto max-w-[1000px] px-[22px]">
    <slot />
  </div>
</template>
