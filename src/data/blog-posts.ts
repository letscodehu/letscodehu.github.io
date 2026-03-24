export interface BlogPost {
  slug: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  contentEn: string
  contentHu: string
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
    contentEn: `If you'd rather watch this as a video, [watch it on YouTube](https://www.youtube.com/watch?v=C4pPAub7ZbM).

Your developers are fast. Too fast, actually.

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
    contentHu: `Ha inkább videón néznéd meg, [itt megtalálod YouTube-on](https://www.youtube.com/watch?v=C4pPAub7ZbM).

A fejlesztőid gyorsak. Talán túl gyorsak is.

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
]

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug)
}
