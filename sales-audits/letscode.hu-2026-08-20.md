# Sales funnel audit — letscode.hu (2026-08-20)

**URL:** https://letscode.hu/hu/ (+ /hu/consulting, /hu/contact, /hu/contact/ai, /hu/about, a Google Calendar foglaló)
**Szempont:** ugyanaz, mint 08-19-én — online konzulting az elsődleges üzletág, a workshop háttérben. Feltételezett látogató: CTO / VP Eng / engineering manager, hidegebb forgalom, első találkozás.
**Amit megnéztem:** desktop (1440×900) és mobil (390×844), az élő oldal, a `consulting-first-funnel` PR (bed43f7) utáni állapot. A foglalást most sem küldtem el.

## Verdict

**A pozicionálás megtörtént.** A kezdőlap, a `/hu/consulting`, a navigáció, a lábléc-alcím, a hero és a foglalási esemény mind konzulting-first lett. A `/hu/consulting` ma az oldal legjobb lapja — jobb, mint az `/hu/ai-consulting`, ami tegnap még a minta volt. A tegnapi 11 pontból 6 teljesen, 2 részben megoldódott.

Ami maradt, az viszont egy jellegzetes mintázatba áll össze: **a funnel eleje átépült, a vége nem.** Minden konzulting CTA — mind a négy a `/hu/consulting`-on, a hero gombja, a kezdőlap gombjai — ugyanoda mutat: `/hu/contact`. És a `/hu/contact` az egyetlen oldal, ami kimaradt az átírásból. Ott ez fogadja a látogatót:

> *"Ha engineering csapatokért felelsz, és felmerült a **képzés** vagy fókuszált tanácsadási együttműködés gondolata..."*

Vagyis a látogató végigolvas egy oldalt arról, hogy kívülről megnézed a rendszert — aztán a foglalási oldalon megint azt olvassa, hogy képzést árulsz. Ez most a legdrágább hely a funnelben, mert a legmelegebb forgalom ér ide.

A második maradék: **ár még mindig nincs sehol.** A "Felmérés" ajánlatnak azóta van neve, hossza, formátuma és konkrét kimenete — minden megvan, kivéve a számot.

---

## Ami megoldódott (tegnapi számozás szerint)

| # | Tegnapi probléma | Állapot |
|---|---|---|
| 1 | A konzulting oldal a workshop alá rendeli magát | **Megoldva.** Új H1, saját problémafelvetés, a "Hogyan egészíti ki a képzéseket" szekció a lap aljára került egyetlen blokként ("És ha inkább képzés kell?"). Nav sorrend: Tanácsadás → AI → Képzés. Lábléc-alcím megfordult. |
| 2 | Nem derül ki, hogy online | **Megoldva.** Hero: *"Távolról dolgozom: videóhívások közös képernyővel a ti kódbázisotokon, a végén írásos anyaggal."* Külön "Hogyan dolgozom távolról" szekció a konzulting oldalon, read-only hozzáférés kimondva. |
| 3 | A konzulting ajánlatnak nincs alakja | **Részben.** Név ✓, időtartam ✓ (2–3 hét), formátum ✓ (3× 90 perces hívás, lebontva), kimenet ✓ (írásos anyag, vezetőségnek is bemutatható). **Ár: nincs.** |
| 4 | Nulla bizonyíték a konzulting úton | **Részben.** Az esettanulmány most ki van emelve a konzulting oldalra saját kártyával ✓. Idézet, ügyfélnév, Credly-badge továbbra sincs rajta. |
| 5 | A tanácsadó névtelen | **Megoldva a konzulting oldalon.** *"Papp Krisztián vagyok. Tizenöt éve tervezek és építek rendszereket..."* + arckép. A `/hu/about`-on viszont **nem** — lásd lent. |
| 6 | Elköteleződéskor angolra vált | **Nagyrészt.** Calendly → Google Calendar. Az esemény neve magyar (*"Első Konzultáció"*), a leírás magyar és konzulting-fókuszú, a Meet meg van nevezve, a második süti-banner eltűnt. **A widget UI viszont angol** — lásd 4. pont lent. |
| 7 | Egyetlen konverziós lehetőség | **Részben.** A State of AI Dev riport felkerült a kezdőlapra alacsonyabb küszöbű lépcsőnek ✓. A `/hu/consulting`-on továbbra sincs semmi a hívás mellett. |
| 8 | A konzulting lebeszéli a saját ismétlődő bevételét | **Megoldva.** *"Ahol a bevezetés folyamatos külső szemet igényel, ott havi kerettel dolgozunk tovább — havi két session."* A törött mondat eltűnt. |
| 9 | Mobilon a süti-banner ráfekszik a CTA-ra | **Megoldva.** Banner 216 px → 122 px. Hero CTA-k: 471–512 és 524–564 px, a banner 710-nél kezdődik. A tegnapi 15 px-es margóból 146 px lett, mindkét gomb látszik. |
| 10 | Mobilon a naptár szűk dobozban, 1131 px-re | **Megoldva.** Mobilon az iframe `display: none`, helyette teljes szélességű "Időpont foglalása" gomb a Google saját oldalára. |
| 11 | A navigáció a képzésnek kedvez | **Megoldva.** Tanácsadás az első elem, az "Együttműködési formátumok" alá bekerült a "Tanácsadás részletei" gomb. |

**Amit külön érdemes kiemelni:** a `/hu/consulting` "Mire mondok nemet" szekciója (*"A tanácsadásban az a jó üzlet, ha minél tovább tart. Nálam nem ez a cél."*) és a "Felmérés" hívásonkénti lebontása a legjobb eladási szöveg az egész oldalon. Az `/en/consulting` ugyanezt megkapta.

---

## Ami maradt (prioritási sorrendben)

### 1. A `/hu/contact` kimaradt az átírásból — és minden CTA oda visz — magas

**Ami ott van** (`src/i18n/hu.json:838–854`):
- Intro: *"...felmerült a **képzés** vagy fókuszált tanácsadási együttműködés gondolata..."* — a képzés van elöl.
- "Kiknek érdemes jelentkezni?" — 3 pontból **2 képzésre céloz**: *"...akik csapat szintű képzést terveznek"*, *"HR vagy L&D partnereknek, akik technikai képzéseket szerveznek"*. Egyetlen pont szól szállítási/architekturális problémáról.
- "Mire számíthatsz?" — 3 pont, és **egyik sem mondja ki, hogy a hívás ingyenes**.

**Az összehasonlítás, ami fáj:** a `/hu/contact/ai` ugyanennek a lapnak a jobb verziója, és mellette van a fájlban:

| | `/hu/contact` | `/hu/contact/ai` |
|---|---|---|
| Ingyenes kimondva | ❌ | ✅ *"Ez a beszélgetés ingyenes"* |
| Gomb szövege | "30 perces beszélgetés foglalása" | "**Ingyenes** 30 perces beszélgetés foglalása" |
| Elvárás-pontok | 3, általános | 5, konkrét (mit próbáltatok, mikor beszélünk pénzről, mikor mondok nemet) |
| Célzás | 2/3 képzésre | 3/3 a valódi vevőre |

**Miért kerül pénzbe:** a fő ág foglalási oldala gyengébb, mint a mellékágé. Aki átolvasta a konzulting oldalt és rákattint, egy olyan lapra ér, ami visszaminősíti azt, amit épp elolvasott — és nyitva hagyja a "vajon ez fizetős?" kérdést pont a gombnyomás előtt.

**Fix:** vidd át az `aiExpectations` / `aiResponse` mintát a sima ágra. Az `aiResponse` négy pontja szó szerint működik konzultingra is (a leírás a Google Calendar eseményben már így is szól — ott megvan az *"Időről és pénzről csak ezután beszélünk"* és a *"nem külső tanácsadó kell, ezt egyenesen megmondom"*, csak az oldalról hiányzik). Az intro kezdjen a szállítási problémával, a képzés maradjon ki vagy menjen a végére. A "Kiknek érdemes" 1. és 3. pontja írandó át.

### 2. Ár még mindig nincs sehol a konzulting úton — magas

**Ami ott van:** a "Felmérés" ajánlat mindent megkapott a tegnapi listáról **az árat kivéve**: 2–3 hét, három 90 perces videóhívás, hívásonkénti bontás, írásos anyag a végén, "Ez a szokásos belépő". A folytatásnál is: *"havi két session"* — de forint nincs. A teljes oldalon 0 db `Ft`.

Közben a workshop oldalon továbbra is ott van ár, határidő és garancia — vagyis az oldalon **még mindig a háttérbe tolt termék az egyetlen, aminek ára van**.

**Miért kerül pénzbe:** az ajánlat most már elég konkrét ahhoz, hogy a vevő el tudja képzelni — épp ezért az ár hiánya most feltűnőbb, mint tegnap. Aki így is foglal, annak egy része árat jön kérdezni; aki nem mer, az azért nem, mert nem tudja, a saját ligájában van-e.

**Fix:** egy sáv is elég a "Felmérés" blokk aljára (*"Tipikusan X–Y Ft + áfa"* vagy *"XXX Ft-tól"*), és egy havi keretszám a folytatáshoz. Nem kell árlista — egy nagyságrend kell.

### 3. Bizonyíték: egy esettanulmány, nulla emberi szó — magas

**Ami ott van:** a `/hu/consulting`-on egy esettanulmány-kártya ✓, azon túl semmi: 0 idézet (`<blockquote>`: 0), 0 ügyfélnév, 0 Credly-badge, 0 logó.

**Ahol viszont ott vannak a badge-ek:** a `/hu/about`-on — mind a négy AWS/Claude tanúsítvány, élő Credly linkkel. Vagyis a hitelesítő jelek azon az oldalon ülnek, ahová a konzulting-forgalom nem megy, és hiányoznak arról, ahol a döntés születik.

**Fix:**
- A négy badge (vagy legalább a Solutions Architect + AI Practitioner) kerüljön át/duplán a `/hu/consulting` "Miért tőlem" szekciója mellé.
- 2–3 rövid idézet korábbi megbízótól — ha NDA miatt nincs név, akkor is működik a *"egy ~40 fős fintech engineering szervezet CTO-ja"* forma konkrét eredménnyel.
- Az esettanulmány számai (6× tesztlefedettség, ~30 000 DAU) elbírnák, hogy a kártya fölött külön kiemelt számként is megjelenjenek.

### 4. A foglaló widget angol — egyetlen paraméterrel javítható — közepes

**Ami ott van:** a beágyazott Google Calendar felülete végig angol: *"30 min appointments"*, *"Select an appointment time"*, *"Show more"*, S/M/T/W/T/F/S fejlécek, és **12 órás időformátum** (*"3:00pm"*). A magyar szöveg és a magyar eseménynév közé így beékelődik egy angol UI.

**Kipróbáltam:** a `&hl=hu` paraméter az iframe URL-jére rakva a teljes widgetet magyarrá teszi — *"Válassza ki a találkozó időpontját"*, *"30 perces találkozók"*, hétfővel kezdődő hét, **24 órás formátum** (`09:00`, `15:30`). Egy karakternyi munka:

`src/config.ts:44, 50, 58, 64` — mind a négy `?gv=true` végére `&hl=hu` (magyar oldalon; az `/en/` ágon `&hl=en`). A `bookingUrl` rövidlinkeket (`calendar.app.google/...`, `config.ts:45, 51, 59, 65`) érdemes ugyanígy ellenőrizni, mert mobilon **azok** a belépési pontok.

**Miért kerül pénzbe:** a "3:00pm" nem hiba, csak idegen — de pont a legutolsó lépésnél jelzi, hogy egy külföldi eszközön vagy, és a 12 órás formátumot magyar szemmel egy pillanatra dekódolni kell. Olcsóbb javítás nincs a listán.

### 5. A `/hu/about` lett az új elmaradt oldal — és zsákutca — közepes

**Ami ott van:**
- A "Papp Krisztián" név a látható szövegben **0-szor szerepel** — pontosan úgy, ahogy tegnap az egész oldalon. Csak a kép `alt`-jában van meg. A lap így kezd: *"Senior tanácsadóként és trénerként dolgozom..."* (`hu.json:797`).
- *"Több éves tapasztalat termékfejlesztő csapatokkal"* (`hu.json:801`) — miközben a `/hu/consulting` már azt írja, *"Tizenöt éve"*. Ugyanaz az ember, két különböző önéletrajz.
- **Egyetlen CTA sincs az oldalon.** 9 link van rajta: YouTube, Vimeo, Sessionize, SoundCloud, 4 Credly. `/hu/contact`-ra és `/hu/consulting`-ra **nulla**.

**Miért kerül pénzbe:** a "Rólam" a klasszikus utolsó ellenőrzés hideg vevőnél — megnézi, kivel ülne le. Most gyengébb képet ad magadról, mint a konzulting oldal, és nincs rajta út tovább.

**Fix:** a `consulting.whyMe` bekezdés (név + tizenöt év + "közvetlenül velem dolgoztok") legyen a Rólam nyitómondata is, a "Több éves tapasztalat" helyére konkrét szám és 2–3 valódi kontextus, a lap aljára pedig egy "Foglalj időpontot" blokk.

### 6. A meta description-ök a pénzt hozó oldalakon még képzés-first — közepes

**Ami ott van** (`src/i18n/hu.json:996–1008`):

| Oldal | Jelenlegi description |
|---|---|
| `home` | *"**Terem- és online képzés**, valamint tanácsadás..."* |
| `about` | *"...független **képzés** és tanácsadás..."* |
| `contact` | *"...**képzés**, workshop vagy tanácsadás egyeztetéséhez."* |
| `caseStudies` | *"...valós **képzési** és tanácsadási munkából..."* |
| `consulting` | *"Külső nézőpont arra, mi lassítja a szállítást..."* ✅ |

Plusz a kezdőlap `<title>`-je: **"Kezdőlap | Letscode Solutions Kft"**.

**Miért kerül pénzbe:** ez az, amit a Google mutat — a márkakeresésre és a kezdőlapra érkezőknek a találati oldalon még mindig képzés a felütés, és a legerősebb SEO-hely ("Kezdőlap") üresen áll. A pozicionálás a lapon megtörtént, a keresőben nem.

**Fix:** a `consulting` description mintájára a másik négy is; a home title legyen a hero állítása, ne "Kezdőlap".

### 7. A `/hu/consulting`-on egyetlen kimenet van: hívásfoglalás — közepes

**Ami ott van:** az oldal 6 linkjéből 3 a `/hu/contact`, 1 az esettanulmány, 1 az AI oldal, 1 a képzés. Alacsonyabb küszöbű lépés — riport, checklist, e-mailes válasz — **nincs**. A State of AI Dev riport felkerült a kezdőlapra és ott van az AI ágon is, de erről az oldalról hiányzik.

**Miért kerül pénzbe:** aki elolvassa a "Felmérés" leírását és még nem áll készen naptárazni, most nyomtalanul távozik. Nincs e-mail-cím, nincs újramegkeresés.

**Fix:** a "Mire mondok nemet" után egy alacsonyabb küszöbű blokk — akár csak a riport ugyanabban a formában, ahogy a kezdőlapon van, akár egy 1 oldalas "mit nézz meg, mielőtt hívsz" checklist e-mailért cserébe.

### 8. Mobilon a foglalás gombja 1130 px-re van — alacsony

**Ami ott van (390×844):** `/hu/contact` teljes magassága 1755 px, az "Időpont foglalása" gomb 1130 px-nél. Előtte a "Kiknek érdemes jelentkezni?" (415) és a "Mire számíthatsz?" (789) blokk.

**Fix:** a gomb kerüljön feljebb, közvetlenül az intro alá (a két szövegblokk mehet alá) — így a legmelegebb látogató egy görgetésen belül tud foglalni. Ez a tegnapi 10. pont maradék fele.

### 9. Apróságok — alacsony

- **Törött mondat a kezdőlapon** (`hu.json:80`): *"**Megbízható szállítási**: CI/CD, amely gyors és megbízható..."* — hiányzó szó, plusz "megbízható" kétszer egy mondatban.
- **Az esettanulmány nincs benne a navigációban és a láblécben sem** — csak a `/hu/consulting`-ról és a blogról érhető el. Egy "Esettanulmányok" menüpont vagy lábléc-link olcsó.
- **`seo.defaultOgImageAlt`** (`hu.json:994`) is még *"képzés és tanácsadás"* sorrendű.

---

## Ami már most működik — ezekhez ne nyúlj

- **A `/hu/consulting` szerkezete.** Probléma → "Ismerős helyzetek" a vevő szavaival → három szolgáltatásblokk → megnevezett belépő ajánlat lebontva → "Hogyan dolgozom távolról" → folytatás → "Mire mondok nemet" → név és arc → esettanulmány. Ez most az oldal etalonja; ha bármit másolsz máshová, ezt másold.
- **"Mire mondok nemet."** Az öt pont közül a *"Nem javaslok újraírást, ha a meglévő rendszer megjavítható"* és a *"Nem veszem át a döntéseiteket"* pont az, amitől egy CTO el meri hinni, hogy nem eladni akarsz neki.
- **A "Felmérés" hívásonkénti lebontása.** Az, hogy a második hívásról kimondod, *"nem prezentációt nézünk, hanem a ti rendszereteket"*, többet ér, mint bármilyen módszertani leírás.
- **A Google Calendar esemény leírása.** Magyar, konzulting-fókuszú, és megvan benne az az elvárás-kezelés, ami magáról a `/hu/contact` oldalról hiányzik. (Innen érdemes visszamásolni az oldalra — nem fordítva.)
- **A mobil süti-banner és a mobil foglalógomb.** Mindkettő rendben van most, ne nyúlj hozzájuk.
- **A hero "Távolról dolgozom" mondata.** Konkrét (videóhívás, közös képernyő, a ti kódbázisotok, írásos anyag) — pont annyi, amennyi kell.
- **Az időpont-kínálat:** másnaptól foglalható, 09:00–16:30, napi 16 sáv. Nem itt van a szűk keresztmetszet.

## Amit nem ellenőriztem

- **Számokat most sem láttam** — ez egy látogatás, nem analytics. A sorrend a súrlódás nagyságán alapul, nem mért konverzión.
- **A foglalást nem küldtem el** — a visszaigazoló e-mailt és a hívás utáni követést továbbra sem láttam. Az esemény leírása alapján ez a lépés jónak tűnik, de nem tesztelt.
- **Az `/en/` ág:** a `/en/consulting` megkapta ugyanazt az átírást (a H1 és a struktúra stimmel), de végig nem jártam. Ha az online konzulting nemzetközi piacra is megy, külön audit kell.
- **A `/hu/training` és a workshop fizetési folyamat** — a workshop háttérbe került, de ha marad, az külön funnel.
- **Nem tudom, hova landol a fizetett forgalom.**
- **Valódi mobileszközön nem teszteltem**, csak 390×844-es viewportban.
