// Inline-SVG diagram renderek a State of AI Dev 2026 riporthoz.
// Keretrendszer-függetlenek: mindegyik egy DOM mount-elemet és egy adatobjektumot kap.
// A színek CSS-változók (var(--s1)…), ezért a téma váltása újrarenderelés nélkül működik.

const SVGNS = 'http://www.w3.org/2000/svg'

function el(n, a = {}) {
  const e = document.createElementNS(SVGNS, n)
  for (const k in a) e.setAttribute(k, a[k])
  return e
}

export const SER = ['var(--s1)', 'var(--s2)', 'var(--s3)', 'var(--s4)', 'var(--s5)', 'var(--s6)', 'var(--s7)', 'var(--s8)']
export const ORD = ['var(--o1)', 'var(--o2)', 'var(--o3)', 'var(--o4)', 'var(--o5)']
// Az archetípusok végig ugyanazt a négy színt kapják, bármelyik ábrán szerepelnek.
export const ARCH_COLORS = ['var(--a1)', 'var(--a2)', 'var(--a3)', 'var(--a4)']
// Szegmens-összehasonlításkor a teljes minta sávja semleges szürke, hogy a
// hangsúlyos szín a választott szegmensé maradjon.
const BASE_SER = 'var(--axis)'

// Rövidített tengelyfeliratok a ko-előfordulási mátrixhoz.
const AXTOOL = {
  'Chat-asszisztens (ChatGPT/Claude…)': 'Chat-assziszt.',
  'GitHub Copilot': 'Copilot',
  'Codex (OpenAI)': 'Codex',
  'Egyéb agent / eszköz': 'Egyéb agent',
}
const ab = (s) => AXTOOL[s] || s

const hu = (v, d = 0) => v.toFixed(d).replace('.', ',')

/**
 * Tooltip-vezérlő egy `position:fixed` DOM-elem köré.
 * A komponensen belül él, így nem szivárog ki semmi a body-ra.
 */
export function createTooltip(node) {
  const move = (e) => {
    const p = 12
    let x = e.clientX + p
    let y = e.clientY + p
    const r = node.getBoundingClientRect()
    if (x + r.width > innerWidth - 8) x = e.clientX - r.width - p
    if (y + r.height > innerHeight - 8) y = e.clientY - r.height - p
    node.style.left = x + 'px'
    node.style.top = y + 'px'
  }
  return {
    show(html, e) {
      node.innerHTML = html
      node.style.opacity = 1
      move(e)
    },
    move,
    hide() {
      node.style.opacity = 0
    },
  }
}

/** Egy diagramelemre ráköti a tooltipet. */
function hover(node, tip, html) {
  node.addEventListener('mousemove', (e) => tip.show(html, e))
  node.addEventListener('mouseleave', tip.hide)
}

/**
 * Szegmens-kiemelés egy ábrasorhoz.
 *
 * A sor elemei egy `<g>`-be kerülnek, hogy a nem választott szegmenseket
 * egyben lehessen tompítani — a tooltip rajtuk is működik, csak halványak.
 * `hl` nélkül (nincs kiválasztott szegmens) minden sor teljes erővel látszik.
 *
 * @param {?Function} hl     sorcímke → a választott szegmenshez tartozik-e
 * @param {string}    label  a sor címkéje
 * @returns {{ g: SVGGElement, on: boolean }}
 */
function rowGroup(hl, label) {
  const on = !hl || hl(label)
  return { g: el('g', on ? {} : { opacity: 0.24 }), on: !!hl && on }
}

/** A kiemelt sor címkéje félkövér — a tompítás mellé pozitív jelzés is kell. */
const strong = (on) => (on ? { style: 'font-weight:750' } : {})

/** Jelmagyarázat-sáv a mount elé. */
function legend(mount, items, colors) {
  const leg = document.createElement('div')
  leg.className = 'legend'
  items.forEach((s, i) => {
    const sp = document.createElement('span')
    sp.innerHTML = `<i style="background:${colors[i % colors.length]}"></i>${s}`
    leg.appendChild(sp)
  })
  mount.appendChild(leg)
  return leg
}

/**
 * Az összes diagramfüggvényt visszaadja, a megadott tooltipre kötve.
 * @param {{show:Function,move:Function,hide:Function}} tip
 */
export function createCharts(tip) {
  // ---- vízszintes egy-sorozatos sáv (nagyságrend, egy szín) ----
  // `opts.overlay = { label, items }`: a választott szegmens sorozata a teljes
  // mintás sávok MELLÉ kerül, nem helyettük — a viszonyítási alap sosem tűnik el.
  // A párosítás címke szerint megy, mert a többválaszos eloszlás máshogy is
  // rendezhet, és a szegmensből hiányzó kategória 0-t jelent, nem hiányt.
  function barChart(mount, items, opts = {}) {
    const colors = opts.colors || null
    const hl = opts.highlight || null
    const ov = opts.overlay ? new Map(opts.overlay.items.map((d) => [d.label, d.pct])) : null
    if (ov) legend(mount, ['teljes minta', opts.overlay.label], [BASE_SER, 'var(--s1)'])
    const rowH = ov ? 42 : 34
    const padT = 6
    const padB = 18
    const labelW = Math.min(230, Math.max(...items.map((d) => d.label.length)) * 7 + 10)
    const W = 680
    const plotL = labelW + 8
    const plotR = 54
    const plotW = W - plotL - plotR
    const H = padT + items.length * rowH + padB
    // Közös skála: a két sorozat csak akkor összemérhető, ha ugyanaz a max.
    const max = Math.max(...items.map((d) => d.pct), ...(ov ? [...ov.values()] : []), 1)
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    items.forEach((d, i) => {
      const y = padT + i * rowH
      const { g, on } = rowGroup(hl, d.label)
      g.appendChild(
        el('text', { x: plotL - 8, y: y + rowH / 2 + 4, 'text-anchor': 'end', class: 'lbl', ...strong(on) })
      ).textContent = d.label
      // Szegmens mellett a teljes minta semleges szürkére vált, a szegmens
      // viszi a hangsúlyos színt — ugyanaz a nyelv, mint a kiemelésnél.
      const series = ov
        ? [
            { pct: d.pct, fill: BASE_SER, name: 'teljes minta' },
            { pct: ov.get(d.label) ?? 0, fill: 'var(--s1)', name: opts.overlay.label },
          ]
        : [{ pct: d.pct, fill: colors ? colors[i % colors.length] : 'var(--s1)', name: null }]
      const bh = ov ? 13 : 20
      const gap = 3
      let by = y + (rowH - (series.length * bh + (series.length - 1) * gap)) / 2
      series.forEach((s) => {
        g.appendChild(el('rect', { x: plotL, y: by, width: plotW, height: bh, rx: 4, class: 'barbg' }))
        const w = Math.max(2, (plotW * s.pct) / max)
        const bar = el('rect', { x: plotL, y: by, width: w, height: bh, rx: 4, fill: s.fill })
        bar.style.cursor = 'default'
        hover(bar, tip, `<b>${d.full || d.label}</b>${s.name ? `<br>${s.name}` : ''}<br>${hu(s.pct, 1)}%`)
        g.appendChild(bar)
        g.appendChild(
          el('text', { x: plotL + w + 7, y: by + bh / 2 + 4, class: 'val', ...(ov ? { style: 'font-size:11.5px' } : {}) })
        ).textContent = Math.round(s.pct) + '%'
        by += bh + gap
      })
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- 100%-ra normált vízszintes halmozott sáv ----
  // `opts.highlight(label)`: ez a sor a választott szegmenshez tartozik-e.
  // Ha nincs megadva, minden sor teljes erővel látszik (alapállapot).
  function stackChart(mount, ct, opts = {}) {
    const { series, rows } = ct
    const colors = opts.colors || SER
    const hl = opts.highlight || null
    legend(mount, series, colors)
    const rowH = 40
    const padT = 4
    const padB = 6
    const labelW = Math.min(200, Math.max(...rows.map((d) => d.label.length)) * 6.6 + 8)
    const W = 680
    const plotL = labelW + 8
    const plotR = 8
    const plotW = W - plotL - plotR
    const H = padT + rows.length * rowH + padB
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    rows.forEach((d, i) => {
      const y = padT + i * rowH
      const bh = 22
      const by = y + (rowH - bh) / 2
      const { g, on } = rowGroup(hl, d.label)
      g.appendChild(el('text', { x: plotL - 8, y: by - 1, 'text-anchor': 'end', class: 'lbl', ...strong(on) })).textContent =
        d.label
      let x = plotL
      d.pct.forEach((p, j) => {
        if (p <= 0) return
        const w = (plotW * p) / 100
        const gap = w > 3 ? 2 : 0
        const r = el('rect', { x: x, y: by, width: Math.max(1, w - gap), height: bh, fill: colors[j % colors.length] })
        hover(r, tip, `<b>${series[j]}</b><br>${d.label}: ${hu(p, 1)}%`)
        g.appendChild(r)
        if (p >= 11) {
          const t = el('text', { x: x + w / 2, y: by + bh / 2 + 4, 'text-anchor': 'middle', class: 'val', fill: '#fff', style: 'font-size:11px' })
          t.textContent = Math.round(p)
          g.appendChild(t)
        }
        x += w
      })
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- csoportosított arány-sávok: {series, rows:[{label,n,pct:[]}]} ----
  // Többválaszos kérdésekhez is jó, mert a sorok nem 100%-ra normáltak.
  function groupBars(mount, obj, opts = {}) {
    const { series, rows } = obj
    const colors = opts.colors || SER
    const hl = opts.highlight || null
    legend(mount, series, colors)
    const barH = 12
    const barGap = 3
    const groupPad = 20
    const groupH = series.length * (barH + barGap) + groupPad
    const W = 680
    const padL = opts.labelW || 150
    const padR = 44
    const plotW = W - padL - padR
    const H = rows.length * groupH + 12
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    rows.forEach((row, gi) => {
      const gy = gi * groupH + 8
      const { g, on } = rowGroup(hl, row.label)
      g.appendChild(
        el('text', { x: padL - 8, y: gy + 14, 'text-anchor': 'end', class: 'lbl', style: on ? 'font-weight:800' : 'font-weight:650' })
      ).textContent = row.label
      row.pct.forEach((p, ti) => {
        const y = gy + ti * (barH + barGap)
        const w = (plotW * p) / 100
        g.appendChild(el('rect', { x: padL, y: y, width: plotW, height: barH, rx: 3, class: 'barbg' }))
        const r = el('rect', { x: padL, y: y, width: Math.max(1, w), height: barH, rx: 3, fill: colors[ti % colors.length] })
        hover(r, tip, `<b>${row.label}</b><br>${series[ti]}: ${hu(p, 1)}%`)
        g.appendChild(r)
        g.appendChild(el('text', { x: padL + plotW + 6, y: y + barH - 2, class: 'val', style: 'font-size:11px' })).textContent =
          Math.round(p) + '%'
      })
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- adoptációs tölcsér: egymásra épülő, szűkülő küszöbök ----
  // `opts.overlay = { label, items }`: a szegmens saját tölcsére. A lépések
  // index szerint párosulnak, mert ugyanaz a feltétellánc ugyanabban a
  // sorrendben fut mindkét mintán — itt az index stabil azonosító.
  function funnelChart(mount, steps, opts = {}) {
    const ov = opts.overlay ? opts.overlay.items : null
    const rowH = 52
    const padT = 8
    const padB = 14
    const W = 680
    const plotL = 236
    const plotR = 86
    const plotW = W - plotL - plotR
    const H = padT + steps.length * rowH + padB
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    steps.forEach((d, i) => {
      const y = padT + i * rowH
      // A tölcsér mélységével sötétedő kék: vizuálisan is "szűkülés".
      // Szegmens mellett ezt a szegmens sávja viszi tovább, a teljes minta
      // pedig semleges szürke — ugyanaz a nyelv, mint a többi ábrán.
      const shade = ORD[Math.min(ORD.length - 1, Math.round((i / Math.max(1, steps.length - 1)) * (ORD.length - 1)))]
      const series = ov
        ? [
            { pct: d.pct, fill: BASE_SER, name: 'teljes minta' },
            { pct: ov[i]?.pct ?? 0, fill: shade, name: opts.overlay.label },
          ]
        : [{ pct: d.pct, fill: shade, name: null }]
      const bh = ov ? 14 : 30
      const gap = 3
      const by0 = y + (rowH - (series.length * bh + (series.length - 1) * gap)) / 2
      svg.appendChild(
        el('text', { x: plotL - 10, y: ov ? y + rowH / 2 + 4 : by0 + 13, 'text-anchor': 'end', class: 'lbl' })
      ).textContent = d.label
      let by = by0
      series.forEach((s) => {
        svg.appendChild(el('rect', { x: plotL, y: by, width: plotW, height: bh, rx: 5, class: 'barbg' }))
        const w = Math.max(3, (plotW * s.pct) / 100)
        const r = el('rect', { x: plotL, y: by, width: w, height: bh, rx: 5, fill: s.fill })
        hover(r, tip, `<b>${d.label}</b>${s.name ? `<br>${s.name}` : ''}<br>a minta ${hu(s.pct, 1)}%-a`)
        svg.appendChild(r)
        svg.appendChild(
          el('text', {
            x: plotL + plotW + 10,
            y: by + bh / 2 + (ov ? 4 : 5),
            class: 'val',
            style: `font-size:${ov ? 12.5 : 15}px`,
          })
        ).textContent = Math.round(s.pct) + '%'
        by += bh + gap
      })
      // Lemorzsolódás az előző lépéshez képest. Szegmens mellett a SZEGMENS
      // lemorzsolódását mutatjuk — az olvasó a saját tölcsérére kíváncsi —,
      // a szegmens színében, hogy egyértelmű legyen, melyik sorozaté.
      if (i > 0) {
        const cur = ov ? (ov[i]?.pct ?? 0) : d.pct
        const prev = ov ? (ov[i - 1]?.pct ?? 0) : steps[i - 1].pct
        const drop = prev - cur
        if (drop > 0.5) {
          svg.appendChild(
            el('text', {
              x: plotL + 8,
              y: by0 - (ov ? 4 : (rowH - bh) / 2 + 1),
              style: `font-size:10.5px;fill:${ov ? 'var(--s1)' : 'var(--muted)'};font-family:var(--mono)`,
            })
          ).textContent = `−${Math.round(drop)} pp`
        }
      }
    })
    if (ov) legend(mount, ['teljes minta', opts.overlay.label], [BASE_SER, ORD[ORD.length - 1]])
    mount.appendChild(svg)
  }

  // ---- archetípus-profil rács: sorok = csoport, oszlopok = mutató ----
  // A színerősség oszloponként normált (min–max), mert a mutatók mértékegysége eltér.
  function profileGrid(mount, obj, opts = {}) {
    const { metrics, rows } = obj
    const hl = opts.highlight || null
    const nc = metrics.length
    const cellW = 74
    const cellH = 46
    const padL = 168
    // A -45°-ban forgatott oszlopfeliratok jobbra és felfelé lógnak ki, ezért
    // a viewBox-nak mindkét irányban helyet kell hagynia (a kártya levágná).
    const padT = 132
    const padR = 128
    const W = padL + nc * cellW + padR
    const H = padT + rows.length * cellH + 10
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    // oszloponkénti min/max a színskálához
    const cols = metrics.map((_, j) => rows.map((r) => r.values[j]))
    const lo = cols.map((c) => Math.min(...c))
    const hi = cols.map((c) => Math.max(...c))
    metrics.forEach((m, j) => {
      const cx = padL + j * cellW + cellW / 2
      const t = el('text', {
        x: cx,
        y: padT - 10,
        'text-anchor': 'start',
        class: 'axk',
        style: 'font-size:11.5px;fill:var(--ink2)',
        transform: `rotate(-45 ${cx} ${padT - 10})`,
      })
      t.textContent = m.label
      svg.appendChild(t)
    })
    rows.forEach((r, i) => {
      const y = padT + i * cellH
      const { g, on } = rowGroup(hl, r.label)
      g.appendChild(
        el('text', { x: padL - 10, y: y + cellH / 2 - 1, 'text-anchor': 'end', class: 'lbl', style: on ? 'font-weight:800' : 'font-weight:650' })
      ).textContent = r.label
      // az archetípus színe a sor bal szélén
      g.appendChild(el('rect', { x: padL - 5, y: y + 3, width: 3, height: cellH - 6, rx: 1.5, fill: ARCH_COLORS[i % 4] }))
      r.values.forEach((v, j) => {
        const x = padL + j * cellW
        const span = hi[j] - lo[j]
        const norm = span > 0 ? (v - lo[j]) / span : 0.5
        const rect = el('rect', {
          x: x + 2,
          y: y + 2,
          width: cellW - 4,
          height: cellH - 4,
          rx: 6,
          fill: 'var(--s1)',
          'fill-opacity': 0.08 + 0.62 * norm,
          stroke: 'var(--border)',
        })
        const shown = metrics[j].fmt === 'pct' ? Math.round(v) + '%' : hu(v, 2)
        hover(rect, tip, `<b>${r.label}</b><br>${metrics[j].label}: ${shown}`)
        g.appendChild(rect)
        g.appendChild(
          el('text', {
            x: x + cellW / 2,
            y: y + cellH / 2 + 5,
            'text-anchor': 'middle',
            style: `font-size:13px;font-weight:700;fill:${norm > 0.62 ? '#fff' : 'var(--ink)'};font-variant-numeric:tabular-nums`,
          })
        ).textContent = shown
      })
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- rés-ábra: mennyire mélyen használjuk vs. mi van alatta ----
  // `opts.overlay = { label, items: {adoption, governance} }`. Két sorozatnál
  // két rés keletkezik, és pont a kettő viszonya az érdekes ("nagyobb-e az én
  // résem az átlagosnál?"), ezért MINDKETTŐT kiírjuk, egymás alatt, a sorozat
  // színében — a rés-szám a felirat mellé kerül, nem fölé, hogy ne ütközzenek.
  function gapChart(mount, obj, opts = {}) {
    const ov = opts.overlay ? opts.overlay.items : null
    const blocks = [
      { title: 'Ilyen mélyen használjuk', items: obj.adoption, seg: ov?.adoption, color: 'var(--s1)' },
      { title: 'Ennyi van alatta', items: obj.governance, seg: ov?.governance, color: 'var(--s6)' },
    ]
    const rowH = 32
    const headH = 30
    const W = 680
    const plotL = 246
    const plotR = 52
    const plotW = W - plotL - plotR
    const total = blocks.reduce((a, b) => a + b.items.length, 0)
    // Alul külön sáv a rés-annotációnak, hogy ne csússzon rá az utolsó sor
    // százalék-címkéjére. Két sorozatnál két sor kell.
    const H = total * rowH + blocks.length * headH + (ov ? 68 : 50)
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    let y = 6
    const means = []
    blocks.forEach((b) => {
      svg.appendChild(
        el('text', { x: 0, y: y + 16, class: 'axk', style: 'font-size:11px;letter-spacing:.1em;text-transform:uppercase;fill:var(--muted);font-family:var(--mono)' })
      ).textContent = b.title
      y += headH
      const y0 = y
      b.items.forEach((d, di) => {
        const series = ov
          ? [
              { pct: d.pct, fill: BASE_SER, name: 'teljes minta' },
              { pct: b.seg?.[di]?.pct ?? 0, fill: b.color, name: opts.overlay.label },
            ]
          : [{ pct: d.pct, fill: b.color, name: null }]
        const bh = ov ? 11 : 19
        const gap = 3
        let by = y + (rowH - (series.length * bh + (series.length - 1) * gap)) / 2
        svg.appendChild(
          el('text', { x: plotL - 10, y: y + rowH / 2 + 4, 'text-anchor': 'end', class: 'lbl' })
        ).textContent = d.label
        series.forEach((s) => {
          svg.appendChild(el('rect', { x: plotL, y: by, width: plotW, height: bh, rx: 4, class: 'barbg' }))
          const w = Math.max(2, (plotW * s.pct) / 100)
          const r = el('rect', { x: plotL, y: by, width: w, height: bh, rx: 4, fill: s.fill })
          hover(r, tip, `<b>${d.label}</b>${s.name ? `<br>${s.name}` : ''}<br>a minta ${hu(s.pct, 1)}%-a`)
          svg.appendChild(r)
          svg.appendChild(
            el('text', { x: plotL + w + 7, y: by + bh / 2 + 4, class: 'val', ...(ov ? { style: 'font-size:11px' } : {}) })
          ).textContent = Math.round(s.pct) + '%'
          by += bh + gap
        })
        y += rowH
      })
      const mean = (arr) => (arr?.length ? arr.reduce((a, d) => a + d.pct, 0) / arr.length : 0)
      means.push({ avg: mean(b.items), avgSeg: ov ? mean(b.seg) : null, y0, y1: y })
    })
    // blokkátlagok — szegmens mellett sorozatonként egy-egy
    means.forEach((m) => {
      const lines = ov
        ? [{ v: m.avg, c: BASE_SER }, { v: m.avgSeg, c: 'var(--ink)' }]
        : [{ v: m.avg, c: 'var(--ink)' }]
      lines.forEach((l) => {
        const x = plotL + (plotW * l.v) / 100
        svg.appendChild(
          el('line', { x1: x, y1: m.y0 - 4, x2: x, y2: m.y1 - 2, stroke: l.c, 'stroke-width': 1.5, 'stroke-dasharray': '4 3', opacity: 0.55 })
        )
      })
    })
    /** Egy rés-nyíl a két blokkátlag között. */
    const arrow = (a, b, gy, color, label) => {
      const xa = plotL + (plotW * a) / 100
      const xb = plotL + (plotW * b) / 100
      ;[[xb, xa], [xb, xb], [xa, xa]].forEach(([x1, x2], k) => {
        const dy = k === 0 ? 0 : 4
        svg.appendChild(el('line', { x1, y1: gy - dy, x2, y2: gy + dy, stroke: color, 'stroke-width': 2 }))
      })
      return { xa, xb }
    }
    if (ov) {
      const g1 = arrow(means[0].avg, means[1].avg, H - 34, BASE_SER)
      svg.appendChild(
        el('text', { x: Math.max(g1.xa, g1.xb) + 9, y: H - 30, style: 'font-size:11.5px;font-weight:700;fill:var(--muted)' })
      ).textContent = `${Math.round(means[0].avg - means[1].avg)} pp — teljes minta`
      const g2 = arrow(means[0].avgSeg, means[1].avgSeg, H - 14, 'var(--s6)')
      svg.appendChild(
        el('text', { x: Math.max(g2.xa, g2.xb) + 9, y: H - 10, style: 'font-size:11.5px;font-weight:750;fill:var(--s6)' })
      ).textContent = `${Math.round(means[0].avgSeg - means[1].avgSeg)} pp — ${opts.overlay.label}`
    } else {
      const gy = H - 14
      const { xa, xb } = arrow(means[0].avg, means[1].avg, gy, 'var(--s6)')
      svg.appendChild(
        el('text', { x: (xa + xb) / 2, y: gy - 8, 'text-anchor': 'middle', style: 'font-size:12px;font-weight:750;fill:var(--s6)' })
      ).textContent = `${Math.round(means[0].avg - means[1].avg)} százalékpontos rés`
    }
    // A szegmens sávjai a BLOKK színét viszik (kék = adoptáció, narancs =
    // governance), ezért a jelmagyarázat mintája is kétszínű — egy sima kék
    // folt a fele ábrához hazudna.
    if (ov) {
      legend(mount, ['teljes minta', opts.overlay.label], [
        BASE_SER,
        'linear-gradient(90deg, var(--s1) 50%, var(--s6) 50%)',
      ])
    }
    mount.appendChild(svg)
  }

  // ---- kvadráns: AI-érettség × governance-érettség ----
  function quadrantChart(mount, obj, opts = {}) {
    const hl = opts.highlight || null
    const W = 680
    const H = 460
    const padL = 62
    const padR = 116
    const padT = 26
    const padB = 54
    const plotW = W - padL - padR
    const plotH = H - padT - padB
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    const X = (v) => padL + (plotW * v) / 100
    const Y = (v) => padT + plotH - (plotH * v) / 100
    // rács
    for (let t = 0; t <= 100; t += 25) {
      svg.appendChild(el('line', { x1: X(t), y1: padT, x2: X(t), y2: padT + plotH, stroke: 'var(--grid)' }))
      svg.appendChild(el('line', { x1: padL, y1: Y(t), x2: padL + plotW, y2: Y(t), stroke: 'var(--grid)' }))
      svg.appendChild(el('text', { x: X(t), y: padT + plotH + 17, 'text-anchor': 'middle', class: 'axk' })).textContent = t
      svg.appendChild(el('text', { x: padL - 9, y: Y(t) + 4, 'text-anchor': 'end', class: 'axk' })).textContent = t
    }
    // átlagkereszt = a kvadránsok határa
    const mx = X(obj.mean_maturity)
    const my = Y(obj.mean_governance)
    svg.appendChild(el('line', { x1: mx, y1: padT, x2: mx, y2: padT + plotH, stroke: 'var(--axis)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }))
    svg.appendChild(el('line', { x1: padL, y1: my, x2: padL + plotW, y2: my, stroke: 'var(--axis)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' }))
    // kvadráns-feliratok
    const qlab = [
      { x: padL + 8, y: padT + 16, t: 'óvatos', anchor: 'start' },
      { x: padL + plotW - 8, y: padT + 16, t: 'kiegyensúlyozott', anchor: 'end' },
      { x: padL + 8, y: padT + plotH - 8, t: 'lemaradó', anchor: 'start' },
      { x: padL + plotW - 8, y: padT + plotH - 8, t: 'fedezetlen tempó', anchor: 'end' },
    ]
    qlab.forEach((q) => {
      svg.appendChild(
        el('text', { x: q.x, y: q.y, 'text-anchor': q.anchor, style: 'font-size:11px;fill:var(--muted);font-family:var(--mono);letter-spacing:.08em;text-transform:uppercase' })
      ).textContent = q.t
    })
    // tengelycímek
    svg.appendChild(
      el('text', { x: padL + plotW / 2, y: H - 12, 'text-anchor': 'middle', style: 'font-size:12.5px;fill:var(--ink2);font-weight:650' })
    ).textContent = 'AI-érettség →'
    const yt = el('text', { x: 16, y: padT + plotH / 2, 'text-anchor': 'middle', style: 'font-size:12.5px;fill:var(--ink2);font-weight:650', transform: `rotate(-90 16 ${padT + plotH / 2})` })
    yt.textContent = 'Governance-érettség →'
    svg.appendChild(yt)
    // pontok
    const rad = (n) => 9 + Math.sqrt(n) * 1.5
    obj.company.forEach((p, i) => {
      const c = SER[i % SER.length]
      const cx = X(p.x)
      const cy = Y(p.y)
      const { g, on } = rowGroup(hl, p.label)
      // a kiemelt pont gyűrűt kap: pontoknál a tompítás önmagában kevés jelzés
      if (on) g.appendChild(el('circle', { cx, cy, r: rad(p.n) + 5, fill: 'none', stroke: 'var(--accent)', 'stroke-width': 2 }))
      const dot = el('circle', { cx, cy, r: rad(p.n), fill: c, 'fill-opacity': 0.82, stroke: 'var(--surface)', 'stroke-width': 2 })
      hover(dot, tip, `<b>${p.label}</b><br>AI-érettség: ${hu(p.x, 1)}<br>Governance: ${hu(p.y, 1)}`)
      g.appendChild(dot)
      // a felirat a pont mellé, a jobb szél felé nem lóghat ki
      const right = cx < padL + plotW - 110
      g.appendChild(
        el('text', {
          x: cx + (right ? rad(p.n) + 7 : -rad(p.n) - 7),
          y: cy + 4,
          'text-anchor': right ? 'start' : 'end',
          style: `font-size:12.5px;font-weight:${on ? 800 : 700};fill:var(--ink)`,
        })
      ).textContent = p.label
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- csoportátlag-görbe rendezett kategóriák mentén (1–5 skála) ----
  function curveChart(mount, items, opts = {}) {
    const hl = opts.highlight || null
    const W = 680
    const H = 300
    const padL = 46
    const padR = 24
    const padT = 32
    const padB = 76
    const plotW = W - padL - padR
    const plotH = H - padT - padB
    const lo = opts.min ?? 1
    const hi = opts.max ?? 5
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    const X = (i) => padL + (plotW * (i + 0.5)) / items.length
    const Y = (v) => padT + plotH - (plotH * (v - lo)) / (hi - lo)
    for (let t = lo; t <= hi; t += 1) {
      svg.appendChild(el('line', { x1: padL, y1: Y(t), x2: padL + plotW, y2: Y(t), stroke: 'var(--grid)' }))
      svg.appendChild(el('text', { x: padL - 8, y: Y(t) + 4, 'text-anchor': 'end', class: 'axk' })).textContent = t
    }
    // átlagvonal
    if (opts.reference != null) {
      svg.appendChild(
        el('line', { x1: padL, y1: Y(opts.reference), x2: padL + plotW, y2: Y(opts.reference), stroke: 'var(--muted)', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' })
      )
      // A felirat a rajzterület fölé kerül, különben ütközik az utolsó ponttal.
      svg.appendChild(
        el('text', { x: padL + plotW, y: padT - 11, 'text-anchor': 'end', style: 'font-size:11px;fill:var(--muted);font-family:var(--mono)' })
      ).textContent = '– – teljes átlag ' + hu(opts.reference, 2)
    }
    const pts = items.map((d, i) => [X(i), Y(d.mean)])
    svg.appendChild(
      el('polyline', { points: pts.map((p) => p.join(',')).join(' '), fill: 'none', stroke: 'var(--s1)', 'stroke-width': 2.5, 'stroke-linejoin': 'round' })
    )
    items.forEach((d, i) => {
      const [cx, cy] = pts[i]
      // A vonal végig teljes erővel marad — csak a pontok és feliratuk tompulnak,
      // különben a görbe alakja, vagyis az ábra lényege veszne el.
      const { g, on } = rowGroup(hl, d.label)
      const dot = el('circle', { cx, cy, r: on ? 8.5 : 6.5, fill: opts.colors ? opts.colors[i % opts.colors.length] : 'var(--s1)', stroke: on ? 'var(--accent)' : 'var(--surface)', 'stroke-width': on ? 2.5 : 2 })
      hover(dot, tip, `<b>${d.label}</b><br>átlag ${hu(d.mean, 2)}/5`)
      g.appendChild(dot)
      g.appendChild(
        el('text', { x: cx, y: cy - 13, 'text-anchor': 'middle', class: 'val', style: `font-size:12.5px${on ? ';font-weight:800' : ''}` })
      ).textContent = hu(d.mean, 2)
      // tengelyfelirat két sorban, hogy elférjen
      const words = d.label.split(' ')
      const mid = Math.ceil(words.length / 2)
      const l1 = words.length > 2 ? words.slice(0, mid).join(' ') : d.label
      const l2 = words.length > 2 ? words.slice(mid).join(' ') : ''
      const axStyle = `font-size:11.5px${on ? ';font-weight:750;fill:var(--ink)' : ''}`
      g.appendChild(el('text', { x: cx, y: padT + plotH + 20, 'text-anchor': 'middle', class: 'axk', style: axStyle })).textContent = l1
      if (l2) g.appendChild(el('text', { x: cx, y: padT + plotH + 34, 'text-anchor': 'middle', class: 'axk', style: axStyle })).textContent = l2
      svg.appendChild(g)
    })
    mount.appendChild(svg)
  }

  // ---- likert 1..5, függőleges ----
  // `opts.overlay = { label, counts, mean }`. Szegmens mellett SZÁZALÉKRA
  // váltunk: a szegmens kisebb mintából jön, a nyers darabszámok nem
  // összemérhetők. Az átlagvonalak ilyenkor kikerülnek a rajzból a
  // jelmagyarázatba — két függőleges vonal közeli átlagoknál egymásra csúszna.
  function likert(mount, counts, mean, opts = {}) {
    const ov = opts.overlay || null
    const W = 520
    const H = 200
    const padL = 28
    const padR = 12
    const padT = 10
    const padB = 40
    const plotW = W - padL - padR
    const plotH = H - padT - padB
    const bw = plotW / 5
    const total = counts.reduce((a, b) => a + b, 0)
    const asPct = (arr) => {
      const t = arr.reduce((a, b) => a + b, 0) || 1
      return arr.map((c) => (c / t) * 100)
    }
    const ovTotal = ov ? ov.counts.reduce((a, b) => a + b, 0) : 0
    const series = ov
      ? [
          { vals: asPct(counts), raw: counts, tot: total, name: 'teljes minta', grey: true },
          { vals: asPct(ov.counts), raw: ov.counts, tot: ovTotal, name: ov.label, grey: false },
        ]
      : [{ vals: counts, raw: counts, tot: total, name: null, grey: false }]
    const max = Math.max(...series.flatMap((s) => s.vals), 1)
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    for (let i = 0; i < 5; i++) {
      const slotX = padL + i * bw + bw * 0.16
      const slotW = bw * 0.68
      const w = ov ? slotW * 0.47 : slotW
      series.forEach((s, si) => {
        const bh = (plotH * s.vals[i]) / max
        const x = slotX + si * (w + slotW * 0.06)
        const y = padT + plotH - bh
        const r = el('rect', { x, y, width: w, height: Math.max(1, bh), rx: 4, fill: s.grey ? BASE_SER : ORD[i] })
        hover(
          r,
          tip,
          `<b>${i + 1}. szint</b>${s.name ? `<br>${s.name}` : ''}<br>${s.raw[i]} válasz · ${Math.round((s.raw[i] / s.tot) * 100)}%`
        )
        svg.appendChild(r)
        svg.appendChild(
          el('text', {
            x: x + w / 2, y: y - 6, 'text-anchor': 'middle', class: 'val',
            ...(ov ? { style: 'font-size:10.5px' } : {}),
          })
        ).textContent = ov ? Math.round(s.vals[i]) + '%' : s.raw[i]
      })
      svg.appendChild(
        el('text', { x: padL + i * bw + bw / 2, y: H - 24, 'text-anchor': 'middle', class: 'axk', style: 'font-size:13px;fill:var(--ink2)' })
      ).textContent = i + 1
    }
    if (!ov) {
      const mx = padL + ((mean - 1) / 4) * plotW
      svg.appendChild(el('line', { x1: mx, y1: padT - 2, x2: mx, y2: padT + plotH, stroke: 'var(--neg)', 'stroke-width': 2, 'stroke-dasharray': '4 3' }))
      svg.appendChild(
        el('text', { x: mx, y: H - 6, 'text-anchor': 'middle', style: 'fill:var(--neg);font-size:12px;font-weight:700' })
      ).textContent = 'átlag ' + hu(mean, 2)
    } else {
      legend(
        mount,
        [`teljes minta — átlag ${hu(mean, 2)}`, `${ov.label} — átlag ${ov.mean == null ? '—' : hu(ov.mean, 2)}`],
        [BASE_SER, ORD[3]]
      )
    }
    mount.appendChild(svg)
  }

  // ---- korrelációs hőtérkép (divergáló) ----
  function heatmap(mount, labels, matrix) {
    const n = labels.length
    const cell = 50
    const padL = 130
    const padT = 126
    const rightPad = 120
    const W = padL + n * cell + rightPad
    const H = padT + n * cell + 8
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    function col(v) {
      const a = Math.min(1, Math.abs(v))
      return { fill: v >= 0 ? 'var(--pos)' : 'var(--neg)', op: 0.12 + 0.8 * a }
    }
    for (let i = 0; i < n; i++) {
      svg.appendChild(
        el('text', { x: padL - 8, y: padT + i * cell + cell / 2 + 4, 'text-anchor': 'end', class: 'axk', style: 'font-size:12px;fill:var(--ink2)' })
      ).textContent = labels[i]
      const tx = el('text', {
        x: padL + i * cell + cell / 2,
        y: padT - 8,
        'text-anchor': 'start',
        class: 'axk',
        style: 'font-size:12px;fill:var(--ink2)',
        transform: `rotate(-42 ${padL + i * cell + cell / 2} ${padT - 8})`,
      })
      tx.textContent = labels[i]
      svg.appendChild(tx)
      for (let j = 0; j < n; j++) {
        const v = matrix[i][j]
        const c = col(v)
        const x = padL + j * cell
        const y = padT + i * cell
        const r = el('rect', {
          x: x + 1, y: y + 1, width: cell - 2, height: cell - 2, rx: 6,
          fill: c.fill, 'fill-opacity': i === j ? 0.15 : c.op, stroke: 'var(--border)',
        })
        hover(r, tip, `<b>${labels[i]}</b> × <b>${labels[j]}</b><br>ρ = ${hu(v, 2)}`)
        svg.appendChild(r)
        const t = el('text', {
          x: x + cell / 2, y: y + cell / 2 + 4, 'text-anchor': 'middle',
          style: `font-size:12px;font-weight:650;fill:${Math.abs(v) > 0.55 ? '#fff' : 'var(--ink)'};font-variant-numeric:tabular-nums`,
        })
        t.textContent = v.toFixed(2).replace('0.', ',').replace('-0', '-').replace('1.00', '1')
        svg.appendChild(t)
      }
    }
    mount.appendChild(svg)
  }

  // ---- ko-előfordulási hőtérkép (szekvenciális) ----
  function coocMap(mount, obj) {
    const tools = obj.tools
    const rows = obj.rows
    const n = tools.length
    const cell = 50
    const padL = 150
    const padT = 112
    const rightPad = 120
    const W = padL + n * cell + rightPad
    const H = padT + n * cell + 8
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    for (let i = 0; i < n; i++) {
      svg.appendChild(
        el('text', { x: padL - 8, y: padT + i * cell + cell / 2 + 4, 'text-anchor': 'end', style: 'font-size:12px;fill:var(--ink2)' })
      ).textContent = ab(rows[i].tool)
      const tx = el('text', {
        x: padL + i * cell + cell / 2, y: padT - 8, 'text-anchor': 'start',
        style: 'font-size:11.5px;fill:var(--ink2)',
        transform: `rotate(-40 ${padL + i * cell + cell / 2} ${padT - 8})`,
      })
      tx.textContent = ab(tools[i])
      svg.appendChild(tx)
      rows[i].cells.forEach((c, j) => {
        const x = padL + j * cell
        const y = padT + i * cell
        const op = c.self ? 0.14 : 0.1 + (0.85 * c.pct) / 100
        const r = el('rect', { x: x + 1, y: y + 1, width: cell - 2, height: cell - 2, rx: 6, fill: 'var(--s1)', 'fill-opacity': op, stroke: 'var(--border)' })
        if (!c.self) hover(r, tip, `<b>${rows[i].tool}</b>-t használók<br>${c.pct}%-a használ <b>${c.tool}</b>-t is`)
        svg.appendChild(r)
        const t = el('text', {
          x: x + cell / 2, y: y + cell / 2 + 4, 'text-anchor': 'middle',
          style: `font-size:12px;font-weight:650;fill:${!c.self && c.pct > 55 ? '#fff' : c.self ? 'var(--muted)' : 'var(--ink)'};font-variant-numeric:tabular-nums`,
        })
        t.textContent = c.self ? '—' : c.pct
        svg.appendChild(t)
      })
    }
    mount.appendChild(svg)
  }

  // ---- csoportátlag-sávok (1–5 skála) ----
  function meanBars(mount, items) {
    const W = 680
    const rowH = 40
    const padT = 6
    const padB = 24
    const labelW = 150
    const plotL = labelW + 8
    const plotR = 44
    const plotW = W - plotL - plotR
    const H = padT + items.length * rowH + padB
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    ;[1, 2, 3, 4, 5].forEach((t) => {
      const x = plotL + (plotW * (t - 1)) / 4
      svg.appendChild(el('line', { x1: x, y1: padT, x2: x, y2: padT + items.length * rowH, stroke: 'var(--grid)', 'stroke-width': 1 }))
      svg.appendChild(el('text', { x: x, y: H - 8, 'text-anchor': 'middle', class: 'axk' })).textContent = t
    })
    items.forEach((d, i) => {
      const y = padT + i * rowH
      const bh = 18
      const by = y + (rowH - bh) / 2
      svg.appendChild(el('text', { x: plotL - 8, y: by + bh / 2 + 4, 'text-anchor': 'end', class: 'lbl' })).textContent = d.label
      const w = (plotW * (d.mean - 1)) / 4
      const r = el('rect', { x: plotL, y: by, width: Math.max(2, w), height: bh, rx: 4, fill: 'var(--s1)' })
      hover(r, tip, `<b>${d.label}</b><br>átlag ${hu(d.mean, 2)}/5`)
      svg.appendChild(r)
      svg.appendChild(el('text', { x: plotL + w + 7, y: by + bh / 2 + 4, class: 'val' })).textContent = hu(d.mean, 2)
    })
    mount.appendChild(svg)
  }

  // ---- kockázati index: abszolút halmozott sáv, rendezve, átlag-referenciavonallal ----
  function riskChart(mount, obj, opts = {}) {
    const hl = opts.highlight || null
    const dims = obj.dims
    const rows = obj.rows
    legend(mount, dims, SER)
    const rowH = 48
    const padT = 26
    const padB = 26
    const W = 700
    const labelW = 180
    const plotL = labelW + 8
    const plotR = 46
    const plotW = W - plotL - plotR
    const H = padT + rows.length * rowH + padB
    const maxX = 100
    const svg = el('svg', { viewBox: `0 0 ${W} ${H}`, role: 'img' })
    ;[0, 25, 50, 75, 100].forEach((t) => {
      const x = plotL + (plotW * t) / maxX
      svg.appendChild(el('line', { x1: x, y1: padT - 6, x2: x, y2: padT + rows.length * rowH, stroke: 'var(--grid)', 'stroke-width': 1 }))
      svg.appendChild(el('text', { x: x, y: padT - 11, 'text-anchor': 'middle', class: 'axk' })).textContent = t
    })
    rows.forEach((d, i) => {
      const y = padT + i * rowH
      const bh = 24
      const by = y + (rowH - bh) / 2
      const { g, on } = rowGroup(hl, d.segment)
      g.appendChild(
        el('text', { x: plotL - 8, y: by + 9, 'text-anchor': 'end', class: 'lbl', style: on ? 'font-weight:800' : 'font-weight:650' })
      ).textContent = d.segment
      let x = plotL
      d.parts.forEach((p, j) => {
        if (p <= 0) return
        const w = (plotW * p) / maxX
        const gap = w > 3 ? 2 : 0
        const r = el('rect', { x: x, y: by, width: Math.max(1, w - gap), height: bh, fill: SER[j % 8] })
        hover(r, tip, `<b>${dims[j]}</b><br>${d.segment}: ${hu(p, 1)} pont`)
        g.appendChild(r)
        if (w > 26) {
          const t = el('text', { x: x + w / 2, y: by + bh / 2 + 4, 'text-anchor': 'middle', class: 'val', fill: '#fff', style: 'font-size:11px' })
          t.textContent = Math.round(p)
          g.appendChild(t)
        }
        x += w
      })
      g.appendChild(
        el('text', { x: x + 7, y: by + bh / 2 + 5, style: 'font-size:15px;font-weight:750;fill:var(--ink);font-variant-numeric:tabular-nums' })
      ).textContent = hu(d.total, 1)
      svg.appendChild(g)
    })
    const ox = plotL + (plotW * obj.overall.total) / maxX
    svg.appendChild(el('line', { x1: ox, y1: padT - 6, x2: ox, y2: padT + rows.length * rowH + 4, stroke: 'var(--ink2)', 'stroke-width': 1.5, 'stroke-dasharray': '5 3' }))
    svg.appendChild(
      el('text', { x: ox, y: H - 8, 'text-anchor': 'middle', style: 'font-size:11px;font-weight:650;fill:var(--ink2)' })
    ).textContent = 'összes átlag ' + hu(obj.overall.total, 1)
    mount.appendChild(svg)
  }

  return {
    barChart, stackChart, groupBars, funnelChart, profileGrid, gapChart,
    quadrantChart, curveChart, likert, heatmap, coocMap, meanBars, riskChart,
  }
}
