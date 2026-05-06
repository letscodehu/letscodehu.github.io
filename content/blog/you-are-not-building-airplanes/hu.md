
Sok fejlesztőcsapatban jelenik meg egy mérnöki reflex:

> ha valami elromolhat, készüljünk fel rá.

Egy külső rendszer hibás adatot küldhet, ezért validálunk.  
Hiányzó mezőkre sokszor defaultot adunk.  
Konfiguráció nélkül is megpróbáljuk elindítani az alkalmazást.  
`null` esetén gyorsan bekerül még egy ág, nehogy emiatt álljon meg a folyamat.

A mérnöki megbízhatóságról gondolkodva gyakran a repülés (vagy éppen az űrutazás) jut eszünkbe példaként:

- redundáns rendszerek,
- backup műszerek,
- vészforgatókönyvek,
- több körös biztonság.

A levegőben nincs gyors hotfix. Emiatt logikusnak tűnik a következtetés:

> a jó rendszer minden eshetőségre felkészül.

Na, pontosan itt szoktuk félreérteni a repülést.

A repülésben a megbízhatóság nem puszta redundanciából születik. Legalább ennyire lényeges, hogy a mérnökök ahol csak lehet, egyszerűsítik a rendszert.

## Régi, egyszerű megoldások

Egy kisebb általános repülőgépben több "elavultnak" tűnő technológia dolgozik.

Sok kisrepülőben ma is **karburátoros motor** van. Egy autóban ez már réginek számítana, mert a modern, elektronikusan vezérelt injektor átvette a helyét.

Repülőben viszont nagyon prózai mérnöki logika áll mögötte:

> kevesebb alkatrész, egyszerűbb működés, könnyebb hibadiagnosztika, kisebb meghibásodási felület.

Ugyanez igaz a **mágnesgyújtásra**.

Egy csomó repülőmotor gyújtása nem az akkumulátorra támaszkodik úgy, mint egy átlagos autóé. A mágnesgyújtás saját maga állítja elő a szikrát.

Részleges elektromos hiba, lemerült akkumulátor vagy generátorprobléma mellett a motor még mehet tovább, miközben a rádió vagy a transzponder akár le is állhat.

Ez redundáns megoldás, mert nyílván itt is két gyertya és gyújtókör van. Közben egyszerűsít is, mert kivon egy teljes függőségi láncot a kritikus működésből.

A repülés tanulsága így sokkal pontosabb:

> a kritikus pontokon legyen backup, a többi helyen pedig maradjon a lehető legkevesebb dolog, ami el tud romlani.

Ez a különbség szoftverben könnyen elmosódik.

Hajlamosak vagyunk azt hinni, hogy a megbízhatóság egyenlő azzal, hogy minden bizonytalanságra írunk még egy `if`-et. Sokszor épp ez termeli ki a komplexitást.

## Amikor a teszt túlképzeli a valóságot

Dolgoztam egy projekten, ahol volt egy nagy acceptance tesztkészletünk.

Az indításukhoz a teljes rendszer felállt. A külső integrációk előre eltárolt JSON fájlokból kapták a válaszokat, papíron pedig sok hibás állapotra fel voltunk készülve.

Idővel ezeket a fake válaszokat senki sem gondozta. Szépen felhalmozódtak olyan payloadok, amelyek a valós partner rendszertől gyakorlatilag nem érkezhettek volna.

Például (egy nagy marék túlzással):

```json
{
  "customerId": null,
  "status": "",
  "billingProfile": {
    "currency": null
  }
}
```

A külső contract szerint ez invalid válasz. Olyan adat, amelyet a boundaryn kellett volna megfogni.

A csapat így reagált:

> hát ha a teszt ezt adja, akkor a rendszer bírja el.

Ebből születtek az ilyen mapperek:

```python
def map_customer(response: dict) -> Customer:
    customer_id = response.get("customerId") or "UNKNOWN"
    status = response.get("status") or "PENDING"

    billing = response.get("billingProfile") or {}
    currency = billing.get("currency") or "EUR"

    return Customer(
        customer_id=customer_id,
        status=status,
        currency=currency
    )
```

Ezek a sorok elsőre rendben levőnek tűnnek: kis fallback, kis null safety, kis defensive coding.

Pont itt történik meg az a váltás, amit sokan nem vesznek észre:

A hibából legitim rendszerállapot lesz, miközben a bemenetet már a boundaryn vissza kellett volna utasítani.

## A fallback ára

Amikor azt írjuk:

```python
status = response.get("status") or "PENDING"
```

valójában létrehozunk egy új üzleti állapotot.

Van valódi `PENDING`, ahol a partner tényleg ezt küldte. Mellette megjelenik az a helyzet is, amikor nem kaptunk státuszt, ezért a rendszer `PENDING`-ként kezeli a rekordot.

Üzletileg ez két külön dolog. A kódban mégis ugyanúgy fog viselkedni.

Erre jön az `UNKNOWN` customer, a default currency, az üres billing profile, a fallback locale és az opcionális feature flag.

Minden ilyen döntés új kombinációkat termel.

A rendszer bonyolultságát gyakran az adja, hogy túl sokféleképpen tud "még éppen működni".

Pont mint egy túlbonyolított gép, ahol minden alkatrészre raktunk még egy kerülőutat, egy segédkapcsolót és egy ideiglenes bypass-t. Egy idő után senki sem tudja, normál esetben minek hogyan kellene viselkednie.

## Az AI felerősíti a mintát

Az AI-assisted fejlesztésben ez a minta könnyen felerősödik.

A modellek statisztikailag a "biztonságosnak tűnő" kódot preferálják:

- `or default`,
- `if not x return fallback`,
- `try/except pass`,
- opcionális paraméterek mindenhová.

Egy egyszerű config loaderre simán kapsz ilyet:

```python
import os

def get_config():
    return {
        "db_host": os.getenv("DB_HOST", "localhost"),
        "db_port": int(os.getenv("DB_PORT", "5432")),
        "db_user": os.getenv("DB_USER", "app"),
        "db_password": os.getenv("DB_PASSWORD", "")
    }
```

Elsőre "robosztusnak" néz ki.

Valójában olyan, mintha egy kritikus repülési rendszert rákötnénk egy csomó fölösleges elektronikára, mert attól modernebbnek tűnik.

Kényelmesebb lehet. Okosabbnak látszik. Cserébe több hibalehetőséget nyit.

Productionben a hiányzó `DB_HOST` legyen azonnali indítási hiba, ne pedig egy socket timeout percekkel később. 

## Redundancia és egyszerűség

Ezt a mérnöki tanulságot szoftverben ritkán alkalmazzuk tudatosan.

### 1. Külső bizonytalanság

Hálózati hibára retry stratégia való. Külső service elé circuit breaker kerülhet. Infrastruktúra szinten több availability zone és backup queue adhat tartalékot.

Itt a hiba a rendszerünkön kívül keletkezik, ezért a kontrollált továbbműködés hasznos.

### 2. Belső invariánsok

A kötelező config maradjon kötelező. A domain contract legyen szigorú. Az invalid payload essen el a boundaryn. A rendszer belsejében csak ismert állapotok legyenek.

A legtöbb csapat ma összemossa ezt a két helyzetet.

Mindenhová ugyanazt a defensive hozzáállást viszi. Így ott is redundáns viselkedést épít, ahol a szűkebb, világosabb állapottér lenne hasznos.

## AI guideline-ba való

Ha AI segítségével kódolunk, akkor jól jöhet egy hasonló `agents.md` részlet:

```md
## Invalid state policy

- Required environment variables must fail application startup if missing
- External contract violations must raise explicit exceptions at adapter boundary
- Domain required fields must not receive silent fallback defaults
- Unknown business state must never be mapped to an existing valid state
- Prefer fail-fast over best-effort continuation for invalid internal conditions
```

Ez azért hasznos, mert szabály nélkül az AI gyakran a "mindenre készüljünk fel" mintát másolja.

## Automatizált szabályok

Mivel az AI vagy betartja a rule-okat, vagy sem, ezért érdemes lehet akár ArchUnit szinten is ilyen gondolkodást érvényesíteni.

Például tilthatjuk, hogy kritikus config defaultot kapjon:

```java
@ArchTest
static final ArchRule critical_config_must_not_have_defaults =
    fields()
        .that().areDeclaredInClassesThat().resideInAPackage("..config..")
        .should().notBeAnnotatedWith(Value.class);
```

A lényeg:

**a valid állapotok szűkítését ugyanúgy ellenőrizni kell, mint a code style-t.**

## Kevés lehetséges állapot

A repülésből azt érdemes megtanulni, hogy a kritikus pontokon legyen backup, máshol pedig maradjon a lehető legegyszerűbb működés.

A kisrepülő bizonyos pontokon azért megbízhatóbb, mert kevesebb benne az a komponens, amely váratlan módon viselkedhet.

Szoftverben ugyanez igaz.

Minden extra fallback, fölösleges default és "hátha mégis működjön" logika új állapotot hoz létre. Több tesztelési kombinációra lesz szükség, és csak további hibalehetőségeket nyit.

Az AI korszakában fontos mérnöki képesség lesz pontosan látni, hol kell redundanciát építeni, és hol kell egyszerűsíteni.

A megbízhatóság akkor nő, amikor eleve kevés dolog tud rosszul történni.