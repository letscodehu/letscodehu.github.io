/**
 * Blog metadata and ordering. Article bodies live in content/blog/<slug>/en.md and hu.md
 * (loaded via import.meta.glob in blog-posts.ts for the Vite bundle only).
 */
export interface BlogPostManifest {
  slug: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  videoUrl?: string
  /** Path under site root for Open Graph / Twitter preview, e.g. `/blog/og/my-slug.png` (file in `public/`). */
  ogImagePath?: string
}

export const blogPostManifest: BlogPostManifest[] = [
  {
    slug: 'ci-cd-pipeline-slower-than-your-developers',
    titleEn: 'Your CI/CD Pipeline Is Slower Than Your Developers',
    titleHu: 'A CI/CD pipeline-od lassabb, mint a fejlesztőid',
    excerptEn:
      'Developers ship fast; production does not. The bottleneck is not people—it is your pipeline, process, and architecture of delivery.',
    excerptHu:
      'Gyorsan jön a kód, az éles környezet mégis napokig változatlan. A szűk keresztmetszet nem a fejlesztőkben van, hanem a pipeline-ban.',
    videoUrl: 'https://www.youtube.com/watch?v=C4pPAub7ZbM',
  },
  {
    slug: 'adrs-are-useful-only-if-they-shape-the-decision',
    titleEn: 'ADRs Are Useful Only If They Shape the Decision',
    titleHu: 'Az ADR csak akkor ér valamit, ha alakítja a döntést',
    excerptEn:
      'ADRs fail when they become passive documentation. Their real value is the thinking and discussion before the decision is finalized.',
    excerptHu:
      'Az ADR akkor bukik el, ha csak dokumentáció marad. A valódi értéke az, amikor még a döntés előtt tisztázza a kontextust és tradeoffokat.',
    videoUrl: 'https://www.youtube.com/watch?v=7ts25z4ysLo',
  },
  {
    slug: 'your-scaling-problem-might-be-architecture-not-kubernetes',
    titleEn: 'Your Scaling Problem Might Be Architecture, Not Kubernetes',
    titleHu: 'Lehet, hogy nem Kubernetes kell, hanem jobb architektúra',
    excerptEn:
      'Before moving to Kubernetes, verify what actually breaks first. Many scaling problems come from architecture and unclear boundaries, not missing clusters.',
    excerptHu:
      'Mielőtt Kubernetesre váltasz, mérd meg, mi a valódi limit. A skálázási gondok gyakran nem az infrastruktúrán, hanem az architektúrán csúsznak el.',
    videoUrl: 'https://youtu.be/ah5V42lkuds',
  },
  {
    slug: 'not-all-tech-debt-is-equal',
    titleEn: 'Not All Tech Debt Is Equal',
    titleHu: 'Nem minden tech debt egyforma',
    excerptEn:
      'Treating all tech debt the same creates false progress. Strategic, accidental, and architectural debt need different decisions and different responses.',
    excerptHu:
      'Ha minden tech debtet ugyanúgy kezelsz, látszólagos haladást kapsz. A stratégiai, véletlen és architekturális tech debt teljesen más döntést igényel.',
    videoUrl: 'https://youtu.be/3mii9bxFxY8',
    ogImagePath: '/blog/tech-debt.png',
  },
  {
    slug: 'worth-solving-before-architecture',
    titleEn: 'Before You Choose Architecture, Answer This One Question',
    titleHu: 'Mielőtt architektúrát választasz, válaszolj erre az egy kérdésre',
    excerptEn:
      'Teams often start with stack and architecture decisions too early. First validate whether the problem is worth solving now, then design the smallest system that proves value.',
    excerptHu:
      'Sok csapat túl korán ugrik architektúrára és stackre. Először azt validáld, hogy a probléma valóban most érdemes-e megoldani, és csak utána tervezhess rendszert.',
  },
]
