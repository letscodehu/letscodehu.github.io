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
  /** Tag slugs, must match entries in `blog-tags.ts`. */
  tags: string[]
}

export const blogPostManifest: BlogPostManifest[] = [
  {
    slug: 'you-dont-need-an-agent-for-that',
    publishedAt: '2026-08-11',
    tags: ['ai', 'decision-making'],
    titleEn: "You Don't Need an Agent for That",
    titleHu: 'Nem kell hozzá agent',
    featuredImagePath: '/blog/hammers.jpg',
    videoUrl: 'https://youtu.be/kh1prG_vE_4',
    excerptEn:
      'A team spent three weeks building an agent to triage support tickets, then replaced it with a text classifier - faster, cheaper, more predictable. Most agent-shaped ideas are tasks with a mapping already sitting in the data, waiting to be learned instead of reasoned about turn by turn.',
    excerptHu:
      'Egy csapat három hetet töltött egy agent építésével support ticketek triázsolására, majd lecserélte egy szövegklasszifikálóra - gyorsabb, olcsóbb, kiszámíthatóbb lett. A legtöbb agent-formájú ötlet valójában olyan task, aminek a leképezése már ott van az adatban, csak meg kell tanulni, nem újra végiggondolni minden alkalommal.',
  },
  {
    slug: 'ai-didnt-make-you-5x-faster',
    publishedAt: '2026-07-30',
    tags: ['ai', 'ci-cd'],
    titleEn: "AI Didn't Make You 5x Faster. It Moved the Bottleneck.",
    titleHu: 'Az AI nem tett 5x gyorsabbá. Csak arrébb tolta a szűk keresztmetszetet.',
    featuredImagePath: '/blog/5x-faster.png',
    videoUrl: 'https://youtu.be/jfzbIeOuwZg',
    excerptEn:
      "An agent generated a feature in minutes, then sat idle waiting for CI runners. AI made writing code cheap, but that was never the same as making software cheap - and the gap is where the promised 5x disappears.",
    excerptHu:
      'Egy agent pár perc alatt legenerált egy feature-t, aztán tétlenül várt egy szabad CI runnerre. Az AI olcsóvá tette a kód megírását, de ez sosem volt ugyanaz, mint a szoftver olcsóvá tétele - és ebben a résben tűnik el az ígért 5x.',
  },
  {
    slug: 'architect-wont-be-here-when-bill-comes-due',
    publishedAt: '2026-07-14',
    tags: ['architecture', 'decision-making'],
    titleEn: "The Architect Won't Be Here When the Bill Comes Due",
    titleHu: 'Az architektet már nem találod ott, mikor megjön a számla',
    featuredImagePath: '/blog/serverless-strategy.png',
    excerptEn:
      'The person who mandates "everything serverless" is systematically the one least exposed to the consequences. The decision outlives the decider, and the misalignment between who decides and who pays is the real defect - not the tech.',
    excerptHu:
      'Aki kimondja, hogy „minden legyen serverless", rendszerint az van a legkevésbé kitéve a következményeknek. A döntés túléli a döntéshozót, és a valódi hiba nem a technológia, hanem az elcsúszás aközött, hogy ki dönt és ki fizet.',
    videoUrl: 'https://www.youtube.com/watch?v=cHAQ23lY_PE',
  },
  {
    slug: 'best-engineer-barely-writes-code',
    publishedAt: '2026-06-20',
    tags: ['ai', 'leadership'],
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
    tags: ['ai', 'architecture'],
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
    tags: ['ai', 'decision-making'],
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
    tags: ['ai', 'decision-making'],
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
    tags: ['ai', 'testing'],
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
    tags: ['architecture'],
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
    tags: ['architecture', 'compliance'],
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
    tags: ['ci-cd'],
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
    tags: ['decision-making'],
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
    tags: ['architecture', 'scaling'],
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
    tags: ['tech-debt', 'architecture'],
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
    tags: ['architecture', 'decision-making'],
    titleEn: 'Before You Choose Architecture, Answer This One Question',
    titleHu: 'Mielőtt architektúrát választasz, válaszolj erre az egy kérdésre',
    videoUrl: 'https://youtu.be/X_S0TyXHiNs',
    featuredImagePath: '/blog/chaos.png',
    excerptEn:
      'Teams often start with stack and architecture decisions too early. First validate whether the problem is worth solving now, then design the smallest system that proves value.',
    excerptHu:
      'Sok csapat túl korán ugrik architektúrára és stackre. Először azt validáld, hogy a probléma valóban most érdemes-e megoldani, és csak utána tervezhess rendszert.',
  },
  // {
  //   slug: 'structured-output-without-asking-nicely',
  //   publishedAt: '2025-10-21',
  //   tags: ['ai', 'architecture'],
  //   titleEn: 'Structured Output Without Asking Nicely',
  //   titleHu: 'Strukturált kimenet anélkül, hogy szépen megkérnéd a modellt',
  //   featuredImagePath: '/blog/structured-output-without-asking-nicely.png',
  //   excerptEn:
  //     "Asking an LLM nicely for a specific output shape works until it doesn't - a few calls out of a hundred drift out of format and break a parser. Constraining the token generation itself, through tool calling or schema enforcement, is what actually makes the shape non-negotiable.",
  //   excerptHu:
  //     'Ha csak megkéred az LLM-et, hogy egy adott formában válaszoljon, az addig működik, amíg nem - száz hívásból néhány kicsúszik a formátumból, és eltör egy parsert. Ami tényleg nem alkuképessé teszi a formát, az a token-generálás megkötése magával a schemával, tool callingen keresztül.',
  // },
  // {
  //   slug: 'what-is-bm25',
  //   publishedAt: '2025-10-28',
  //   tags: ['ai'],
  //   titleEn: 'What Is BM25, and Why Does It Still Matter?',
  //   titleHu: 'Mi az a BM25, és miért számít még mindig?',
  //   featuredImagePath: '/blog/what-is-bm25.png',
  //   excerptEn:
  //     "BM25 is a thirty-year-old keyword ranking algorithm still running behind most search boxes, precise on exact terms and blind to anything it can't match on the word level. Modern systems don't replace it with semantic search - they blend the two.",
  //   excerptHu:
  //     'A BM25 egy harmincéves kulcsszó-rangsoroló algoritmus, ami még mindig ott fut a legtöbb keresőmező mögött, pontos a konkrét kifejezéseknél, és vak mindenre, amit nem tud szó szinten matchelni. A modern rendszerek nem lecserélik semantic searchre, hanem a kettőt vegyítik.',
  // },
  // {
  //   slug: 'why-llms-hallucinate',
  //   publishedAt: '2025-11-03',
  //   tags: ['ai'],
  //   titleEn: 'Why LLMs Hallucinate (and What Actually Reduces It)',
  //   titleHu: 'Miért hallucinálnak az LLM-ek (és mi csökkenti tényleg)',
  //   featuredImagePath: '/blog/why-llms-hallucinate.png',
  //   excerptEn:
  //     'Telling a model to admit uncertainty, lowering temperature, and asking for sources all sound like fixes for hallucination - none of them reliably work. What actually helps is giving the model something real to look up instead of asking it to be more honest about having nothing.',
  //   excerptHu:
  //     'Megmondani a modellnek, hogy vállalja a bizonytalanságot, lejjebb venni a temperature-t, forrást kérni - mind megoldásnak hangzik hallucinációra, egyik sem működik megbízhatóan. Ami tényleg segít, hogy adsz neki valami valódit, amit megnézhet, ahelyett hogy őszintébb bizonytalanságot kérnél tőle.',
  // },
  // {
  //   slug: 'ml-vs-ai-engineer',
  //   publishedAt: '2025-11-11',
  //   tags: ['ai'],
  //   titleEn: 'ML Engineer vs. AI Engineer: What Actually Changed',
  //   titleHu: 'ML Engineer vs. AI Engineer: mi változott valójában',
  //   featuredImagePath: '/blog/ml-vs-ai-engineer.png',
  //   excerptEn:
  //     'It looks like a rebrand of the same job, but ML and AI engineering start from a different premise - training your own model on your own data versus building on top of a foundation model you didn\'t train. That difference shapes the tools, the skills, and what "ops" even means.',
  //   excerptHu:
  //     'Úgy néz ki, mintha ugyanannak a munkának lenne új címkéje, de az ML és az AI engineering más előfeltevésből indul - saját modellt tréningezni saját adaton, versus egy olyan foundation modellre építeni, amit nem te tréningeztél. Ez a különbség formálja a toolokat, a skilleket, és azt is, mit jelent egyáltalán az „ops".',
  // },
  {
    slug: 'context-engineering-in-practice',
    publishedAt: '2025-12-03',
    tags: ['ai', 'architecture'],
    titleEn: 'Context Engineering in Practice: Building Agents That Remember Just Enough',
    titleHu: 'Context engineering a gyakorlatban: agentek, amik pont eleget emlékeznek',
    featuredImagePath: '/blog/context-engineering-in-practice.png',
    excerptEn:
      "Most failing agents aren't held back by a weak model - they're drowning in tool results that quietly re-inject the same 2,500-word document into every turn. The fix isn't a bigger context window; it's giving the model exactly what it needs for the current step, and nothing else.",
    excerptHu:
      'A legtöbb elbukó agentet nem egy gyenge modell fogja vissza - egy olyan tool eredmény fullasztja meg, ami csendben ugyanazt a 2500 szavas dokumentumot injektálja vissza minden turnban. A megoldás nem egy nagyobb context window, hanem hogy pontosan azt adod a modellnek, ami az aktuális lépéshez kell, és semmi mást.',
  },
  // {
  //   slug: 'chain-of-thought-reasoning-models',
  //   publishedAt: '2025-12-16',
  //   tags: ['ai'],
  //   titleEn: 'Chain of Thought: Why Reasoning Models Get Complex Problems Right',
  //   titleHu: 'Chain of Thought: miért oldják meg jól a reasoning modellek az összetett problémákat',
  //   featuredImagePath: '/blog/chain-of-thought-reasoning-models.png',
  //   excerptEn:
  //     "Ask a model to jump straight to an answer and it has to compress every step of the reasoning into one token. Let it show its work first, and each step only has to be locally correct - the same distinction Kahneman drew between System 1 and System 2, just measurable in a model's accuracy.",
  //   excerptHu:
  //     'Kérj egy modelltől egy azonnali választ, és minden reasoning-lépést egyetlen tokenbe kell tömörítenie. Engedd, hogy előbb megmutassa a munkáját, és minden lépésnek csak lokálisan kell helyesnek lennie - ugyanaz a különbség, amit Kahneman a System 1 és System 2 között tett, csak mérhető formában, a modell pontosságában.',
  // },
  // {
  //   slug: 'prompt-storage-strategies',
  //   publishedAt: '2025-12-19',
  //   tags: ['ai', 'architecture'],
  //   titleEn: 'Where You Store Your Prompts Decides How Fast You Can Change Them',
  //   titleHu: 'Ahol a promptjaidat tárolod, az dönti el, milyen gyorsan tudsz változtatni rajtuk',
  //   featuredImagePath: '/blog/prompt-storage-strategies.png',
  //   excerptEn:
  //     'Hardcoded prompts are fast for one person and a bureaucratic nightmare for a team. A database unlocks fast iteration, at the cost of schema headaches; a dedicated tool adds versioning, at the cost of an external dependency. Storage stops being a footnote the moment you actually try to evaluate a prompt.',
  //   excerptHu:
  //     'A kódba égetett prompt gyors egy embernek, és bürokratikus rémálom egy csapatnak. Egy adatbázis gyors iterációt old fel, schema-fejfájás árán; egy dedikált tool verziózást ad, egy külső függőség árán. A tárolás abban a pillanatban hagyja abba a lábjegyzet-létet, amikor tényleg ki akarod értékelni a promptot.',
  // },
  // {
  //   slug: 'llm-tool-design-antipatterns',
  //   publishedAt: '2026-01-11',
  //   tags: ['ai', 'testing'],
  //   titleEn: 'When Tools Go Wrong: Antipatterns (and How to Test Your Way Out)',
  //   titleHu: 'Amikor a tool-ok rosszul sülnek el: antipatternek (és hogyan tesztelj ki belőlük)',
  //   featuredImagePath: '/blog/llm-tool-design-antipatterns.png',
  //   excerptEn:
  //     "A forty-function manifest of near-identical tools isn't confusing the model - it's confusing you, and the model just mirrors it. Most tool-selection failures trace back to schema and naming decisions the team never made, not to the model misreading intent.",
  //   excerptHu:
  //     'Egy negyven függvényes, szinte egyforma tool-okból álló manifest nem a modellt zavarja össze - téged zavar össze, a modell csak tükrözi ezt. A legtöbb tool-választási hiba olyan schema- és elnevezési döntésekre vezethető vissza, amiket a csapat sosem hozott meg, nem a modell téves értelmezésére.',
  // },
  // {
  //   slug: 'when-everything-is-an-agent',
  //   publishedAt: '2026-01-13',
  //   tags: ['ai', 'decision-making'],
  //   titleEn: 'When Everything Is an "Agent", Nothing Is',
  //   titleHu: 'Ha minden „agent", akkor semmi sem az',
  //   featuredImagePath: '/blog/when-everything-is-an-agent.png',
  //   excerptEn:
  //     'A cron job with an LLM call and a genuinely autonomous, tool-using system get called the same thing now, and that confusion has a real cost: over-engineered chatbots, under-scrutinized real agents, and burned credibility with stakeholders. A three-rung ladder - task, workflow, agent - fixes the vocabulary.',
  //   excerptHu:
  //     'Egy cron job egy LLM-hívással és egy ténylegesen autonóm, tool-okat használó rendszer ma ugyanazt a nevet kapja, és ennek a zavarnak valódi ára van: túltervezett chatbotok, alulvizsgált valódi agentek, elégetett hitelesség a stakeholdereknél. Egy háromfokú létra - task, workflow, agent - rendbe teszi a szókincset.',
  // },
  // {
  //   slug: 'prompt-structure-vs-kv-cache',
  //   publishedAt: '2026-02-11',
  //   tags: ['ai', 'scaling'],
  //   titleEn: 'Prompt Structure vs. KV Cache',
  //   titleHu: 'Prompt struktúra vs. KV cache',
  //   featuredImagePath: '/blog/prompt-structure-vs-kv-cache.png',
  //   excerptEn:
  //     'Everyone name-drops KV cache in architecture reviews, but a single dynamic timestamp prepended to a prompt is enough to force a full recomputation of everything behind it. The fix is pure ordering discipline: stable content first, dynamic content pushed all the way to the bottom.',
  //   excerptHu:
  //     'Mindenki emlegeti a KV cache-t az architektúra review-kon, de egyetlen dinamikus időbélyeg a prompt elejére illesztve elég ahhoz, hogy kikényszerítse minden mögötte lévő dolog teljes újraszámolását. A megoldás tiszta sorrendi fegyelem: stabil tartalom elöl, dinamikus tartalom egészen az aljára tolva.',
  // },
]
