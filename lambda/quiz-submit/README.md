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
- **URL**: Function URL engedélyezve, CORS: `https://letscode.hu`

## Env változók

| Változó | Leírás |
|---------|--------|
| `NOTION_TOKEN` | Notion integration token (secret) |
| `NOTION_DATABASE_ID` | A Notion DB azonosítója |

## Notion DB struktúra

| Mező | Típus |
|------|-------|
| Email | Email |
| Beküldve | Date |
| Válaszok | Rich Text (JSON blob) |

> **Slice 3** hozzáad: `reCAPTCHA score` (Number) mezőt és Google reCAPTCHA v3 validálást.  
> **Slice 4** hozzáad: e-mail alapú deduplikációt (409 visszaküldés duplikátnál).
