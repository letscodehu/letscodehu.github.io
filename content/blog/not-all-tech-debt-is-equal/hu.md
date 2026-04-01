A tech debt nem egyetlen általános probléma.

A legtöbb csapat még mindig úgy beszél róla, mintha csak egy nagy takarítási kategóriáról lenne szó:
"csökkentenünk kell a tech debt-et."

Érett gondolkodásra vall, de a gyakorlatban viszont gyakran semmit nem jelent.

Amikor minden kellemetlen jelenséget tech debtként címkézünk, eltűnik a priorizálás. A csapat folyamatosan "törleszt", de a szállítás nem lesz gyorsabb.

## A felosztás, ami jobb döntéshez vezet

Hasznosabb, ha három kategóriára bontjuk:

1. Stratégiai tech debt
2. Véletlen tech debt
3. Architekturális tech debt

Backlog-címkében hasonlónak tűnhetnek, de teljesen máshogy viselkednek, ezért más döntést igényelnek.


## 1) Stratégiai tech debt

A stratégiai tech debt tudatos.

Direkt halasztasz egy tisztább megoldást, mert most a sebesség, a tanulás vagy a validáció fontosabb.

Példák:

- hardcode-olt értékek, mielőtt valódi konfigurációs modell készül,
- absztrakciók kihagyása, amikor még csak egy use case létezik,
- moduláris monolit megtartása, mielőtt túl korán service-határokat vezetnél be.

Ezek nem "lusta shortcutok", hanem trade-offok.

Időt vásárolsz azzal a tudattal, hogy később munka lesz vele.
E nélkül a legtöbb csapat vagy túltervez, vagy nem szállít.

A stratégiai tech debt nem ellenség.
Akkor válik azzá, ha nem tudjuk, hogy éltünk vele.

## 2) Véletlen tech debt

A véletlen tech debt az, amire a legtöbben azonnal gondolnak:
copy-paste logika, rossz elnevezések, hiányzó tesztek, duplikált edge-case kezelés.

Ez általában kapkodásból, nemtörődömségből vagy normális emberi hibákból jön.

Rontja az olvashatóságot és növelheti a hibakockázatot, de többnyire izolált.
Célzott refaktorral, fegyelmezettebb review-val és jobb alapbeállításokkal javítható.

Ez az a kategória, ami **valóban** befér egy sprint ticketbe.


## 3) Architekturális tech debt

Az architekturális tech debt rendszerszintű:
rossz határok, tight coupling, netán a valóságtól elszakadt domain modell.

Ez a legveszélyesebb típus, mert csendben indul.
Eleinte a velocity akár jónak is tűnhet, ezért fel sem tűnik, hogy baj van.

Aztán lassan megtörik a görbe:

- minden új feature több idő,
- a változtatások kockázatosabbak,
- a csapatok elkezdik blokkolni egymást,
- a hibakeresés régészetté válik.

Ilyenkor már nem egy implementációs részletet javítasz, hanem a rendszer idegrendszerét kell megműteni.

### Egy valós példa

Minden egy egyszerű igénnyel indult: "gyorsan át kell adnunk a felhasználó beállítását három-négy modulon keresztül."

Ahelyett, hogy újratervezték volna az adatfolyamot, létrehoztak egy Context nevű objektumot.
Ez egyfajta svájci bicska lett: bárki belepakolhatott bármit, és bárki kivehetett belőle bármit.

Akkor ez zseniális gyorsítósávnak tűnt.
A döntés egyszerű volt: "majd ha több időnk lesz, szétválasztjuk a felelősségi köröket, de most szállítanunk kell a funkciót."

#### A "lopakodó" fázis: láthatatlan terjeszkedés

Ahogy teltek a hónapok, jöttek az új fejlesztők.
Látták, hogy van egy objektum, ami mindenhol ott van.
Ha kellett egy új jogosultság-ellenőrzés vagy egy munkamenet-azonosító, a legegyszerűbb az volt, hogy "bedobják a közösbe".

A Context objektum hízni kezdett.
Már nem 5, hanem 50 tulajdonsága volt.

Senki nem érezte a veszélyt, mert a rendszer működött.
Sőt, rövid távon gyorsnak tűnt a fejlesztés, mert nem kellett határokkal és adatfolyammal foglalkozni, elég volt a közös kosárhoz nyúlni.

#### A "beágyazódás" fázis: amikor a megoldás csapdává válik

Ez az a pont, ahol a korábbi döntés eléri a kritikus tömeget.
A Context már nem csak egy adatcsomag, hanem a rendszer idegrendszere.

Minden új modul, amit írtak, feltételezte a Context jelenlétét.
Eleinte csak kényelmi rétegnek tűnt, később viszont megtartó szerkezetté vált.

A fordulópont akkor jött el, amikor valaki egy komponenst Context nélkül akart futtatni egy automata tesztben.
Kiderült, hogy gyakorlatilag lehetetlen: a fél rendszert be kellett volna húzni hozzá.

#### Az eredmény: strukturális merevedés

Egy apró változtatás a Context egyik mezőjén beláthatatlan dominóhatást indított el.
A hibakeresés nyomozássá vált: ki módosította az objektumot, és hol íródott felül az érték.

A fejlesztők elkezdték félteni a kódot.
Senki nem akart hozzányúlni a közös részhez, mert mindenki tudta, hogy ha ott valami eltörik, az egész rendszer borulhat.

#### Miért nem látszott előre?

Mert a folyamat fokozatos volt.
Nem egyetlen rossz döntés született, hanem több száz apró, akkor még ésszerűnek tűnő kompromisszum.

Amikor végül felismerték, hogy a szerkezet fenntarthatatlan, már nem egy sima javításra volt szükség.
A javítás költsége addigra magasabb lett volna, mint több érintett modul újragondolása.

A tanulság egyszerű:
ami ma egy apró, elnézett shortcut, az holnap a fejlesztési sebességed plafonja lehet.
Nem azért kell rendet tartani, mert a kódnak szépnek kell lennie, hanem azért, hogy a rendszer ne váljon saját maga foglyává.

## Miért bukik el a "csökkentsük a tech debt-et" terv?

Sok roadmapen van egy általános "tech debt" sor.
Viszont besorolás nélkül ez tipikus mintát eredményez:

- azt javítjuk, amit könnyű javítani,
- a látványos lokális takarítás kap figyelmet,
- a strukturális tech debt marad.

Az output nő, ám a valódi átfutás nem javul.


## Mit csinálj helyette

Kezdd a nyelvvel:

- stratégiai,
- véletlen,
- architekturális.

Utána hatás alapján priorizálj, ne esztétika alapján.

És egy dolgot fogadj el:
tech debt egy egészséges terméken mindig lesz.

Ha látszólag nulla, akkor valószínűleg vagy nem szállítasz elég gyorsan, vagy túl korán overengineeringelsz.

## Záró gondolat

Nem a tech debt a fő probléma.
Az irányítatlan, összemosott tech debt az.

Ha minden roadmapen szerepel a "tech debt", de a csapat továbbra sem ért egyet abban, mi blokkolja a szállítást, az ritkán kapacitás probléma.
Ez már inkább osztályozási probléma.

Ha ez ismerős, beszéljünk arról, hogyan válasszuk szét azt a techdebtet, ami tényleg lassítja a szállítást, attól, ami csak zaj.

[Írj, és javítsuk együtt a szállítási döntéseket](/hu/contact).