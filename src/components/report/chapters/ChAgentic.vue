<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import SubHead from '../ui/SubHead.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'

const { D, H, pct, hu, roleAgent } = useReport()
</script>

<template>
  <ChapterSection id="agentic" num="04" tag="Agentic coding" title="A delegálás szenioritási kérdés">
    <LeadText>
      Az autonóm agent — ami maga elemzi a repót, megírja a változtatást és nyitja a PR-t — a mintában már nem demó.
      <b>{{ pct(H.agent_any) }}</b> nyúlt hozzá, <b>{{ pct(H.agent_daily) }}</b> naponta használja. De hogy ki lép be,
      azt élesen szelektálja a szerepkör.
    </LeadText>

    <InsightBox>
      A napi agent-delegálás a <b>{{ roleAgent.top.label.toLowerCase() }}</b> körében
      {{ pct(roleAgent.top.pct) }}, a senior fejlesztőknél {{ pct(roleAgent.all['Senior fejlesztő'].pct) }} — a
      <b>junioroknál {{ pct(roleAgent.all['Junior fejlesztő'].pct) }}</b
      >, a medioroknál {{ pct(roleAgent.all['Medior fejlesztő'].pct) }}. Az agent kiadása nem a munka megspórolása:
      ítélőképesség kell hozzá, hogy valaki felmérje, mit lehet rábízni és mit nem.
    </InsightBox>

    <CardGrid>
      <ChartCard title="Agent-autonómia szerepkörönként" meta="soronként 100% · szerepkör × agent-autonómia (q12b × q03)">
        <div data-stack="role_x_autonomy"></div>
        <template #note>
          A kis szerepkör-cellák (junior, eng. manager) a trendet mutatják, a pontos %-ot ne.
        </template>
      </ChartCard>
      <ChartCard title="Agent-autonómia cégtípusonként" meta="soronként 100% · cégtípus × agent-autonómia (q12 × q03)">
        <div data-stack="companytype_x_autonomy"></div>
      </ChartCard>
    </CardGrid>

    <SubHead>Az eszközkészlet is elválik</SubHead>
    <LeadText>
      Nem ugyanazok az eszközök futnak a négy csoportnál. A chat-asszisztens a belépő szint jellemzője; ahogy nő a
      delegálás mélysége, átveszi a helyét a terminál- és repo-szintű agent.
    </LeadText>

    <ChartCard
      title="Eszközhasználat archetípusonként"
      meta="a csoport hány %-a használja az adott eszközt · több válasz lehetséges"
    >
      <div data-group="tools_by_arch" data-labelw="168"></div>
    </ChartCard>

    <InsightBox>
      A <b>{{ H.top_tool.label }}</b> a minta egészében {{ pct(H.top_tool.pct) }}-os, az AI-native csoportban viszont
      <b>{{ pct(D.tools_by_arch.rows[3].pct[0]) }}</b
      >. A chat-asszisztens fordítva mozog: az asszisztens-használóknál {{ pct(D.tools_by_arch.rows[1].pct[1]) }}, az
      AI-native-oknál már csak {{ pct(D.tools_by_arch.rows[3].pct[1]) }}. Átlagosan {{ hu(H.tools_per_person) }} eszköz
      fut fejenként — az eszközök kiegészítik, nem kiváltják egymást.
    </InsightBox>

    <ChartCard
      class="print-hide"
      title="Együtt-használat (ko-előfordulás)"
      meta="a sor eszközét használók hány %-a használja az oszlopét is"
    >
      <div data-chart="cooc"></div>
      <template #note>
        Olvasd soronként. A mátrix <b>nem szimmetrikus</b>: az „A-ból B” nem ugyanaz, mint a „B-ből A”, mert egy
        népszerű eszköz sok kisebb mellé bekerül, fordítva ritkábban.
      </template>
    </ChartCard>
  </ChapterSection>
</template>
