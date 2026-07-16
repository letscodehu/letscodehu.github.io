/**
 * Blog metadata and ordering. Article bodies live in content/blog/<slug>/en.md and hu.md
 * (loaded via import.meta.glob in blog-posts.ts for the Vite bundle only).
 */
export interface BlogPostManifest {
  slug: string
  publishedAt: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  videoUrl?: string
  /** Path under site root for featured/blog preview image, e.g. `/blog/og/my-slug.png` (file in `public/`). */
  featuredImagePath?: string
}

export const blogPostManifest: BlogPostManifest[] = [
  {
    slug: 'architect-wont-be-here-when-bill-comes-due',
    publishedAt: '2026-07-14',
    titleEn: "The Architect Won't Be Here When the Bill Comes Due",
    titleHu: 'Az architektet már nem találod ott, mikor megjön a számla',
    featuredImagePath: '/blog/serverless-strategy.png',
    excerptEn:
      'The person who mandates "everything serverless" is systematically the one least exposed to the consequences. The decision outlives the decider, and the misalignment between who decides and who pays is the real defect - not the tech.',
    excerptHu:
      'Aki kimondja, hogy „minden legyen serverless", rendszerint az van a legkevésbé kitéve a következményeknek. A döntés túléli a döntéshozót, és a valódi hiba nem a technológia, hanem az elcsúszás aközött, hogy ki dönt és ki fizet.',
  },
  {
    slug: 'best-engineer-barely-writes-code',
    publishedAt: '2026-06-20',
    titleEn: 'Your Best Engineer Barely Writes Code Anymore',
    titleHu: 'A legjobb fejlesztőd már alig ír kódot',
    featuredImagePath: '/blog/engineering-meeting.png',
    excerptEn:
      'A team lead almost put his best engineer on a performance plan for low output - until his manager asked one question. When generating code is nearly free, output stops measuring value, and judgment becomes the work no dashboard can see.',
    excerptHu:
      'Egy team lead majdnem performance planre tette a legjobb fejlesztőjét gyenge output miatt - amíg a managere fel nem tett egy kérdést. Amikor a kód generálása szinte ingyen van, az output megszűnik értéket mérni, és az ítélőképesség lesz a munka, amit egyetlen dashboard sem lát.',
  },
  {
    slug: 'ai-model-independence',
    publishedAt: '2026-06-15',
    titleEn: 'Your Model Can Disappear Overnight',
    titleHu: 'A modelled egyik napról a másikra eltűnhet',
    featuredImagePath: '/blog/ai-model-independence.png',
    excerptEn:
      'An export-control order disabled a frontier model for everyone - even the US customers it never targeted. The fix is not a model from the right country, but an architecture that can swap models without a rewrite.',
    excerptHu:
      'Egy exportkorlátozás mindenkitől levett egy frontier modellt - még azoktól az amerikai ügyfelektől is, akiknek nem szólt. A megoldás nem a jó országból választott modell, hanem egy architektúra, amely átírás nélkül tud modellt váltani.',
    videoUrl: 'https://www.youtube.com/watch?v=qLfJ9uvztZE',
  },
  {
    slug: 'spec-driven-development-waterfall-trap',
    publishedAt: '2026-06-07',
    titleEn: 'Spec-Driven Development and the Waterfall Trap',
    titleHu: 'Spec-vezérelt fejlesztés és a vízesés-csapda',
    featuredImagePath: '/blog/spec-driven-waterfall.png',
    videoUrl: 'https://youtu.be/-nk3exnGqBE',
    excerptEn:
      'Spec-driven development solves real problems with vibe coding, but writing a long, confident spec up front quietly brings back the waterfall assumption. The fix is to iterate the spec, not just the code.',
    excerptHu:
      'A spec-vezérelt fejlesztés valódi problémát old meg a vibe codinggal szemben, de egy hosszú, magabiztos előzetes spec csendben visszahozza a vízesés-feltételezést. A megoldás: iteráld a specet, ne csak a kódot.',
  },
  {
    slug: 'ai-generated-adrs',
    publishedAt: '2026-06-01',
    titleEn: 'Do Not Let AI Write Your ADRs',
    titleHu: 'Ne az AI írja meg helyetted az ADR-t',
    excerptEn:
      'AI can produce polished ADR-shaped text, but it cannot weigh your real decision drivers. Use it to expose assumptions and blind spots before the team owns the choice.',
    excerptHu:
      'Az AI csiszolt ADR-szerű szöveget tud írni, de nem tudja helyetted súlyozni a valódi decision drivereket. Használd feltételezések és vakfoltok felszínre hozására, mielőtt a csapat dönt.',
    featuredImagePath: '/blog/ai-in-adr.png',
  },
  {
    slug: 'testing-in-ai-age',
    publishedAt: '2026-05-11',
    titleEn: 'Tests Have Always Been Neglected. AI Made It Worse.',
    titleHu: 'A tesztek mindig mostohagyerekek voltak. Az AI csak ráerősített erre.',
    featuredImagePath: '/blog/ai-generated-tests.png',
    excerptEn:
      'AI can generate tests fast, but speed often amplifies brittle, implementation-focused test suites. The real gain comes from behavior-focused tests that survive refactors.',
    excerptHu:
      'Az AI gyorsan gyárt teszteket, de ezzel sokszor csak a törékeny, implementation-fókuszú mintákat skálázzuk. A tartós értéket a viselkedésközpontú tesztek adják.',
  },
  {
    slug: 'you-are-not-building-airplanes',
    publishedAt: '2026-05-05',
    titleEn: 'You Are Not Building Airplanes',
    titleHu: 'Nem minden rendszer repülőgép',
    featuredImagePath: '/blog/airplane.png',
    excerptEn:
      'Reliability does not improve by writing fallbacks for every uncertain state. Critical points need redundancy; everywhere else needs simplicity.',
    excerptHu:
      'A megbízhatóság nem attól nő, hogy minden bizonytalan állapotra fallbacket írunk. A kritikus pontokon kell redundancia, mindenhol máshol egyszerűség.',
  },
  {
    slug: 'overengineering-vs-underengineering-compliance-nightmare',
    publishedAt: '2026-04-26',
    titleEn: 'Overengineering vs. underengineering: a compliance near-miss',
    titleHu: 'Overengineering vs. underengineering: majdnem compliance-rémálom',
    excerptEn:
      'A tenant deletion endpoint looked like five lines, but multi-region data, retention rules, and auditability turned it into a business-critical workflow design problem.',
    excerptHu:
      'A tenant törlése első ránézésre 5 soros endpointnak tűnt, de a több régiós adatok, a retention szabályok és az audit igények gyorsan üzletkritikus folyamattervezési problémává tették.',
    featuredImagePath: '/blog/underengineering.png',
    videoUrl: 'https://youtu.be/ubMhBhTy10I',
  },
  {
    slug: 'ci-cd-pipeline-slower-than-your-developers',
    publishedAt: '2026-03-20',
    titleEn: 'Your CI/CD Pipeline Is Slower Than Your Developers',
    titleHu: 'A CI/CD pipeline-od lassabb, mint a fejlesztőid',
    featuredImagePath: '/blog/ci-cd.png',
    excerptEn:
      'Developers ship fast; production does not. The bottleneck is not people—it is your pipeline, process, and architecture of delivery.',
    excerptHu:
      'Gyorsan jön a kód, az éles környezet mégis napokig változatlan. A szűk keresztmetszet nem a fejlesztőkben van, hanem a pipeline-ban.',
    videoUrl: 'https://www.youtube.com/watch?v=C4pPAub7ZbM',
  },
  {
    slug: 'adrs-are-useful-only-if-they-shape-the-decision',
    publishedAt: '2026-03-08',
    titleEn: 'ADRs Are Useful Only If They Shape the Decision',
    titleHu: 'Az ADR csak akkor ér valamit, ha alakítja a döntést',
    featuredImagePath: '/blog/adr.png',
    excerptEn:
      'ADRs fail when they become passive documentation. Their real value is the thinking and discussion before the decision is finalized.',
    excerptHu:
      'Az ADR akkor bukik el, ha csak dokumentáció marad. A valódi értéke az, amikor még a döntés előtt tisztázza a kontextust és tradeoffokat.',
    videoUrl: 'https://www.youtube.com/watch?v=7ts25z4ysLo',
  },
  {
    slug: 'your-scaling-problem-might-be-architecture-not-kubernetes',
    publishedAt: '2026-03-04',
    titleEn: 'Your Scaling Problem Might Be Architecture, Not Kubernetes',
    featuredImagePath: '/blog/no-kubernetes.png',
    titleHu: 'Lehet, hogy nem Kubernetes kell, hanem jobb architektúra',
    excerptEn:
      'Before moving to Kubernetes, verify what actually breaks first. Many scaling problems come from architecture and unclear boundaries, not missing clusters.',
    excerptHu:
      'Mielőtt Kubernetesre váltasz, mérd meg, mi a valódi limit. A skálázási gondok gyakran nem az infrastruktúrán, hanem az architektúrán csúsznak el.',
    videoUrl: 'https://youtu.be/ah5V42lkuds',
  },
  {
    slug: 'not-all-tech-debt-is-equal',
    publishedAt: '2026-03-31',
    titleEn: 'Not All Tech Debt Is Equal',
    titleHu: 'Nem minden tech debt egyforma',
    excerptEn:
      'Treating all tech debt the same creates false progress. Strategic, accidental, and architectural debt need different decisions and different responses.',
    excerptHu:
      'Ha minden tech debtet ugyanúgy kezelsz, látszólagos haladást kapsz. A stratégiai, véletlen és architekturális tech debt teljesen más döntést igényel.',
    videoUrl: 'https://youtu.be/3mii9bxFxY8',
    featuredImagePath: '/blog/tech-debt.png',
  },
  {
    slug: 'worth-solving-before-architecture',
    publishedAt: '2026-04-20',
    titleEn: 'Before You Choose Architecture, Answer This One Question',
    titleHu: 'Mielőtt architektúrát választasz, válaszolj erre az egy kérdésre',
    videoUrl: 'https://youtu.be/X_S0TyXHiNs',
    featuredImagePath: '/blog/chaos.png',
    excerptEn:
      'Teams often start with stack and architecture decisions too early. First validate whether the problem is worth solving now, then design the smallest system that proves value.',
    excerptHu:
      'Sok csapat túl korán ugrik architektúrára és stackre. Először azt validáld, hogy a probléma valóban most érdemes-e megoldani, és csak utána tervezhess rendszert.',
  },
]
