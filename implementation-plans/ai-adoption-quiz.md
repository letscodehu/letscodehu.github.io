# AI Adoption Quiz – technikai terv és slicing

## Overview / üzleti értéke

Fejlesztőknek szóló, AI adoptionről szóló kvíz a letscode.hu-n. A felhasználó 10–15 kérdésen megy végig, az utolsó lépésben e-mail címet ad meg, majd köszönő képernyőt lát. A benchmark riportot (aggregált eredmények) e-mailben kapja meg, ha összegyűlt ~pár száz válasz. Cél: minősített fejlesztő leadek gyűjtése tréning/tanfolyam ajánlathoz, Facebook hirdetéssel hajtva.

---

## Technikai megközelítés

### Architektúra

```
Böngésző (Vue 3 / vite-ssg)
  → /hu/quiz oldal (új route + prerender path)
  → QuizPage.vue (lépésenkénti kvíz + e-mail step + köszönő screen)
  → POST (reCAPTCHA token + válaszok + email)
      → Új AWS Lambda endpoint
          → Google reCAPTCHA v3 verify API
          → Notion API (deduplikáció + write)
```

Minden frontend pattern a meglévő mintát követi (`SignupPopup.vue`): `fetch` + AbortController timeout + hibaállapotok.

### Adatmodell (Notion DB)

| Mező | Notion típus | Tartalom |
|------|-------------|----------|
| Email | Email | felhasználó e-mail |
| Beküldve | Date | submission timestamp |
| reCAPTCHA score | Number | 0.0–1.0 |
| Válaszok | Rich Text | JSON blob: `{"q1": "...", "q2": 3, ...}` |

### Kvíz adatmodell (frontend)

```ts
type QuestionType = 'single-choice' | 'scale'

interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]   // single-choice esetén
  min?: number         // scale esetén
  max?: number
  minLabel?: string
  maxLabel?: string
}
```

Válaszok egy `Record<string, string | number>` objektumban gyűlnek, ahol a kulcs a question `id`.

### Kulcsdöntések

- **Csak `/hu/quiz`**: A route a meglévő `childRoutes` tömbhöz kerül `quiz` path-szal. Az `/en/quiz`-t nem adjuk a prerender paths-hoz és nem kap sitemap bejegyzést; ha valaki mégis felkeresi, a Vue komponens HU-ra redirect-el (egyszerűbb, mint lang guard).
- **reCAPTCHA v3 betöltés**: `useHead` / script tag a QuizPage-en, csak kliens oldalon (`import.meta.env.SSR` guard), site key env változóból (`VITE_RECAPTCHA_SITE_KEY`).
- **Deduplikáció Lambda-ban**: Notion query emailre → ha találat, 409 visszaküldés. (Notion query lassabb, mint egy saját DB, de az alacsony submission volumen miatt elfogadható.)
- **Válaszok JSON-ként**: Egyszerűbb, mint 15 külön Notion property. Az aggregáláshoz a Notion export / bulk query elegendő.
- **Lambda URL**: `QUIZ_SUBMIT_API_URL` konstans a `src/config.ts`-ben, a meglévő pattern szerint.

### Kockázatok / ismeretlenek

| Kockázat | Melyik slice validálja |
|----------|----------------------|
| Notion API rate limit / latencia | Slice 1 (első valós write) |
| reCAPTCHA v3 SSR-compat (script betöltés vite-ssg alatt) | Slice 3 |
| Notion query e-mail dedup teljesítménye nagy adatmennyiségnél | Slice 4 (de a volumen miatt elhanyagolható) |

### Feltételezések

- A Lambda függvényt a fejlesztő hozza létre manuálisan (Node.js runtime, AWS Lambda URL-lel, CORS engedélyezve).
- Notion integration token és DB ID env változókként kerül a Lambdába.
- reCAPTCHA site key és secret key be van szerezve, site key `VITE_RECAPTCHA_SITE_KEY` env változóként.
- A 10–15 kérdés tartalmát a fejlesztő tölti ki (nem a terv része).
- A köszönő képernyőn nincs azonnali személyes eredmény, csak visszaigazolás.
- Mobil-first stílus a meglévő CSS custom properties-szel (nincs külső UI lib).

---

## Vertical slices (sorrendben)

| # | Slice | Értéke | Demo | Függőség |
|---|-------|--------|------|----------|
| 1 | Walking skeleton | Route + 1 kérdés + e-mail + Notion write | `/hu/quiz` megnyitható, 1 kérdés + email → adat Notionben | — |
| 2 | Teljes kérdésor + progress bar | Mind a 10–15 kérdés kitölthető | Végigpörgés, back/next, progress bar helyesen mutat | Slice 1 |
| 3 | reCAPTCHA v3 | Spam-védelem | Érvénytelen token esetén Lambda elutasít | Slice 1 |
| 4 | Deduplikáció | Ugyanaz az email csak egyszer küldhet | Második beküldés ugyanazzal az emaillel → hibaüzenet | Slice 1 |
| 5 | SSG + produkciós wiring | Megjelenik a build outputban, sitemap helyes | `npm run build` sikeres, `/hu/quiz` a prerender path-ok között | Slice 1–4 |

---

## Slices részletesen

### Slice 1 — Walking skeleton (végponttól végpontig)

**Értéke:** Bizonyítja, hogy a route, a Vue komponens, a Lambda hívás és a Notion write egymáshoz illeszkednek. Minden további slice erre épül.

**Demo / elfogadás:** Megnyitom a `/hu/quiz`-t, látok 1 hardcoded kérdést, megadom az emailt, elkülöm → köszönő képernyő jelenik meg → a Notion DB-ben megjelenik egy sor az emaillel és a válasszal.

**Feladatok:**
- [x] `src/pages/QuizPage.vue` létrehozása (minimális: 1 hardcoded kérdés, email input, submit gomb, köszönő állapot)
- [x] Route hozzáadása `src/router/index.ts`-hez (`path: 'quiz'`, komponens: `QuizPage`)
- [x] Lambda kód létrehozása (`lambda/quiz-submit/index.mjs`): fogad `{ email, answers }`, írja Notionbe, visszaad 200/500
- [x] `QUIZ_SUBMIT_API_URL` + timeout konstans hozzáadása `src/config.ts`-hez
- [ ] Notion DB létrehozása (manuális lépés – lásd `lambda/quiz-submit/README.md`)
- [x] `/hu/quiz` prerender path hozzáadása `src/seo/prerender-paths.ts`-hez (HU_STATIC_ALIASES)
- [x] Fetch logika a QuizPage-ben: POST → 200 → köszönő képernyő / 409 → duplikát hiba / hálózati hiba

### Slice 2 — Teljes kérdésor + progress bar

**Értéke:** A kvíz teljes egészében kitölthető, minden kérdéstípus működik, a felhasználó tudja hol jár.

**Demo / elfogadás:** Végigmegyek az összes kérdésen (single choice + scale), a progress bar helyesen mutatja az aktuális lépést (pl. "4 / 12"), vissza tudok lépni. Az utolsó lépés az e-mail.

**Feladatok:**
- [x] `src/data/quiz-questions.ts` létrehozása: `QuizQuestion` típus + 12 valós kérdés (single choice + scale mix)
- [x] `SingleChoiceQuestion.vue` komponens: opciók listája, kiválasztott állapot, v-model
- [x] `ScaleQuestion.vue` komponens: 1–5 skála, min/max label, v-model
- [x] Progress bar a QuizPage headerben: "X / Y" lépésszámláló + animált sáv
- [x] QuizPage.vue frissítve: quiz-questions.ts import, SingleChoiceQuestion + ScaleQuestion használata
- [x] Mobilon és dark mode-ban helyes megjelenés

### Slice 3 — reCAPTCHA v3

**Értéke:** Automatizált spam/tömeges beküldés ellen védelem, szerver oldalon validálva.

**Demo / elfogadás:** Normál kitöltésnél a beküldés sikeres. Ha a reCAPTCHA score alacsony (manuálisan tesztelve alacsony threshold-dal), a Lambda 422-t ad vissza és a kliens hibaüzenetet mutat.

**Feladatok:**
- [ ] reCAPTCHA v3 script betöltése QuizPage-ben (csak böngészőben: `if (!import.meta.env.SSR)`)
- [ ] `VITE_RECAPTCHA_SITE_KEY` env változó hozzáadása `.env` / `.env.production`-höz
- [ ] `grecaptcha.execute(siteKey, { action: 'quiz_submit' })` hívás beküldés előtt, token csatolása a POST body-hoz
- [ ] Lambda: `fetch` a Google reCAPTCHA verify API-hoz (`https://www.google.com/recaptcha/api/siteverify`)
- [ ] Lambda: score < 0.5 esetén 422 visszaküldés
- [ ] Kliens: 422 esetén "Nem sikerült ellenőrizni, próbáld újra" hibaüzenet
- [ ] `RECAPTCHA_SECRET_KEY` Lambda env változóként dokumentálva

### Slice 4 — Deduplikáció

**Értéke:** Ugyanaz az e-mail cím csak egyszer küldhet be, megakadályozza a duplikált leadeket.

**Demo / elfogadás:** Első beküldés sikerül. Második beküldés ugyanazzal az emaillel → a kliens "Ezzel az e-mail címmel már töltötted ki a kvízt." üzenetet mutat.

**Feladatok:**
- [ ] Lambda: Notion query emailre beküldés előtt (`filter: { property: 'Email', email: { equals: email } }`)
- [ ] Lambda: ha van találat → 409 visszaküldés `{ error: 'duplicate' }` body-val
- [ ] Kliens: 409 esetén dedikált hibaüzenet (nem generikus)

### Slice 5 — SSG + produkciós wiring

**Értéke:** Az oldal megjelenik a build outputban, indexelhető, a sitemap tartalmazza.

**Demo / elfogadás:** `npm run build` hiba nélkül lefut, a `/hu/quiz` megjelenik a generált fájlok között és a `sitemap.xml`-ben.

**Feladatok:**
- [ ] `/hu/quiz` végleges helye `prerender-paths.ts`-ben ellenőrizve (nem kerülhet `STATIC_SEGMENTS`-be, mert az EN-re is generálna)
- [ ] `generate-sitemap.ts` ellenőrzése: `/hu/quiz` bekerül, `/en/quiz` nem
- [ ] Produkciós Lambda URL beírva `src/config.ts`-be
- [ ] `VITE_RECAPTCHA_SITE_KEY` production value beállítva
- [ ] Manuális mobil + dark mode smoke test

---

## Sorrend indoklása

A **Slice 1** (walking skeleton) az összes többi előfeltétele: validálja a Lambda–Notion összeköttetést, ami a legnagyobb ismeretlen. Ha ez nem működik (pl. Notion API rate limit, CORS probléma), korán kiderül.

A **Slice 2** (teljes kérdésor) frontend-only munka, nem blokkolja a backend fejlesztést — párhuzamosan is futhat Slice 3-mal.

A **Slice 3** és **Slice 4** (reCAPTCHA + dedup) egymástól független Lambda módosítások, bármelyik jöhet előbb.

A **Slice 5** (SSG) a legutolsó, mert csak akkor releváns, ha minden funkció stabil.

---

## Nyitott kérdések

- A kvíz kérdéseinek szövegét és válaszlehetőségeit te töltöd ki a `quiz-questions.ts`-ben.
- A Notion DB ID és integration token Lambda env változóként kerül be — ezeket te hozod létre és konfigurálod.
- Ha az `/en/quiz` route-ot teljesen ki akarod zárni (ne legyen elérhető 404 helyett redirect), adj hozzá egy `beforeEnter` guard-ot a route-hoz, ami `lang !== 'hu'` esetén átirányít.
