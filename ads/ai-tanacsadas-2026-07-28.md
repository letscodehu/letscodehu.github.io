# Ad assets — AI tanácsadás

**URL:** https://letscode.hu/hu/ai-tanacsadas *(a bejárás a lokális dev szerveren történt: http://localhost:5177/hu/ai-tanacsadas — az oldal a `feat/ai-consulting-page` branchen van, éles URL csak merge után él)*
**Language:** HU
**Conversion goal:** `Foglalj időpontot` → `/hu/contact/ai` → ingyenes 30 perces beszélgetés foglalása beágyazott naptárból
**Generated:** 2026-07-28

## What the page claims

- **Offer:** AI tanácsadás három formában — (1) AI readiness assessment: rövid, fix scope-ú felmérés, a végén írásos anyag és priorizált next steps; (2) döntéstámogatás konkrét AI-döntésekben, ADR-be rögzített trade-offokkal, second opinion külső szemmel; (3) csapat szintű AI-gyakorlatok: egységes használat, review/tesztelés/minőségi kapuk igazítása, mérés.
- **Audience:** CTO-k és VP of Engineeringek, akikre felülről jön a nyomás; engineering managerek, akiknél mindenki máshogy használja az AI-t; tech leadek egy konkrét AI-döntés előtt. (A `/hu/contact/ai` oldal nevezi meg őket így.)
- **Pain (az oldal szavaival):** „csináljunk valamit az AI-jal”, de nincs siker-definíció; Copilot-licenc mindenkinél, és ennyi az AI-stratégia; három PoC, egyik sem ment production közelébe; review nélkül merge-ölt generált kód; a generált kód nő, a review kapacitás nem; egyetlen vendor egyetlen modelljére épült feature; az AI-ra költött összeg megtérüléséről senki nem tud nyilatkozni.
- **Proof available:** AWS Certified AI Practitioner és Claude Certified Architect – Foundations (mindkettő Credly badge-dzsel linkelve), governance SaaS-nál a kezdetektől AI-alapú fejlesztésben, az elején hands-on, tizenöt év rendszertervezés. **Nincs** ügyfélnév, testimonial, esettanulmány-szám, ROI-adat vagy árazás az oldalon — ezek a hirdetésekben sem szerepelnek.
- **Objections handled („Mire mondok nemet”):** nem vezet be AI-t oda, ahol a valódi gond a hiányzó teszt / kétnapos CI / tisztázatlan ownership; nem épít AI-feature-t board-optikára; nem ígér létszámcsökkenést; nem szállít vendor lock-int, ha az nem tudatos döntés.
- **Primary CTA:** „Foglalj időpontot” (háromszor szerepel az oldalon) → `/hu/contact/ai`. A célon: ingyenes 30 perces beszélgetés, beágyazott naptár, „azzal kezdünk, mit próbáltatok, nem prezentációval”, „ha nálatok most nem az AI a következő lépés, ezt egyenesen meg fogom mondani”.
- **Secondary CTA:** „Kitöltöm a felmérést” → `/hu/quiz` (16 kérdéses AI adoption felmérés, cserébe összesített benchmark).

---

## Angle 1 — Pain-first: nyomás felülről, siker-definíció nélkül

*Grounded in:* „Fentről jön a nyomás, hogy »csináljunk valamit az AI-jal«, de senki nem mondta meg, mi lenne a siker.”

### Google Search RSA

**Headlines (≤30)**
1. AI-nyomás felülről? (19)
2. AI tanácsadás csapatoknak (25)
3. Hol éri meg nálatok az AI? (26)
4. Copilot-licenc nem stratégia (28)
5. Három PoC, nulla production (27)
6. Mi működik, és mi nem (21)
7. AI readiness assessment (23)
8. Írásos anyag a vezetésnek (25)
9. Priorizált next steps (21)
10. Ingyenes 30 perces hívás (24)
11. Foglalj időpontot (17)
12. Független AI tanácsadó (22)
13. Kérj második véleményt (22)
14. Fix scope-ú felmérés (20)
15. Kívülről nézzük meg (19)

**Descriptions (≤90)**
1. Fentről jön a nyomás, hogy legyen AI? Nézzük meg együtt, hol éri meg nálatok. (77)
2. AI readiness assessment: írásos anyag arról, mire használjatok AI-t, milyen sorrendben. (87)
3. Ingyenes 30 perces beszélgetés. Azzal kezdjük, mit próbáltatok, nem prezentációval. (83)
4. Független tanácsadó, nem vendor. Ha nálatok nem az AI a következő lépés, megmondom. (83)

**Display paths (≤15):** /ai-tanacsadas (13) /assessment (10)

**Pinning:** nincs rá szükség. Mind a 15 headline önállóan is értelmes, és pont a keveredésből derül ki, melyik fájdalompont fog. Ha a fiókban brand-védelem indokolja, a 12-es („Független AI tanácsadó”) mehet 1. pozícióba pinelve — de ez csökkenti a tesztelhető kombinációk számát.

### Meta

**Primary text:**
A legtöbb csapatnál nem az a kérdés, hogyan vezessünk be AI-t, hanem hogy egyáltalán hol éri meg.

Fentről jön a nyomás, hogy „csináljunk valamit az AI-jal”, de senki nem mondta meg, mi lenne a siker. Közben van Copilot-licenc mindenkinél, elkészült három proof of concept, és egyik sem ment production közelébe.

Az AI readiness assessment egy rövid, fix scope-ú felmérés: végigmegyünk azon, hol tartotok, mi működött és mi nem. A végén írásos anyagot kapsz arról, mire érdemes nálatok AI-t használni, mire nem, és milyen sorrendben.

Foglalj egy ingyenes 30 perces beszélgetést.

*(580 karakter; a hook az első 96-ban lezárul, tehát a „See more” előtt teljes.)*

**Headline (≤40):** Hol éri meg nálatok az AI? (26)
**Description (≤30):** Ingyenes 30 perces hívás (24)
**CTA button:** Book Now

### Image prompts

**1:1 — Meta feed (1080×1080)**
Abstract isometric illustration of a clean, orderly software architecture — a small grid of connected rounded rectangles and thin connector lines — with a heavy, diffuse mass of glowing pressure pushing down onto it from the top of the frame, slightly distorting the top row of shapes. Composition centered with generous negative space around the grid, subject occupying the middle 60% of the square. Flat vector style with subtle depth, precise geometry, no photorealism, no people. Deep navy-to-near-black background, panels a shade lighter navy, single electric blue accent (#3B82F6) on the connector lines and the pressure mass, off-white highlights. Cool, calm, technical mood with visible tension. No text, no lettering, no numbers, no UI labels, no logos.

**9:16 — Story / Reels (1080×1920)**
Vertical abstract composition: a downward-flowing column of diffuse glowing blue pressure entering from above, meeting a small, precise isometric grid of connected rounded rectangles that holds its shape. Keep the entire subject inside the middle third of the frame; leave the top and bottom thirds as empty dark gradient so overlays and the profile bar do not cover anything. Flat vector style with subtle depth, no photorealism, no people. Deep navy-to-near-black background, one electric blue accent (#3B82F6), off-white highlights. Cool, technical, quietly tense. No text, no lettering, no numbers, no UI labels, no logos.

**1.91:1 — Display / link preview (1200×628)**
Wide abstract illustration: on the left, three faint, unfinished isometric structures fading into the dark background; on the right, one clearly resolved, well-lit isometric structure of connected rounded rectangles. A thin electric blue line runs across the frame linking them, brightening from left to right. Subject weighted to the right two-thirds, left third kept dark and open. Flat vector style, precise geometry, no photorealism, no people. Deep navy-to-near-black background, single electric blue accent (#3B82F6), off-white highlights. Calm, analytical mood. No text, no lettering, no numbers, no UI labels, no logos.

---

## Angle 2 — Contrarian: az sem baj, ha a válasz nem

*Grounded in:* „A legtöbb AI-tanácsadás abban érdekelt, hogy legyen AI-projekt. Én nem.”

### Google Search RSA

**Headlines (≤30)**
1. Nem minden AI-projekt jó (24)
2. AI tanácsadás nemekkel (22)
3. Előbb a teszt, aztán az AI (26)
4. Nem adok el AI-projektet (24)
5. Amikor az AI nem megoldás (25)
6. Az AI felnagyítja a bajt (24)
7. Build vs. buy vs. sehogy (24)
8. Second opinion AI-ügyben (24)
9. Vendor lock-in nélkül (21)
10. AI trade-offok ADR-be (21)
11. Létszámot nem ígérek (20)
12. Ingyenes 30 perc, érdek nélkül (30)
13. Foglalj konzultációt (20)
14. Független AI szakértő (21)
15. Mire mondok nemet (17)

**Descriptions (≤90)**
1. A legtöbb AI-tanácsadás abban érdekelt, hogy legyen AI-projekt. Nálam a nem is válasz. (86)
2. Ha a valódi gond a hiányzó teszt vagy a kétnapos CI, előbb azt javítjuk — nem AI kell. (86)
3. Build vs. buy vs. sehogy: végigvesszük a trade-offokat, ADR-be rögzítve. (72)
4. Ingyenes 30 perces beszélgetés arról, hol tartotok. Egyenes válasz, vendor-érdek nélkül. (88)

**Display paths (≤15):** /ai-tanacsadas (13) /nemek (5)

**Pinning:** a 12-es („Ingyenes 30 perc, érdek nélkül”) érdemes 3. pozícióba pinelni, hogy a kontrariánus üzenet mellett mindig ott legyen a kockázatmentes belépő — enélkül a „nem adok el AI-projektet” hangvétel CTA nélkül maradhat egyes kombinációkban.

### Meta

**Primary text:**
A legtöbb AI-tanácsadás abban érdekelt, hogy legyen AI-projekt. Én nem.

Nem vezetek be AI-t oda, ahol a valódi probléma a hiányzó teszt, a kétnapos CI vagy a tisztázatlan ownership — előbb azt kell megjavítani. Nem építek AI-feature-t azért, mert jól hangzik a board előtt. És nem ígérem, hogy a fejlesztői létszám csökkenthető lesz tőle.

Amit csinálok: kívülről, érdek nélkül végigvesszük a trade-offokat — build vs. buy vs. sehogy —, és ADR-be rögzítjük a döntést.

Ingyenes 30 perces beszélgetés, utána derül ki, van-e értelme folytatni.

*(542 karakter; a nyitó állítás 71 karakter, tehát teljes egészében a „See more” előtt van.)*

**Headline (≤40):** Nem minden AI-projekt éri meg (29)
**Description (≤30):** Egyenes válasz, 30 perc (23)
**CTA button:** Book Now

### Image prompts

**1:1 — Meta feed (1080×1080)**
Abstract flat-vector illustration of five identical glowing pipelines running left to right across the frame; four of them continue and blur out at the edge, while one is deliberately closed off by a clean geometric gate mid-frame, its glow stopping at the barrier. Centered composition, subject filling the middle 70% of the square, generous dark space above and below. Precise geometry, no photorealism, no people, no hands. Deep navy-to-near-black background, panels a shade lighter navy, a single electric blue accent (#3B82F6) for the active pipelines, muted slate gray for the closed one. Confident, restrained mood. No text, no lettering, no numbers, no UI labels, no logos.

**9:16 — Story / Reels (1080×1920)**
Vertical abstract composition: a single glowing blue path descends through the frame and reaches a clean geometric gate that stops it; below the gate the path resumes as a calm, solid line in a different, cooler direction. Keep the gate and both path segments inside the middle third of the frame, top and bottom thirds left as plain dark gradient for overlays. Flat vector style, precise geometry, no photorealism, no people. Deep navy-to-near-black background, one electric blue accent (#3B82F6), muted slate gray secondary. Decisive, calm mood. No text, no lettering, no numbers, no UI labels, no logos.

**1.91:1 — Display / link preview (1200×628)**
Wide abstract illustration: a row of identical glowing blue arrows all pointing right, except one that has been rotated and now points steadily in a different direction, rendered brighter and sharper than the rest. Subject centered horizontally with the diverging arrow slightly right of center; wide dark margins on both sides. Flat vector style, crisp edges, no photorealism, no people. Deep navy-to-near-black background, electric blue accent (#3B82F6) on the diverging arrow, dimmed slate blue on the rest. Independent, matter-of-fact mood. No text, no lettering, no numbers, no UI labels, no logos.

---

## Angle 3 — Credibility-first: architekt szemmel, nem AI-hype-ból

*Grounded in:* „Emellett tizenöt éve rendszereket tervezek — az AI a legutóbbi technológia, amire ugyanaz a trade-off gondolkodás vonatkozik, mint az összes előzőre.”

### Google Search RSA

**Headlines (≤30)**
1. 15 év rendszertervezés (22)
2. AWS AI Practitioner cert (24)
3. Claude Certified Architect (26)
4. AI-döntés? Second opinion (25)
5. Tanácsadó, nem vendor (21)
6. Hands-on AI fejlesztésből (25)
7. Architekt szemmel az AI-ra (26)
8. Ugyanaz a trade-off logika (26)
9. AI tanácsadás CTO-knak (22)
10. Döntéstámogatás AI-ügyben (25)
11. ADR-alapú AI döntések (21)
12. Írásos, védhető döntés (22)
13. Ingyenes 30 perces hívás (24)
14. Foglalj időpontot (17)
15. AI readiness assessment (23)

**Descriptions (≤90)**
1. AWS Certified AI Practitioner, Claude Certified Architect, tizenöt év rendszertervezés. (87)
2. AI-döntés előtt? Kívülről átnézem, érdek nélkül, és leírom hozzá az indoklást. (78)
3. Az assessment végén írásos anyag: mit vizsgáltunk, mi a döntés, és mi az indoklás. (82)
4. Ingyenes 30 perces beszélgetés: kiderül, van-e fit, mielőtt bármiről döntenétek. (80)

**Display paths (≤15):** /ai-tanacsadas (13) /second-opinion (14)

**Pinning:** nincs rá szükség. A hitelesség-headline-ok (1–3, 6) és a döntés-headline-ok (4, 8, 10–12) bármelyik párosításban működnek, és pont ezt érdemes tesztelni.

### Meta

**Primary text:**
Tizenöt éve tervezek rendszereket. Az AI a legutóbbi technológia, amire ugyanaz a trade-off gondolkodás vonatkozik, mint az összes előzőre.

AWS Certified AI Practitioner és Claude Certified Architect – Foundations. Egy governance SaaS-nál a kezdetektől benne voltam az AI-alapú fejlesztésekben, az elején hands-on.

Ha egy konkrét AI-döntés előtt álltok — bevezetés, build vs. buy, vagy egy szállítói javaslat —, kívülről adok rá második véleményt, és leírom hozzá az indoklást is. Ugyanaz a logika, mint egy ADR-nél, csak üzleti olvasónak.

Ingyenes 30 perces beszélgetés.

*(574 karakter; az első mondat 34 karakter, a teljes hook a 137. karakterig tart — ha a placement szigorúbban vág, a második mondat kerülhet külön bekezdésbe.)*

**Headline (≤40):** Second opinion az AI-döntésetekre (33)
**Description (≤30):** 15 év rendszertervezés (22)
**CTA button:** Book Now

### Image prompts

**1:1 — Meta feed (1080×1080)**
Abstract isometric blueprint of a layered software system — three or four clean horizontal layers of rounded rectangles connected by thin vertical lines, drawn with the precision of an architectural drafting plan. One layer is highlighted, as if under review. Centered composition, subject occupying the middle 65% of the square, wide dark margins. Flat vector style with fine line work and subtle depth, no photorealism, no people, no hands. Deep navy-to-near-black background, panels a shade lighter navy, thin electric blue accent lines (#3B82F6), off-white detail strokes. Precise, senior, unhurried mood. No text, no lettering, no numbers, no UI labels, no logos.

**9:16 — Story / Reels (1080×1920)**
Vertical abstract composition: a tall stack of clean architectural layers built from rounded rectangles and fine connector lines, rising through the frame, with one layer lit in electric blue as if being examined. Keep the entire stack within the middle third of the frame; leave the top and bottom thirds as plain dark gradient for overlays. Flat vector style with fine line work, no photorealism, no people. Deep navy-to-near-black background, single electric blue accent (#3B82F6), off-white detail strokes. Precise, calm, authoritative mood. No text, no lettering, no numbers, no UI labels, no logos.

**1.91:1 — Display / link preview (1200×628)**
Wide abstract illustration in the style of an architectural drafting plan: a horizontal system diagram of connected rounded rectangles with fine measurement-style guide lines running beneath it, one node highlighted and traced by a thin electric blue line that continues to the right edge. Subject spanning the middle band of the frame, generous dark space above and below. Flat vector style, crisp fine lines, no photorealism, no people. Deep navy-to-near-black background, electric blue accent (#3B82F6), off-white strokes. Analytical, experienced, quiet-confidence mood. No text, no lettering, no numbers, no UI labels, no logos.
