<script setup>
import ContentWrap from '../ui/ContentWrap.vue'

defineProps({
  /** A letölthető PDF útvonala. */
  href: { type: String, required: true },
})
</script>

<template>
  <ContentWrap class="no-print">
    <div
      class="reveal mt-10 flex flex-wrap items-center justify-between gap-5 rounded-[18px] bg-ink px-7 py-[26px] text-surface"
    >
      <div>
        <h3 class="mb-1 text-[19px] font-[750] tracking-[-0.015em]">Szerkesztett PDF-változat</h3>
        <p class="max-w-[52ch] text-[14.5px] leading-[1.5] opacity-[0.78]">
          A teljes riport nyomtatható, lapozható formában — borítóval, tartalomjegyzékkel és minden ábrával.
        </p>
      </div>
      <a
        class="flex-none rounded-[10px] bg-accent px-[22px] py-[13px] text-[14.5px] font-bold text-white no-underline transition-[filter] duration-150 hover:brightness-[1.12]"
        :href="href"
        download
        >PDF letöltése</a
      >
    </div>
  </ContentWrap>
</template>
