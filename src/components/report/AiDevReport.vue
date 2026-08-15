<script setup>
// A riport gyökérkomponense. Maga nem tartalmaz tartalmat: a témát, a
// tooltipet, a diagram-renderelést és a görgetéses megjelenést fogja össze,
// a fejezeteket pedig sorban kirakja.
//
// A fejezetek az adatot nem propként kapják, hanem a provideReport()-tal
// átadott, számított API-ból (useReport()).
import { computed, ref, toRef, watch } from 'vue'
import './report.css'
import { anchor } from './chapters.js'
import { provideReport } from './useReport.js'
import { provideSegment } from './useSegment.js'
import { useCharts } from './useCharts.js'
import { useReveal } from './useReveal.js'

import SegmentPicker from './ui/SegmentPicker.vue'
import ReportHero from './chapters/ReportHero.vue'
import ReportToc from './chapters/ReportToc.vue'
import ChSummary from './chapters/ChSummary.vue'
import ChFindings from './chapters/ChFindings.vue'
import ChArchetypes from './chapters/ChArchetypes.vue'
import ChAgentic from './chapters/ChAgentic.vue'
import ChAiCode from './chapters/ChAiCode.vue'
import ChReview from './chapters/ChReview.vue'
import ChGovernance from './chapters/ChGovernance.vue'
import ChSecurity from './chapters/ChSecurity.vue'
import ChLearning from './chapters/ChLearning.vue'
import ChMethodology from './chapters/ChMethodology.vue'
import ReportPdfCta from './chapters/ReportPdfCta.vue'
import ReportConsultCta from './chapters/ReportConsultCta.vue'
import ReportFooter from './chapters/ReportFooter.vue'

const props = defineProps({
  /** A compute.py által előállított report_data.json tartalma. */
  data: { type: Object, required: true },
  /** 'auto' = a böngésző/OS beállítását követi; 'light' / 'dark' = kényszerített. */
  theme: { type: String, default: 'auto' },
  /** Az egyes fejezetek úsztatva jelenjenek-e meg görgetéskor. */
  reveal: { type: Boolean, default: true },
  /** Nyomtatási/PDF-mód: borító + tartalomjegyzék, nyitott lenyílók, világos téma. */
  printMode: { type: Boolean, default: false },
  /** A letölthető PDF útvonala. Üres string esetén a letöltő blokk elmarad. */
  pdfUrl: { type: String, default: 'state-of-ai-dev-2026.pdf' },
  /**
   * A kiemelt szegmens `"dimenzió:kulcs"` alakban (pl. `companytype:Freelancer`).
   * Üres string = teljes minta. Ismeretlen kulcsra a riport csendben a teljes
   * mintán marad. `v-model:segment`-tel kétirányú.
   */
  segment: { type: String, default: '' },
})

// A komponens szándékosan NEM nyúl az URL-hez: beágyazva az a befogadó oldalé.
// Aki linkelhető szegmenst akar, a `v-model:segment`-re köti az URL-kezelését
// (lásd src/main.js).
const emit = defineEmits(['update:segment'])

const rootEl = ref(null)
const tipEl = ref(null)

const effTheme = computed(() => (props.printMode ? 'light' : props.theme))
const effReveal = computed(() => props.reveal && !props.printMode)
// A PDF rögzített dokumentum: nem tud „szegmens-állapotot” jelenteni, ezért
// nyomtatásban se választó, se kiemelés nincs.
const segEnabled = computed(() => !props.printMode)

provideReport(toRef(props, 'data'))
const segment = provideSegment(toRef(props, 'data'), segEnabled)
useCharts(rootEl, tipEl, toRef(props, 'data'), segment)

watch(() => props.segment, (v) => segment.setFromString(v), { immediate: true })
watch(segment.asString, (v) => emit('update:segment', v))
useReveal(rootEl, effReveal)

function scrollToChapter(id) {
  const node = rootEl.value?.querySelector(`#${anchor(id)}`)
  if (!node) return
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  node.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
}
</script>

<template>
  <div
    ref="rootEl"
    class="ai-report"
    :class="{ 'reveal-on': effReveal, 'print-mode': printMode }"
    :data-theme="effTheme === 'auto' ? null : effTheme"
  >
    <!-- A tooltip a komponensen belül él, nem a body-n. -->
    <div
      ref="tipEl"
      class="pointer-events-none fixed top-0 left-0 z-50 max-w-[260px] rounded-[9px] border border-brd bg-surface px-2.5 py-2 text-[12.5px] text-ink opacity-0 shadow-[0_8px_28px_rgba(0,0,0,0.2)] transition-opacity duration-[0.08s] [&_b]:font-bold"
    ></div>

    <ReportHero @navigate="scrollToChapter" />
    <SegmentPicker v-if="segEnabled" />
    <ReportToc />

    <ChSummary />
    <ChFindings />
    <ChArchetypes />
    <ChAgentic />
    <ChAiCode />
    <ChReview />
    <ChGovernance />
    <ReportConsultCta />
    <ChSecurity />
    <ReportConsultCta />
    <ChLearning />
    <ChMethodology />
    <ReportPdfCta v-if="pdfUrl" :href="pdfUrl" />
    <ReportFooter />
  </div>
</template>
