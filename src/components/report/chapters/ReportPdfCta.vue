<script setup>
// A PDF-letöltés. A blokk a zárolt részben van, tehát csak feliratkozás után
// renderelődik — e-mailt itt már nem kérünk. Az e-mail-bekérő a ReportGate-ben
// él, a közös logika a useReportSubscription.js-ben.
import ContentWrap from '../ui/ContentWrap.vue'

defineProps({
  /** A letölthető PDF útvonala. */
  href: { type: String, required: true },
})
</script>

<template>
  <ContentWrap class="no-print">
    <div class="reveal mt-10 rounded-[18px] bg-ink px-7 py-[26px] text-surface">
      <div class="flex flex-wrap items-center justify-between gap-5">
        <div class="min-w-0 grow basis-[24rem]">
          <h3 class="mb-1 text-[19px] font-[750] tracking-[-0.015em]">Szerkesztett PDF-változat</h3>
          <p class="max-w-[52ch] text-[14.5px] leading-[1.5] opacity-[0.78]">
            A teljes riport nyomtatható, lapozható formában — borítóval, tartalomjegyzékkel és minden ábrával.
          </p>
        </div>
        <a
          :href="href"
          download
          class="flex-none rounded-[10px] bg-accent px-[22px] py-[13px] text-[14.5px] font-bold text-white no-underline transition-[filter] duration-150 hover:brightness-[1.12]"
          >PDF letöltése</a
        >
      </div>
    </div>
  </ContentWrap>
</template>
