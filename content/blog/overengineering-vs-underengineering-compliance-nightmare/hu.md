
Minden csapat életében van az a pillanat, amikor beesik egy látszólag triviális kérés. Nem új architektúra, nem új termék, csak egy apró kis „meg kéne csinálni” jellegű feature. Ilyenkor könnyű legyinteni: _„ugyan már, ez max 5 sor, ne gondoljuk túl”_.

Na, pontosan itt tud ugyanakkorát robbanni az underengineering, mint máshol az overengineering.

Az egyik oldalról ismerjük a klasszik: mindent mikroservice, mindenre külön event bus, háromféle cache, ötféle proxy, mert „hátha kell egyszer”. Ez a túlgondolt, túlépített, feleslegesen bonyolult világ.

A másik csapda viszont kevésbé látványos: amikor valamit _annyira_ leegyszerűtünk, hogy közben teljesen figyelmen kívül hagyjuk az üzleti, jogi, compliance vagy üzemeltetési realitásokat. És ez néha egyetlen REST végpontnál kezdődik.

Ebben a sztoriban pontosan ez történt. Jött egy ártalmatlannak tűnő kérés: **„kell egy végpont, amivel egy tenantot lehet törölni a rendszerből”**. A csapat pedig majdnem reflexből ráugrott, hogy „oké, ez kb. 5 sor, megcsináljuk sprint közben”.

Spoiler: ez az 5 sor nagyon közel állt ahhoz, hogy compliance szempontból egy csodás aknamezővé váljon.


## A feature, ami papíron 5 sor

Nézzük meg, honnan indultunk.

A kérés nagyjából így hangzott: _„Legyen egy API végpont, amivel egy tenant összes adata törölhető a rendszerből. GDPR, adatvédelem, ilyesmi. Nem kell túlgondolni, csak töröljük a hozzá tartozó adatokat.”_

Ha valaki csak a technikai felszínt nézi, a fejében rögtön ez játszódik le:

- kell egy `DELETE /tenants/{tenantId}` végpont,
- a handlerben hívunk egy repository-t,
- `DELETE FROM ... WHERE tenant_id = :tenantId`,
- visszaadunk egy 200 OK-t,
- _„kész is vagyunk, ez literally 5 sor”_.

És egy _egyrégiós_, _egyetlen termékes_, _egyetlen adatbázisos_ homokozó projektben ez tényleg majdnem igaz lenne.

Csakhogy a valóság nem ez volt.

A rendszer, amiben ez a kérés landolt, nagyjából így nézett ki:

- több **régióban** üzemelt, külön adatbázisokkal,
- több **termék** osztozott ugyanazon tenant fogalmán,
- bizonyos adatok **archiválva**, mások **logolva**, megint mások **cache-elve** voltak,
- és persze mindezek felett ott lebegett a **GDPR**, a belső **retention policy** meg még pár iparági compliance követelmény.

Itt már nem egy “delete from tenant where id = …” jellegű kérdésről beszélünk, hanem egy **komplex üzleti folyamatról**, aminek az egyik _technikai_ eszköze történetesen egy HTTP végpont.


## Amikor az underengineering elkezd fájni

A csapat első reakciója mégis az volt, ami ilyenkor gyakori:

- „Auth hogy legyen? HTTP Basic vagy inkább JWT?”
- „Kell-e idempotencia? Ha kétszer hívják meg, baj?”
- „Legyen-e sync vagy async a törlés?”

Észre sem vették, hogy a beszélgetés **rossz szinten** ragadt.

A valós kérdések ugyanis nem itt kezdődnek. Hanem ilyeneknél:

- **Hol vannak a tenant adatai _valójában_?**
  - Hány adatbázisban, hány régióban, hány termék komponensben?
- **Ki a „forrásrendszer” a tenant életciklusára?**
  - Ki mondja meg, hogy egy tenant egyáltalán létezik, és mikor „készen áll” a törlésre?
- **Mit jelent a törlés üzletileg?**
  - Visszavonhatatlan? Vagy előbb deaktiválunk, aztán X nap múlva törlünk?
- **Milyen jogalapon törlünk?**
  - Ügyfél kérésére, szerződés lejárta miatt, nem fizetés miatt, GDPR requestre… és ezek között van-e különbség?
- **Mi a helyzet hibák esetén?**
  - Ha 5 rendszerből 3 sikeresen töröl, 2-ben exception van, akkor most a tenant félig létezik, félig nem?
- **Ki és hogyan tudja ezt később auditálni?**
  - Ha egy auditor megkérdezi: „Mutassák meg, hogy X tenant adatait mikor és hol törölték”, tudunk-e válaszolni?

Egy ponton valaki feltette a kulcskérdést: _„Oké, értem, hogy lesz egy API, de ezt az egész folyamatot most tényleg egy 5 soros kontrollerfüggvényre akarjuk rábízni?”_

Itt jött elő, hogy **underengineering**-be fordult az egész. Nem az volt a baj, hogy REST végpontban gondolkodtunk, hanem az, hogy **csak** abban.


## Több régió, több termék – már nem csak technikai részlet

Nézzük meg közelebbről, miért volt ez ennyire csúszós pálya.

**1. Több régió**  
A tenant adatai több földrajzi régióban voltak jelen, részben compliance, részben latency okokból. Ha egy régióban törlünk, de a másikban nem, attól a tenantnak még bőven vannak adatai.

- Ki indítja a törlést? Egy központi rendszer? Régiónként külön komponens?
- Mi történik, ha az egyik régió elérhetetlen? Retrying? Halasztott törlés?
- Kell-e garancia arra, hogy **minden** régióban befejeződött a törlés, mielőtt „késznek” tekintjük?

**2. Több termék**  
A tenant ugyanazt az azonosítót használta különböző termékekben. Ez jól hangzik addig, amíg csak _bejelentkezésről_ beszélünk. Amint törlésre kerül a sor, rögtön kiderül:

- Minden termék tudja, hogy neki mit kell csinálnia egy törlés event hatására?
- Vannak-e olyan logok, audit trail-ek, amelyekre retention szabály vonatkozik (pl. 5 évig meg kell őrizni)? Azokat akkor _nem_ szabad törölni.
- Van-e olyan adat, ami ugyan tenant scope-ban van, de jogilag nem törölhető azonnal (számlázás, könyvelés, stb.)?

**3. Orchestráció**  
Ha több régió, több termék, több adatforrás van, akkor ezt valakinek **össze kell fogni**.

Itt szoktak elszabadulni az overengineering reflexek: „akkor kell egy globális workflow engine, ami BPMN-ben modellezi a törlést, event sourcing, sagák, minden”.

De az underengineering sem jobb: „majd a `TenantController` meghívja sorban a service-eket, aztán kész”.

A jó válasz általában valahol középen van:

- kell egy **világos modell** arra, hogy a törlés milyen lépésekből áll,
- kell egy **megbízható komponens**, ami ezeket a lépéseket végigviszi,
- kell egy **állapotgép** vagy státusz, ami jelzi, hogy a törlés épp hol tart (pl. _initiated_, _in_progress_, _failed_, _completed_),
- és kell egy **auditálható napló**, ami megmutatja, hogy mi történt, mikor, hol, milyen eredménnyel.

Ez már nem 5 sor. De nem is kell hozzá komplett NASA flight control center.


## Compliance szemmel nézve ez nem „nice to have”

A story akkor fordult igazán komolyra, amikor valaki behívta a compliance-es vagy legal oldalt a beszélgetésbe.

Nagyjából ilyen kérdések érkeztek:

- „Hogyan bizonyítjuk egy hatósági ellenőrzésnél, hogy tényleg töröltük az adatokat?”
- „Mi van, ha egy ügyfél 2 év múlva megkérdezi, hogy pontosan mikor töröltük az adatait?”
- „Biztos, hogy **minden** adat törölhető? Mi a helyzet a számlákkal, könyveléssel, szerződésekkel?”
- „Hogyan biztosítjuk, hogy egy rosszindulatú operátor ne tudjon random tenantokat eltüntetni?”

Itt vált világossá, hogy a „csináljunk egy DELETE végpontot” típusú gondolkodás **nem csak technikailag** volt underengineered, hanem **üzletileg és jogilag is**.

Egy compliance-szempontból vállalható megoldásnál legalább a következőknek rendben kell lenniük:

- **Jogosultság**: ki hívhatja a törlést, és milyen kontextusban? (pl. csak belső admin rendszerből, megfelelő role-okkal).
- **Audit trail**: minden törlésről legyen visszakövethető, hogy ki, mikor, milyen okból indította, mi történt, és mi lett az eredmény.
- **Retention szabályok**: ne töröljünk olyat, amit jogszabály szerint meg kell tartani X évig.
- **Fail-safe viselkedés**: részleges siker esetén a rendszer ne essen szét „zombi tenantokra”. Inkább rollback, retry, vagy explicit _failed_ állapot + manuális beavatkozás.

Ezek közül egyik sem ott kezdődik, hogy **„HTTP Basic Auth megfelelő?”**. Az auth kérdése fontos, de csak akkor, ha már tudjuk, _mit_ védünk, _miért_, _kik elől_, _milyen folyamatban_.


## Hol húzódik a határ az „épp elég” és a „túl sok” között?

Itt jön be az overengineering vs. underengineering igazi dilemmája.

- Ha **alultervezel**, kapsz egy olyan rendszert, ami első ránézésre gyors, egyszerű és „kész”,
  de valójában tele van rejtett aknákkal: inkonzisztens adatok, hiányzó logok, auditálhatatlanság, compliance kockázat.

- Ha **túltolod**, akkor egy viszonylag egyszerű folyamatot is méregdrága, nehezen karbantartható, túlkomplikált workflow-vá emeled. A csapat félni fog hozzányúlni, és minden módosítás kínszenvedés lesz.

A különbség sokszor nem az eszközökben van, hanem a **gondolkodás sorrendjében**.

Gyakorlati sorrend, ami ebben a történetben végül működött:

1. **Először**: értsük meg az üzleti és jogi folyamatot.
   - Mit jelent „tenant törlése” _nem_ technikai nyelven?
2. **Utána**: térképezzük fel, hol vannak az adatok.
   - Milyen rendszerek, régiók, adatbázisok érintettek?
3. **Ezután**: definiáljunk egy egyszerű, de robusztus folyamatot.
   - Milyen lépésekből áll a törlés, mi történik hibánál?
4. **Csak ezután**: válasszuk ki a technikai megoldásokat.
   - API, auth, orchestration, storage, logolás, stb.

Ugyanaz a technológia lehet overengineering és underengineering is – a különbség az, hogy **mit próbálunk vele megoldani**, és mennyire illeszkedik a valós problémához.


## Konkrétan mi változott a majdnem-5-soros megoldáshoz képest?

A végén nem lett atomerőmű-szintű komplexitás, de az eredeti „5 soros” elképzeléshez képest pár dolog alapjaiban változott.

Nagy vonalakban valami ilyesmi alakult ki:

- A `DELETE /tenants/{tenantId}` **nem törölt semmit közvetlenül**.
  - Csak egy **törlési folyamatot indított**, amit egy külön komponens vitt végig.
- Bevezettünk egy **tenant lifecycle** modellt.
  - A tenantnak voltak állapotai: _active_, _pending_deletion_, _deletion_in_progress_, _deleted_, _deletion_failed_.
- A tényleges törlést egy **orchestrator** végezte.
  - Végigment a releváns rendszereken: core DB-k, file storage, cache, log retention pipeline, stb.
  - Minden lépésről **állapotot és logot** írt.
- Hibák esetére volt egy **következetes viselkedés**.
  - Ha valahol hiba történt, a tenant _deletion_failed_ állapotba került, és bekerült egy queue-ba manuális review-ra.
- A törlés indítása csak **szűk körű, auditált csatornán** volt lehetséges.
  - Nem „nyilvános” API, hanem belső admin felületről, erős azonosítással és jogosultsággal.

Ez még mindig bőven belefér egy normál, karbantartható rendszer komplexitásába. Nem kellett hozzá 12 új microservice és öt új adatbázis-technológia.

De már messze nem az az 5 sornyi „delete from where tenant_id” megoldás volt, amit első lendületből odabiggyesztett volna bárki.


## Tanulság: a jó tervezés nem arról szól, hogy mennyire „okos” a rendszered

Ennek a sztorinak nem az a tanulsága, hogy „mindig tervezz óriási architektúrákat”. 

Sokkal inkább az, hogy:

- **Underengineering**: amikor egy komplex, üzletileg és jogilag terhelt problémát úgy kezelsz, mintha csak egy sima CRUD művelet lenne.
- **Overengineering**: amikor egy egyszerű problémát is úgy kezelsz, mintha a fél világ forgalmát kéne kiszolgálnia 99.999%-os SLA-val.

A kettő között az a közös, hogy egyiknél sincs igazán _jó_ gondolkodás a háttérben. Reflexek vannak.

Az, hogy egy „tenant törlés” feature végül milyen lesz, azon múlik, hogy a csapat mennyire hajlandó megállni az elején, és feltenni a kellemetlen, de fontos kérdéseket:

- Hol vannak az adatok valójában?
- Ki és milyen alapon kérheti a törlést?
- Mi lesz hibák esetén?
- Mit kér majd számon egy auditor?

Ha ezekre van jó válasz, onnantól már mindegy, hogy Basic Auth vagy JWT, gRPC vagy REST – ez már _implementációs részlet_.

És igen, néha kiderül, hogy az 5 sorból 50 lesz. De ha ezzel elkerülsz egy adatvédelmi vagy compliance rémálmot, akkor az a plusz 45 sor nem overengineering. Az a **felnőtt tervezés**.
