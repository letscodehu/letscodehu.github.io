<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import SubHead from '../ui/SubHead.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'
import MethodDetails from '../ui/MethodDetails.vue'
import MethodHeading from '../ui/MethodHeading.vue'

const { D, H, pct, rhoTxt, rho, archVal } = useReport()
</script>

<template>
  <ChapterSection id="ai-kod" num="05" tag="AI-generált kód" title="Mennyit ír már tényleg a gép">
    <LeadText>
      A kérdés a production kód arányára vonatkozott, emberi módosítás nélkül vagy minimálissal.
      <b>{{ pct(H.high_ratio) }}</b> mondja, hogy ez több mint a fele, <b>{{ pct(H.very_high_ratio) }}</b> pedig a 71%+
      sávba sorolja magát. Ez becslés, nem mérés — de a szegmensek közti különbség így is beszédes.
    </LeadText>

    <CardGrid>
      <ChartCard title="AI-generált kód aránya" meta="AI-kódarány (q05) · a válaszadók megoszlása">
        <div data-bar="q05_ai_code_ratio"></div>
      </ChartCard>
      <ChartCard title="AI-kódarány archetípusonként" meta="soronként 100% · archetípus × AI-kódarány (q05)">
        <div data-stack="arch_x_ratio"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      Az archetípus szinte determinálja a kódarányt: az AI-native csoport
      <b>{{ pct(archVal('native', 'ratio50')) }}</b
      >-ánál a kód több mint fele AI-generált, az asszisztens-használóknál
      {{ pct(archVal('assistant', 'ratio50')) }}. Az agent-autonómia és az AI-kódarány között ez a minta legerősebb
      együttjárása (<b>ρ={{ rhoTxt(rho('Agent-autonómia', 'AI-kódarány')) }}</b
      >) — aki komplett feladatokat delegál, annál a kód is nagyobb részben gépi.
    </InsightBox>

    <ChartCard title="AI-kódarány cégtípusonként" meta="soronként 100% · cégtípus × AI-kódarány (q12 × q05)">
      <div data-stack="companytype_x_ratio"></div>
    </ChartCard>

    <SubHead>Melyik munkafázist vette át az AI</SubHead>
    <LeadText>
      Először a jól körülhatárolt, olcsón ellenőrizhető munka ment át: boilerplate, tesztek, dokumentáció. A mély
      kontextust igénylő feladatok — legacy refaktor, bug-izolálás — csak a magasabb érettségi szinteken nyílnak meg.
    </LeadText>

    <CardGrid>
      <ChartCard title="Átvett munkafázisok" meta="átvett munkafázisok (q04) · max. 2 válasz · a válaszadók %-a">
        <div data-multibar="q04_workflow_shift"></div>
      </ChartCard>
      <ChartCard title="Munkafázisok archetípusonként" meta="a csoport hány %-a jelölte · több válasz lehetséges">
        <div data-group="workflow_by_arch" data-labelw="168"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      A különbség nem a sorrendben van, hanem a <b>mélységben</b>. A bug- és leak-izolálást — a legnehezebben
      delegálható feladatot — az AI-native csoport <b>{{ pct(D.workflow_by_arch.rows[3].pct[4]) }}</b
      >-a jelölte, az asszisztens-használók {{ pct(D.workflow_by_arch.rows[1].pct[4]) }}-a. A kívülállók
      {{ pct(D.workflow_by_arch.rows[0].pct[5]) }}-a szerint az AI <i>egyik</i> fázisban sem váltott ki manuális
      munkát; az AI-native csoportban ezt <b>senki</b> nem jelölte.
    </InsightBox>

    <MethodDetails>
      <MethodHeading>Számítás</MethodHeading>
      <p>
        A <code>q04</code> többválaszos (max. 2 jelölés), ezért az arányok összege meghaladja a 100%-ot; a nevező
        mindig a csoport létszáma. A <code>q05</code> önbevallott sávbecslés, nem repository-elemzés.
      </p>
      <MethodHeading>Fenntartás</MethodHeading>
      <p>
        Az „AI-generált kód aránya” a riport legpuhább mutatója: nincs közös definíciója annak, mi számít „minimális
        módosításnak”, és a becslés felfelé is, lefelé is torzulhat. A szegmensek közti <b>különbséget</b> érdemes
        olvasni, nem az abszolút szintet.
      </p>
    </MethodDetails>
  </ChapterSection>
</template>
