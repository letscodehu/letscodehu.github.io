
Képzeld el, hogy épp egy új rendszert készülsz tervezni. Leülsz, megnyitod a jegyzeteidet, esetleg egy diagramkészítő eszközt, és az agyad azonnal a szokásos kérdésekre ugrik. Monolit vagy microservice? Milyen adatbázis? Milyen technológiai stack? Talán még az is eszedbe jut: „Skálázható legyen már az első naptól?” Elsőre ez teljesen ésszerűnek tűnik.

Csakhogy van egy lépés, ami ezek elé kívánkozik.

Van egy kérdés, amit szinte soha senki nem tesz fel: *milyen problémát is oldasz meg valójában?* Nem a feature-t. Nem a rendszert. Hanem a valódi problémát.


## Ahogy ez általában történik

Képzeld el, hogy egy felhasználó odamegy hozzád, és azt mondja: „Figyelj, valahogy jó lenne követni a leadeket.” Egyszerűen hangzik, nem? Ami ezután jön, az már kevésbé.

Azonnal megindul az agyunk a megoldás irányába. Már pörög is a belső checklist: kell egy backend, kell egy frontend, autentikáció, nyilván, valószínűleg integrációk is.

Egy ponton valaki bedobja a microservice-eket, biztos ami biztos.

Közben senki nem áll meg, hogy megkérdezze: *mit jelent itt pontosan az, hogy „leadek követése”?* Milyen lépésekből áll, ki mit csinál, milyen gyakran, és mi számít sikernek?

Rendszert tervezni szórakoztató. A problémát mélyen megérteni – az már munka.


## Egy másik, túl ismerős történet

Most képzeld el a következő kérést: „Szeretném kezelni a fizetéseket.” Ilyenkor sok csapatnál ugyanaz a forgatókönyv indul el.

Már gondolkodsz is: kellenek felhasználói fiókok, bejelentkezés, talán szerepkörök és jogosultságok, webhookok szinte biztosan, valamilyen konténeres infrastruktúra, load balancer, monitoring.

Kezd egész „rendes rendszer” kinézete lenni. Olyasmi, amit szívesen meg is mutatnál másoknak.

Aztán kicsit hátrébb lépsz, és felteszed a kérdést: *mi is történik itt valójában?*

Az illető kiküld talán heti két számlát. Nincs lezárt tartalom, nincs előfizetéses modell, nincs bonyolult billing logika. Egyszerűen csak pénzt szeretne kapni.

És mi máris egy teljes architektúra-döntési kérdést csináltunk egy nagyon egyszerű folyamathoz.


## Mit mondanak az adatok?

Ez nem csak egy sejtés vagy személyes tapasztalat. Van mögötte elég sok kutatás is.

Ha megnézed a DORA riportokat, a jól teljesítő csapatok nem attól lesznek sikeresek, hogy kifinomultabb vagy látványosabb rendszereket építenek. Sokkal inkább attól, hogy *gyorsabban szállítanak értéket*.

A lead time-re figyelnek, a visszajelzés sebességére, az eredményekre. Nem arra, hogy mennyire „future-proof” az architektúra.

És ott vannak a CHAOS riportok. Évek óta nagyjából ugyanazt látni bennük: a megépített feature-ök nagy része alig használt, vagy soha, senki nem használja őket érdemben.

Ha ezt végiggondolod, nehéz amellett érvelni, hogy a legnagyobb kockázatunk az, hogy nem terveztünk elég nagyot. Sokkal inkább az, hogy rengeteg energiát teszünk olyan dolgok túltervezésébe, amelyeknek valójában nagyon kicsi a súlya a mindennapi használatban.


## Kérdések, amik mindent átírnak

Szóval mielőtt akár csak megnyitnád az Excalidraw-t, érdemes egy percre lelassítani, és feltenni pár nagyon alap kérdést.

Kinek készül ez? Mit akar valójában elérni? Milyen gyakran fogja használni? Mennyire fáj most ez a probléma?

És talán a legfontosabbat: *mi történik, ha ez a rendszer soha nem készül el?*

Ha az őszinte válasz valami ilyesmi: „Hát, megoldják… csak egy kicsit kényelmetlenebb lesz”, akkor valószínűleg nem egy üzletkritikus, rendszerszintű problémáról beszélünk.

Inkább egy kellemetlenségről, egy kis súrlódásról a folyamatban. Erre is lehet rendszert építeni, de nem mindegy, milyen áron és milyen sebességgel.


## Két nagyon eltérő út

Térjünk vissza a példákhoz: leadek követése, fizetések kezelése. Mindkét esetben nagyjából két utad van.

Az első nagyon egyszerű.

Fogsz valamilyen általános eszközt: Notion, Google Sheets, kézi számlázás, egy Stripe fizetési link, és összeállítasz egy minimális folyamatot. Nem elegáns, nem teljesen automatizált, de gyorsan megvan, és azonnal van belőle érték.

Pár óra munka után már látod, hol akad el a folyamat, mit felejtenek el az emberek, hol lenne igazán szükség automatizációra.

A második út sokkal ismerősebb a fejlesztőknek.

Rendszert építesz. Backend, frontend, autentikáció, infrastruktúra, monitoring, CI/CD. Most már van valami igazán impozáns – legalábbis technikai szemmel.

Csakhogy nehéz is. Lassú felépíteni, és drága fenntartani. Közben pedig telik az idő, és a környezet nem áll meg: változnak a prioritások, alakul a kontextus, néha maga az igény szűnik meg.

*Ilyenkor derül ki, hogy a legegyszerűbb megoldás sokkal tovább bírta volna.*

Nem azért, mert technológiailag „okosabb”, hanem mert gyorsabban kiderül róla, hogy működik-e, és kevesebb áldozatot követel, ha módosítani kell rajta. Könnyebb elengedni vagy átalakítani valamit, amibe pár nap munkát tettél, mint egy több hónapos fejlesztést.

![Two paths](/blog/chaos.png)

## Amikor az architektúra tényleg számít

Ez persze nem azt jelenti, hogy sose építs rendszert, vagy hogy az architektúra másodlagos.

Vannak helyzetek, amikor nagyon is számít, hogyan épül fel a rendszered. Amikor valódi méretről beszélünk, amikor több csapatnak kell egymástól függetlenül dolgoznia, amikor a domain eleve bonyolult, vagy szigorú szabályozási környezetben működsz.

Ilyenkor a kifinomultabb megoldásoknak bőven van létjogosultsága. Csak érdemes különválasztani a „tényleg nem férünk már el” típusú helyzeteket attól, amikor annyit mondunk: „Lehet, hogy majd egyszer szükség lesz rá.”

A gyakorlat elég sokszor megmutatja, hogy ez a „majd egyszer” vagy soha nem érkezik meg, vagy egészen más formában jelenik meg, mint ahogy elképzeltük.


## Mi történik valójában a háttérben?

A legtöbb túltervezett rendszer mögött nem rossz szándék áll, és nem is feltétlenül hiányzó szakmai tudás. Sokkal inkább bizonytalanság.

Nem akarunk rossz döntést hozni. Szeretnénk minden lehetséges jövőre felkészülni. És ha őszinték vagyunk magunkhoz, néha benne van az is, hogy jó érzés valami „impozánsat” építeni, amire szakmailag is büszkék lehetünk.

*A csavar ott van, hogy ha egyszerre túl sok lehetséges jövőre próbálsz tervezni, könnyen elcsúszik a fókusz arról az egy-két dologról, ami most tényleg számítana.*

Ahelyett, hogy kiderítenénk, mi az az egy konkrét probléma, amit ma érdemes megoldani, és mi az a legegyszerűbb megoldás, ami már elég jó.


## Egy kérdés, ami sok felesleges munkát megspórol

Nem nagyon látni olyan projekteket, amelyek azért mentek volna félre, mert az első verzió túl egyszerű volt. Olyat annál inkább, ahol hosszú hónapok mentek el egy olyan jövő támogatására, ami végül soha nem vált valósággá.

Szóval legközelebb, amikor már nyitnád is a diagramkészítőt, mielőtt dobozokat rajzolsz és nyilakat húzol, mielőtt architektúráról döntenél, állj meg egy pillanatra.

*Tedd fel magadnak ezt a kérdést:*

**Egyáltalán érdemes ezt a problémát most megoldani?**

Ha a válasz igen, utána már lehet arról beszélni, mekkora rendszert indokol, és hogyan nézzen ki az első verzió, ami tényleg bizonyítja, hogy van értelme tovább építeni.

---

Ha ez a cikk elérte, hogy kicsit megállj, mielőtt megrajzolod az első dobozt, akkor valószínűleg másnak is segítene.

Oszd meg azokkal, akik rendszeresen túl nagyot építenek túl korán – és ha szeretnél még hasonló, hype-mentes gondolatokat a szállításról és az architektúráról, iratkozz fel a Youtube-csatornámra vagy kövess a LinkedInen.


---

## Források

DORA / Accelerate State of DevOps  
<https://dora.dev/research/>

Standish Group CHAOS Report summary  
<https://www.projectsmart.co.uk/white-papers/chaos-report.pdf>

Accelerate (Forsgren, Humble, Kim)