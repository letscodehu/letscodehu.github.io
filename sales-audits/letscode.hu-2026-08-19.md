# Sales funnel audit — letscode.hu (2026-08-19)

**URL:** https://letscode.hu/hu/ (+ /hu/consulting, /hu/ai-consulting, /hu/contact, /hu/contact/ai, /hu/about)
**Szempont:** online konzulting az elsődleges üzletág, a workshop háttérbe kerül. Feltételezett látogató: CTO / VP Eng / engineering manager, hidegebb forgalom (LinkedIn, blog, YouTube), aki most találkozik veled először.
**Amit megnéztem:** desktop (1440×900) és mobil (390×844), a teljes út a hero CTA-tól a Calendly foglalás utolsó lépéséig (nem küldtem el).

## Verdict

Az oldal ma **képzést árul, nem konzultingot** — és ezt nemcsak a hangsúlyokkal teszi, hanem szó szerint kimondja. A `/hu/consulting` H1-je: *"Tanácsadás, amely segít a csapatoknak workshop elveket valós rendszerekben alkalmazni"*. Vagyis a tanácsadás a saját oldalán is a workshop kiegészítőjeként pozicionálja magát. Amíg ez így van, minden forgalom, amit konzultingra hozol, egy olyan oldalra ér, ami azt üzeni: a fő termék valami más.

A második legnagyobb baj: a szó, hogy **"online"**, egyetlenegyszer sem szerepel a kezdőlapon (0 találat "online"/"távol" a `main` szövegében), a láblécben viszont ott van egy verőcei cím. Egy online konzulting ajánlat, ami sehol nem mondja ki, hogy távolról dolgozik.

Van egy jó hírem is: a `/hu/ai-consulting` oldal **majdnem pontosan az, aminek a konzulting oldalnak lennie kellene**. Nem újat kell írni, hanem azt a mintát átemelni.

## Fő problémák (prioritási sorrendben)

### 1. A konzulting oldal a workshop alá rendeli magát — magas

**Ami ott van:**
- H1: *"Tanácsadás, amely segít a csapatoknak workshop elveket valós rendszerekben alkalmazni"*
- Első bekezdés első mondata: *"A képzés akkor ragad meg igazán, ha valós rendszereken és valós döntéseken használják."*
- Egy egész szekció: *"Hogyan egészíti ki a tanácsadás a képzéseket"*
- A page title tag is ugyanez a mondat.
- A kezdőlapon 15 db H2 közül 3 nyíltan képzés-márkázott (*"A fókusz a képzéseken"*, *"Képzési fókuszterületek"*, *"Miért más ez a képzés?"*) — konzulting-márkázott szekció: **0**.
- A hero másodlagos CTA-ja: *"Nézd meg a képzéseket"*.
- A logó alatti alcím minden oldalon: *"Képzések és tanácsadás szoftverfejlesztő csapatoknak"* — ebben a sorrendben.

**Miért kerül pénzbe:** aki konzultingot keres, az első 5 másodpercben azt látja, hogy tréner vagy, aki mellékesen tanácsot is ad. A drágább, ismétlődő munka így a saját oldalán is másodhegedűs lesz. Ráadásul a mondat kimondatlanul azt sugallja: *"ez a szolgáltatás azoknak szól, akik már vettek tőlem workshopot"* — vagyis a hideg érdeklődő kizárva érzi magát.

**Fix:**
- Új H1 a `/hu/consulting`-ra, ami önmagában megáll és eredményt ígér, nem a workshopra hivatkozik. Pl.: *"Kívülről nézem meg, mi lassítja a szállítást — és megmondom, mit javíts először."*
- Az első bekezdés a látogató problémájával kezdjen, ne a képzéssel.
- A *"Hogyan egészíti ki a tanácsadás a képzéseket"* szekció törlendő vagy megfordítandó (*"Ha a csapatnak a felismerés után gyakorlás is kell, arra van workshop"* — egy mondat, a lap alján).
- Kezdőlapon: a *"Képzési fókuszterületek"* és *"Miért más ez a képzés?"* szekciók fölé kerüljön egy konzulting szekció, és a hero másodlagos CTA legyen *"Hogyan dolgozom"* / *"Nézd meg a tanácsadást"*.
- A logó alatti alcím: *"Tanácsadás és képzés szoftverfejlesztő csapatoknak"*.

### 2. Sehol nem derül ki, hogy ez online működik — magas

**Ami ott van:** a kezdőlap `main` szövegében 0 találat az "online" és a "távol" szótőre. A `hu.json`-ban az egyetlen "online" említés a képzésre vonatkozik (*"1–3 napos workshopok, személyesen vagy online"*). A láblécben minden oldalon: *"Nyár utca 6, 2621 Verőce, Hungary"*.

**Miért kerül pénzbe:** ha a fő ajánlat online konzulting, akkor az egyetlen földrajzi jel az oldalon egy 2000 fős falu a Dunakanyarban. Egy budapesti vagy külföldi CTO ebből azt olvassa ki, hogy utazás, helyszín, ütemezés — mindaz a súrlódás, amitől az online ajánlat éppen mentes lenne. Ez a legolcsóbban javítható probléma a listán: egy mondat.

**Fix:** a heróba, a `/hu/consulting` első bekezdésébe és a `/hu/contact` tetejére kerüljön be explicit módon, hogy a munka távolról zajlik és hogyan. Pl.: *"Távolról dolgozom: heti / kéthetente ismétlődő sessionök videón, közben írásban is elérhető vagyok. Ha kell, bemegyek — de ehhez nem kell."* A `seo.descriptions.consulting`-ba is.

### 3. A konzulting ajánlatnak nincs alakja: nincs név, ár, időtartam, konkrét kimenet — magas

**Ami ott van:** *"Rövid, fókuszált tanácsadási együttműködéseket vállalok"*. A formátumok listája a kezdőlapon: *"1–2 napos fókuszált workshopok"*, *"Rövid diagnosztikai együttműködések"*, *"Folyamatos tanácsadás"*, *"Hosszabb távú partnerség"* — négy kategória, egyiknek sincs ára, hossza, se konkrét szállítmánya.

Ezzel szemben a workshop oldalon: *"Early bird 99.000 Ft augusztus 20-ig, utána 119.000 Ft"*, *"Már csak 3 hely maradt"*, *"Ha a workshop elmarad, 100% vissza 3 munkanapon belül"*. **A teljes oldalon ez az egyetlen olyan ajánlat, aminek ára, határideje és garanciája van** — és pont az, amit háttérbe akarsz tenni.

**Miért kerül pénzbe:** ár nélkül a vevő nem tudja eldönteni, hogy egyáltalán a saját ligájában van-e, ezért nem foglal hívást, hanem elhalasztja. Aki mégis foglal, az részben azért jön, hogy megtudja az árat — vagyis a hívásaid egy részét árlistaként használják.

**Fix:** legyen egy megnevezett, fix scope-ú belépő ajánlat a konzulting oldalon, a `/hu/ai-consulting` "AI readiness assessment" mintájára, de árral:
- Név (pl. *"Szállítási audit"*), időtartam (*"2 hét, 3 session"*), konkrét kimenet (*"írásos anyag: mi lassít, mit javíts először, milyen sorrendben"*), és egy ársáv (*"XXX Ft-tól"* vagy *"tipikusan X–Y Ft"*).
- A folyamatos konzultingra elég egy havi keret ("havi X alkalom, Y Ft/hó") — de kimondva.

### 4. Nulla bizonyíték a konzulting úton — magas

**Ami ott van:** a `/hu/consulting` oldalon nincs egyetlen ügyfélnév, referencia, szám, idézet vagy esettanulmány-link. A `/hu/contact` oldalon sem. Az egyetlen esettanulmányod (`rebuilding-engineering-trust-30k-dau-backoffice`) kizárólag a `/hu/blog` oldal aljáról érhető el — a kezdőlapról, a konzulting oldalról és a navigációból nem linkelsz rá sehonnan.

**Miért kerül pénzbe:** a konzulting drágább és kockázatosabb vétel, mint egy workshopjegy, viszont most kevesebb bizonyíték támasztja alá. Egy hideg CTO-nak az egész oldalon nincs egyetlen jele annak, hogy ezt a munkát valaki már megvette és jól járt vele.

**Fix:**
- Az esettanulmányt emeld ki a blog alól: saját link a navigációba vagy legalább egy kártya a konzulting oldalon és a kezdőlapon, számmal a címben.
- Kérj 2–3 rövid idézetet korábbi megbízóktól — név, cég, szerepkör. Ha NDA miatt nem megy, akkor is működik a *"egy 40 fős fintech engineering szervezet CTO-ja"* forma, konkrét eredménnyel.
- A `/hu/consulting` legalább annyi hitelesítő jelet kapjon meg, mint a `/hu/ai-consulting` (ott ott vannak a Credly badge-ek — a sima konzulting oldalon semmi).

### 5. A tanácsadó névtelen — magas

**Ami ott van:** a "Papp Krisztián" név a teljes oldal **látható szövegében sehol nem szerepel** — egyedül egy kép `alt` attribútumában, a `/hu/about` oldalon (*"Papp Krisztián előadás közben a Weblica konferencián"*). A Rólam oldal így kezd: *"Senior tanácsadóként és trénerként dolgozom..."*, a háttér pedig: *"Több éves tapasztalat termékfejlesztő csapatokkal"*. A neved először a Calendly foglalóoldalon jelenik meg, angolul.

**Miért kerül pénzbe:** online konzultingnál a termék te vagy. Most egy névtelen "senior tanácsadó"-val kell 30 perces hívást foglalni. A *"Több éves tapasztalat"* ráadásul gyengébb, mint amit az AI oldalon már le is írsz magadról (*"tizenöt éve rendszereket tervezek"*) — ott konkrét, itt üres.

**Fix:** név + arc + konkrét évszám a kezdőlapon és a konzulting oldalon is (nem csak a Rólamon). A *"Több éves tapasztalat"* helyére a konkrét szám és 2–3 valódi kontextus (milyen méretű szervezet, milyen domain).

### 6. Az elköteleződés pillanatában átvált angolra — közepes

**Ami ott van:** a `/hu/contact` beágyazott Calendly widgetje végig angol: *"Engineering Discovery Call"*, *"Select a Date & Time"*, *"Enter Booking Details"*, *"Name / Email"*, és egy **második, angol nyelvű cookie-banner** a widgeten belül. A Calendly esemény leírásában pedig ez áll: *"Typical topics: ... Team-level training needs"* — vagyis a foglalás pillanatában megint a képzés az utolsó szó.

Ráadásul a `/hu/contact` oldal **nem mondja ki, hogy a hívás ingyenes** — miközben a `/hu/contact/ai` oldal kimondja (*"Ez a beszélgetés ingyenes"*), sőt az árazásról is megnyugtat (*"Időről és pénzről csak ezután beszélünk"*).

**Miért kerül pénzbe:** magyar szövegen végigolvasott látogató a legutolsó, legkockázatosabb lépésnél idegen felületre és nyelvre kerül, plusz egy második süti-döntést kap. A "vajon ez fizetős?" kérdés pedig megválaszolatlan marad pont ott, ahol a legdrágább.

**Fix:**
- Calendly esemény átnevezése és leírása magyarul, konzulting-fókusszal (*"Ingyenes 30 perces konzultáció"*, a topicok közül a képzés lekerül vagy leghátulra megy).
- A `/hu/contact` kapja meg a `/hu/contact/ai` "Mire számíthatsz?" listáját szó szerint — az ott jó, itt hiányzik.
- A `"Web conferencing details provided upon confirmation"` helyett nevezd meg az eszközt (Meet / Zoom): egy ismeretlen linkre kevésbé szívesen mondanak igent.

### 7. Egyetlen konverziós lehetőség van: egy 30 perces hívás — közepes

**Ami ott van:** a kezdőlap, a `/hu/consulting` és a `/hu/ai-consulting` minden CTA-ja ugyanoda mutat: *"Foglalj időpontot"*. Alternatíva mindössze egy nyers `mailto:` link. Az AI ágon van egy alacsonyabb küszöbű lépcső (*"Még nem tartotok ott, hogy beszéljünk?"* → State of AI Dev riport) — a konzulting ágon **semmi**.

**Miért kerül pénzbe:** a hideg forgalom nagy része nem áll készen arra, hogy naptárba írjon egy idegent. Aki nem foglal, az most nyomtalanul távozik: nincs e-mail-cím, nincs újramegkeresés.

**Fix:** a konzulting oldalra is kerüljön egy alacsonyabb küszöbű lépés — ugyanaz a mintázat, ami az AI oldalon már működik. Lehet az AI riport, lehet egy 1 oldalas checklist ("mit nézz meg, mielőtt hívsz"), vagy egyszerűen: *"Írd le pár mondatban, hol akadtatok el, és e-mailben visszaírok"* — űrlappal, nem `mailto`-val.

### 8. A konzulting oldal a saját ismétlődő bevételét beszéli le — közepes

**Ami ott van:** *"Az együttműködések rövidek és fókuszáltak. ... A cél nem tartós függés—az, hogy a csapatod birtokolhassa a gyakorlatokat és döntéseket után, hogy készen vagyunk."*

**Miért kerül pénzbe:** ha az online konzulting felé mész, valószínűleg visszatérő, ismétlődő együttműködésre van szükséged (havi keret, retainer). Ez a bekezdés viszont elővételezve visszautasítja: a vevő azt olvassa, hogy a hosszabb együttműködés nálad rossz jel. Az önállóvá tétel ígérete jó — de nem ugyanaz, mint kizárni a folytatást.

**Külön:** ez a mondat nyelvtanilag el is törik (*"...birtokolhassa a gyakorlatokat és döntéseket után, hogy készen vagyunk"*) — fordítási maradvány, méghozzá pont azon az oldalon, amire az egész váltást építed.

**Fix:** fogalmazd át úgy, hogy az autonómia ígérete megmaradjon, de a folytatás nyitva legyen: *"A cél nem az, hogy függjetek tőlem — hanem hogy a csapat maga vigye tovább. Ahol ez folyamatos külső nézőpontot igényel, ott havi kerettel dolgozunk."* És javítsd a törött mondatot.

### 9. Mobilon a süti-banner ráfekszik a másodlagos CTA-ra — közepes

**Ami ott van (390×844, mért értékek):** a süti-banner `position: fixed`, 216 px magas, a viewport 616 px-énél kezdődik. A hero elsődleges CTA (*"Foglalj időpontot"*) 561–601 px között van — 15 px-en múlik, hogy látszik. A másodlagos CTA (*"Nézd meg a képzéseket"*, 613–653 px) **a banner alá kerül**, amíg a látogató nem dönt a sütikről.

**Miért kerül pénzbe:** most a képzés-gomb tűnik el, ami a te új irányod szerint nem tragédia — de a margó 15 px. Bármilyen szövegváltoztatás a heróban (pl. a 2. pontban javasolt "online" mondat) a fő CTA-t is a banner alá tolja, és akkor mobilon nincs látható konverziós gomb.

**Fix:** a bannerhez adj alsó térközt / kisebb magasságot mobilon (vagy egy alsó sávos, 1-2 soros változatot), és a hero CTA-kat told feljebb, hogy ne 15 px-en múljon.

### 10. Mobilon a naptár 1131 px-re van lefelé, 318 px széles dobozban — közepes

**Ami ott van:** `/hu/contact`, 390 px széles nézetben a Calendly iframe a lap tetejétől 1131 px-re kezdődik (több mint egy teljes képernyő görgetés), mérete fix 318×698 px. Az oldal teljes magassága 2401 px.

**Miért kerül pénzbe:** a foglaló felület egy szűk, fix magasságú dobozba van szorítva, amiben a naptár és az idősávok saját belső görgetést kapnak — görgetés a görgetésben, telefonon. Aki idáig eljutott, az a legmelegebb látogatód; itt veszíteni a legdrágább.

**Fix:** mobilon a beágyazott widget helyett egy nagy, teljes szélességű gomb, ami a Calendly saját (mobilra optimalizált) oldalát nyitja — a beágyazás maradhat desktopon. A "Kiknek érdemes jelentkezni?" / "Mire számíthatsz?" blokkok pedig kerüljenek a naptár **alá** mobilon, hogy a foglalás közelebb legyen a tetejéhez.

### 11. A navigáció 2:1 arányban a képzésnek kedvez — alacsony (de olcsó javítás)

**Ami ott van:** a főmenü *"Képzés"* eleme nem link, hanem lenyíló, alatta két elem (*"Képzések cégeknek"*, *"Architect Mindset képzés"*), és a menüben ez áll az **első** helyen. A *"Tanácsadás"* egyetlen sor, utána. A kezdőlap *"Együttműködési formátumok"* szekciója — a leginkább konzulting-releváns blokk az oldalon — **egyetlen CTA-t sem tartalmaz**, se linket, se gombot.

**Fix:** a *"Tanácsadás"* kerüljön a menü első helyére, a képzés mögé; az *"Együttműködési formátumok"* alá kerüljön egy *"Foglalj időpontot"* gomb.

## Ami már most működik — ezekhez ne nyúlj

- **A `/hu/ai-consulting` oldal a jó minta.** Problémával nyit (*"Az AI körüli nyomás nagyobb, mint a bizonyíték"*), van *"Amit tipikusan látok"* szekciója a vevő szavaival, megnevezett belépő ajánlata (*"AI readiness assessment — Belépő együttműködés"*), kifogáskezelése (*"Mire mondok nemet"* — ez kifejezetten erős, mert eladás közben mond nemet), hitelesítése (Credly badge-ek élő linkkel), és egy alacsonyabb küszöbű lépcsője (riport). **A konzulting oldalt erre a vázra írd át, ne nulláról.**
- **A `/hu/contact/ai` elvárás-kezelése.** *"Ez a beszélgetés ingyenes"*, *"Időről és pénzről csak ezután beszélünk"*, *"Ha az jön ki, hogy nálatok most nem az AI a következő lépés, ezt egyenesen meg fogom mondani."* Ez pontosan az, amitől egy hideg vezető meg meri nyomni a gombot.
- **A foglalóűrlap rövid:** név + e-mail kötelező, plusz egy opcionális szöveges mező. Nincs telefonszám, nincs cégméret-legördülő. Ne bővítsd.
- **Az időpont-kínálat rendben van:** másnaptól foglalható, napi 16 sáv 09:00–16:30 között. Nem az akadozó naptár a szűk keresztmetszet.
- **Gyors, ugrálásmentes betöltés, nincs azonnal beugró popup.** Az egyetlen belépő megszakítás a süti-banner.
- **A hero elsődleges CTA mindkét nézetben a hajtás felett van** (desktop 354 px, mobil 561 px).
- **A blogos utánpótlás az AI oldalon jól van bekötve** (8 cikk + "Összes AI-cikk") — a konzulting oldalról ez teljesen hiányzik.

## Amit nem ellenőriztem

- **Számokat nem láttam** — ez egy látogatás, nem analytics. A fenti sorrend a súrlódás nagyságán alapul, nem mért konverzión.
- **Nem küldtem el a foglalást** — az utolsó lépésnél (név/e-mail képernyő) megálltam, így a visszaigazoló e-mailt és a hívás utáni követést nem láttam.
- **Az angol (`/en/`) verziót nem néztem végig** — ha az online konzulting nemzetközi piacra is megy, azt külön kell auditálni.
- **A `/hu/training/workshop-budapest` fizetési folyamatát nem jártam végig** (a workshop háttérbe kerül, de ha marad, az a funnel külön kérdés).
- **Nem tudom, hogy fizetett forgalom hova landol** — ha a hirdetések a workshop landolóra visznek, akkor a fenti kezdőlap-problémák egy része nem is érinti azt a forgalmat.
- **Valódi mobileszközön nem teszteltem**, csak 390×844-es viewportban; a Calendly beágyazás valós telefonon még szűkebb lehet.
