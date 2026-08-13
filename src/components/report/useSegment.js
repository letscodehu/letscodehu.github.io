// A kiválasztott szegmens állapota.
//
// A riport nem szűr, hanem KIEMEL: a teljes minta végig látszik, a választott
// szegmens pedig mellette. Két dolog következik ebből, ami itt is látszik:
//
//   - a bontásos ábráknak (kereszttáblák, kvadráns, kockázati index…) nem kell
//     előreszámolt adat, csak azt kell tudniuk, melyik sort emeljék ki;
//   - egyszerre csak egy dimenzió lehet aktív, így nincs olyan választás, ami
//     néhány fős cellára szűkítene (N=175 mellett ez módszertani korlát, nem
//     UI-ízlés).
//
// A választható opciók a `compute.py`-ból jönnek (`segments.dims`), mert a
// szerepkör-összevonás ott dől el; itt csak a megjelenítési konfig él.
//
// A `useReport.js` provide/inject mintáját követi, de külön kulccsal: a
// szegmens állapot, a report számított tartalom — a kettő függetlenül él.
import { computed, inject, provide, ref } from 'vue'

const SEGMENT_KEY = Symbol('ai-report-segment')

/**
 * A szűrődimenziók megjelenítési oldala: melyik ábra bomlik melyik dimenzió
 * mentén. A választható opciókat NEM itt soroljuk fel — azok a JSON
 * `segments.dims` blokkjából jönnek, mert a szerepkör-összevonás a
 * `compute.py`-ban dől el, és két helyen tartva elcsúszhatna.
 *
 * `ctPrefix`: azok a kereszttáblák bomlanak e dimenzió mentén, amelyek kulcsa
 * így kezdődik (`companytype_x_ratio` → cégtípus).
 * `charts`:   a nevesített ábrák (`data-chart`) és csoportos ábrák
 *             (`data-group`), amiknek a sorai/pontjai e dimenzió szegmensei.
 * `selfDist`: az az eloszlás, amit maga a dimenzió definiál — erre nem teszünk
 *             szegmens-sorozatot, mert az triviálisan 100% lenne egy sávon.
 */
const DIMS = [
  {
    key: 'companytype',
    label: 'Cégtípus',
    ctPrefix: 'companytype_',
    charts: ['quadrant', 'risk'],
    selfDist: 'q12_company_type',
  },
  {
    key: 'arch',
    label: 'Archetípus',
    ctPrefix: 'arch_',
    charts: ['archdist', 'archgrid', 'review-arch', 'workflow_by_arch', 'tools_by_arch'],
  },
  {
    key: 'role',
    label: 'Szerepkör',
    ctPrefix: 'role_',
    charts: [],
    selfDist: 'q12b_role',
  },
]

/**
 * @param {Ref<Object>}  data     a report_data.json tartalma
 * @param {Ref<Boolean>} enabled  false nyomtatási módban — a PDF rögzített
 *                                dokumentum, nem tud „szegmens-állapotot” jelenteni
 */
function buildSegment(data, enabled) {
  const current = ref(null)

  // A megjelenítési konfig és a JSON-ból jövő opciók összefésülése. Ha egy
  // dimenzióhoz nincs előreszámolt opció, ki sem kerül a választóba.
  const dims = computed(() => {
    const meta = data.value.segments?.dims ?? []
    return DIMS.map((dim) => ({
      key: dim.key,
      label: dim.label,
      options: meta.find((m) => m.key === dim.key)?.options ?? [],
    })).filter((d) => d.options.length)
  })

  // A választás csak akkor él, ha tényleg létező opcióra mutat. Ismeretlen
  // kulcsra (elavult link, elgépelt prop) a riport csendben a teljes mintán
  // marad — nem hibázik, és nem is kerül félkész állapotba.
  const resolved = computed(() => {
    const c = current.value
    if (!c) return null
    const dim = dims.value.find((d) => d.key === c.dim)
    const opt = dim?.options.find((o) => o.key === c.key)
    return opt ? { dim: c.dim, key: c.key, option: opt } : null
  })

  /** A ténylegesen érvényes választás — nyomtatásban mindig `null`. */
  const active = computed(() =>
    enabled.value && resolved.value ? { dim: resolved.value.dim, key: resolved.value.key } : null
  )

  const option = computed(() => (enabled.value ? (resolved.value?.option ?? null) : null))

  /** `"dimenzió:kulcs"` — ebben az alakban megy az URL-be és a `segment` propba. */
  const asString = computed(() => (active.value ? `${active.value.dim}:${active.value.key}` : ''))

  /** A `"dimenzió:kulcs"` alak beolvasása. Érvénytelen bemenet = teljes minta. */
  function setFromString(s) {
    const i = s ? String(s).indexOf(':') : -1
    const next = i > 0 ? { dim: s.slice(0, i), key: s.slice(i + 1) } : null
    // Azonos értékre nem cserélünk objektumot: különben minden prop-frissítés
    // fölöslegesen újrarajzoltatná az összes diagramot.
    const c = current.value
    if ((c?.dim ?? null) === (next?.dim ?? null) && (c?.key ?? null) === (next?.key ?? null)) return
    current.value = next
  }

  /** Ugyanarra kattintva megszűnik a kiválasztás. */
  function select(dimKey, optKey) {
    const c = current.value
    current.value = c && c.dim === dimKey && c.key === optKey ? null : { dim: dimKey, key: optKey }
  }

  function clear() {
    current.value = null
  }

  function isSelected(dimKey, optKey) {
    const c = active.value
    return !!c && c.dim === dimKey && c.key === optKey
  }

  /**
   * Egy ábra sorcímkéje a választott szegmenshez tartozik-e?
   *
   * Az opció `rows` mezője sorolja fel a lefedett sorcímkéket — egy összevont
   * szerepkör-csoport (pl. „Vezetők") egyszerre több sort emel ki, mert a
   * kereszttáblák a részletes, 7 kategóriás bontást mutatják tovább.
   */
  function matchesRow(label) {
    return option.value?.rows?.includes(label) ?? false
  }

  /**
   * Az ábra kiemelő-függvénye, vagy `null`, ha az ábra nem a választott
   * dimenzió mentén bomlik (ilyenkor „teljes minta” jelölést kap).
   *
   * @param {string} id kereszttábla-kulcs, `data-chart` név vagy `data-group` kulcs
   */
  function highlightFor(id) {
    const c = active.value
    if (!c) return null
    const dim = DIMS.find((d) => d.key === c.dim)
    if (!dim) return null
    const splits = (dim.ctPrefix && id.startsWith(dim.ctPrefix)) || dim.charts.includes(id)
    return splits ? matchesRow : null
  }

  /** A választott szegmens előreszámolt adatblokkja, vagy `null`. */
  const segData = computed(() => {
    const c = active.value
    return c ? (data.value.segments?.data?.[`${c.dim}:${c.key}`] ?? null) : null
  })

  /**
   * A választott szegmens sorozata egy bontatlan eloszláshoz — a teljes mintás
   * sávok MELLÉ kerül, nem helyettük. `null`, ha nincs szegmens, nincs hozzá
   * előreszámolt adat, vagy ha az eloszlás épp a szegmenst definiáló kérdés.
   *
   * @param {'distributions'|'multi'} kind
   * @param {string} col a kérdés oszlopneve
   * @returns {?{label: string, items: Array}}
   */
  function overlayFor(kind, col) {
    const c = active.value
    if (!c || !segData.value) return null
    if (DIMS.find((d) => d.key === c.dim)?.selfDist === col) return null
    const items = segData.value[kind]?.[col]
    return items ? { label: option.value?.label ?? c.key, items } : null
  }

  /**
   * A szegmens előreszámolt blokkja név szerint (`funnel`, `gap`,
   * `builders_dist`) — ugyanaz a burok, mint az `overlayFor`-nál.
   *
   * @returns {?{label: string, items: *}}
   */
  function overlayBlock(name) {
    const c = active.value
    if (!c || !segData.value) return null
    const items = segData.value[name]
    return items ? { label: option.value?.label ?? c.key, items } : null
  }

  return {
    dims, current, active, option, asString, select, clear, setFromString,
    isSelected, highlightFor, overlayFor, overlayBlock,
  }
}

/** A gyökérkomponens hívja. */
export function provideSegment(data, enabled) {
  const api = buildSegment(data, enabled)
  provide(SEGMENT_KEY, api)
  return api
}

/** A választósáv és a diagram-renderelés hívja. */
export function useSegment() {
  const api = inject(SEGMENT_KEY, null)
  if (!api) throw new Error('useSegment(): csak az AiDevReport komponensen belül hívható.')
  return api
}
