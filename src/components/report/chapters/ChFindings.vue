<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'

const { findings } = useReport()
</script>

<template>
  <ChapterSection id="kulcsallitasok" num="02" tag="Kulcsállítások" title="Tíz szám, ami leírja a 2026-os állapotot">
    <LeadText>
      Mindegyik állítás a lenti fejezetek valamelyikéből származik, és mindegyikhez tartozik ábra. A számok
      önbevalláson alapulnak.
    </LeadText>

    <div class="rp-findings mt-[30px] grid grid-cols-2 gap-4 max-[800px]:grid-cols-1">
      <article
        v-for="(f, i) in findings"
        :key="i"
        class="rp-finding flex items-start gap-4 rounded-[14px] border border-brd bg-surface px-5 py-[18px]"
      >
        <div
          class="rp-finding-n min-w-[3.4ch] flex-none text-[27px] leading-[1.15] font-extrabold tracking-[-0.03em] text-accent tabular-nums"
        >
          {{ f.n }}
        </div>
        <div>
          <h3 class="rp-finding-h mt-0.5 mb-[5px] text-[15.5px] leading-[1.25] font-[750] tracking-[-0.01em]">
            {{ f.t }}
          </h3>
          <p class="text-[14.5px] leading-[1.55] text-ink2 [&_b]:font-[650] [&_b]:text-ink" v-html="f.d"></p>
        </div>
      </article>
    </div>
  </ChapterSection>
</template>
