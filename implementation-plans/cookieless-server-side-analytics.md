# Cookieless server-side analytics — technikai terv és slice-bontás

## Áttekintés / üzleti érték

A jelenlegi GA4 csak sütielfogadás (consent) mögött fut, így a sütit elutasító
(vagy a bannert még el nem döntő) látogatók teljesen kimaradnak a mérésből — a
GA-számok alulbecslik a tényleges forgalmat. A cél egy **cookieless, server-side
mérés**, ami **csak akkor lép működésbe, amikor nincs sütielfogadás**, és a
`page_view`-kat GA4 Measurement Protocollal, jogtisztán (anonim, semmi tartós
azonosító) ugyanabba a GA4 propertybe küldi, `traffic_source=server_cookieless`
jelöléssel megkülönböztetve.

Lefedett célok: össz-forgalom közelítése, marketing-attribúció (referrer/UTM),
jogtiszta minimál mérés. Out of scope: konverzió- és interakció-események,
pontos egyedi/visszatérő látogatószám, külön property/dashboard.

## Technikai megközelítés

### Architektúra dióhéjban

```
böngésző (no-consent)                    AWS Lambda (új)              GA4
  router.afterEach                         Function URL              Measurement
   → trackPageView(path)                                            Protocol
     → ha !loaded.ga:                  POST /  { page_location,
        cookieless beacon  ───────────►  page_title, referrer,  ──► /mp/collect
        (fetch keepalive)               utm... }                    event: page_view
                                        - napi hash → client_id     params:
                                        - IP csak geo, nem tárol    traffic_source=
                                        - MP secret env-ből           server_cookieless
```

- **Újrafelhasznált:** a `tracking.ts` `loaded.ga` flagje (kölcsönös kizárás
  forrása), a `router.afterEach` pageview-hook (`src/main.ts:67`), a `config.ts`
  endpoint-minta (URL + timeout konstanspár), a `fetch` POST JSON minta.
- **Új:** egy kliensoldali `trackCookielessPageView` függvény a `tracking.ts`-ben;
  egy új AWS Lambda (a meglévő waitlist/email Lambda-k mintájára), ami a GA4 MP
  felé továbbít.

### Adatmodell-változások

Tartós adattárolás **nincs** (se DB, se IP-log). Egyetlen perzisztens elem a
Lambda oldalon egy **titkos salt** (env var / SSM), amiből a napi rotációs hash
készül. GA4-ben két admin-beállítás kell:
- **Measurement Protocol API secret** létrehozása a data streamhez.
- **`traffic_source` event-scoped custom dimension** regisztrálása.

### Kulcsdöntések (+ rövid indok)

- **Kölcsönös kizárás `loaded.ga`-ra kötve.** A beacon csak akkor megy, ha a
  kliens-GA nem fut. Ez fedi a "banner még eldöntetlen" és a "analytics
  elutasítva" állapotot is, egyetlen ellenőrzéssel, dupla számolás kizárva.
- **client_id = napi rotációs hash.** `sha256(napi_dátum + titkos_salt + IP +
  UserAgent + domain)`. Napi felbontásban hozzávetőleges egyedi látogató, de
  másnap más a hash → senki nem követhető vissza (Plausible/Fathom-modell).
- **IP csak tranziensen.** A kérés pillanatában (geo-kísérlet / hash input),
  utána eldobjuk, nem logoljuk.
- **`fetch(..., { keepalive: true })`** a `navigator.sendBeacon` helyett: a
  meglévő fetch-mintához illik, JSON+Content-Type natívan megy, és oldalelhagyáskor
  is elindul. (sendBeacon fallback opció, ha megbízhatósági gond lenne.)

### Kockázatok / ismeretlenek

1. **MP `page_view` megjelenése (legnagyobb kockázat).** A GA4 MP `page_view`
   csak `session_id` + `engagement_time_msec` paraméterekkel jelenik meg a
   standard riportokban. Süti nélkül nincs perzisztens session → kérésenként
   generált `session_id` lesz (minden pageview külön session). Ez torzítja a
   session-számot, de a pageview látszani fog. **Slice 1 validálja.**
2. **Geo.** A GA4 MP nem vezeti le megbízhatóan az országot a hívó (Lambda) IP-jéből,
   és nincs hivatalos `ip_override` GA4-ben (az UA-féle volt). Lehet, hogy a geo
   pontatlan/üres lesz. **Slice 3 méri fel; ha kell, Lambda-oldali geo-lookup
   külön döntés.**
3. **Attribúció.** MP-ből a forrás/médium session-attribúciója korlátozott; az UTM-et
   event-paraméterként + a marker dimenzióval visszük, a riportozhatóságot Slice 3
   méri.

### Feltételezések

- A GA4 measurement ID a meglévő `G-R6KWGC5Y5M` (tracking.ts), ugyanaz a property/stream.
- Az MP API secret és a custom dimension GA4 admin-oldali létrehozása megtörténik
  (manuális, egyszeri lépés a 2. slice előtt).
- A GDPR-anonimitás jogi jóváhagyása a felhasználó oldalán van; itt a technikai
  anonimizálást szállítjuk.
- Lambda deploy ugyanúgy kézi/megszokott módon történik, mint a meglévő Lambda-knál
  (repo csak a frontendet és a config URL-t tartalmazza).

## Vertical slice-ok (sorrendben)

| # | Slice | Szállított érték | Demo | Függ |
|---|-------|------------------|------|------|
| 1 | Walking skeleton: no-consent page_view a GA4-ben | Bizonyított end-to-end lánc + #1 kockázat tisztázva | Inkognitó, süti nélkül navigálok → esemény a GA4 Realtime-ban; sütit elfogadva → nincs beacon | — |
| 2 | Jogtiszta identitás: napi hash + marker | Anonim client_id + szegmentálható cookieless adat | GA4-ben `traffic_source=server_cookieless`; aznap azonos, másnap eltérő client_id; semmi nem tárolódik | 1 |
| 3 | Attribúció: referrer + UTM + cím | Honnan jön a no-consent forgalom | `?utm_source=...`-szal / külső referrerrel nyitva → látszik GA4-ben | 2 |
| 4 | Hardening & korrektség | Megbízható, dupla számolás nélküli üzem | Consent-állapot mátrix helyes; nincs hiba; oldalelhagyáskor is megy | 1 |

## Slice-ok részletesen

### Slice 1 — Walking skeleton: no-consent page_view a GA4-ben

**Érték:** A teljes lánc (böngésző → új Lambda → GA4 MP → Realtime) működik, és
eldől a legnagyobb kockázat: egyáltalán megjelenik-e az MP `page_view`.

**Demo / acceptance:** Inkognitóban, a sütibanner elfogadása nélkül navigálva
egy `page_view` megjelenik a GA4 Realtime nézetben. Ha elfogadom a sütiket, a
beacon NEM megy el (a hálózati fülön nincs hívás az új endpointra).

**Tasks (a teljes stacken át):**
- [ ] GA4 admin: MP API secret létrehozása a meglévő `G-R6KWGC5Y5M` streamhez.
- [ ] Új Lambda (waitlist Lambda mintájára): Function URL, POST JSON fogadása,
      továbbítás a GA4 MP `/mp/collect`-re `page_view` eseménnyel; `client_id`
      egyelőre fix/egyszerű; `session_id` + `engagement_time_msec` paraméterek
      beállítása (a #1 kockázat miatt); measurement_id + api_secret env-ből.
- [ ] `src/config.ts`: `COOKIELESS_ANALYTICS_API_URL` + `..._TIMEOUT_MS` (dev/prod).
- [ ] `src/tracking.ts`: `trackCookielessPageView(path)` — `fetch(url, {method:POST,
      keepalive:true})`, minimál payload (`page_location`); SSR-guard
      (`typeof window === 'undefined'`).
- [ ] `trackPageView`-ba beakasztás: ha `!loaded.ga` → `trackCookielessPageView`
      hívása (a router.afterEach-en keresztül automatikusan minden navigációra).
- [ ] Manuális e2e ellenőrzés GA4 Realtime-ban (consent és no-consent ág is).

### Slice 2 — Jogtiszta identitás: napi rotációs hash + marker

**Érték:** A client_id anonim és naponta rotál; a cookieless adat
megkülönböztethető a consentes adattól GA4-ben.

**Demo / acceptance:** GA4-ben a `traffic_source=server_cookieless` dimenzió
megjelenik a server-side eseményeken. Ugyanazon a napon két kérés azonos
client_id-t kap, másnap eltérőt. A Lambda semmit nem logol/tárol a látogatóról.

**Tasks:**
- [ ] GA4 admin: `traffic_source` event-scoped custom dimension regisztrálása.
- [ ] Lambda: titkos salt env var (vagy SSM) bevezetése.
- [ ] Lambda: `client_id = sha256(YYYY-MM-DD + salt + IP + UA + domain)`; az IP-t
      csak ehhez használjuk, nem logoljuk; UA a kérés headeréből.
- [ ] Lambda: minden eseményre `traffic_source: 'server_cookieless'` param.
- [ ] Logolás-audit: megerősíteni, hogy se IP, se UA, se hash nem kerül tartós logba.
- [ ] Ellenőrzés: aznapi azonosság / másnapi eltérés + dimenzió GA4-ben.

### Slice 3 — Attribúció: referrer + UTM + oldalcím

**Érték:** Látható, honnan érkezik a no-consent forgalom (csatorna, kampány).

**Demo / acceptance:** `?utm_source=...&utm_medium=...`-szal vagy külső
referrerrel megnyitva az oldalt, az adat megjelenik a GA4 megfelelő riportjában
(a marker dimenzióval szűrve).

**Tasks:**
- [ ] Kliens: a beacon payload bővítése — `page_location` (teljes URL), `page_title`,
      `document.referrer`, UTM paraméterek a query stringből.
- [ ] Lambda: ezek továbbítása MP event-paraméterként (`page_location`,
      `page_title`, `page_referrer`, kampány-paraméterek).
- [ ] Geo-kockázat felmérése GA4-ben (Slice technikai megjegyzés #2); ha üres/rossz,
      döntés a Lambda-oldali geo-lookupról (külön, opcionális).
- [ ] Ellenőrzés UTM-es és referreres nyitással.

### Slice 4 — Hardening & korrektség

**Érték:** Megbízható, dupla számolás nélküli, hibatűrő üzem éles forgalomban.

**Demo / acceptance:** Consent-állapot mátrix (eldöntetlen / analytics elutasítva
/ analytics elfogadva) helyesen viselkedik: az első kettőnél megy a beacon, a
harmadiknál soha. Nincs konzolhiba, az oldalelhagyáskori navigáció is rögzül.

**Tasks:**
- [ ] A "no-consent" definíció pontosítása és tesztelése mindkét állapotra
      (`decided=false`, illetve `decided=true && analytics=false`) — `loaded.ga`-ra
      támaszkodva.
- [ ] Hibatűrés: timeout (`..._TIMEOUT_MS`), hálózati hiba lenyelése (a mérés soha
      ne törje az oldalt), `keepalive` ellenőrzése oldalelhagyáskor (szükség esetén
      `sendBeacon` fallback).
- [ ] Dupla számolás verifikálása: consent megadása után 0 beacon.
- [ ] SSR/prerender guard ellenőrzése (vite-ssg build közben ne fusson).
- [ ] Lambda: alap rate-limit / méret-limit a payloadra (visszaélés ellen).

## Sorrend indoklása

Az 1. slice szándékosan a legvékonyabb teljes lánc, mert a legnagyobb műszaki
kockázatot (megjelenik-e egyáltalán az MP `page_view` a GA4-ben) azonnal tisztázza
— ha ez nem megy, minden más felesleges. A 2. a jogtisztaságot adja (ez a feature
létjogosultsága), a 3. az üzleti plusz-értéket (attribúció), a 4. pedig az éles
üzemhez szükséges megbízhatóságot — ez jöhet utoljára, mert addigra már demózható,
működő érték van.

## Nyitott kérdések

- **MP `page_view` riportozhatóság:** ha a kérésenkénti `session_id` torzítása
  zavaró, kell-e valamilyen session-közelítés (pl. napi hash session_id-ként is)?
- **Geo:** elfogadható-e a pontatlan/üres ország, vagy kell Lambda-oldali
  geo-lookup (IP→ország a kérés pillanatában, tárolás nélkül)?
- **Salt-rotáció:** elég a `dátum + statikus titkos salt`, vagy kell ténylegesen
  rotált salt (pl. naponta generált, SSM-ben tárolt)? A statikus salt + dátum
  egyszerűbb és elég ehhez a célhoz.
