<script setup>
import { ARCH_COLORS } from '../charts.js'
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import SubHead from '../ui/SubHead.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'
import PlainBox from '../ui/PlainBox.vue'
import MethodDetails from '../ui/MethodDetails.vue'
import MethodHeading from '../ui/MethodHeading.vue'

const { D, pct, hu, archVal } = useReport()
</script>

<template>
  <ChapterSection id="archetipusok" num="03" tag="Archetípusok & AI-érettség" title="Négy fejlesztő, négy valóság">
    <LeadText>
      A „mennyire használ AI-t” kérdésre nincs egy válasz. A minta négy jól elkülönülő csoportra bomlik aszerint, hogy
      milyen <b>mélyen</b> engedik be az AI-t a munkafolyamatba — és ez a besorolás szinte minden más kérdésnél is
      megjósolja a választ.
    </LeadText>

    <div
      class="rp-archcards mt-[30px] mb-1 grid grid-cols-4 gap-[14px] max-[860px]:grid-cols-2 max-[480px]:grid-cols-1"
    >
      <article
        v-for="(a, i) in D.archetypes.defs"
        :key="a.key"
        class="rp-archcard rounded-xl border border-brd border-t-[3px] bg-surface px-4 pt-[15px] pb-[17px]"
        :style="{ borderTopColor: ARCH_COLORS[i] }"
      >
        <div class="mb-2 flex items-baseline gap-2">
          <span class="size-[9px] flex-none rounded-full" :style="{ background: ARCH_COLORS[i] }"></span>
          <span class="rp-arch-pct text-[25px] leading-none font-extrabold tracking-[-0.03em] tabular-nums">
            {{ pct(a.pct) }}
          </span>
        </div>
        <h3 class="mb-[3px] text-[15px] font-[750] tracking-[-0.01em]">{{ a.name }}</h3>
        <p class="rp-arch-tag mb-2 text-[13.5px] leading-[1.4] text-ink2">{{ a.tagline }}</p>
        <p class="rp-arch-rule border-t border-brd pt-2 font-mono text-[11px] leading-[1.5] text-muted">
          {{ a.rule }}
        </p>
      </article>
    </div>

    <PlainBox heading="Így olvasd — az archetípusok">
      <p>
        A besorolás <b>szabályalapú</b>, nem statisztikai klaszterezés: két kérdésből dől el (milyen gyakran használ
        AI-t, és milyen mélyen delegál autonóm agentnek), így bárki be tudja lőni, hova esne. A tengely a használat
        mélysége — nem képesség, nem szenioritás és nem teljesítmény.
      </p>
    </PlainBox>

    <ChartCard title="Az archetípusok megoszlása" meta="a válaszadók %-a">
      <div data-chart="archdist"></div>
    </ChartCard>

    <SubHead>A négy csoport profilja</SubHead>
    <LeadText>
      Ugyanaz a tíz mutató mind a négy csoportra. Az árnyalat oszloponként normált: a sötétebb cella az adott mutató
      legmagasabb értéke a négy csoport közül.
    </LeadText>

    <ChartCard title="Archetípus-profil" meta="soronként egy csoport · oszloponként egy mutató · %-ok és 1–5 skálák">
      <div data-chart="archgrid"></div>
    </ChartCard>

    <InsightBox>
      A profil három dolgot mutat meg egyszerre. Egy: az <b>AI-kódarány</b> ugrásszerűen nő ({{
        pct(archVal('assistant', 'ratio50'))
      }}
      → {{ pct(archVal('native', 'ratio50')) }}), miközben az eszközök száma alig ({{
        hu(archVal('assistant', 'tools'))
      }}
      → {{ hu(archVal('native', 'tools')) }}) — nem több eszközről van szó, hanem mélyebb bizalomról. Kettő: a
      <b>review-teher</b> nem a tetején a legnagyobb, hanem középen. Három: a <b>governance-mutatók</b> (policy,
      képzés, biztonsági teszt) nem követik az érettséget — az AI-native oszlopok itt nem világosabbak, mint a többi.
    </InsightBox>

    <MethodDetails>
      <MethodHeading>A besorolás</MethodHeading>
      <p>
        <b>Kívülálló:</b> legfeljebb havonta néhányszor használ AI-t. <b>Asszisztens-használó:</b> legalább heti
        használat, de agentnek nem ad ki feladatot (vagy csak kísérletezik). <b>Agent-kísérletező:</b> heti szinten ad
        ki kisebb taskokat. <b>AI-native:</b> napi szinten delegál end-to-end feladatot. A besorolás csak a
        <code>q01</code> és <code>q03</code> válaszokból következik — az AI-kódarány, a review-teher és a
        governance-mutatók <b>nem</b> részei a definíciónak, ezért a profiltáblában érdemi információt hordoznak.
      </p>
      <MethodHeading>Fenntartás</MethodHeading>
      <p>
        A csoportok mérete eltérő, a kisebbeknél a százalékok
        zajosabbak. A besorolás önbevalláson alapul: azt méri, minek <i>látja</i> valaki a saját munkamódját.
      </p>
    </MethodDetails>
  </ChapterSection>
</template>
