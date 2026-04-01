Mi van, ha a skálázási problémádnak semmi köze az infrastruktúrához?

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

[Írj, és találjuk meg együtt a jó skálázási irányt](/hu/contact).