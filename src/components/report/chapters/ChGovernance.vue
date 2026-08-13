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

const { D, H, pct, hu, rho, rhoTxt, gap, quad } = useReport()
</script>

<template>
  <ChapterSection id="governance" num="07" tag="Vállalati governance" title="Fedezetlen tempó">
    <LeadText>
      A cégek nem fékeznek: <b>{{ pct(H.support_high) }}</b> aktívan ösztönzi az AI-használatot (átlag
      {{ hu(H.support_mean) }}/5). A szabályzat, a képzés és a technikai fedezet viszont nem tartott lépést — és a
      kettő között nincs is érdemi kapcsolat.
    </LeadText>

    <ChartCard
      title="Az adoptáció és a governance közti rés"
      meta="a minta %-a · felül a használat mélysége, alul a mögötte álló feltételek"
    >
      <div data-chart="gap"></div>
    </ChartCard>

    <InsightBox>
      Az adoptációs mutatók átlaga <b>{{ pct(gap.adoption) }}</b
      >, a governance-mutatóké <b>{{ pct(gap.governance) }}</b> — {{ gap.points }} százalékpont a különbség. A
      legélesebb egyedi kontraszt: {{ pct(H.support_high) }} ösztönzés mellett {{ pct(H.policy_ok) }} működő policy és
      {{ pct(H.company_training) }} céges képzés.
    </InsightBox>

    <SubHead>Érettség vs. fedezet szegmensenként</SubHead>
    <LeadText>
      Két 0–100-as index egymással szemben: mennyire mélyen használják az AI-t, és mennyire van mögötte szabályzat,
      képzés és biztonsági felkészültség. Ha a kettő együtt mozogna, a pontok átlóban állnának. Nem állnak.
    </LeadText>

    <ChartCard
      title="AI-érettség × governance-érettség"
      meta="cégtípusonként · a pont mérete a szegmens létszáma · a szaggatott vonal a minta átlaga"
    >
      <div data-chart="quadrant"></div>
    </ChartCard>

    <InsightBox>
      A <b>{{ quad.startup.label }}</b> szegmens érettsége {{ hu(quad.startup.x, 0) }}, a governance-e
      {{ hu(quad.startup.y, 0) }} — a „fedezetlen tempó” kvadráns. A <b>{{ quad.enterprise.label }}</b> fordítva áll ({{
        hu(quad.enterprise.x, 0)
      }}
      vs {{ hu(quad.enterprise.y, 0) }}): lassabban halad, de van mögötte keret. A két index közti rangkorreláció a
      teljes mintán <b>ρ={{ rhoTxt(D.corr_maturity_governance) }}</b
      >, az AI-kódarány és a governance-index között pedig
      <b>ρ={{ rhoTxt(rho('AI-kódarány', 'Governance-index')) }}</b> — statisztikailag ez azt jelenti, hogy
      <b>a kettőnek semmi köze egymáshoz</b>.
    </InsightBox>

    <CardGrid>
      <ChartCard
        title="Céges támogatottság"
        :pill="`átlag ${hu(D.scales.q07_company_support.mean)}/5`"
        meta="q07 · 1: tiltja · 5: aktívan ösztönzi"
      >
        <div data-chart="lik-q07"></div>
      </ChartCard>
      <ChartCard title="Van-e formális AI-policy?" meta="q08 · szabályzat státusza">
        <div data-bar="q08_company_policy"></div>
      </ChartCard>
      <ChartCard title="AI-képzés az elmúlt 12 hónapban" meta="q13 · formális képzés">
        <div data-bar="q13_training"></div>
      </ChartCard>
      <ChartCard title="Céges támogatás a képzési státusz szerint" meta="átlagos q07-érték (1–5) csoportonként">
        <div data-chart="trainsup"></div>
      </ChartCard>
    </CardGrid>

    <InsightBox>
      A képzés a leglátványosabb hiány: <b>{{ pct(H.no_training) }}</b> nem kapott formális AI-képzést az elmúlt egy
      évben, és csak {{ pct(H.company_training) }} kapott céges keretből. Ez ugyanabban a mintában történik, ahol
      {{ pct(H.daily) }} minden nap AI-jal dolgozik — a készségfejlesztés a fejlesztők magánügye maradt.
    </InsightBox>

    <MethodDetails>
      <MethodHeading>A két index</MethodHeading>
      <p>
        <b>AI-érettség</b> = használati gyakoriság (35%) + agent-autonómia (35%) + AI-kódarány (30%), mind 0–1-re
        skálázva, majd 0–100-ra. <b>Governance-érettség</b> = AI-policy státusza (40%) + kapott képzés (30%) +
        LLM-biztonsági felkészültség (30%). Ahol egy komponens nem értelmezhető (pl. „egyedül dolgozom”, vagy „nem
        fejlesztünk LLM-integrációt”), ott nem nullázunk és nem imputálunk átlagot, hanem a maradék komponensekre
        normáljuk a súlyokat.
      </p>
      <MethodHeading>Fenntartás</MethodHeading>
      <p>
        Az indexek súlyozása döntés kérdése, nem levezetett igazság — más súlyokkal a szintek eltolódnának. A
        <b>pontok egymáshoz viszonyított helyzete</b> és a korreláció hiánya viszont robusztus: nem a súlyokon múlik,
        hogy a startup és a nagyvállalat ellentétes irányba tér el az átlagtól.
      </p>
    </MethodDetails>
  </ChapterSection>
</template>
