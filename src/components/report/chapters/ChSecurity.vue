<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import SubHead from '../ui/SubHead.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'
import PlainBox from '../ui/PlainBox.vue'

const { D, H, pct, hu, cell } = useReport()
</script>

<template>
  <ChapterSection id="biztonsag" num="08" tag="AI-biztonság" title="A leggyorsabbak a legkitettebbek">
    <LeadText>
      Két külön kockázat fut egymás mellett: a <b>kifelé menő adat</b> (mi kerül be a promptba) és a
      <b>befelé jövő támadás</b> (mi történik, ha az LLM-integrációt valaki manipulálja). Egyikben sincs jó helyzetben
      a minta.
    </LeadText>

    <CardGrid>
      <ChartCard title="Szenzitív adat publikus LLM-be (shadow AI)" meta="shadow AI (q09) · forráskód / kulcs / séma szivárgása">
        <div data-bar="q09_shadow_ai"></div>
      </ChartCard>
      <ChartCard title="Shadow AI archetípusonként" meta="soronként 100% · archetípus × shadow AI (q09)">
        <div data-stack="arch_x_shadow"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      Összesen <b>{{ pct(H.shadow) }}</b
      >-nál fordul elő szenzitív adat publikus LLM-be juttatása. A megoszlás viszont ellentmond az intuíciónak: az
      AI-native csoportban a <b>rendszeres</b> gyakorlat a leggyakoribb ({{ pct(H.native_shadow_regular) }}), és közülük
      {{ pct(H.native_no_policy) }} dolgozik működő policy nélkül — miközben ez a csoport küldi a legtöbb kódot
      modellbe. A kitettség nem a lemaradóknál koncentrálódik.
    </InsightBox>

    <ChartCard title="Visszafogja-e a szabályzat a szivárgást?" meta="soronként 100% · AI-policy × shadow AI (q08 × q09)">
      <div data-stack="policy_x_shadow"></div>
    </ChartCard>

    <InsightBox>
      A policy segít, de nem old meg mindent. Ahol van szabályzat és betartják, ott
      <b>{{ pct(cell('policy_x_shadow', 'Van, és betartják', 'Soha, blokkolva')) }}</b> mondja, hogy soha nem fordul elő
      — ahol nincs és nem is terveznek, ott csak
      {{ pct(cell('policy_x_shadow', 'Nincs, nem is terveznek', 'Soha, blokkolva')) }}. De a működő policy mellett is
      {{ pct(cell('policy_x_shadow', 'Van, és betartják', 'Előfordul („megoldjuk okosban”)')) }} jelzi, hogy „megoldják
      okosban”.
    </InsightBox>

    <SubHead>LLM-integráció: aki épít, az véd?</SubHead>
    <LeadText>
      A minta <b>{{ D.security.builders_pct }}%</b>-a fejleszt LLM-integrációt. Náluk a
      prompt injection és a RAG-mérgezés nem elméleti kérdés, hanem termékkockázat.
    </LeadText>

    <CardGrid>
      <ChartCard title="Felkészültség LLM-sebezhetőségekre" meta="csak az LLM-integrációt fejlesztők">
        <div data-chart="secdist"></div>
      </ChartCard>
      <ChartCard
        title="Biztonsági érettség cégtípusonként"
        meta="soronként 100% · cégtípus × LLM-biztonsági felkészültség (q12 × q14) · a teljes minta"
      >
        <div data-stack="companytype_x_security"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      Az LLM-integrációt fejlesztők <b>{{ pct(D.security.no_test_pct) }}</b
      >-ának nincs dedikált tesztje, ezen belül {{ pct(D.security.none_pct) }} egyáltalán
      nem foglalkozik a kérdéssel. Release előtt <b>{{ pct(D.security.redteam_pct) }}</b>
      red-teamel. Ez az a pont, ahol a riport számai a leginkább figyelmeztető jelzések, nem büszkeségre okot adó
      eredmények.
    </InsightBox>

    <SubHead>Kompozit kockázati index</SubHead>

    <PlainBox heading="Így olvasd — kockázati index">
      <p>
        Egyetlen <b>0–100-as pontszám</b> öt tényezőből, egyenlő súllyal: shadow AI, hiányzó szabályzat, kizárólag
        publikus felhő, gyenge LLM-biztonsági felkészültség, képzéshiány. <b>Magasabb = kockázatosabb.</b> A színes
        szeletek megmutatják, melyik tényező hajtja a pontszámot. A szám nem abszolút mérce, hanem a cégtípusok
        összevetésére való.
      </p>
    </PlainBox>

    <ChartCard title="AI-kockázati index cégtípusonként" meta="0–100 · öt faktor egyenlő súllyal">
      <div data-chart="risk"></div>
    </ChartCard>

    <InsightBox>
      A sorrend megerősíti a governance-fejezet képét: a legmagasabb kockázat a
      <b>{{ D.risk.rows[0].segment.toLowerCase() }}</b> szegmensben ({{ hu(D.risk.rows[0].total, 1) }}/100), a
      legalacsonyabb a <b>{{ D.risk.rows[D.risk.rows.length - 1].segment.toLowerCase() }}</b
      >nál ({{ hu(D.risk.rows[D.risk.rows.length - 1].total, 1) }}). Nem a technológiai lemaradás termeli a kockázatot,
      hanem a szervezeti keret hiánya.
    </InsightBox>

    <CardGrid>
      <ChartCard title="Lokális vs. felhő LLM-ek" meta="lokális vs. felhő (q10) · adatvédelmi megfontolás">
        <div data-bar="q10_local_vs_cloud"></div>
      </ChartCard>
      <ChartCard
        title="Biztonsági érettség archetípusonként"
        meta="soronként 100% · archetípus × LLM-biztonsági felkészültség (q14)"
      >
        <div data-stack="arch_x_security"></div>
      </ChartCard>
    </CardGrid>
  </ChapterSection>
</template>
