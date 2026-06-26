# quiz-submit Lambda

Node.js 20.x Lambda function – fogadja a kvíz beküldéseket és Notionbe írja őket.

## Telepítés

```bash
cd lambda/quiz-submit
npm install
zip -r quiz-submit.zip index.mjs node_modules package.json
```

## AWS Lambda konfiguráció

- **Runtime**: Node.js 20.x
- **Handler**: `index.handler`
- **URL**: Function URL engedélyezve.
- **CORS**: a Function URL CORS configot **hagyd üresen/kikapcsolva** – a CORS-t a
  kód kezeli (origin-allowlist: `https://letscode.hu`, `http://localhost:5173`).
  Ha a Function URL is beállítja, dupla `Access-Control-Allow-Origin` fejléc lesz,
  amit a böngésző érvénytelennek tekint.

## Env változók

| Változó | Leírás |
|---------|--------|
| `NOTION_TOKEN` | Notion integration token (secret) |
| `NOTION_DATABASE_ID` | A Notion DB azonosítója |
| `RECAPTCHA_SECRET_KEY` | Google reCAPTCHA v3 secret key (secret). Üresen hagyva a validáció kimarad (dev). |

## Notion DB struktúra

| Mező | Típus |
|------|-------|
| Email | Email |
| clientID | Rich Text (kliensoldali localStorage UUID) |
| Beküldve | Date |
| Válaszok | Rich Text (JSON blob) |
| reCAPTCHA score | Number |

> **Fontos:** a `clientID` (Rich Text) mezőt létre kell hozni a Notion DB-ben,
> különben a dedup-lekérdezés és a write is hibára fut.

## reCAPTCHA v3 (Slice 3)

A kliens minden beküldéshez `recaptchaToken`-t csatol (`quiz_submit` action). A Lambda
a Google `siteverify` API-val ellenőrzi:

- `score < 0.5` vagy sikertelen verify → **422** (`recaptcha_failed`).
- Sikeres verify → a score bekerül a `reCAPTCHA score` mezőbe.
- Ha `RECAPTCHA_SECRET_KEY` nincs beállítva, a validáció kimarad (score `null`).

## Opcionális e-mail + deduplikáció

Az e-mail megadása **opcionális**. A kliens minden beküldéshez csatol egy tartós
`clientId`-t (localStorage UUID), így anonim kitöltőnél is van mire dedupolni.

- Ha az e-mail meg van adva → formátum-ellenőrzés; érvénytelennél **400** (`invalid_email`).
- Write előtt a Lambda az e-mailre **és** a `clientID`-re is lekérdezi a DB-t
  (`or` filter; ha csak az egyik azonosító van, csak arra). Találatnál **409**
  (`duplicate`), és nem keletkezik új sor. A kliens ilyenkor az
  *"Ezt a kvízt erről az eszközről (vagy ezzel az e-mail címmel) már kitöltötted."*
  üzenetet mutatja.
- Ha **se e-mail, se `clientId`** nem érkezik (pl. letiltott localStorage),
  nincs mire dedupolni: a beküldést dedup nélkül elmentjük.
