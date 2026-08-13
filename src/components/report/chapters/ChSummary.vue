<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'

const { D, H, pct, summary } = useReport()
</script>

<template>
  <ChapterSection
    id="osszefoglalo"
    num="01"
    tag="Vezetői összefoglaló"
    title="Az AI-native fejlesztés megérkezett. A fedezete nem."
  >
    <LeadText>
      A minta nem a fejlesztői átlagot mutatja, hanem azt a réteget, amelyik már ma úgy dolgozik, ahogy a többség
      valószínűleg egy-két éven belül. Ebben a rétegben az AI-használat kérdése eldőlt — a nyitott kérdés az, hogy mi
      van alatta.
    </LeadText>

    <ol class="rp-summary mt-7 mb-2 grid max-w-[72ch] list-none gap-3 p-0">
      <li
        v-for="(s, i) in summary"
        :key="i"
        class="relative pl-10 text-[17px] leading-[1.58] text-ink2 [&_b]:font-[650] [&_b]:text-ink"
      >
        <span
          class="absolute top-[3px] left-0 flex size-[26px] items-center justify-center rounded-lg bg-accent text-[13px] font-extrabold text-white tabular-nums"
          aria-hidden="true"
          >{{ i + 1 }}</span
        >
        <span v-html="s"></span>
      </li>
    </ol>

    <ChartCard
      title="Az AI-native lánc: hol morzsolódik le a mezőny"
      meta="egymásba ágyazott feltételek · minden lépés az előző szűkítése · a minta %-a"
    >
      <div data-chart="funnel"></div>
      <template #note>
        Minden sor tartalmazza az összes fölötte lévő feltételt is. A legalsó sor tehát azokat jelenti, akik napi
        szinten használnak AI-t, naponta delegálnak autonóm agentnek, <i>és</i> a kódjuk több mint fele AI-generált.
      </template>
    </ChartCard>

    <InsightBox>
      A tölcsér első fele lapos, a második meredek: az <b>AI-használat</b> már alapállapot ({{ pct(H.any_ai) }}), a
      <b>napi agent-delegálás</b> viszont még mindig szűrő ({{ pct(H.agent_daily) }}). A teljes AI-native láncot a minta
      <b>{{ pct(D.funnel[D.funnel.length - 1].pct) }}</b
      >-a teljesíti — ez a riport központi szegmense.
    </InsightBox>
  </ChapterSection>
</template>
