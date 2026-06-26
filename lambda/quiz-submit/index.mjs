import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const DB_ID = process.env.NOTION_DATABASE_ID
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET_KEY
const RECAPTCHA_MIN_SCORE = 0.5
const RECAPTCHA_ACTION = 'quiz_submit'

const ALLOWED_ORIGINS = new Set(['https://letscode.hu', 'http://localhost:5173'])

// A kérés origin-jét visszatükrözzük, ha az allowlistben van; különben a prod
// originra esünk vissza. Egyetlen origin kerül a fejlécbe (a böngésző nem fogad
// el vesszővel elválasztott listát).
function corsHeaders(event) {
  const origin = event?.headers?.origin ?? event?.headers?.Origin
  const allowOrigin = origin && ALLOWED_ORIGINS.has(origin) ? origin : 'https://letscode.hu'
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    Vary: 'Origin',
  }
}

// Google reCAPTCHA v3 token ellenőrzése. Ha nincs secret konfigurálva
// (pl. dev), a validáció kimarad és null score-ral tér vissza.
async function verifyRecaptcha(token) {
  if (!RECAPTCHA_SECRET) return { ok: true, score: null }

  const params = new URLSearchParams({ secret: RECAPTCHA_SECRET, response: token ?? '' })
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  })
  const data = await res.json()
  const score = typeof data.score === 'number' ? data.score : null

  const ok =
    data.success === true &&
    data.action === RECAPTCHA_ACTION &&
    (score ?? 0) >= RECAPTCHA_MIN_SCORE

  return { ok, score }
}

export const handler = async (event) => {
  try {
    if (event.requestContext?.http?.method === 'OPTIONS') {
      return { statusCode: 204, headers: corsHeaders(event), body: '' }
    }

    let body
    try {
      body = JSON.parse(event.body ?? '{}')
    } catch {
      return { statusCode: 400, headers: corsHeaders(event), body: JSON.stringify({ error: 'invalid_json' }) }
    }

    const { email: rawEmail, clientId: rawClientId, answers, recaptchaToken } = body

    // Az e-mail opcionális. Ha megadták, formátumot ellenőrzünk; ha üres/hiányzik,
    // a clientID alapján dedupolunk (anonim kitöltés).
    const trimmedEmail = typeof rawEmail === 'string' ? rawEmail.trim() : ''
    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      return { statusCode: 400, headers: corsHeaders(event), body: JSON.stringify({ error: 'invalid_email' }) }
    }

    // Dedup és tárolás egységesen kisbetűs e-mailen (a Notion equals szűrő
    // kis/nagybetű-érzékeny, különben a casing megkerülné a deduplikációt).
    const email = trimmedEmail.toLowerCase()

    // Kliensoldali, tartós azonosító (localStorage UUID). Bypassolható, de a
    // véletlen / böngészőn belüli ismételt kitöltést megfogja.
    const clientId = typeof rawClientId === 'string' ? rawClientId.trim().slice(0, 100) : ''

    if (!answers || typeof answers !== 'object') {
      return { statusCode: 400, headers: corsHeaders(event), body: JSON.stringify({ error: 'invalid_answers' }) }
    }

    let recaptchaScore = null
    try {
      const verdict = await verifyRecaptcha(recaptchaToken)
      recaptchaScore = verdict.score
      if (!verdict.ok) {
        return { statusCode: 422, headers: corsHeaders(event), body: JSON.stringify({ error: 'recaptcha_failed' }) }
      }
    } catch (err) {
      console.error('reCAPTCHA verify failed', err)
      return { statusCode: 422, headers: corsHeaders(event), body: JSON.stringify({ error: 'recaptcha_failed' }) }
    }

    try {
      // E-mailre VAGY clientID-re dedupolunk. Ha egyik azonosító sincs (pl.
      // letiltott localStorage), nincs mire szűrni: a beküldést dedup nélkül
      // engedjük át.
      const dedupConditions = []
      if (email) dedupConditions.push({ property: 'Email', email: { equals: email } })
      if (clientId) dedupConditions.push({ property: 'clientID', rich_text: { equals: clientId } })

      if (dedupConditions.length > 0) {
        const existing = await notion.databases.query({
          database_id: DB_ID,
          filter: dedupConditions.length === 1 ? dedupConditions[0] : { or: dedupConditions },
          page_size: 1,
        })
        if (existing.results.length > 0) {
          return { statusCode: 409, headers: corsHeaders(event), body: JSON.stringify({ error: 'duplicate' }) }
        }
      }

      await notion.pages.create({
        parent: { database_id: DB_ID },
        properties: {
          ...(email ? { Email: { email } } : {}),
          ...(clientId
            ? { clientID: { rich_text: [{ text: { content: clientId } }] } }
            : {}),
          Beküldve: { date: { start: new Date().toISOString() } },
          Válaszok: {
            rich_text: [{ text: { content: JSON.stringify(answers).slice(0, 2000) } }],
          },
          ...(recaptchaScore !== null
            ? { 'reCAPTCHA score': { number: recaptchaScore } }
            : {}),
        },
      })

      return { statusCode: 200, headers: corsHeaders(event), body: JSON.stringify({ ok: true }) }
    } catch (err) {
      console.error('Notion write failed', err)
      return { statusCode: 500, headers: corsHeaders(event), body: JSON.stringify({ error: 'server_error' }) }
    }
  } catch (err) {
    console.error('Unhandled exception', err)
    return {
      statusCode: 500,
      headers: corsHeaders(event),
      body: JSON.stringify({ error: 'server_error' }),
    }
  }
}
