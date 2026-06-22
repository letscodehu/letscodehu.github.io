import { Client } from '@notionhq/client'

const notion = new Client({ auth: process.env.NOTION_TOKEN })
const DB_ID = process.env.NOTION_DATABASE_ID

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://letscode.hu',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export const handler = async (event) => {
  if (event.requestContext?.http?.method === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  let body
  try {
    body = JSON.parse(event.body ?? '{}')
  } catch {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'invalid_json' }) }
  }

  const { email, answers } = body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'invalid_email' }) }
  }

  if (!answers || typeof answers !== 'object') {
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'invalid_answers' }) }
  }

  try {
    await notion.pages.create({
      parent: { database_id: DB_ID },
      properties: {
        Email: { email },
        Beküldve: { date: { start: new Date().toISOString() } },
        Válaszok: {
          rich_text: [{ text: { content: JSON.stringify(answers).slice(0, 2000) } }],
        },
      },
    })

    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ ok: true }) }
  } catch (err) {
    console.error('Notion write failed', err)
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'server_error' }) }
  }
}
