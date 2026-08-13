// A riport számított tartalma: formázók, adatkinyerő segédek és a prózába
// ágyazott, adatból számolt szövegek.
//
// A gyökérkomponens `provideReport()`-tal teszi elérhetővé, a fejezetek
// `useReport()`-tal veszik fel — így nem kell 12 fejezeten átfűzni a `data`
// propot, és minden levezetés egy helyen marad.
import { computed, inject, provide } from 'vue'

const REPORT_KEY = Symbol('ai-report')

export const pct = (v) => Math.round(v) + '%'
export const hu = (v, d = 2) => Number(v).toFixed(d).replace('.', ',')

/** Határozott névelő magyar egyeztetéssel (az AI-native, a kívülálló). */
export const az = (w) => ('aáeéiíoóöőuúüű'.includes(w.trim()[0]?.toLowerCase()) ? 'az ' : 'a ') + w

export const rhoTxt = (v) => (v < 0 ? '−' : '') + Math.abs(v).toFixed(2).replace('.', ',')

function buildReport(data) {
  const D = computed(() => data.value)
  const H = computed(() => data.value.headline)

  /** Egy archetípus-sor a profiltáblából, kulcs szerint. */
  const archRow = (key) => {
    const i = D.value.archetypes.order.indexOf(key)
    return D.value.archetypes.profile.rows[i]
  }
  /** Egy mutató értéke egy archetípusnál. */
  const archVal = (key, metric) => {
    const j = D.value.archetypes.profile.metrics.findIndex((m) => m.key === metric)
    return archRow(key).values[j]
  }
  const archDef = (key) => D.value.archetypes.defs.find((d) => d.key === key)

  /** Egy kereszttábla cellája: sorcímke + sorozatcímke szerint. */
  const cell = (ctKey, rowLabel, seriesLabel) => {
    const ct = D.value.crosstabs[ctKey]
    const r = ct.rows.find((x) => x.label === rowLabel)
    const j = ct.series.indexOf(seriesLabel)
    return r && j >= 0 ? r.pct[j] : 0
  }

  /** Spearman-együttható a mátrixból, címkék alapján. */
  const rho = (a, b) => {
    const c = D.value.corr
    return c.matrix[c.labels.indexOf(a)][c.labels.indexOf(b)]
  }

  const gap = computed(() => {
    const g = D.value.gap
    const avg = (a) => a.reduce((s, d) => s + d.pct, 0) / a.length
    return {
      adoption: avg(g.adoption),
      governance: avg(g.governance),
      points: Math.round(avg(g.adoption) - avg(g.governance)),
    }
  })

  const quad = computed(() => {
    const q = D.value.quadrant.company
    const byGapDesc = [...q].sort((a, b) => b.x - b.y - (a.x - a.y))
    return {
      widest: byGapDesc[0],
      narrowest: byGapDesc[byGapDesc.length - 1],
      startup: q.find((p) => p.label.startsWith('Startup')),
      enterprise: q.find((p) => p.label.startsWith('Nagyvállalat')),
    }
  })

  const reviewArch = computed(() => {
    const r = D.value.review.by_arch
    const desc = [...r].sort((a, b) => b.mean - a.mean)
    const peak = desc[0]
    const low = [...r].sort((a, b) => a.mean - b.mean)[0]
    // A csúcs holtversenyes is lehet — ilyenkor mindkét csoportot megnevezzük,
    // különben a szöveg önkényesen kiemelné az egyiket.
    const tied = desc.filter((d) => Math.abs(d.mean - peak.mean) < 0.005)
    return {
      rows: r,
      peak,
      low,
      tied,
      peakTxt:
        tied.length > 1
          ? tied.map((d) => az(d.label.toLowerCase())).join(' és ') + ' csoport (mindkettő ' + hu(peak.mean) + '/5)'
          : az(peak.label.toLowerCase()) + ' csoport (' + hu(peak.mean) + '/5)',
      delta: (peak.mean - low.mean).toFixed(2).replace('.', ','),
    }
  })

  const roleAgent = computed(() => {
    const ra = D.value.role_agent_daily
    const entries = Object.entries(ra).filter(([, v]) => v.n >= 15)
    const top = entries.sort((a, b) => b[1].pct - a[1].pct)[0]
    return { all: ra, top: { label: top[0], ...top[1] } }
  })

  const heroStats = computed(() => [
    { n: pct(H.value.daily), k: 'minden nap AI-eszközzel dolgozik' },
    { n: pct(H.value.agent_daily), k: 'naponta delegál autonóm agentnek' },
    { n: pct(H.value.high_ratio), k: 'szerint a kódja fele már AI-generált' },
  ])

  const findings = computed(() => {
    const h = H.value
    const nat = archDef('native')
    const asst = archDef('assistant')
    const f = D.value.funnel
    return [
      {
        n: pct(nat.pct),
        t: 'Minden harmadik válaszadó AI-native',
        d: `Ennyien adnak ki napi szinten end-to-end feladatot autonóm agentnek — nem asszisztensként használják az AI-t, hanem munkatársként. A teljes láncot (napi használat + napi agent-delegálás + 50%+ AI-kód) a minta <b>${pct(f[f.length - 1].pct)}</b>-a teljesíti.`,
      },
      {
        n: pct(h.high_ratio),
        t: 'A production kód fele gépi kézből jön',
        d: `Ennyien mondják, hogy a production kódjuk <b>több mint fele</b> AI-generált, emberi módosítás nélkül vagy minimálissal; <b>${pct(h.very_high_ratio)}</b> a 71%+ sávban van. Ez önbevallás, nem repository-mérés — de a nagyságrend így is beszédes.`,
      },
      {
        n: pct(roleAgent.value.top.pct),
        t: 'Az agentic coding senior gyakorlat',
        d: `A <b>${roleAgent.value.top.label.toLowerCase()}</b> csoport delegál naponta a legnagyobb arányban, a senior fejlesztőknél ${pct(roleAgent.value.all['Senior fejlesztő'].pct)} — a junioroknál viszont csak <b>${pct(roleAgent.value.all['Junior fejlesztő'].pct)}</b>. Az agent-delegálás tapasztalatot és ítélőképességet igényel, nem váltja ki.`,
      },
      {
        n: hu(reviewArch.value.peak.mean),
        t: 'A verifikációs teher középen tetőzik',
        d: `A review-teher nem a legmélyebb AI-használóknál a legnagyobb: a csúcs ${reviewArch.value.peakTxt}, a legalacsonyabb pedig épp ${az(reviewArch.value.low.label.toLowerCase())} csoportnál (${hu(reviewArch.value.low.mean)}/5). A középmezőny fizeti a tanulási görbe árát.`,
      },
      {
        n: pct(archVal('native', 'noblocker')),
        t: 'A minőség csak addig gát, amíg kevés az AI',
        d: `Az AI-native-ok közül ennyien mondják, hogy <b>nincs akadály</b> a szélesebb használat előtt. Az asszisztens-használóknál viszont még <b>${pct(cell('arch_x_blocker', asst.name, 'Minőség / megbízhatóság'))}</b> a minőséget és megbízhatóságot jelöli fő blokkolónak.`,
      },
      {
        n: rhoTxt(D.value.corr_maturity_governance),
        t: 'Az AI-érettség és a governance nem jár együtt',
        d: `A két index közti rangkorreláció gyakorlatilag nulla (ρ=${rhoTxt(D.value.corr_maturity_governance)}), az AI-kódarány és a governance-index között pedig <b>ρ=${rhoTxt(rho('AI-kódarány', 'Governance-index'))}</b>. Aki mélyen használja az AI-t, nem dolgozik szabályozottabb környezetben — csak gyorsabban.`,
      },
      {
        n: gap.value.points + ' pp',
        t: 'Ekkora a rés az adoptáció és a fedezet között',
        d: `Az adoptációs mutatók átlaga <b>${pct(gap.value.adoption)}</b>, a mögöttük álló governance-mutatóké <b>${pct(gap.value.governance)}</b>. A cégek <b>${pct(h.support_high)}</b>-a aktívan ösztönzi az AI-t, működő policy viszont csak <b>${pct(h.policy_ok)}</b>-nál van.`,
      },
      {
        n: pct(h.shadow),
        t: 'A shadow AI nem a szélen van, hanem középen',
        d: `Ennyien mondják, hogy előfordul szenzitív adat (forráskód, kulcs, séma) publikus LLM-be juttatása. Az AI-native csoportban a <b>rendszeres</b> szivárgás a leggyakoribb: <b>${pct(h.native_shadow_regular)}</b> — vagyis a legmélyebb használat jár a legnagyobb kitettséggel.`,
      },
      {
        n: pct(D.value.security.no_test_pct),
        t: 'Aki LLM-et épít termékbe, jellemzően nem teszteli',
        d: `Az LLM-integrációt fejlesztők közül ennyiennek nincs dedikált prompt-injection tesztje; mindössze <b>${pct(D.value.security.redteam_pct)}</b> red-teamel release előtt.`,
      },
      {
        n: pct(cell('arch_x_learning', archDef('native').name, 'AI-alapú architektúra')),
        t: 'A tanulási igény együtt érik a használattal',
        d: `Az AI-native-ok már <b>AI-alapú architektúrát</b> akarnak tanulni, az asszisztens-használók a <b>prompt engineeringet</b> (${pct(cell('arch_x_learning', asst.name, 'Prompt engineering'))}), a kívülállók pedig az <b>AI biztonságot és etikát</b> (${pct(cell('arch_x_learning', archDef('outsider').name, 'AI biztonság & etika'))}). A képzési kínálatnak szintenként kell szólnia.`,
      },
    ]
  })

  const summary = computed(() => {
    const h = H.value
    return [
      `A magyar fejlesztői minta nagy része átlépett a kísérletezésen: <b>${pct(h.daily)}</b> minden nap AI-eszközzel dolgozik, és <b>${pct(h.high_ratio)}</b> szerint a production kódjának több mint fele már AI-generált. Az AI már nem egy eszköz a szerszámosládában, hanem a munkafolyamat alapja.`,
      `Az agentic coding a mintában már nem niche: <b>${pct(h.agent_any)}</b> nyúlt autonóm agenthez, <b>${pct(h.agent_daily)}</b> naponta delegál end-to-end feladatot. Ez a réteg — az <b>AI-native csoport</b> — másképp dolgozik, mint a többi: más eszközöket használ, más munkafázisokat adott át, és másban látja az akadályt.`,
      `A verifikáció terhe nem együtt nő a használattal. A legnagyobb terhet a <b>középmezőny</b> viseli (${hu(reviewArch.value.peak.mean)}/5), az AI-native-ok a legkisebbet (${hu(reviewArch.value.low.mean)}/5). Ez nem bizonyítja, hogy az AI könnyebbé teszi a review-t — inkább azt jelzi, hogy a rutin és a kialakult ellenőrzési szokások számítanak.`,
      `A legnagyobb szerkezeti probléma a <b>fedezetlen tempó</b>: az AI-érettség és a governance-érettség között gyakorlatilag nincs kapcsolat (ρ=${rhoTxt(D.value.corr_maturity_governance)}). A startupok érettsége ${hu(quad.value.startup.x, 0)}, governance-e ${hu(quad.value.startup.y, 0)}; a nagyvállalatoknál fordított a helyzet (${hu(quad.value.enterprise.x, 0)} vs ${hu(quad.value.enterprise.y, 0)}).`,
      `A biztonsági érettség a leggyengébb láncszem: <b>${pct(h.shadow)}</b>-nál előfordul szenzitív adat publikus LLM-be juttatása, és az LLM-integrációt fejlesztők <b>${pct(D.value.security.no_test_pct)}</b>-ának nincs dedikált prompt-injection tesztje. A kockázat nem a lemaradóknál koncentrálódik, hanem a leggyorsabbaknál.`,
    ]
  })

  return {
    D,
    H,
    pct,
    hu,
    az,
    rhoTxt,
    archRow,
    archVal,
    archDef,
    cell,
    rho,
    gap,
    quad,
    reviewArch,
    roleAgent,
    heroStats,
    findings,
    summary,
  }
}

/** A gyökérkomponens hívja; a visszaadott API a fejezeteknek is elérhető. */
export function provideReport(data) {
  const api = buildReport(data)
  provide(REPORT_KEY, api)
  return api
}

/** Fejezet- és UI-komponensek hívják. */
export function useReport() {
  const api = inject(REPORT_KEY, null)
  if (!api) throw new Error('useReport(): csak az AiDevReport komponensen belül hívható.')
  return api
}
