# Requirement: AI adoption felmérés – kérdések átdolgozása

## Summary
A „Magyar fejlesztők és az AI – 2026-os felmérés" kérdéseit lead-szegmentálásra hangoljuk. Elsődleges cél a **B2B lead-gyűjtés** (céges tréning/workshop + AI-bevezetési tanácsadás): a kérdések szűrjék ki a döntéshozókat, mérjék a cég AI-érettségét és fájdalompontjait, miközben elég érdekes adatot adnak egy hiteles, megosztható benchmark riporthoz (a csali). Hossz: 12 kérdés.

## Scope
- **In:** kérdés-szett cseréje `src/data/quiz-questions.ts`-ben; új `multi-choice` kérdéstípus + komponens; ehhez a Lambda (quiz-submit) tömb-válasz kezelése.
- **Out:** pontozás/„AI-érettség szint" visszajelzés (a felmérés továbbra is e-mailre váltó adatgyűjtés, nem önértékelő kvíz); explicit befektetési-szándék kérdés; angol fordítás (HU-only marad).

## Requirements (végleges kérdéssor, ebben a sorrendben)

**Engaging nyitás (benchmark):**
1. `q01_usage_frequency` (single) – „Milyen gyakran használsz AI eszközöket a munkádban?" → Egyáltalán nem / Alkalmanként (havonta néhányszor) / Rendszeresen (hetente többször) / Minden nap, a legtöbb feladathoz
2. `q02_tools` (**multi-choice, ÚJ**) – „Melyik AI eszközöket használod fejlesztéshez? (több is választható)" → GitHub Copilot / Cursor / Claude Code / Codex (OpenAI) / Windsurf / Kiro / Gemini CLI / Egyéb agent / kódoló eszköz / Chat-alapú asszisztens (ChatGPT, Claude, Gemini) / Nem használok AI eszközt — *kódoló agentek a fókuszban; a chat-alapú eszközök gyűjtő kategóriába*
3. `q03_use_case` (**multi-choice**) – „Mire használod az AI-t a munkádban? (több is választható)" → Kódgenerálás / autocomplete · Kód review és refaktor · Dokumentáció és tesztek · Hibakeresés / magyarázat · Nem használom AI-t a munkámhoz (kizáró)
4. `q04_time_saved` (single) – „Átlagosan mennyi időt spórol naponta?" → Nem spórol / <30 perc / 30 perc–1 óra / >1 óra / Nem használok AI eszközt

**Attitűd + céges érettség (szegmentálás):**
5. `q05_trust` (scale 1–5) – „Mennyire bízol felülvizsgálat nélkül az AI által generált kódban?" (Egyáltalán nem ↔ Teljesen)
6. `q06_company_support` (scale 1–5) – „Mennyire támogatja a céged az AI eszközök használatát?" (Tiltja/nem tudja ↔ Aktívan ösztönzi)
7. `q07_company_policy` (single) – „Van-e formális AI használati policy a cégednél?" → Igen, betartják / Van, de senki sem követi / Nincs, de terveznek / Nincs, és nem is terveznek
8. `q08_blocker` (single) – „Mi a legnagyobb akadálya az AI szélesebb körű használatának?" → Biztonsági/adatvédelmi · Minőség/megbízhatóság · Költség/budget · Hiányzó tudás/tapasztalat (skill-gap) · Vezetői támogatás/kultúra hiánya · Hiányzó engedély/licenc · Nincs akadály
9. `q09_team_need` (**átszabott q12**, single) – „Mi segítené leginkább a csapatod AI-használatát?" → Egységes gyakorlat / belső guideline-ok · Képzés / tréning a csapatnak · Megfelelő eszközök kiválasztása és bevezetése · Policy / governance / biztonsági keretek · Semmi, jól működik

**Demográfia a végén (alacsony lemorzsolódás):**
10. `q10_role` (**ÚJ**, single) – „Mi a szereped a fejlesztésben?" → Junior fejlesztő / Medior fejlesztő / Senior fejlesztő / Tech lead / architect / Engineering manager / CTO / VP / cégtulajdonos / Egyéb (PM, QA, DevOps…) — *a lead+ szint = forró B2B lead*
11. `q11_company_type` (single) – „Milyen típusú szervezetnél dolgozol?" → Startup/scale-up · Nagyvállalat/enterprise · Ügynökség/szoftverház · Freelancer/saját vállalkozás
12. `q12_team_size` (single) – „Hány fős fejlesztői csapatban dolgozol?" → Egyedül · 2–10 fő · 11–50 fő · 50 fő felett

**Kiesik:** régi `q11_training` (átfedi a támogatás/policy/szükséglet kérdéseket).

## Inputs / Outputs
- Adatmodell bővül: `QuestionType` += `'multi-choice'`; a `multi-choice` válasz `string[]`.
- `answers` payload a Lambda felé: a `q02_tools` értéke tömb, a többi string/number marad. A `quiz-submit` Lambda-nak ezt validálnia/tárolnia kell.

## Edge cases & error handling
- `multi-choice`: a „Nem használok AI eszközt" választás kizárja a többit; legalább 1 elem kötelező a továbblépéshez.
- `canGoNext` multi-choice esetén: legalább egy kijelölt elem.

## Non-functional
- Új `MultiChoiceQuestion.vue` komponens a meglévő `SingleChoiceQuestion`/`ScaleQuestion` mintájára; SSG/prerender változatlan; HU-only.

## Acceptance criteria
- [ ] 12 kérdés a fenti sorrendben és szöveggel `quiz-questions.ts`-ben.
- [ ] `multi-choice` típus + komponens működik, tömböt ad vissza.
- [ ] Lambda elfogadja és tárolja a tömb-választ (`q02_tools`).
- [ ] Van szerep- és „csapat-szükséglet" kérdés (döntéshozó- és consulting-szűrő).
- [ ] A felmérés végén ugyanúgy e-mail-lépés + köszönő képernyő.

## Open questions / assumptions
- Multi-choice „kizáró" opció logikája: a „Nem használok AI eszközt" kizárja a többit.
- Feltételezés: a Lambda séma szabadon bővíthető (nem fix kulcsokra validál).
