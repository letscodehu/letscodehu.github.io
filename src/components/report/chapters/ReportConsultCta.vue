<script setup>
import ContentWrap from '../ui/ContentWrap.vue'
</script>

<template>
  <ContentWrap class="no-print">
    <div
      class="reveal mt-10 flex flex-wrap items-center justify-between gap-5 rounded-[18px] bg-ink px-7 py-[26px] text-surface"
    >
      <div>
        <h3 class="mb-1 text-[19px] font-[750] tracking-[-0.015em]">Hol tart ehhez képest a ti csapatotok?</h3>
        <p class="max-w-[52ch] text-[14.5px] leading-[1.5] opacity-[0.78]">
          A riport a piac egészéről szól — ha szeretnéd ugyanezt a saját szervezetedre vetítve látni, egyeztessünk
          egy rövid, ingyenes konzultáción.
        </p>
      </div>
      <a
        class="flex-none rounded-[10px] bg-accent px-[22px] py-[13px] text-[14.5px] font-bold text-white no-underline transition-[filter] duration-150 hover:brightness-[1.12]"
        href="/hu/ai-tanacsadas"
        >Foglalj időpontot</a
      >
    </div>
  </ContentWrap>
</template>
