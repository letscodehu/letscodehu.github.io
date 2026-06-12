Régen az architekturális döntések dokumentálása többnyire kollaboratív folyamat volt.

Lehetett egy meeting, egy RFC, egy ADR review, egy hosszú Slack thread vagy egy whiteboard előtt álló vita. A forma változott, de a lényeg ugyanaz maradt: több ember próbálta megérteni ugyanazt a döntést különböző nézőpontokból.

Az AI megjelenésével ez könnyen megváltozik.

Ma már elég megkérni egy modellt, hogy segítsen dönteni. Pár másodperc múlva kapunk alternatívákat, pro-kontra listát, szakmainak tűnő érveket és egy kész javaslatot.

Van ennél rosszabb verzió is: fejben már eldöntjük, mit akarunk, majd megkérjük az AI-t, hogy írja meg hozzá az ADR-t.

Így kimarad a kényelmetlen rész. Nem ülnek le azok, akik más kockázatot látnak. A csapat nem küzd meg azzal, hogy a döntés csak bizonyos kompromisszumok mellett vállalható.

Csak lesz egy dokumentum.

Pont ez a probléma.

Egy ADR nem arról szól, hogy milyen döntés *szokott* működni a világban. Arról szól, hogy a *mi* helyzetünkben miért hoztunk meg egy adott döntést.

Az ADR lényege nem az, hogy legyen valahol egy dokumentum. A dokumentum csak melléktermék.

> **Info:** Az ADR, azaz Architecture Decision Record ezt a mellékterméket adja kézzelfogható formába: leírja egy architekturális döntés körülményeit, alternatíváit, kompromisszumait és következményeit.

Az igazán fontos rész maga a döntéshozási folyamat: amikor több fél, több nézőpont és többféle kockázat találkozik, mielőtt a csapat elköteleződik.

Fejlesztés, product, security, operations, support vagy akár compliance teljesen más költséget lát ugyanabban a döntésben. Egy jó ADR-folyamat ezeket az eltérő szempontokat hozza felszínre.

Nézzünk egy példát.

## Egy prompt, amiből kész ADR lesz

Tegyük fel, hogy egy csapat eddig egy moduláris monolitban dolgozott. Most felmerül, hogy az értesítési funkciót külön service-be kellene tenni, mert egyre több email, push notification és webhook megy ki a rendszerből.

A prompt lehetne ilyen (Most tekintsünk el attól, hogy magával a prompttal is van gond. Erre később visszatérünk):
```md
Írj egy ADR-t arról, hogy a notification modult külön microservice-be szervezzük ki.

Kontextus:
- jelenleg moduláris monolitban működik a rendszer
- a notification modul emailt, push notificationt és webhookot küld
- a termék várhatóan növekedni fog
- szeretnénk skálázhatóbb és lazábban kapcsolt architektúrát
- a csapat fontosnak tartja a cloud-native best practice-eket

Az ADR tartalmazzon kontextust, döntést, alternatívákat, pro-kontra érveket és következményeket.
```

Erre az AI könnyen adhat egy ilyen választ:

```md
# ADR: Notification modul kiszervezése külön microservice-be

## Kontextus

A jelenlegi rendszer moduláris monolitként működik. A notification modul felelős az emailek, push notificationök és webhookok küldéséért. A termék növekedése miatt egyre fontosabb a skálázhatóság, a rugalmasság és a komponensek laza kapcsolása.

## Döntés

A notification modult külön microservice-be szervezzük ki. A monolit eseményeket publikál egy message brokerbe, a Notification Service pedig ezek alapján küldi ki az értesítéseket.

## Alternatívák

1. A notification modul marad a monolit része.
2. A notification logikát külön library-be szervezzük.
3. A notification modult külön microservice-be szervezzük.

## Indoklás

A microservice megközelítés jobban támogatja a skálázhatóságot, a független deployt és a laza kapcsolódást. A notification funkció üzletileg jól elkülöníthető, ezért természetes service boundaryt alkot. Az aszinkron kommunikáció javítja a rendszer ellenálló képességét, mivel a fő üzleti folyamatok nem blokkolódnak notification küldés közben.

## Következmények

Pozitív következmények:
- a notification komponens külön skálázható
- a csapat függetlenül deployolhatja az értesítési logikát
- a rendszer jobban illeszkedik a cloud-native architektúrához
- a service boundary tisztább lesz

Negatív következmények:
- nő az üzemeltetési komplexitás
- szükség lesz message brokerre
- kezelni kell az eventual consistencyt
- összetettebb lesz a monitoring

## Státusz

Elfogadva.
```

Első ránézésre ez teljesen vállalható.

Van kontextus. Vannak alternatívák. Megjelennek a következmények. A döntés logikusnak tűnik.

Pont ezért veszélyes.

## Az AI szerelmes a best practice-ekbe

A generált ADR szinte minden mondata ismerős szakmai mintákból épül:

- microservice,
- message broker,
- laza kapcsolódás,
- független deploy,
- skálázhatóság,
- cloud-native architektúra,
- eventual consistency.

Ezek nem rossz fogalmak. Sok helyzetben kifejezetten hasznosak.

Az ADR-ekben viszont gyakran nem az iparági értelemben vett "legjobb" megoldást választjuk, hanem azt, amelyik:

- belefér a költségkeretbe,
- megfelel a csapat tudásszintjének,
- illeszkedik a meglévő rendszerhez,
- kezelhető az adott határidő mellett.

A helyi optimum sokszor fontosabb, mint az iparági optimum.

Egy háromfős csapatnál lehet, hogy a monoliton belüli tiszta modulhatár jobb döntés, mint egy külön service saját deployjal, monitoringgal és incident runbookkal.

Egy két hónapos határidő előtt lehet, hogy a legegyszerűbb queue-alapú háttérfeldolgozás többet ér, mint egy teljes event-driven architektúra bevezetése.

Egy alacsony forgalmú B2B terméknél lehet, hogy a 100 millió felhasználóra skálázódó megoldás csak felesleges költséget és komplexitást hoz.

A fenti ADR-ben a "cloud-native best practice" úgy működik, mint egy erősítő. Komolyabbnak láttatja a döntést, miközben kevés konkrétumot mond arról, hogy erre a csapatra és erre a rendszerre miért igaz.

Lehet, hogy a notification modul tényleg külön service-t érdemel.

Az is lehet, hogy a monoliton belüli boundaryt kellene rendbe tenni, queue-val leválasztani a kiküldést, és egyelőre nem új deployolható egységet létrehozni.

A generált ADR ezt a különbséget nem bontja ki.

## A döntés már a promptban eldőlt

Érdemes megnézni a promptot is.

Nem azt kérdeztük, milyen opciók vannak. Azt kértük, hogy írjon ADR-t arról, hogy kiszervezzük a modult.

Az AI ilyenkor gyakran segítőkészen igazolja a megadott irányt. Összegyűjti hozzá a jól hangzó érveket, majd a végére odaírja: elfogadva.

Ez a bias persze nem az AI-val jelent meg először.

Emberek által írt ADR-ekben is láttunk ilyet: az író érezhetően hajlik az egyik megoldás felé, ezért az alternatívákat gyengébben mutatja be, a preferált irány kockázatait pedig finomabban kezeli.

Az AI ebben nem új problémát teremt. Gyorsabban és csiszoltabban tudja felerősíteni a meglévőt.

Ettől a dokumentum úgy néz ki, mintha döntési folyamat eredménye lenne.

Valójában könnyen lehet, hogy csak egy preferencia kapott utólagos szakmai csomagolást.

Ez az egyik legnagyobb kockázat AI-generált ADR-eknél: a dokumentum nem a döntést rögzíti, hanem racionalizálja.

Ilyenkor az ADR a lényegét veszíti el.

A csapat már döntött, az AI pedig dokumentumot gyártott hozzá. Kimaradt az a rész, ahol az operations elmondhatta volna, hogy nincs kapacitás új service-t üzemeltetni. A security rákérdezhetett volna a webhook retry és audit trail részleteire. A product jelezhette volna, hogy a következő két hónapban nem a skálázás, hanem egy nagy release stabil leszállítása a fontos.

Pont ez a folyamat adná az ADR értékét.

Ha az AI-t úgy használjuk, hogy a csapat helyett megírja a kész döntési dokumentumot, akkor ezek a nézőpontok könnyen eltűnnek. A dokumentum megmarad, a döntéshozás minősége viszont nem javul.

## A felelősség nem kerül át az AI-ra

Kódnál ezt már most is érdemes komolyan venni.

Ha egy AI által írt módosítás miatt a cég dollármilliókat bukik, a végső felelősség nem a modellé lesz. A felelősség annál a fejlesztőnél és csapatnál marad, aki jóváhagyta, merge-ölte és productionbe engedte.

Az "AI írta" legfeljebb magyarázat arra, hogyan került oda a hiba.

Felmentésnek kevés.

Ugyanez igaz az architekturális döntésekre is.

Ha egy AI-generált ADR alapján rossz service boundaryt húzunk, felesleges infrastruktúrát építünk, vagy olyan üzemeltetési terhet veszünk fel, amit a csapat nem bír el, a következményeket a szervezet viseli. Az incident callban, a migrációs projektben és a költségriportban már nem az számít, ki fogalmazta meg az ADR-t.

Az számít, ki fogadta el döntésként.

## A decision driverek nem egyenlőek

Egy ADR lényege nem pusztán a döntés. Legalább ennyire fontos, milyen kompromisszumok állnak mögötte.

Például:

- fejlesztési sebesség,
- üzemeltetési költség,
- skálázhatóság,
- csapat tapasztalata,
- vendor lock-in,
- biztonság,
- observability,
- incident recovery,
- time to market.

Mind decision driver.

A fenti ADR fel is sorol néhányat közülük. Üzemeltetési komplexitás, message broker, eventual consistency, monitoring.

A súlyozás viszont hiányzik.

Mi számít jobban: a független deploy vagy az, hogy a háromfős csapat eddig egyetlen production service-t üzemeltetett?

Mekkora a valós notification terhelés? Napi tízezer üzenet? Tízmillió? Kampányidőszakban burstöl, vagy egyenletesen jön?

Van ember, aki érti a message broker működését, retry modelljét, dead letter queue-ját és idempotenciáját?

Két hónap múlva fontos release jön. Ilyenkor tényleg belefér egy új service, új CI/CD pipeline, új dashboard és új incident runbook?

Az AI felsorolhatja a drivereket. Ettől még nem biztos, hogy helyesen méri össze őket.

Az ADR-ek értéke pont abban van, hogy explicit módon rögzítik ezeket a súlyozásokat.

## A szépen hangzó mondatok eltakarják a hiányzó bizonyítékot

Nézzük ezt a mondatot:

> A notification funkció üzletileg jól elkülöníthető, ezért természetes service boundaryt alkot.

Lehet igaz.

Csak a generált ADR-ből nem derül ki, mi alapján.

Külön csapat dolgozik rajta? Eltérő release ciklusa van? Más skálázási profilja van, mint a rendszer többi részének? Olyan adatokat kezel, amelyek külön jogosultsági modellt igényelnek?

Ha ezek közül egyik sem igaz, akkor a "természetes service boundary" csak szépen hangzó címke.

Ugyanez igaz az aszinkron kommunikációra is. A fő üzleti folyamat tényleg ne blokkolódjon emailküldés miatt, ez jó cél.

Ehhez viszont nem feltétlenül kell külön microservice. Lehet, hogy elég egy belső queue, háttérfeldolgozás és tisztább modulhatár.

A generált ADR a nagyobb architekturális lépést választja, mert az látványosabban illeszkedik a promptban szereplő szavakhoz.

## Mire használnám mégis?

Eddig ez könnyen hangozhatott úgy, mintha teljesen kizárnám az AI-t az ADR-ek környékéről.

Nem erről van szó.

AI-t nem a végső ADR megírására használnék.

Inkább úgy tekintenék rá, mint egy további félre a döntési folyamatban.

Nem döntéshozó. Nem dokumentumgyártó. Egy bevont nézőpont, amely kérdez, ellenőriz, vakfoltokat keres, és néha kellemetlenül pontos hiányosságokra mutat rá.

Review-ra például nagyon hasznos.

Például ilyen prompttal:

```md
Review-zd ezt az ADR-t szkeptikus architectként.

Ne fogadd el a döntést adottnak.

Keresd meg:
- milyen decision driverek hiányoznak
- hol nincs bizonyíték az állítások mögött
- mely alternatívákat kezeli túl gyengén a dokumentum
- milyen üzemeltetési kockázatokat kellene tisztázni
- milyen kérdésekre kell válaszolnunk döntés előtt
```

Ebben nagyon erős.

Jó kérdéseket tud adni. Észrevehet vakfoltokat. Segíthet alternatívákat keresni.

Így az AI a döntési folyamat résztvevője lesz.

A döntés továbbra is emberi felelősség. Az AI adhat szempontot, kérdezhet jól, és gyorsan összerakhatja, hogy általában mi működik.

> Azt viszont nem tudja, hogy nálatok mi számít igazán.