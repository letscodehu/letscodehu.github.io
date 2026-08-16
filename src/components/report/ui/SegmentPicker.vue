<script setup>
// Szegmensválasztó sáv: az olvasó kijelöli, melyik szeletet emelje ki a riport.
// Egyszerre egy dimenzió és egy opció aktív — az indoklás a useSegment.js-ben.
//
// Nyomtatásban nem renderelődik (az AiDevReport hagyja ki), ezért itt nincs
// print-stílus és nincs `print-hide` osztály sem.
//
// Mobilon (md alatt) a sáv sticky marad, de alapból összecsukott: a teljes
// opciólista csak a toggle gombra tapintva nyílik ki, hogy ne foglaljon
// állandóan helyet a képernyőn. Desktopon (md és felette) ez a toggle
// eltűnik, a sáv mindig teljesen nyitva látszik — ott elég a hely.
import { ref } from 'vue'
import { useSegment } from '../useSegment.js'
import ContentWrap from './ContentWrap.vue'

const { dims, option, select, clear, isSelected } = useSegment()

const isOpen = ref(false)
</script>

<template>
  <!-- `no-print`: böngészőből nyomtatva (printMode nélkül) a vezérlő ne kerüljön papírra -->
  <div class="rp-segbar no-print sticky top-0 z-40 border-b border-brd bg-surface">
    <ContentWrap>
      <button
        type="button"
        class="flex w-full items-center justify-between py-[11px] font-mono text-[11.5px] text-ink2 md:hidden"
        :aria-expanded="isOpen"
        aria-controls="rp-segbar-panel"
        @click="isOpen = !isOpen"
      >
        <span
          >Szűrők<template v-if="option"
            > — <b class="text-ink">{{ option.label }}</b></template
          ></span
        >
        <span class="transition-transform duration-150" :class="{ 'rotate-180': isOpen }">▾</span>
      </button>

      <div
        id="rp-segbar-panel"
        class="flex-wrap items-center gap-x-5 gap-y-2.5 py-[11px] md:flex"
        :class="isOpen ? 'flex' : 'hidden'"
      >
        <div v-for="dim in dims" :key="dim.key" class="flex flex-wrap items-center gap-2">
          <span class="font-mono text-[10.5px] tracking-[0.09em] text-muted uppercase">{{ dim.label }}</span>
          <button
            v-for="o in dim.options"
            :key="o.key"
            type="button"
            :aria-pressed="isSelected(dim.key, o.key)"
            :title="o.full"
            class="rp-segbtn cursor-pointer rounded-full border px-[11px] py-[3px] text-[12.5px] leading-[1.5] transition-colors"
            :class="
              isSelected(dim.key, o.key)
                ? 'border-accent bg-accent text-surface font-semibold'
                : 'border-brd text-ink2 hover:border-accent hover:text-accent'
            "
            @click="select(dim.key, o.key)"
          >
            {{ o.label }}
          </button>
        </div>

        <p v-if="option" class="ml-auto flex items-center gap-2.5 font-mono text-[11.5px] text-muted">
          <span
            >kiemelve: <b class="text-ink">{{ option.label }}</b></span
          >
          <button
            type="button"
            class="cursor-pointer rounded-md border border-brd px-2 py-0.5 text-ink2 transition-colors hover:border-accent hover:text-accent"
            @click="clear()"
          >
            vissza a teljes mintára
          </button>
        </p>
        <p v-else class="ml-auto max-w-[42ch] font-mono text-[11.5px] leading-[1.5] text-muted">
          Válassz egy szegmenst — a teljes minta végig látszik, a választott szelet kiemelve.
        </p>
      </div>
    </ContentWrap>
  </div>
</template>
