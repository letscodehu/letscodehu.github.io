export interface BlogPost {
  slug: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  contentEn: string
  contentHu: string
  videoUrl?: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ci-cd-pipeline-slower-than-your-developers',
    titleEn: 'Your CI/CD Pipeline Is Slower Than Your Developers',
    titleHu: 'A CI/CD pipeline-od lassabb, mint a fejlesztőid',
    excerptEn:
      'Developers ship fast; production does not. The bottleneck is not people—it is your pipeline, process, and architecture of delivery.',
    excerptHu:
      'Gyorsan jön a kód, az éles környezet mégis napokig változatlan. A szűk keresztmetszet nem a fejlesztőkben van, hanem a pipeline-ban.',
    videoUrl: 'https://www.youtube.com/watch?v=C4pPAub7ZbM',
    contentEn: `Your developers are fast. Too fast, actually.

They ship code in hours. AI writes half of it. Pull requests pile up. And yet your production environment hasn't changed in three days.

There's a "release window" on Thursdays, isn't there?

The problem isn't your developers. It's your pipeline.

---

## Architecture without delivery is just a diagram

We talk a lot about architecture. Microservices. Event-driven systems. Scalability. But almost nobody talks about the one thing that actually determines whether your system delivers value: how fast you can safely ship to production.

If you can't deploy quickly and reliably, your architecture doesn't matter. It's just a very expensive diagram.

---

## The illusion of productivity

AI made developers faster. You can generate a REST endpoint, validation, tests, and a migration in under 10 minutes. But faster code generation doesn't mean faster delivery — not if the path to production is broken.

I worked on a project where there were no local development environments. By design. The team decided early on that everyone should use ephemeral cloud environments for consistency with production.

Which sounds reasonable — until you see what it means in practice.

Every change had to be deployed to the cloud just to test it. What should have been a 30-second feedback loop became a 15-minute wait. A developer fixes a bug. Deploys to the cloud. Waits. Sees a typo. Deploys again. Waits again.

The fix reached production hours later.

That's not productivity. That's developer buffering.

---

## What "slow pipeline" actually means

A slow pipeline isn't just "CI takes 20 minutes." Sometimes it has nothing to do with CI at all.

On another project, we had regular release meetings. Every release, we sat down and went through the tickets: what's going out, what's in this batch, who needs to know. Standard process.

One of those meetings, we spent 20 minutes going through the list — only to find out the release contained a single frontend change. A space. In a label.

The other two changes we expected to ship had already gone out earlier. Nobody had tagged them as a release. So they never got tracked. And what was left in the batch was a one-character whitespace fix.

We needed a 20-minute meeting to confirm that.

If we had shipped continuously, there would have been nothing to coordinate. The meeting wasn't the problem. Batching was.

---

## Speed is an architectural concern

Most teams treat CI/CD as tooling. "It's just some Jenkins jobs, a few GitHub runners." But it's not. It's part of your architecture.

I've seen this directly. A team split everything into separate repos early on — clean boundaries, independent ownership. It felt like the right call.

But nobody accounted for the dependencies between those repos. Workflows depended on other workflows. There were no contract tests. And without contract tests, the frontend and backend periodically broke each other — not because of bad code, but because there was no automated way to know when one side changed something the other relied on.

Every deployment became a gamble.

The pipeline wasn't slow because of the tools. It was slow because the architecture made independent deployment impossible.

---

## The cost of slow shipping

Slow pipelines don't just waste time. They change behavior.

On that same project, there were 3 code owners for 40 engineers. Every PR had to go through one of them. Reviews were slow — sometimes weeks. So developers started bundling tasks together.

"Why open 3 separate PRs and wait 3 times when you can wait once?"

The result: bigger PRs, harder reviews, higher risk. And when something broke, nobody could tell which change caused it.

Then came the inevitable next step: deploying at night, "just in case."

Congratulations — you've made deployment a stressful event. Which is absurd. Deployment is literally your core capability.

---

## What fast actually looks like

A fast pipeline isn't about raw speed. It's about confidence.

A developer makes a small change, merges it, and it's live in 10 minutes. No drama. A bug reaches production — rollback takes 30 seconds. No meeting, no panic. A new feature ships behind a flag, enabled when you're ready.

Decoupled. Boring. Predictable.

That's the goal. Because if deployment is exciting, something is very wrong.

---

## How to fix it — without enterprise theater

You don't fix a slow pipeline by adding more tools and processes. You fix it by removing things.

Instead of one big PR per day — ten small ones.  
Instead of shared database changes — backward-compatible migrations.  
Instead of a manual QA gate — reliable automated tests.  
Instead of release meetings — continuous deployment.

Every manual approval is a symptom. Every flaky test is technical debt. Every "just in case" process is fear wearing a process badge.

---

## The real question

AI will keep making developers faster. That's not slowing down.

The question is whether your organization can keep up. Because if your pipeline is slower than your developers, you're not accelerating — you're bottlenecking the one thing that actually generates revenue: delivery.

If you're a CTO or a Lead Engineer, and you feel like your team is "buffering" instead of shipping, let's fix that.

I help tech companies bridge the gap between engineering effort and business value. We'll identify the bottlenecks in your process—whether they're in your code, your architecture, or your decision-making—and build a leaner, smarter path to production.

Book a Call to see how we can work together.`,
    contentHu: `A fejlesztőid gyorsak. Talán túl gyorsak is.

Órák alatt kerül be a kód a repóba, az AI megírja a felét, a pull requestek pedig tornyosulnak. Mégis, az éles környezet három napja változatlan.

Ugye nálatok is csütörtökön van a „release window”?

A probléma nem a fejlesztőkkel van. Hanem a pipeline-nal.

---

## Szállítás nélkül az architektúra csak egy színes ábra

Rengeteget beszélünk az architektúráról: microservices, eseményvezérelt rendszerek, skálázhatóság. De szinte senki nem említi azt az egyetlen tényezőt, ami eldönti, hogy ér-e valamit a rendszered: milyen gyorsan tudsz biztonságosan élesíteni.

Ha nem tudsz gyorsan és megbízhatóan deployolni, az architektúrád nem számít. Akkor az csak egy méregdrága diagram.

---

## A produktivitás illúziója

Az AI felgyorsította a kódolást. Egy REST endpoint, a validáció, a tesztek és a migráció megvan tíz perc alatt. De a gyorsabb kódgenerálás nem jelent gyorsabb szállítást, ha az élesítési folyamat döcög.

Dolgoztam egy projekten, ahol szándékosan nem volt lokális fejlesztői környezet. A csapat úgy döntött: mindenki használjon távoli, felhős környezetet, hogy az összhangban legyen az élessel.

Logikusnak tűnt – amíg nem láttuk a gyakorlatban.

Minden apró módosítást felhőbe kellett deployolni a teszteléshez. Ami lokálisan 30 másodperc lett volna, az a távoli környezetben 15 perc várakozássá nyúlt. A fejlesztő javít egy bugot. Deployol. Vár. Észrevesz egy elütést. Újra deployol. Újra vár.

A javítás csak órákkal később jutott el az éles szerverre. Ez nem hatékonyság, hanem fejlesztői buffering.

---

## Mit jelent valójában a lassú pipeline?

A lassú pipeline nem csak annyit tesz, hogy „húsz percig fut a CI”. Gyakran semmi köze a technikai folyamathoz.

Egy másik projekten rendszeres release meetingeket tartottak. Minden kiadás előtt leültünk átnézni a jegyeket: mi megy ki, mi van a csomagban, kit kell értesíteni. Standard procedúra.

Egyszer húsz percet vitatkoztunk a listáról, mire kiderült: a release egyetlen frontend módosítást tartalmaz. Egyetlen szóközt egy feliratban.

A másik két változtatás, amit szintén ki akartunk tenni, már korábban kiment, csak senki nem jelölte őket releaseben, így nem szerepeltek a nyilvántartásban. Maradt tehát a „csomagban” egy egykarakteres javítás.

Húszperces meeting kellett hozzá.

Ha folyamatosan szállítanánk, nem lenne mit egyeztetni. Nem a meetinggel volt a baj, hanem a batch-eléssel.

---

## A sebesség architektúra kérdése

A legtöbb csapat a CI/CD-re eszközként tekint: „pár Jenkins job, néhány GitHub runner”. Pedig ez is a szoftverarchitektúra része.

Láttam ezt közelről: egy csapat korán szétválasztotta a repókat a tiszta határok és a független felelősségi körök miatt. Jó ötletnek tűnt.

Csakhogy senki nem számolt a repók közötti függőségekkel. A munkafolyamatok egymásra épültek, de nem voltak contract tesztek. Ezek nélkül a frontend és a backend rendszeresen „eltörte” egymást – nem a rossz kód miatt, hanem mert nem volt automatikus jelzés, ha az egyik oldal módosított valamin, amire a másik támaszkodott.

Minden deploy szerencsejátékká vált. A pipeline nem a rossz eszközök miatt volt lassú, hanem mert az architektúra ellehetetlenítette a független telepítést.

---

## A lassú szállítás ára

A lassú folyamatok nemcsak időt égetnek, hanem a fejlesztők hozzáállását is rontják.

Ugyanazon a projekten három code owner jutott negyven fej.esztőre. Minden PR rajtuk ment keresztül. A review-k hetekig elhúzódtak. A fejlesztők ezért elkezdtek „csomagolni”.

„Miért nyissak három külön PR-t és várjak háromszor hetekig, ha egyben is letudhatom?”

Az eredmény: hatalmas PR-ok, átláthatatlan review-k, óriási kockázat. Ha pedig valami elromlott, senki nem tudta, melyik módosítás okozta. Aztán jött a „megoldás”: éjszakai deploy, „hátha így nem lesz baj”.

Gratulálok: a telepítést sikerült egy stresszes eseménnyé tenni. Pedig a deploynak a napi rutin részének kellene lennie.

---

## Milyen a valóban gyors folyamat?

A gyors pipeline nem a nyers sebességről, hanem a bizalomról szól.

A fejlesztő végez egy apró módosítást, beküldi, és tíz perc múlva élesben látja. Nincs dráma. Ha bug kerül ki, a rollback harminc másodperc. Nincs meeting, nincs pánik. Az új funkciók feature flag mögött mennek ki, és akkor aktiválódnak, amikor készen állnak.

Tagolt. Unalmas. Kiszámítható.

Ez a cél. Mert ha a deploy izgalmas, ott valami nagyon el van rontva.

---

## Hogyan javítsd meg – vállalati processek nélkül?

A lassú pipeline-t nem újabb eszközökkel és még bonyolultabb folyamatokkal javítod meg, hanem egyszerűsítéssel.

- Napi egy nagy PR helyett: tíz kicsi.
- Közös adatbázis-módosítások helyett: visszafelé kompatibilis migrációk.
- Manuális QA helyett: megbízható automatizált tesztek.
- Release meetingek helyett: folyamatos szállítás (CD).

Minden manuális jóváhagyás csak egy tünet. Minden bizonytalan teszt technical debt. Minden „hátha így jó lesz” szabály csak a félelem, amit folyamatnak álcáztak.

---

## Az igazi kérdés

Az AI tovább gyorsítja a fejlesztőket. Ez a tempó már nem fog lassulni.

A kérdés az: a szervezeted bírja-e ezt az iramot? Mert ha a pipeline lassabb a fejlesztőknél, akkor épp azt a folyamatot fojtod meg, ami a bevételt termeli: a delivery-t.

Ha CTO vagy vezető mérnök vagy, és érzed, hogy a csapatod csak „pufferezik” a tényleges szállítás helyett, tegyünk ellene.

Segítek tech cégeknek áthidalni a szakadékot a fejlesztői munka és az üzleti érték között. Feltérképezzük a szűk keresztmetszeteket – legyen szó kódról, architektúráról vagy döntéshozatali folyamatokról –, és felépítünk egy hatékonyabb utat az éles környezet felé.

Beszéljünk, és nézzük meg, hogyan tehetjük gördülékenyebbé a folyamataitokat!`,
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
    contentEn: `Most people will tell you that having ADRs is a good thing. They are not wrong.

ADR stands for Architecture Decision Record. The idea is simple: when you make an important architectural decision, you write it down. You capture context, alternatives, tradeoffs, reasoning, and final choice.

So when someone asks six months later, "Why this database?", "Why this queue?", or "Why three services?", you do not need to reconstruct the answer from Slack fragments and half-remembered meetings.

In theory, that is incredibly valuable.

## Why ADRs still fail in practice

In many teams ADRs exist and still feel like a waste of time. Not because the concept is bad, but because the intended value never appears.

A practical reason is discoverability. In a small team, searching Confluence is acceptable. In a larger organization, searching for one ADR returns hundreds of results, many outdated, archived, or irrelevant. The document is "there", but practically unreachable. And if engineers cannot find a decision quickly, they behave as if that decision was never documented.

There is also a process failure mode: ADRs become ritual. Someone introduces templates, review meetings, and a governance flow. People continue writing documents, but real decisions happen elsewhere. The review meeting ends with polite nods, a formal approval, and no meaningful improvement in decision quality.

## ADRs do not remove bias

ADRs are supposed to compare options objectively, but the author is still human. If someone has a decade of SQL experience and little exposure to NoSQL, the framing can drift before anyone notices.

SQL gets described as mature and proven. NoSQL gets described as uncertain and operationally risky. Both might be valid choices, but one gets better narrative framing because it is familiar. The ADR then captures preference with just enough logic around it to look neutral.

So ADRs do not eliminate bias. They only make the written reasoning visible.

## The real value is the thinking

Most teams treat ADRs as documentation. Their real value is decision hygiene.

When an ADR is written before commitment, it forces useful questions: what is the actual context, which alternatives are truly viable, what tradeoffs matter most, and what consequences are we accepting on purpose.

If that thinking happens early, the ADR has done its job, even if nobody reads it again. If it is written after implementation starts, it becomes historical reporting with little influence on outcomes.

## A costly example: KMS + CloudHSM

On one product, we had to decide how to manage encryption keys for sensitive customer data. Security pressure was high, compliance expectations were strict, and we wanted a setup that looked strong in both audits and architecture diagrams.

We picked AWS KMS with CloudHSM. On paper, it looked excellent: managed primitives, hardware-backed key protection, clear enterprise story. The decision meeting focused heavily on cryptographic guarantees and almost not at all on recovery constraints.

The missing question was simple: what happens if the AWS account itself is compromised?

Months later, during a resilience review, we discovered an unpleasant constraint. In an account takeover scenario, you cannot just recreate the exact KMS and CloudHSM trust relationship in a new account and continue business as usual. The coupling is not something you can rebuild in a clean environment on demand.

That changed the risk picture completely. We had already built dependent services around the original setup, production data had been encrypted under that model, and key-handling paths were spread across multiple components.

Fixing the gap was painful. We had to redesign parts of the key lifecycle, introduce migration steps for encrypted data, coordinate downtime windows, and retest incident procedures end to end. It took weeks and consumed capacity that should have gone to product work.

Would an ADR template alone have saved us? No. But a better decision conversation probably would have. One person asking "show me the DR playbook for account compromise" could have forced the right investigation before implementation.

That is the core point: the value is not the file. The value is the conversation the file forces.

## When ADRs actually work

In practice, a few rules help:

1. Use ADRs for decisions that are expensive to reverse (data stores, boundaries, integration patterns).
2. Write them before final commitment, not after implementation starts.
3. Keep them short and focused: context, options, tradeoffs, decision, consequences.

Retrospective ADRs can still be useful at the beginning, as practice for better decision thinking. But the long-term goal is proactive ADRs that shape decisions in real time.

## Final thought

ADRs are not useless.

They fail when they are treated as passive documentation.

If your ADR did not influence the decision, it is not really an architecture decision record. It is just documentation.

If you want better architectural decisions in your team, I can help you design a lean ADR workflow that improves discussion quality and reduces expensive blind spots before implementation.

[Contact me and let's improve your decision process](/en/contact).`,
    contentHu: `Sokan azt mondják, hogy az ADR jó dolog. És igazuk is van.

Az ADR (Architecture Decision Record) lényege egyszerű: ha fontos architekturális döntést hoztok, azt leírjátok. Kontextus, opciók, érvelés, végső döntés.

Így amikor fél év múlva valaki megkérdezi, hogy miért pont ezt az adatbázist választottátok, miért van itt queue, vagy miért három szolgáltatásra van bontva a rendszer, nem Slack threadeket és félhomályos meeting-emlékeket kell visszafejteni.

Elvben ez óriási érték.

## Miért bukik el mégis sok ADR?

Sok csapatnál az ADR-ek léteznek, mégis időpocsékolásnak érződnek. Nem azért, mert rossz az ötlet, hanem mert a valódi haszon nem jelenik meg.

Az első probléma a megtalálhatóság. Kisebb csapatban még működik a dokumentációs kereső. Nagyobb szervezetben viszont egyetlen ADR-keresésre jön 200 találat: archív oldal, régi meetingjegyzet, félig releváns belsős wiki. A döntés "elvileg megvan", gyakorlatban viszont nincs kéznél.

A második probléma, hogy az ADR könnyen rituálévá válik. Van template, van review meeting, van approval, de a valódi döntések nem ezekben a fórumokban születnek. A csapat kipipál egy folyamatlépést, miközben a döntéshozatali minőség nem javul.

## Az ADR nem szünteti meg a bias-t

Az ADR formailag bemutathat több opciót, mégis torzíthat. Ha az író SQL-ben magabiztos és NoSQL-ben bizonytalan, a megfogalmazás eleve billen:

- az SQL érettnek és megbízhatónak hangzik,
- a NoSQL kockázatosnak és túl bonyolultnak.

Mindkettő lehet valid út, mégis az ismerős technológia kap jobb narratívát. Az ADR az érvelést rögzíti, de nem teszi automatikusan objektívvé.

## A valódi érték: a közös gondolkodás

A legtöbb csapat dokumentációnak tekinti az ADR-t, pedig az igazi értéke a döntés előtti gondolkodás kikényszerítése.

Mi a valódi kontextus?  
Mely alternatívák életképesek ténylegesen?  
Mely tradeoffok számítanak igazán?  
Milyen következményeket fogadunk el tudatosan?

Ha ezekre még a végleges döntés előtt válasz születik, az ADR működik. Ha csak utólag írjátok meg, akkor inkább történeti napló.

## Egy drága példa: KMS + CloudHSM

Egy korábbi terméknél arról döntöttünk, hogyan tároljuk a titkosítási kulcsokat. Az üzleti oldal nyilván erős biztonsági sztorit akart, a compliance oldal auditálhatóságot, a technikai oldal pedig minél kevesebb operatív terhet.

AWS KMS + CloudHSM kombináció mellett mentünk el. Papíron ez tökéletesen nézett ki: managed szolgáltatás, hardveres kulcsvédelem, enterprise-kompatibilis security narrative. A döntési beszélgetésben viszont túl sok fókusz ment arra, hogy "mennyire erős kriptográfiailag", és túl kevés arra, hogy "mi történik, ha az account szintjén van baj".

A hiányzó kérdés egyszerű volt: mi a disaster recovery terv account compromise esetére?

Ezt nem bontottuk ki időben. Hónapokkal később, egy reziliencia-áttekintésen derült ki, hogy ha az AWS account kompromittálódik, a KMS és CloudHSM kapcsolatát nem tudod csak úgy egy másik accountban reprodukálni, mintha semmi nem történt volna.

Ez alapjaiban írta át a kockázatot. Addigra a rendszer már erre épült, több komponens kulcskezelése függött ettől, és éles adatok voltak az adott modell szerint titkosítva.

A korrekció nem "egy gyors ticket" volt. Újra kellett tervezni a kulcs-életciklus egy részét, migrációs folyamatot építeni a már titkosított adatokhoz, koordinálni az átállást, és végigtesztelni az incidenskezelést. Hetek mentek el rá, jelentős termékfejlesztési kapacitás árán.

Megoldotta volna ezt önmagában egy ADR sablon? Nem. De ha a döntésbe korán bevonunk még egy-két nézőpontot, és valaki felteszi a DR kérdést, nagy eséllyel még implementáció előtt felszínre jön ez a vakfolt.

Ez a lényeg: nem a dokumentum az érték, hanem a beszélgetés, amit kikényszerít.

## Mikor működik jól az ADR?

Tapasztalatból három egyszerű szabály:

1. Olyan döntésekhez használd, amelyeket drága visszafordítani (adatbázis, kommunikációs minta, rendszerhatárok).
2. A végleges döntés előtt készüljön, ne implementáció után.
3. Legyen egyszerű: kontextus, opciók, tradeoffok, döntés, következmények.

Kezdetben retrospektív ADR-ek is hasznosak lehetnek gyakorlásként, de a cél az, hogy az ADR valós időben formálja a döntést.

## Záró gondolat

Az ADR nem haszontalan.

Akkor bukik el, ha csak passzív dokumentáció marad.

Ha az ADR-ed nem befolyásolta magát a döntést, akkor az nem igazán architecture decision record. Az csak dokumentáció.

Ha szeretnél jobb architekturális döntéseket a csapatodban, segítek kialakítani egy könnyű, működő ADR folyamatot, ami még implementáció előtt felszínre hozza a vakfoltokat.

[Írj, és nézzük meg együtt a döntési folyamataitokat](/hu/contact).`,
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
    contentEn: `What if your scaling problem has nothing to do with infrastructure?

What if the real problem is architecture?

A company once reached out for help with scaling. They already had a recommended solution from a consulting partner: move to Kubernetes. It sounded modern, safe, and serious.

There was only one issue. They did not need it yet.

## The situation

The company collected telemetry from physical devices. Devices sent data to a backend, the backend processed and stored it, then exposed an API.

At first glance this looked like a textbook "we will need distributed infrastructure soon" case. But one detail changed everything: device production was still slow. So slow that the full production workload was running on one large EC2 instance.

CPU had headroom. Memory had headroom. Disk had headroom. There were no recurring outages and no obvious reliability incidents.

What existed was mostly pressure and anticipation. Scale is coming, therefore we must prepare now, therefore Kubernetes.

## The assumption nobody validated

Nobody asked the most important engineering question: what will break first?

Will CPU saturate? Will memory be exhausted? Will the database become the bottleneck? Will network throughput spike?

There were no convincing load-test results. No evidence-based capacity model. Just a chain of assumptions:

More devices -> more load -> Kubernetes.

That is not architecture. That is a guess wearing technical language.

## Vertical vs horizontal scaling

Scaling usually starts with two options:

- vertical scaling: bigger machine, more capacity;
- horizontal scaling: more machines, split the load.

They were still in the vertical phase, and it was working well.

Vertical scaling becomes problematic when instance costs become unreasonable, when single-host failure risk is no longer acceptable, or when hard limits are reached. They were not at that point.

So the right question was not "How do we operate a cluster?"

The right question was "Do we need more than one machine right now?"

## The monolith constraint

Then came the uncomfortable part: architecture.

The system was a large monolith: ingestion, processing, API, and background jobs in one codebase with shared state and a shared database.

If you lift that into Kubernetes, what exactly are you scaling?

Everything. Every time. Even when only one area needs more resources.

Infrastructure can scale only what your design allows to scale independently. If everything is tightly coupled, everything grows together. Kubernetes cannot undo that coupling. It can only distribute the same coupling across more nodes.

## Are you container-ready?

Another skipped question was operational readiness:

Can the app run cleanly in containers? Is most behavior stateless? Is persistent data externalized? Does startup stay fast and predictable? Does shutdown handle in-flight work gracefully?

If the answer is "not really", Kubernetes adds operational overhead before it adds architectural value.

You end up running the same heavy application in containers with extra orchestration complexity around it. In a small company without internal platform engineering depth, that usually means:

- more CI/CD complexity,
- more deployment logic,
- more observability surface to maintain,
- more on-call stress for the same product throughput.

All this for a bottleneck that may not even exist yet.

## A calmer path that usually works

A better sequence is simple.

First, measure. Simulate realistic future load. Stress ingestion paths. Observe CPU, memory, queue latency, DB behavior, and p95/p99 response times. Identify real limits, not imagined ones.

Second, improve boundaries in the existing code. Separate ingestion concerns from processing concerns from API concerns. Even inside one deployable unit, clear boundaries reduce coupling and expose where independent scaling might later make sense.

Third, containerize for consistency, not fashion. Once packaging is stable, start with simpler orchestration choices such as ECS or Fargate.

For many teams, this already provides sufficient horizontal scaling with less platform overhead than running and operating a full Kubernetes cluster.

## When Kubernetes truly makes sense

Kubernetes is excellent technology when context supports it:

- many teams deploy multiple services independently,
- workload types differ significantly,
- container-first workflows are already mature,
- deployment and rollback discipline is already strong.

In other words, when the organization is ready for that complexity tax and can convert it into delivery speed and resilience.

## The real lesson

This is not an anti-Kubernetes story.

It is a reminder that infrastructure is not a substitute for architecture.

A tightly coupled system does not become loosely coupled because it runs on a cluster. A giant block of code remains a giant block of code, even if it is distributed across ten nodes.

Distributed problems are harder than local ones. Always.

If your team is unsure whether the next scaling step is architecture work, platform work, or both, I can help you map the actual bottlenecks first and choose the simplest path that keeps delivery fast.

[Contact me and let's find the right scaling path](/en/contact).`,
    contentHu: `Mi van, ha a skálázási problémádnak semmi köze az infrastruktúrához?

Mi van, ha valójában az architektúra a szűk keresztmetszet?

Egy cég skálázási kérdéssel keresett meg. A javaslat már megvolt egy külsős tanácsadótól: Kubernetes kell. Modernnek, biztonságosnak és szakmailag erősnek hangzott.

Csak egy gond volt vele: még nem volt rá szükség.

## A helyzet

A cég fizikai eszközökből gyűjtött telemetriai adatokat. Az eszközök adatot küldtek a backendnek, a backend feldolgozta, eltárolta, majd API-n keresztül kiszolgálta.

Papíron ez tipikusan olyan esetnek tűnik, ahol "hamarosan úgyis elkerülhetetlen a cluster". A döntő részlet viszont az volt, hogy az eszközök gyártása lassan futott fel. Annyira lassan, hogy a teljes production terhelés még mindig elfért egy nagy EC2 gépen.

A CPU nem volt plafonon, a memória nem volt kritikus, a tárhely sem fogyott veszélyesen. Nem voltak rendszeres kiesések vagy stabilitási problémák.

Ami volt, az inkább várakozás és nyomás: hamarosan nőni fogunk, tehát most rögtön Kubernetes kell.

## A feltételezés, amit senki nem validált

A legfontosabb mérnöki kérdés elmaradt: mi fog először eltörni?

A CPU? A memória? Az adatbázis? A hálózat?

Nem volt meggyőző terheléses mérés, nem volt kapacitásmodell, nem voltak valós számok. Csak egy logikai lánc:

Több eszköz -> nagyobb terhelés -> Kubernetes.

Ez nem mérnöki döntés. Ez találgatás technikai csomagolásban.

## Vertikális és horizontális skálázás

Alapvetően két út van:

- vertikális skálázás: nagyobb gép, több erőforrás;
- horizontális skálázás: több gép, terheléselosztás.

Ők még a vertikális fázisban voltak, és ez jól működött.

A vertikális skálázás akkor kezd gond lenni, ha az instance-költség elszáll, ha egyetlen gép kiesése már elfogadhatatlan kockázat, vagy ha elérsz technikai plafonokat. Itt még nem erről volt szó.

Vagyis a valódi kérdés nem az volt, hogy "hogyan üzemeltessünk klasztert?", hanem az, hogy "tényleg kell már most egynél több gép?".

## A monolit korlátja

A kellemetlen rész itt jön: az architektúra.

A rendszer egy nagy monolit volt. Ingestion, feldolgozás, API, háttérfolyamatok: egy kódbázisban, közös állapottal, közös adatbázissal.

Ha ezt beteszed Kubernetes alá, valójában mit skálázol?

Mindet egyszerre. Minden alkalommal. Akkor is, ha csak egyetlen komponens szorulna több erőforrásra.

Az infrastruktúra csak azt tudja külön skálázni, amit a design eleve külön kezelhetőre tervezett. Ha minden össze van drótozva, minden együtt nő. A Kubernetes ezt nem oldja meg, csak több node-ra osztja szét ugyanazt a csatoltságot.

## Készen áll az app konténerre?

Egy másik kimaradt kérdés az üzemeltetési készültség volt:

Tud tisztán konténerben futni? Többnyire stateless? Minden tartós adat a processen kívül van? Gyorsan és stabilan indul? Korrektül áll le in-flight munka mellett is?

Ha ezekre a válasz bizonytalan, a Kubernetes előbb ad operatív terhet, mint üzleti értéket.

Ilyenkor ugyanazt a nagy alkalmazást futtatod tovább, csak konténerbe csomagolva, extra orchestration réteggel. Kisebb cégnél, dedikált platform csapat nélkül ez tipikusan ezt jelenti:

- bonyolultabb CI/CD,
- összetettebb deploy logika,
- több monitorozási felület,
- több on-call stressz ugyanarra az outputra.

Mindezt egy olyan szűk keresztmetszetre, ami lehet, hogy még nem is létezik.

## Egy nyugodtabb út

Van egyszerűbb sorrend.

Először mérj. Szimulálj valós jövőbeli terhelést. Terheld az ingestion útvonalat. Nézd a CPU-t, memóriát, queue-latencyt, adatbázis viselkedést és a p95/p99 válaszidőket. Derítsd ki a tényleges limitet.

Másodszor tisztítsd a határokat a jelenlegi kódban. Válaszd szét a begyűjtést, a feldolgozást és az API-felelősségeket. Még egy deploy uniton belül is számít, ha a határok valósak.

Harmadszor konténerizálj konzisztencia miatt, ne trendből. Ha a csomagolás stabil, indulj egyszerűbb orchestrationnel, például ECS-sel vagy Fargate-tel.

Sok csapatnak ez már bőven ad elég horizontális skálázást, jóval kisebb platform overhead mellett, mint egy teljes Kubernetes cluster üzemeltetése.

## Mikor indokolt tényleg a Kubernetes?

A Kubernetes kiváló technológia, ha a kontextus indokolja:

- sok csapat több szolgáltatást deployol egymástól függetlenül,
- eltérő típusú workloadok futnak párhuzamosan,
- a konténeres működés napi rutin,
- a deploy és rollback folyamat már fegyelmezett.

Röviden: amikor a szervezet készen áll a komplexitási adóra, és azt sebességre meg megbízhatóságra tudja fordítani.

## A valódi tanulság

Ez nem Kubernetes-ellenes történet.

Arról szól, hogy az infrastruktúra nem helyettesíti az architektúrát.

Egy szorosan csatolt rendszer nem lesz lazán csatolt attól, hogy clusterben fut. Egy nagy kódtömb nagy kódtömb marad, még ha tíz node-on fut is.

A disztribútált problémák nehezebbek, mint a lokálisak. Mindig.

Ha nem egyértelmű, hogy a következő skálázási lépés inkább architektúra- vagy platformmunka, segítek először feltérképezni a valódi szűk keresztmetszetet, és megtalálni a legegyszerűbb, üzletileg is működő utat.

[Írj, és találjuk meg együtt a jó skálázási irányt](/hu/contact).`,
  },
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
