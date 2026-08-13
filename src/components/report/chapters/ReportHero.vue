<script setup>
import { CHAPTERS, anchor } from '../chapters.js'
import { useReport } from '../useReport.js'
import ContentWrap from '../ui/ContentWrap.vue'

const { D, heroStats } = useReport()

// A görgetést a gyökérkomponens végzi: neki van referenciája a riport
// gyökérelemére, amin belül a horgonyt keresni kell.
const emit = defineEmits(['navigate'])
</script>

<template>
  <header class="rp-hero pt-[clamp(54px,10vw,110px)] pb-10">
    <ContentWrap>
      <div class="font-mono text-[12.5px] font-semibold uppercase tracking-[0.18em] text-accent">
        Magyar fejlesztői körkép · 2026
      </div>

      <h1
        class="rp-h1 mt-[0.14em] mb-[0.3em] text-[clamp(40px,8vw,82px)] font-extrabold leading-[0.96] tracking-[-0.038em]"
      >
        State of AI&nbsp;Dev
      </h1>

      <p class="rp-deck mb-[1em] max-w-[56ch] text-[clamp(18px,2.3vw,23px)] leading-[1.45] font-normal text-ink2">
        Hol tart a magyar szoftverfejlesztés AI-native átalakulása? Mennyit ír már a gép, mit vett át az agent, ki
        ellenőrzi, és mennyi fedezet van mögötte. Fejlesztők és mérnöki vezetők válaszai alapján.
      </p>

      <div class="rp-herostats mt-10 mb-1.5 flex flex-wrap gap-x-[30px] gap-y-[22px]">
        <div v-for="s in heroStats" :key="s.k" class="flex-[1_1_190px] border-t-2 border-ink pt-[13px]">
          <div class="rp-hstat-n text-[clamp(36px,5.2vw,54px)] leading-none font-extrabold tracking-[-0.032em] tabular-nums">
            {{ s.n }}
          </div>
          <div class="mt-[9px] font-mono text-[12px] leading-[1.45] tracking-[0.02em] text-ink2">{{ s.k }}</div>
        </div>
      </div>

      <nav class="no-print mt-[38px] flex flex-wrap gap-x-[9px] gap-y-2 font-mono text-[12.5px]">
        <a
          v-for="c in CHAPTERS"
          :key="c.id"
          :href="`#${anchor(c.id)}`"
          class="cursor-pointer rounded-lg border border-brd px-[11px] py-[7px] text-ink2 no-underline transition-[color,border-color] duration-150 hover:border-accent hover:text-accent"
          @click.prevent="emit('navigate', c.id)"
          >{{ c.label }}</a
        >
      </nav>

      <p class="mt-[26px] mb-[1em] font-mono text-[11.5px] leading-[1.6] text-muted">
        Önkéntes, önbevallásos minta — nem reprezentatív a magyar fejlesztői populációra.
      </p>
    </ContentWrap>
  </header>
</template>
