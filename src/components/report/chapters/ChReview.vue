<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'
import PlainBox from '../ui/PlainBox.vue'

const { D, pct, hu, az, cell, archVal, archDef, reviewArch } = useReport()
</script>

<template>
  <ChapterSection id="review" num="06" tag="Review & verifikáció" title="A verifikációs völgy">
    <LeadText>
      Kézenfekvő feltevés, hogy minél több az AI-kód, annál nagyobb az ellenőrzés terhe. Az adat nem ezt mutatja: a
      teher <b>a középmezőnyben tetőzik</b>, és épp a legmélyebb használóknál a legalacsonyabb.
    </LeadText>

    <CardGrid>
      <ChartCard title="Review-teher archetípusonként" meta="review-teher (q06) átlaga · 1: nem több · 5: sok extra idő">
        <div data-chart="review-arch"></div>
      </ChartCard>
      <ChartCard
        title="Review-teher eloszlása"
        :pill="`átlag ${hu(D.scales.q06_hallucination_review.mean)}/5`"
        meta="review-teher (q06) · a teljes minta"
      >
        <div data-chart="lik-q06"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      A görbe alakja a lényeg: a csúcs <b>{{ reviewArch.peakTxt }}</b
      >, a legalacsonyabb pedig <b>{{ az(reviewArch.low.label.toLowerCase()) }}</b> csoport ({{
        hu(reviewArch.low.mean)
      }}/5) — {{ reviewArch.delta }} pont a különbség. Ugyanez látszik az AI-kódarány mentén is: a legmagasabb terhet a
      <b>0–10%</b>-os sáv jelzi ({{ hu(D.review.by_ratio[0].mean) }}/5), a legalacsonyabbat a 71%+ ({{
        hu(D.review.by_ratio[4].mean)
      }}/5).
    </InsightBox>

    <ChartCard
      title="Review-teher az AI-kódarány mentén"
      meta="review-teher (q06) átlaga az AI-kódarány (q05) sávjai szerint · a „nincs rálátás” kihagyva"
    >
      <div data-chart="review-ratio"></div>
    </ChartCard>

    <PlainBox heading="Amit ez nem jelent">
      <p>
        Ebből <b>nem</b> következik, hogy az AI-kód könnyebben review-zható. Legalább három magyarázat fér az adatra:
        (1) aki sokat használ, gyakorlottabban szűri a gépi hibákat; (2) aki nehéznek találta, abbahagyta vagy vissza
        sem lépett — vagyis a magas terhet érzők a kevés-AI sávokban maradtak; (3) aki nagyon mélyen delegál, esetleg
        <i>kevesebbet</i> ellenőriz, és ezt éli meg kisebb teherként. A kérdőív a <b>szubjektív terhet</b> mérte, nem a
        review minőségét vagy a hibák számát — a harmadik magyarázat kockázatát az adat nem zárja ki.
      </p>
    </PlainBox>

    <ChartCard title="Mi a fő akadály a szélesebb használatban" meta="soronként 100% · archetípus × fő akadály (q11)">
      <div data-stack="arch_x_blocker"></div>
    </ChartCard>

    <InsightBox>
      Az akadály <b>szintfüggő</b>. Az asszisztens-használóknál a minőség és megbízhatóság vezet ({{
        pct(cell('arch_x_blocker', archDef('assistant').name, 'Minőség / megbízhatóság'))
      }}), az AI-native csoport <b>{{ pct(archVal('native', 'noblocker')) }}</b
      >-a szerint viszont már nincs akadály. A kívülállóknál a szabályozói megfelelőség és a minőség egyforma súllyal
      áll — vagyis a belépést nem egy dolog gátolja.
    </InsightBox>
  </ChapterSection>
</template>
