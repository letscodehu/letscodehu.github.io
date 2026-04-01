Sokan azt mondják, hogy az ADR jó dolog. És igazuk is van.

Az ADR (Architecture Decision Record) lényege egyszerű: ha fontos architekturális döntést hoztok, azt leírjátok. Kontextus, opciók, érvelés, végső döntés.

Így amikor fél év múlva valaki megkérdezi, hogy miért pont ezt az adatbázist választottátok, miért van itt queue, vagy miért három szolgáltatásra van bontva a rendszer, nem Slack threadeket és félhomályos meeting-emlékeket kell visszafejteni.

Elvben ez óriási érték.

## Miért bukik el mégis sok ADR?

Sok csapatnál az ADR-ek léteznek, mégis időpocsékolásnak érződnek. Nem azért, mert rossz az ötlet, hanem mert a valódi haszon nem jelenik meg.

Az első probléma a megtalálhatóság. Kisebb csapatban még működik a dokumentációs kereső. Nagyobb szervezetben viszont egyetlen ADR-keresésre jön 200 találat: archív oldal, régi meetingjegyzet, félig releváns belsős wiki. A döntés "elvileg megvan", gyakorlatban viszont nincs kéznél.

A második probléma, hogy az ADR könnyen rituálévá válik. Van template, van review meeting, van approval, de a valódi döntések nem ezekben a fórumokban születnek. A csapat kipipál egy folyamatlépést, miközben a döntéshozatali minőség nem javul.

## Az ADR nem szünteti meg a bias-t

Az ADR formailag bemutathat több opciót, mégis torzíthat. Ha az író SQL-ben magabiztos és NoSQL-ben bizonytalan, a megfogalmazás eleve billen:

- az SQL érettnek és megbízhatónak hangzik,
- a NoSQL kockázatosnak és túl bonyolultnak.

Mindkettő lehet valid út, mégis az ismerős technológia kap jobb narratívát. Az ADR az érvelést rögzíti, de nem teszi automatikusan objektívvé.

## A valódi érték: a közös gondolkodás

A legtöbb csapat dokumentációnak tekinti az ADR-t, pedig az igazi értéke a döntés előtti gondolkodás kikényszerítése.

Mi a valódi kontextus?  
Mely alternatívák életképesek ténylegesen?  
Mely tradeoffok számítanak igazán?  
Milyen következményeket fogadunk el tudatosan?

Ha ezekre még a végleges döntés előtt válasz születik, az ADR működik. Ha csak utólag írjátok meg, akkor inkább történeti napló.

## Egy drága példa: KMS + CloudHSM

Egy korábbi terméknél arról döntöttünk, hogyan tároljuk a titkosítási kulcsokat. Az üzleti oldal nyilván erős biztonsági sztorit akart, a compliance oldal auditálhatóságot, a technikai oldal pedig minél kevesebb operatív terhet.

AWS KMS + CloudHSM kombináció mellett mentünk el. Papíron ez tökéletesen nézett ki: managed szolgáltatás, hardveres kulcsvédelem, enterprise-kompatibilis security narrative. A döntési beszélgetésben viszont túl sok fókusz ment arra, hogy "mennyire erős kriptográfiailag", és túl kevés arra, hogy "mi történik, ha az account szintjén van baj".

A hiányzó kérdés egyszerű volt: mi a disaster recovery terv account compromise esetére?

Ezt nem bontottuk ki időben. Hónapokkal később, egy reziliencia-áttekintésen derült ki, hogy ha az AWS account kompromittálódik, a KMS és CloudHSM kapcsolatát nem tudod csak úgy egy másik accountban reprodukálni, mintha semmi nem történt volna.

Ez alapjaiban írta át a kockázatot. Addigra a rendszer már erre épült, több komponens kulcskezelése függött ettől, és éles adatok voltak az adott modell szerint titkosítva.

A korrekció nem "egy gyors ticket" volt. Újra kellett tervezni a kulcs-életciklus egy részét, migrációs folyamatot építeni a már titkosított adatokhoz, koordinálni az átállást, és végigtesztelni az incidenskezelést. Hetek mentek el rá, jelentős termékfejlesztési kapacitás árán.

Megoldotta volna ezt önmagában egy ADR sablon? Nem. De ha a döntésbe korán bevonunk még egy-két nézőpontot, és valaki felteszi a DR kérdést, nagy eséllyel még implementáció előtt felszínre jön ez a vakfolt.

Ez a lényeg: nem a dokumentum az érték, hanem a beszélgetés, amit kikényszerít.

## Mikor működik jól az ADR?

Tapasztalatból három egyszerű szabály:

1. Olyan döntésekhez használd, amelyeket drága visszafordítani (adatbázis, kommunikációs minta, rendszerhatárok).
2. A végleges döntés előtt készüljön, ne implementáció után.
3. Legyen egyszerű: kontextus, opciók, tradeoffok, döntés, következmények.

Kezdetben retrospektív ADR-ek is hasznosak lehetnek gyakorlásként, de a cél az, hogy az ADR valós időben formálja a döntést.

## Záró gondolat

Az ADR nem haszontalan.

Akkor bukik el, ha csak passzív dokumentáció marad.

Ha az ADR-ed nem befolyásolta magát a döntést, akkor az nem igazán architecture decision record. Az csak dokumentáció.

Ha szeretnél jobb architekturális döntéseket a csapatodban, segítek kialakítani egy könnyű, működő ADR folyamatot, ami még implementáció előtt felszínre hozza a vakfoltokat.

[Írj, és nézzük meg együtt a döntési folyamataitokat](/hu/contact).