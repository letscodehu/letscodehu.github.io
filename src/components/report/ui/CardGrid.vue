<script setup>
// Kétoszlopos diagram-rács. A 800px-es töréspont szándékosan nem a Tailwind
// `md`-je: nyomtatásban az A4 szélessége (~794px) alá esne, és a print-réteg
// kényszeríti vissza a kétoszlopos elrendezést.
</script>

<template>
  <div class="rp-grid2 grid grid-cols-2 gap-[22px] max-[800px]:grid-cols-1">
    <slot />
  </div>
</template>
