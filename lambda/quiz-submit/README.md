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
| Beküldve | Date |
| Válaszok | Rich Text (JSON blob) |
| reCAPTCHA score | Number |

## reCAPTCHA v3 (Slice 3)

A kliens minden beküldéshez `recaptchaToken`-t csatol (`quiz_submit` action). A Lambda
a Google `siteverify` API-val ellenőrzi:

- `score < 0.5` vagy sikertelen verify → **422** (`recaptcha_failed`).
- Sikeres verify → a score bekerül a `reCAPTCHA score` mezőbe.
- Ha `RECAPTCHA_SECRET_KEY` nincs beállítva, a validáció kimarad (score `null`).

## Deduplikáció (Slice 4)

Write előtt a Lambda lekérdezi a Notion DB-t az e-mailre
(`filter: { property: 'Email', email: { equals: email } }`). Ha van találat,
**409** (`duplicate`) a válasz, és nem keletkezik új sor. A kliens ilyenkor a
*"Ezzel az e-mail címmel már töltötted ki a kvízt."* üzenetet mutatja.
