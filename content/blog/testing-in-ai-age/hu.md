Nemrég egy kollégával beszélgettünk a tesztelésről, és elég gyorsan kiderült, hogy teljesen máshonnan nézzük.

Ő ezt így fogalmazta meg:

> „A unit tesztek több kárt okoznak, mint amennyi értéket termelnek.”

Ezt az álláspontot könnyű megérteni, mert mindketten láttunk rossz példákat.

Egy projektről részletesen beszélek a [Continuous Failure előadásban](https://vimeo.com/1102474381): ott szinte kizárólag integration tesztek voltak, egy-egy teszt futása másodpercekig tartott, és a suite a végére kifejezetten belassult.

A másik végletet egy korábbi munkahelyen tapasztaltam. Szinte mindenre írtak unit tesztet, sokszor belső implementációs részletekre. A karbantartás rémálommá vált, és ugyanazt váltotta ki a csapatból, mint amit most a kollégám mondott: zsigeri ellenállást a tesztekkel szemben.

Ebből nekem az maradt meg, hogy a két szélsőség között van egy működő sáv. Itt jönnek képbe a sociable unit tesztek.

## Egy túl ismerős, dummy példa

Nézzünk egy szándékosan leegyszerűsített, dummy példát, ami több valós helyzet tipikus mintáját sűríti egybe.

Jött egy viszonylag egyszerű feature: rendelés végösszeg számítása és mentése. Nem rocket science. Egy service, egy pricing logika, egy repository mentés.

A fejlesztő megkérte az AI-t, hogy írjon teszteket. Az AI szorgalmasan megírta:

- hogy meghívódik a pricing service,
- hogy meghívódik a repository,
- hogy pontosan egyszer hívódik egy mapper,
- hogy a hívások egy konkrét sorrendben történnek.

Papíron ez “alapos” lett. Coverage felment. Merge ment. A csapat közben *hamis biztonságérzetet* kapott.

Két sprinttel később jött egy refaktor:

- kiszedtek egy köztes komponenst,
- átneveztek pár osztályt,
- a belső együttműködés sorrendje változott.

Az üzleti viselkedés ugyanaz maradt. A rendszer ugyanúgy számolt és mentett.

A tesztek fele mégis piros lett.

Itt jön az első fontos felismerés: ezek a tesztek a belső megvalósítást fagyasztották be, a rendszer viselkedését pedig alig védték.

## Mit tanult meg az AI a tréningadatokból?

Az AI nem rosszindulatú, és nem is “buta”. Egyszerűen azt adja vissza, ami a mintákban domináns.

A legtöbb nyilvános kódbázisban és példában azt látja, hogy a “jó unit teszt” így néz ki:

- sok mock,
- sok `verify`,
- metódushívások ellenőrzése,
- branch-enként külön teszt.

Ebből könnyen lesz ilyen:

```java
@Test
void shouldCallPricingServiceAndRepository() {
    OrderRequest request = TestData.orderRequest();

    when(pricingService.calculate(any()))
        .thenReturn(Money.of(100));

    orderService.placeOrder(request);

    verify(pricingService).calculate(any());
    verify(repository).save(any());
}
```

Technikailag ez teszt.

Tervezési szempontból ez egy törékeny függés a belső működéstől.

Ilyenkor már egy belső átrendezés is elég ahhoz, hogy a teszt eltörjön, akkor is, ha a viselkedés változatlan marad.

## Hol kezd el fájni?

Sokáig sehogy. Pont ez benne a veszélyes.

A probléma akkor jön elő, amikor a rendszer már él:

- sok fejlesztő nyúl ugyanahhoz a modulhoz,
- gyakoriak a refaktorok,
- egyre több AI-generált teszt kerül be.

Ilyenkor a “teszt karbantartás” csendben külön költségközponttá válik.

A tipikus tünetek:

- PR-okban száz+ sor tesztváltozás, minimális üzleti változással,
- review fáradtság, mert a változás nagy része zaj,
- reflex: “ha eltört, generáld újra AI-val”.

Ez rövid távon működik, hosszú távon viszont drága:

- tokenben,
- review időben,
- figyelemben,
- és főleg bizalomban a tesztcsomag iránt.

## Miért számít, hogy gyors legyen a teszt?

A tesztsebesség maga a szállítási sebesség.

Ha a pipeline-ban hosszú perceket vagy akár 20 percet várunk arra, hogy kiderüljön rendben van-e a módosítás, minden körben szétesik a fejlesztői fókusz. Ezt az állásidőt végül ugyanúgy a csapat fizeti meg.

Ugyanez igaz az AI-alapú fejlesztésre is. A kód fénysebességgel elkészül, de a validáció továbbra is döcög, ezért a teljes ciklus tempóját a tesztek futási ideje diktálja.

Itt látszik igazán, miért értékes a kiegyensúlyozott tesztpiramis: gyors visszajelzés napközben, erős biztonsági háló release előtt.

## A két szélsőség tesztelésben

A legtöbb csapat ugyanabba a két végletbe csúszik:

**1. Klasszikus izolált unit teszt túlzott mockinggal**  
Mindent mockolunk, minden interakciót verifikálunk. Gyors, de törékeny.

**2. Full integrációs teszt mindenre**  
Feláll az egész környezet. Realisztikusabb, de lassú és nehéz karbantartani.

A gyakorlatban sokszor a köztes sáv működik jól: viselkedésfókuszú, kisméretű “sociable” tesztek.

Olyan tesztek, ahol:

- néhány komponens együtt fut valódi objektumokkal,
- minimális a mocking,
- az eredmény és a rendszer viselkedése a mérvadó.

Például:

```java
@Test
void shouldCalculateFinalPriceForOrder() {
    InMemoryOrderRepository repository =
        new InMemoryOrderRepository();
    PricingService pricingService = new PricingService();
    OrderService service =
        new OrderService(pricingService, repository);

    OrderRequest request = new OrderRequest(
        List.of(new Item("Book", 2, Money.of(50)))
    );

    Order order = service.placeOrder(request);

    assertThat(order.total())
        .isEqualTo(Money.of(100));
    assertThat(repository.findAll()).hasSize(1);
}
```

Ez a típusú teszt sokkal jobban túléli a belső refaktorokat, mert nem az internálokra esküszik fel.

A képhez hozzátartozik, hogy a solitary unit tesztnek is van helye, csak ritkán.

Ilyen például, amikor egy tisztán algoritmikus, determinisztikus logikát akarunk izoláltan védeni, vagy egy nehezen reprodukálható edge case-t célzunk.

Ezekben az esetekben a teljes izoláció kifejezetten hasznos. Általános alapértelmezésként viszont a csapatok többségénél több zajt termel, mint amennyi stabilitást ad.

## Mi legyen a gyakorlati sorrend?

Itt a döntés arról szól, milyen szerződést kérünk az AI-tól a teszteknél.

Nálunk ez a sorrend működik:

1. **Először**: nevezzük meg a viselkedést, amit védeni akarunk.  
   Mit kell tudnia a rendszernek üzleti szinten?
2. **Utána**: döntsük el a teszt szintjét.  
   Unit, sociable unit, integration?
3. **Csak ezután**: generáltassunk tesztet AI-val.  
   Explicit prompttal kérjünk viselkedési állításokat.
4. **Végül**: review ne csak szintaxisra menjen.  
   Kérdés: ez a teszt túléli a következő refaktort?
5. **Tegyünk be technikai korlátot is**.  
   ArchUnit teszttel vagy linter szabállyal gátolható, hogy az AI kontroll nélkül mockokra építsen.

Ha erre nem a válasz, akkor csak gyorsabban gyártjuk a zajt.

## Coverage: hasznos, de veszélyes cél

A coverage jó mérőszám lehet.

Célként használva gyorsan félrevisz.

Amint KPI lesz belőle, gyorsan elkezdjük optimalizálni a számot ahelyett, hogy a rendszerbiztonságot optimalizálnánk.

És itt az AI különösen hatékony: villámgyorsan tud sok olyan tesztet gyártani, ami futtat sorokat, de nem véd döntéseket.

Ezért a “95% coverage” önmagában kevés információt ad:

- refaktorálható-e biztonságosan a modul,
- értelmes-e a visszajelzés piros tesztnél,
- vagy csak az internál változott.

## Tanulság: az AI felnagyítja a tesztstratégiát

Gyenge tesztstratégia mellett az AI gyorsabban skálázza a zajt.

Erős tesztstratégia mellett ugyanilyen gyorsan skálázza az értéket.

Ez a teljes történet lényege.

Az AI tud tesztet írni. *Kérdés nélkül.*

A valódi kérdés az, adunk-e neki olyan keretet, ahol a kimenet:

- viselkedést dokumentál,
- túlél refaktorokat,
- és valódi safety netet ad.

Mert a `verify(userRepository, times(1))` önmagában nem tesztstratégia.

Ha mélyebben érdekel a téma, pár nap múlva erről adok elő a [Weblica konferencián](https://weblica.hr).

Ha úgy érzed, a csapatodnak most sürgős segítség kell a tesztstratégia rendbetételéhez, [keress meg](/hu/contact).