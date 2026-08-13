<script setup>
import { useReport } from '../useReport.js'
import ChapterSection from '../ui/ChapterSection.vue'
import LeadText from '../ui/LeadText.vue'
import CardGrid from '../ui/CardGrid.vue'
import ChartCard from '../ui/ChartCard.vue'
import InsightBox from '../ui/InsightBox.vue'
import PlainBox from '../ui/PlainBox.vue'
import MethodDetails from '../ui/MethodDetails.vue'
import MethodHeading from '../ui/MethodHeading.vue'

const { D, rho, rhoTxt } = useReport()
</script>

<template>
  <ChapterSection id="modszertan" num="10" tag="Módszertan & a minta" title="Mit mér ez a riport, és mit nem">
    <LeadText>
      Önkéntes kitöltésű, önbevallásos online kérdőív. Nem valószínűségi minta:
      <b>nem reprezentatív</b> a magyar fejlesztői populációra, és nem is annak szánjuk.
    </LeadText>

    <CardGrid>
      <ChartCard title="Cégtípus" meta="q12 · a válaszadók megoszlása">
        <div data-bar="q12_company_type"></div>
      </ChartCard>
      <ChartCard title="Szerepkör" meta="q12b · a válaszadók megoszlása">
        <div data-bar="q12b_role"></div>
      </ChartCard>
    </CardGrid>

    <PlainBox heading="Amit az adat nem bír el">
      <p>
        <b>Az arányok szintje felfelé torzít.</b> A kitöltők önként jelentkeztek egy AI-témájú kérdőívre, és a minta a
        senior, döntéshozói rétegre húz — ezért az abszolút százalékok felső becslésnek tekintendők, nem a teljes
        fejlesztői populáció értékeinek.<br />
        <b>Minden mutató önbevallás.</b> Az „AI-generált kódarány”, a „review-teher” és a shadow AI gyakorisága azt
        méri, amit a válaszadó <i>gondol</i> vagy <i>vállal</i>. A shadow AI jellemzően alulbevallott.<br />
        <b>Az együttjárás nem ok-okozat.</b> A korrelációk irányt mutatnak; keresztmetszeti adatból nem állapítható
        meg, mi mit okoz.<br />
        <b>A kis cellák zajosak.</b> A kis létszámú szegmenseknél a százalékok néhány fős elmozdulásra is
        érzékenyek — ezeknél a trend olvasható, a pontos érték nem.
      </p>
    </PlainBox>

    <ChartCard
      title="Mi mozog együtt mivel"
      meta="Spearman-rangkorreláció · −1 (ellentétes) … 0 (nincs) … +1 (együtt mozog)"
    >
      <div data-chart="corr"></div>
      <template #note>
        A <b>kék</b> együtt mozgást jelent, a <b>piros</b> ellentéteset, a halvány cella azt, hogy nincs érdemi
        kapcsolat. A 0,2 alatti abszolút értékek gyakorlatilag kapcsolat-hiányt jelentenek.
      </template>
    </ChartCard>

    <InsightBox>
      A mátrix két dolgot mond ki. Egy: van egy koherens <b>„mélységi” tengely</b> — használati gyakoriság,
      agent-autonómia és AI-kódarány együtt mozognak (a legerősebb kapocs
      ρ={{ rhoTxt(rho('Agent-autonómia', 'AI-kódarány')) }}). Kettő: a
      <b>governance-index ehhez a tengelyhez alig kapcsolódik</b> (AI-kódarány × governance:
      ρ={{ rhoTxt(rho('AI-kódarány', 'Governance-index')) }}), a review-teher pedig enyhén <i>negatív</i> irányban áll
      vele (ρ={{ rhoTxt(rho('AI-kódarány', 'Review-teher')) }}).
    </InsightBox>

    <MethodDetails summary="A kérdőív és a származtatott mutatók" open>
      <MethodHeading>Kérdések</MethodHeading>
      <p>
        16 kérdés: használati gyakoriság (q01), eszközök (q02, többválaszos), agent-autonómia (q03), átvett
        munkafázisok (q04, max. 2), AI-kódarány (q05), review-teher (q06, 1–5), céges támogatás (q07, 1–5), AI-policy
        (q08), shadow AI (q09), lokális vs. felhő (q10), fő akadály (q11), cégtípus (q12), szerepkör (q12b), képzés
        (q13), LLM-biztonsági felkészültség (q14), tanulási igény (q15).
      </p>
      <MethodHeading>Származtatott mutatók</MethodHeading>
      <p>
        <b>Archetípus:</b> szabályalapú besorolás q01 + q03 alapján. <b>AI-érettségi index:</b> q01 (35%) + q03 (35%) +
        q05 (30%). <b>Governance-index:</b> q08 (40%) + q13 (30%) + q14 (30%). <b>Kockázati index:</b> q09 + q08 + q10 +
        q14 + q13, egyenlő súllyal, 0–100-ra skálázva. A nem értelmezhető válaszoknál a súlyok a maradék komponensekre
        normálódnak; a skálaátlagoknál a „nem releváns” válaszok kimaradnak.
      </p>
      <MethodHeading>Ismételhetőség</MethodHeading>
      <p>
        Minden szám a nyers <code>all.csv</code>-ből, egyetlen szkripttel (<code>compute.py</code>) áll elő; a riport
        szövegébe ágyazott értékek is ugyanabból a JSON-ból jönnek, kézi átírás nélkül.
      </p>
    </MethodDetails>
  </ChapterSection>
</template>
