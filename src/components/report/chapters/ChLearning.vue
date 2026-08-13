<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'

const { pct, cell, archDef, archVal } = useReport()
</script>

<template>
  <ChapterSection id="tanulas" num="09" tag="Tanulási igények" title="Mit akarnak tanulni — és mi hiányzik valójában">
    <LeadText>
      A kérdés az volt, hol fejlesztenék leginkább az AI-tudásukat. A válaszok szintenként élesen elválnak: a tanulási
      igény együtt érik a használat mélységével.
    </LeadText>

    <CardGrid>
      <ChartCard title="Hol fejlesztené az AI-tudását" meta="q15 · a teljes minta">
        <div data-bar="q15_future_area"></div>
      </ChartCard>
      <ChartCard title="Tanulási igény archetípusonként" meta="soronként 100% · archetípus × q15">
        <div data-stack="arch_x_learning"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      A létra tisztán kirajzolódik. A <b>kívülállók</b>
      {{ pct(cell('arch_x_learning', archDef('outsider').name, 'AI biztonság & etika')) }}-a az AI biztonságát és
      etikáját választja — kívülről nézve ez a téma. Az <b>asszisztens-használók</b>
      {{ pct(cell('arch_x_learning', archDef('assistant').name, 'Prompt engineering')) }}-a a prompt engineeringet: még
      a hatékonyabb használat a cél. Az <b>AI-native-ok</b> viszont már
      {{ pct(cell('arch_x_learning', archDef('native').name, 'AI-alapú architektúra')) }}-ban az
      <b>AI-alapú architektúrát</b> jelölik, plusz
      {{ pct(cell('arch_x_learning', archDef('native').name, 'LLM-integráció termékbe')) }} az LLM-integrációt — náluk a
      kérdés már rendszerszintű.
    </InsightBox>

    <ChartCard class="print-hide" title="Tanulási igény szerepkörönként" meta="soronként 100% · q12b × q15">
      <div data-stack="role_x_learning"></div>
      <template #note>A kis létszámú szerepkörök arányai zajosak — irányadók, nem pontos mérőszámok.</template>
    </ChartCard>

    <InsightBox>
      Van egy feltűnő hiány is. Az AI-native csoportban a legalacsonyabb az <b>AI biztonság &amp; etika</b> iránti
      érdeklődés ({{ pct(cell('arch_x_learning', archDef('native').name, 'AI biztonság & etika')) }}) — miközben épp ez
      a csoport a legkitettebb: náluk a leggyakoribb a rendszeres shadow AI, és
      {{ pct(archVal('native', 'secgap')) }}-uknak nincs LLM-biztonsági tesztje. A kereslet és a kockázat itt
      ellentétes irányba mutat.
    </InsightBox>
  </ChapterSection>
</template>
