<script setup>
import { useReport } from '../useReport.js'
import ContentWrap from '../ui/ContentWrap.vue'

const { D } = useReport()
</script>

<template>
  <ContentWrap>
    <!-- Ez nem oldalláb, hanem a minta korlátait kimondó módszertani jegyzet.
         A site footere közvetlenül utána jön, ezért az eredeti 84px alsó
         térköz helyett szűkebb — a standalone előnézetben ott nincs mi kövesse. -->
    <div class="rp-foot max-w-[78ch] border-t border-brd pt-11 pb-12 font-mono text-[12.5px] leading-[1.75] text-muted">
      State of AI Dev 2026 — magyar fejlesztői körkép. Az adatok önbevallásosak; a minta önkéntes
      kitöltésű, nem reprezentatív a magyar fejlesztői populációra, és a tapasztaltabb, AI-affin rétegre torzít. Az
      abszolút arányok felső becslések; a megbízhatóbb jelzés a szegmensek közti különbség. A „nem releváns / nincs
      rálátás” válaszokat a skálaátlagoknál kihagytuk. Diagramok: saját inline-SVG renderelés, világos/sötét témához
      igazodva.
    </div>
  </ContentWrap>
</template>
