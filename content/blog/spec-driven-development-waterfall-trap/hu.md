Nemrég beszéltem egy csapattal, amelyik nagy lelkesedéssel váltott spec-vezérelt fejlesztésre.

Ők is ugyanazt olvasták, amit mindenki olvas mostanában. „A spec maga a prompt." Hagyd el az ad-hoc, mondatról mondatra való promptolgatást, írj előbb egy strukturált specifikációt, aztán hagyd, hogy az ágens az alapján dolgozzon. Az olyan eszközök, mint a [GitHub Spec Kit](https://github.com/github/spec-kit) és az [AWS Kiro](https://kiro.dev/), ezt egy kész munkafolyamattá alakítják: spec, terv, feladatok, implementáció.

Leültek hát, és gondosan megírták a következő feature specifikációját. Célok, korlátok, elfogadási kritériumok, edge case-k. Az agent nekiállt, és egy délután alatt egy meglepően teljes implementációt rakott le.

Két héttel később az egészet újraírták.

A kód működött. Pontosan azt csinálta, amit a spec mondott. A baj az volt, hogy a spec egy olyan feature-t írt le, amelyet senki sem akart valójában abban a formában — és a valódi igényeket csak akkor fedezték fel, amikor megnézték, hogyan próbálják használni az emberek az első verziót.

## Az ígéret valódi

A spec-vezérelt fejlesztés egy valódi problémát old meg.

A vibe coding — az a laza szokás, hogy mondatról mondatra promptolod az ágenst, és elfogadod, amit visszaad — szétesik, ahogy a rendszer növekszik. Nincs közös szándék, nincs elfogadási kritérium, nincs nyoma, hogy miért úgy néz ki a kód, ahogy kinéz. Végül egy halom lokálisan helyes töredéket kapsz, amelynek az egészéről lehetetlen összefüggően gondolkodni.

A spec előzetes megírása arra kényszerít, hogy gondolkodj, mielőtt kódot generálsz. Explicit célokat ad az ágensnek egy homályos "vibe" helyett. A csapatnak is ad valamit, amit átnézhet — és ez kisebb és átláthatóbb, mint ezer sor generált kód.

A baj ott kezdődik, amikor ezt a specifikációt úgy kezelik, mint valamit, amit egyszer, előre, a fejlesztés megkezdése előtt _kell_ jól megcsinálni.

## Ezt a filmet már láttuk

A nagy előzetes tervezés volt a vízesés-modell alapígérete. Gyűjtsd össze az összes követelményt, írd meg a teljes specifikációt, hagyják jóvá, aztán építsd meg pontosan _azt_. Minden fázis le kell záruljon, mielőtt a következő elkezdődik.

Ez megbukott — mégpedig egy olyan okból, amelynek semmi köze a fegyelemhez vagy az eszközökhöz. A követelmények, amelyeket az elején leírsz, a legjobb becslésed, és ez a találgatás olyan módon hibás, amelyet még nem láthatsz. Azzal tanulod meg, milyennek kellene lennie a rendszernek, ha megépíted azt, megmutatod az embereknek, és figyeled, ahogy a valóság visszaszól.

Az egész agilis mozgalom erre volt a válasz. Szállíts valami kicsit, kapj visszajelzést, igazodj. Kezeld a tervet hipotézisként, nem pedig egyfajta szerződésként.

A spec-vezérelt fejlesztés csendben visszahozhatja ezt a vízesés-feltételezést.

A spec részletes, verziókezelt. Ez az input, amelyet az ágens követ. Ez a tény csábítóvá teszi, hogy úgy írjuk a specet, mintha már tudnánk a választ, igy a fejlesztést egy lezárt döntés végrehajtásaként kezeljük.

Ha valóban tudod, mit akarsz, ez persze rendben is van. Egy payment webhook handler dokumentált kontrakt-al, egy CSV export ismert formátummal, egy migráció egyértelmű előtte és utáni állapottal. A probléma jól körülhatárolt, tehát egy teljes előzetes spec ilyenkor becsületes dolog.

Ellenben a legtöbb termékfejlesztési munka nem így néz ki.

## A tudás a nehéz rész

Ha a követelmény annyi, hogy „a felhasználók valahogyan nyomon tudják követni a leadjeiket", vagy „szeretnénk kezelni a fizetéseket", a spec nem egy ismert dolog leírása. Feltételezések összessége egy dologról, amelyet még nem is validáltál.

Megírhatod ezt a specet nagy részletességgel. Meghatározhatod a lead-fázisokat, az értesítési szabályokat, a tömeges importot, a jogosultságmodellt. Az ágens _boldogan megépíti_ mindezt. Viszont ezek a részletek nem teszik helyesebbé a feltételezéseket. Csak drágábbá teszik a tévedést, mert most már van egy csiszolt implementáció, amely mindegyiket védi.

Egy homályos prompt, amely eldobható kódot produkál, legalább jelzi a saját bizonytalanságát. Egy pontos spec, amely magabiztos, teljes implementációt produkál, a struktúra egy rétege alá rejti ezt a bizonytalanságot. A csapat átnézi a specit, az pedig alaposnak tűnik, igy aztán mindenki halad tovább. A baj az, hogy a kérdések, amelyeket fel kellett volna tenni, soha nem merülnek fel, mert a dokumentum már úgy hangzik, mintha megválaszolta volna őket.

Ez ugyanaz a hibamód, amelyről [az AI-generált ADR-ekről szóló cikkemben](/hu/blog/p/ai-generated-adrs) írtam: egy jól strukturált dokumentum képes egy találgatást döntésnek álcázni.

## Iteráld a specet, ne csak a kódot

A megoldás nem az, hogy elhagyjuk a speceket. Az, hogy elismerjük: a spec soha nincs készen.

Kezeld a specit úgy, ahogy bármilyen tervet kezelnél egy feedback-vezérelt folyamatban. Írd meg a lehető legkisebb verziót, amely azt rögzíti, amit most _valóban_ tudsz. Építsd meg azt. Tedd valódi felhasználók, vagy legalább valódi adatok elé. Tanuld meg, mit rontottál el. Aztán és csakis aztán változtasd meg a specet.

Ebből néhány dolog következik.

Tartsd az első specet szándékosan vékonynak. Határozd meg azt a részt, amelyről biztos vagy, és a bizonytalan részeket hagyd nyitott kérdésként, ahelyett hogy kitalálnál válaszokat rájuk. Egy spec három becsületes „még nem tudjuk" megjegyzéssel hasznosabb, mint harminc magabiztos bekezdésnyi fikció.

Azért építs, hogy tanulj, ne azért, hogy befejezz. Az első implementáció arra való, hogy megmondja, megállják-e a helyüket a feltételezések. Ha valaki használatát figyelve megváltozik a képed, a spec végzi a munkáját — nem kudarcot vall.

Frissítsd a specet, amikor a valóság ellentmond neki. Az a verzió számít, amelyik tükrözi, amit most tudsz. Egy spec, amely két hónappal később még mindig az eredeti találgatást írja le, már nem specifikáció — csak egy dokumentum, amely túlélte a saját relevanciáját.

## Mire való valójában a spec

A spec értéke nem az, hogy teljes. Az, hogy megírása gondolkodásra kényszerít, és hogy az ágenst az általad szándékosan választott határokon belül tartja.

Egy jó spec arra kényszerít, hogy korán szembenézz a nehéz kérdésekkel. Kinek szól ez? Minek kell igaznak lennie ahhoz, hogy működjön? Mit nem csinálunk meg még szándékosan? Ezek a válaszok többet érnek, mint bármilyen elfogadási kritérium, mert azt alakítják, hogy egyáltalán mi épül meg.

Az ágensnek más okból van szüksége a specre. Laza prompt esetén az általánosan elfogadhatónak tűnő megoldás felé sodródik — ugyanúgy, ahogy mikroservice-ekhez és message brokerekhöz nyúl, ha architektúráról kérdezed. A spec a póráz. Megmondja a modellnek, melyik problémát oldod meg, és melyik megoldások nem jönnek szóba.

Ezekhez a feladatokhoz nem kell, hogy a spec elsőre helyes legyen. Mindkettő jól bírja az iterációt.

Tehát ha bevezeted a spec-vezérelt fejlesztést, kezeld a specet egy visszajelzési ciklus élő inputjaként. Azok a csapatok égnek meg, amelyek egyszer megírják a specet, megbíznak benne, mert részletes, és harminc évvel később fedezik újra fel, miért hagytuk abba a szoftver ily módon való fejlesztését.

---

Ha ez arra késztetett, hogy újra megnézz egy specet, amelyet egy kicsit túl magabiztosan írtál, valószínűleg a csapatod valamelyik tagjának is hasznos lesz.

Oszd meg azokkal, akik most nyúlnak a spec-vezérelt munkafolyamatok felé — és ha több hype-mentes gondolkodást szeretnél a szoftverfejlesztésről és az architektúráról, iratkozz fel a YouTube-csatornámra, vagy kövess LinkedIn-en.
