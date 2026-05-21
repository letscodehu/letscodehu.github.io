Egy termékcsapattal dolgoztam, ahol egyértelmű volt a cél: gyorsabban szállítani úgy, hogy a compliance ne sérüljön. A release-ek lassúak voltak, minden élesítés kis kockázati alkunak érződött.

Az engineering lead hozott egy felelősnek hangzó javaslatot:

> „Vegyük át az iparági best practice-t: event-driven architektúra szigorú bounded contextekkel.”

Az érvelés ismerős volt. Nagy tech cégek használják. Konferenciákon dicsérik. Belső auditok szeretik az „iparági standard” kifejezést.

Hat hónappal később több mozgó alkatrész volt a rendszerben, lassabb lett a visszajelzési ciklus, és ugyanaz a szállítási fájdalom maradt. A csapat egy megoldási formát másolt át anélkül, hogy a mögötte álló problémát is átvette volna.

## Papíron jól nézett ki a döntés

Első ránézésre logikus volt a választás.

Több termék is érintette ugyanazt a tenant-adatot. A release-ek összefüggtek. Egy modul változása végigment a többin. Tipikus monolit-tünetek egy növekvő rendszernél.

A célállapot így nézett ki:

- domainek külön szolgáltatásokra bontása,
- kommunikáció eseményeken keresztül,
- határok kikényszerítése szigorú context mappinggel,
- outbox és retry policy szinte mindenhol.

Táblán ez tiszta történet. Minden doboznak van neve. Minden nyílnak van célja. Mindenki bólogat.

A slide-ból hiányzott az eredeti constraint-készlet, ami máshol jó tradeoffot adott ehhez a mintához:

- nagyon magas írási terhelés,
- sok független csapat napi szintű szállítással,
- érett platformeszközök observability-re és schema evolutionre,
- operációs büdzsé több tucat szolgáltatás megbízható futtatásához.

Az ügyfélnél más volt a helyzet:

- közepes méretű, közös ownershipű csapat,
- mérsékelt forgalom,
- szigorú auditálhatósági elvárások,
- és a következő két negyedévben gyorsuló szállítási ciklus kellett.

Valaki más problémájára optimalizált választ importáltak.

## A best practice tömörített kontextus

A best practice ritkán univerzális szabály. Gyakran egy tömörített történet:

- volt egy X problémánk,
- Y constraint mellett,
- kipróbáltuk az A, B és C opciókat,
- a C nyert Z okok miatt,
- ezért C-t ajánljuk.

Amikor ez az üzenet utazik, az okok tűnnek el először. Megmarad az ajánlás.

Ezért vitatkoznak a csapatok implementációs részleteken, miközben a döntési keret kimarad:

- „Legyen sync vagy async az esemény?”
- „Kell Kafka vagy RabbitMQ?”
- „Hány bounded context elég?”

Hasznos kérdések, csak túl korán jönnek, ha előtte nem hangzik el:

- Mit akarunk most ténylegesen megoldani?
- Mi történik, ha hat hónapig nem csinálunk semmit?
- Melyik kockázat elfogadható, és melyik nem?

Keret nélkül a „best practice” társadalmi gyorsgomb. Lezárja a vitát, és biztonságosnak tűnik a tervező meetingen.

A gyenge gondolkodás mögé is befér magabiztos nyelv.

## A költség későn jelenik meg

Egy ideig semmi nem tűnik töröttnek.

Új szolgáltatások születnek. Szebb dashboardok jönnek. Az architektúra-ábrák több dobozt kapnak. A vezetés haladást hall.

Aztán megérkezik az operációs számla:

- több szolgáltatást érintő változáshoz koordinált release kell,
- egy user journey debugja öt logot és három trace ID-t jelent,
- a lokális fejlesztés több setupot igényel, mint maga a feature,
- az on-call retry viharokat és duplikált esemény edge case-eket kezel.

A szállítási sebesség nem javult. A csapat több időt töltött az architektúra koordinálásával, mint a termék eredményeinek javításával.

Tanácsadói munkában ezt a mintát sokszor látom: maga a practice gyakran kiváló abban a környezetben, ahol kiforrott. Más kontextusban drága ceremonia lesz belőle.

## Az AI olcsóbbá teszi a copy-paste-t

Generatív AI előtt is másoltak a csapatok blogposztokból, konferencia-slide-okból és referencia implementációkból.

A mai különbség a sebesség és a volumen.

Egy fejlesztő kérheti:

- „generálj microservice template-et,”
- „tegyél outbox pattern-t ebbe a modulba,”
- „írj ADR-t event-driven migrációról,”
- „írj teszteket mockokkal minden dependency-re.”

Percek alatt jön a kimenet, és profin néz ki. Innen jön a veszélyes illúzió: ha az artifact szép, a döntés is helyes lehet.

Az LLM-ek erősek a domináns minták reprodukálásában. A domináns nem egyenlő az appropriáttal.

Ha a promptban nincsenek constraint-ek, tradeoffok és failure mode-ok, a modell akkor is magabiztos blueprintet ad. A plauzibilitást optimalizálja, a te kontextusodat nem.

A kockázat már csak az sem, hogy „rossz iparági mintát választottunk”.

A kockázat az, hogy „a rossz mintát gyorsabban ipariítottuk, mint ahogy validálni tudtuk volna”.

## Egy gyakorlati döntési keret

Amikor egy csapat practice átvételén gondolkodik, rövid checklistet használok, mielőtt architektúra-ábrát rajzolunk.

**1. Nevezd meg üzleti nyelven a problémát**  
Ne azt, hogy „microservice kell”, hanem azt, hogy „a release coupling két terméktételt blokkol ebben a negyedévben”.

**2. Írd le explicit a constraint-eket**  
Csapatméret, forgalom, compliance, operációs érettség, büdzsé, időhorizont.

**3. Sorold fel az alternatívákat költséggel**  
Benne a „unalmas” opciók is: moduláris monolit, strangler migráció, workflow orchestration, jobb CI, tisztább ownership.

**4. Határozz meg falsifikáló jelet**  
Mi javuljon 6-8 hét alatt mérhetően? Lead time? Incident rate? Change failure rate? MTTR?

**5. Állíts be visszavonási küszöböt**  
„Ha nő a koordinációs overhead és a lead time nem javul, leállunk és egyszerűsítünk.”

Egyszerűnek hangzik. Gyakorlatban ez állítja meg a drága sodródást.

## Hogyan néz ki a jó átvétel

Az erős csapatok nem kerülik a best practice-eket. Fordítják őket.

Megtartják a hasznos magot, és hozzáigazítják a csomagolást:

- event-driven gondolat ott, ahol az aszinkron határ valódi couplingot csökkent,
- szinkron flow ott, ahol az auditálhatóság és az egyszerűség fontosabb,
- fokozatos migráció mérhető checkpointokkal,
- dokumentált ok a választásról, nem csak az, hogy választottunk.

A practice-t hipotézisként kezelik, identitásként nem.

„Event-driven cég vagyunk” szlogen.  
„Két határon eseményt használunk, mert 30%-kal csökkent a release coupling” mérnöki gondolkodás.

Ez áthúzódik review-kra, hiringre és roadmap vitákra.

## Kapcsolat a teszteléssel, szállítással és adóssággal

Ugyanez a copy-paste dinamika megjelenik az architektúrán kívül is.

A csapatok importálnak:

- heavy mocking stratégiát, mert a tutorialok így csinálják,
- 95%-os coverage célt, mert a dashboard zöld számot vár,
- húsz lépéses pipeline-t, mert enterprise template tartalmazza,
- „zero tech debt sprintet”, mert a slide-ok ajánlják.

Mindegyik lehet hasznos. Mindegyik árthat, ha kontextus nélkül ültetik át.

Ha lassú a szállítás, lehet, hogy architektúra a gond. Lehet process, tesztdesign vagy homályos ownership is. A best practice-ek ritkán mondják meg, melyik áll fenn nálatok.

Alapértelmezést adnak.

Az alapértelmezés kényelmes. Ugyanakkor valaki más optimalizációja.

## Zárás

A best practice-ek nem az ellenség. Az ellenőrizetlen átültetés az.

A hasznos kérdés: „Ez best practice?”  
A még hasznosabb kérdés: „Melyik problémára optimalizálták ezt a practice-t, és az a mi problémánk most?”

Mérnöki érettség akkor van, amikor ötleteket kölcsönözünk anélkül, hogy valaki más constraint-jeit is átvinnénk.

Ha a csapat nagy mintaváltás előtt áll, érdemes egy munkamenetet a döntési keretre szánni, mielőtt kódgenerálás indul. Negyedévek reworkjét lehet így spórolni.

Ha ezt a képességet rendszeresen akarjátok építeni, workshopokat és képzéseket tartok architektúra-döntésekről, sociable testingről és delivery tradeoffokról: [képzési lehetőségek](/hu/kepzes).

Ha kézzel fogható segítség kell egy papíron jól néző, élesben fájó minta kibogozásához, [írj ide](/hu/contact).
