// A fejezetek sorrendje és címkéi egy helyen: ebből épül a borító
// ugrómenüje, a nyomtatási tartalomjegyzék és a fejezetek sorszáma is.
export const CHAPTERS = [
  { id: 'osszefoglalo', label: 'Vezetői összefoglaló' },
  { id: 'kulcsallitasok', label: 'Kulcsállítások' },
  { id: 'archetipusok', label: 'Archetípusok' },
  { id: 'agentic', label: 'Agentic coding' },
  { id: 'ai-kod', label: 'AI-generált kód' },
  { id: 'review', label: 'Review & verifikáció' },
  { id: 'governance', label: 'Governance' },
  { id: 'biztonsag', label: 'Biztonság' },
  { id: 'tanulas', label: 'Tanulási igények' },
  { id: 'modszertan', label: 'Módszertan' },
]

/** A horgony-ID-kat prefixeljük, hogy ne ütközzenek a befogadó oldaléval. */
export const anchor = (id) => `ai-report-${id}`
