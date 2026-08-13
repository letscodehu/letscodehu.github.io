// A diagramok kirajzolása. A fejezet-komponensek csak üres mount-elemeket
// tesznek le (`data-bar`, `data-stack`, `data-chart` …), a tényleges
// renderelés innen, egy helyről fut — így nem kell 12 fejezetben külön
// életciklus-kezelés.
//
// Innen dől el az is, hogy egy ábra hogyan viszonyul a választott szegmenshez:
// vagy kiemeli a szegmens sorát, vagy „teljes minta” jelölést kap. Harmadik,
// magyarázat nélküli állapot nincs.
import { nextTick, onMounted, watch } from 'vue'
import { createCharts, createTooltip, ARCH_COLORS, SER } from './charts.js'

const MOUNTS = '[data-bar],[data-multibar],[data-stack],[data-group],[data-chart]'

/** Plakett annak az ábrának, ami a választott szegmenst nem tudja mutatni. */
function fullSampleBadge(mount) {
  const b = document.createElement('div')
  b.className = 'rp-fullsample'
  b.textContent = 'teljes minta'
  mount.insertBefore(b, mount.firstChild)
}

/**
 * @param {Ref<HTMLElement>} rootEl  a riport gyökérelem
 * @param {Ref<HTMLElement>} tipEl   a tooltip-elem
 * @param {Ref<Object>}      data    a report_data.json tartalma
 * @param {Object}           seg     a provideSegment() által visszaadott API.
 *                                   Nem `useSegment()`-tel vesszük fel: a Vue
 *                                   `inject()`-je nem látja a saját komponense
 *                                   `provide()`-ját, ez pedig a gyökérben fut.
 */
export function useCharts(rootEl, tipEl, data, seg) {
  function render() {
    const root = rootEl.value
    if (!root || !tipEl.value) return
    const d = data.value
    const charts = createCharts(createTooltip(tipEl.value))

    // Újrarendereléskor (adatcsere vagy szegmensváltás) tiszta lappal indulunk.
    root.querySelectorAll(MOUNTS).forEach((m) => {
      m.innerHTML = ''
    })

    // Azok a mountok, amelyek reagálnak a választott szegmensre. Ami kimarad,
    // a végén megkapja a „teljes minta” plakettet.
    const wired = new Set()

    // Az ábra kiemelő-függvénye, vagy null, ha nem a választott dimenzió
    // mentén bomlik. A nem-null eset egyben azt is jelenti, hogy az ábra
    // reagál a szegmensre, tehát nem kell neki plakett.
    const hlFor = (id, mount) => {
      const hl = seg.highlightFor(id)
      if (hl) wired.add(mount)
      return hl
    }

    /** A szegmens sorozata egy bontatlan eloszláshoz, ha van hozzá adat. */
    const ovFor = (kind, col, mount) => {
      const ov = seg.overlayFor(kind, col)
      if (ov) wired.add(mount)
      return ov
    }

    /** Ugyanaz, nevesített szegmens-blokkra (funnel, gap, builders_dist). */
    const ovBlock = (name, mount) => {
      const ov = seg.overlayBlock(name)
      if (ov) wired.add(mount)
      return ov
    }

    root.querySelectorAll('[data-bar]').forEach((m) => {
      const col = m.dataset.bar
      charts.barChart(m, d.distributions[col], { overlay: ovFor('distributions', col, m) })
    })
    root.querySelectorAll('[data-multibar]').forEach((m) => {
      const col = m.dataset.multibar
      charts.barChart(m, d.multi[col], { overlay: ovFor('multi', col, m) })
    })
    root.querySelectorAll('[data-stack]').forEach((m) => {
      const key = m.dataset.stack
      charts.stackChart(m, d.crosstabs[key], {
        colors: m.dataset.colors === 'arch' ? ARCH_COLORS : SER,
        highlight: hlFor(key, m),
      })
    })
    root.querySelectorAll('[data-group]').forEach((m) => {
      const key = m.dataset.group
      charts.groupBars(m, d[key], { labelW: Number(m.dataset.labelw) || 150, highlight: hlFor(key, m) })
    })

    /** A nevesített ábrák: a callback a mountot és a kiemelő-függvényt kapja. */
    const at = (name, fn) => {
      const el = root.querySelector(`[data-chart="${name}"]`)
      if (el) fn(el, hlFor(name, el))
    }

    at('funnel', (el) => charts.funnelChart(el, d.funnel, { overlay: ovBlock('funnel', el) }))
    at('archdist', (el, hl) =>
      charts.barChart(
        el,
        d.archetypes.defs.map((a) => ({ label: a.name, full: a.name + ' — ' + a.tagline, n: a.n, pct: a.pct })),
        { colors: ARCH_COLORS, highlight: hl }
      )
    )
    at('archgrid', (el, hl) => charts.profileGrid(el, d.archetypes.profile, { highlight: hl }))
    at('quadrant', (el, hl) => charts.quadrantChart(el, d.quadrant, { highlight: hl }))
    at('gap', (el) => charts.gapChart(el, d.gap, { overlay: ovBlock('gap', el) }))
    at('review-arch', (el, hl) =>
      charts.curveChart(el, d.review.by_arch, {
        reference: d.scales.q06_hallucination_review.mean,
        colors: ARCH_COLORS,
        highlight: hl,
      })
    )
    at('review-ratio', (el) =>
      charts.curveChart(
        el,
        d.review.by_ratio.filter((r) => r.label !== 'Nincs rálátás'),
        { reference: d.scales.q06_hallucination_review.mean }
      )
    )
    at('secdist', (el) => charts.barChart(el, d.security.builders_dist, { overlay: ovBlock('builders_dist', el) }))

    /** A Likert-skálák szegmens-sorozata: darabszám + átlag egy burokban. */
    const likOverlay = (key, el) => {
      const ov = ovFor('scales', key, el)
      return ov ? { label: ov.label, counts: ov.items.counts, mean: ov.items.mean } : null
    }
    at('lik-q06', (el) =>
      charts.likert(el, d.scales.q06_hallucination_review.counts, d.scales.q06_hallucination_review.mean, {
        overlay: likOverlay('q06_hallucination_review', el),
      })
    )
    at('lik-q07', (el) =>
      charts.likert(el, d.scales.q07_company_support.counts, d.scales.q07_company_support.mean, {
        overlay: likOverlay('q07_company_support', el),
      })
    )
    at('corr', (el) => charts.heatmap(el, d.corr.labels, d.corr.matrix))
    at('cooc', (el) => charts.coocMap(el, d.tool_cooccurrence))
    at('trainsup', (el) => charts.meanBars(el, d.training_x_support))
    at('risk', (el, hl) => charts.riskChart(el, d.risk, { highlight: hl }))

    if (seg.active.value) {
      root.querySelectorAll(MOUNTS).forEach((m) => {
        if (!wired.has(m)) fullSampleBadge(m)
      })
    }
  }

  onMounted(render)
  watch([data, seg.active], () => nextTick(render))

  return { render }
}
