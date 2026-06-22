export type QuestionType = 'single-choice' | 'scale'

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q01_usage_frequency',
    text: 'Milyen gyakran használsz AI eszközöket (pl. GitHub Copilot, ChatGPT, Cursor, Claude) a munkádban?',
    type: 'single-choice',
    options: [
      'Egyáltalán nem',
      'Alkalmanként (havonta néhányszor)',
      'Rendszeresen (hetente többször)',
      'Minden nap, a legtöbb feladathoz',
    ],
  },
  {
    id: 'q02_primary_tool',
    text: 'Melyik AI eszközt használod a legtöbbet fejlesztéshez?',
    type: 'single-choice',
    options: [
      'GitHub Copilot',
      'ChatGPT / GPT-4',
      'Claude (Anthropic)',
      'Cursor / más AI-alapú IDE',
    ],
  },
  {
    id: 'q03_use_case',
    text: 'Mire használod leginkább az AI-t a munkádban?',
    type: 'single-choice',
    options: [
      'Kódgenerálás / autocomplete',
      'Kód review és refaktor',
      'Dokumentáció és tesztek írása',
      'Hibakeresés / magyarázat',
    ],
  },
  {
    id: 'q04_trust',
    text: 'Mennyire bízol az AI által generált kódban felülvizsgálat nélkül?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Egyáltalán nem',
    maxLabel: 'Teljesen megbízom',
  },
  {
    id: 'q05_company_support',
    text: 'Mennyire támogatja a céged az AI eszközök használatát?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Tiltja / nem tudja',
    maxLabel: 'Aktívan ösztönzi',
  },
  {
    id: 'q06_company_policy',
    text: 'Van-e a cégednél formális AI használati policy (szabályzat)?',
    type: 'single-choice',
    options: [
      'Igen, és betartják',
      'Van valami, de senki sem követi',
      'Nincs, de terveznek készíteni',
      'Nincs, és nem is terveznek',
    ],
  },
  {
    id: 'q07_time_saved',
    text: 'Átlagosan mennyi időt spórol neked az AI eszközök használata naponta?',
    type: 'single-choice',
    options: [
      'Nem spórol időt (vagy nem használom)',
      'Kevesebbet, mint 30 percet',
      '30 perctől 1 óráig',
      'Több mint 1 óra',
    ],
  },
  {
    id: 'q08_blocker',
    text: 'Mi a legnagyobb akadálya az AI szélesebb körű használatának nálad vagy a csapatodban?',
    type: 'single-choice',
    options: [
      'Biztonsági / adatvédelmi aggályok',
      'Minőség és megbízhatóság',
      'Hiányzó vállalati engedély / licenc',
      'Nincs akadály, már széles körben használjuk',
    ],
  },
  {
    id: 'q09_team_size',
    text: 'Hány fős fejlesztői csapatban dolgozol?',
    type: 'single-choice',
    options: [
      'Egyedül (freelancer / solo)',
      '2–10 fő',
      '11–50 fő',
      '50 fő felett',
    ],
  },
  {
    id: 'q10_company_type',
    text: 'Milyen típusú szervezetnél dolgozol?',
    type: 'single-choice',
    options: [
      'Startup / scale-up',
      'Nagyvállalat / enterprise',
      'Ügynökség / outsourcing cég',
      'Freelancer / saját vállalkozás',
    ],
  },
  {
    id: 'q11_training',
    text: 'Vettél-e részt AI-jal kapcsolatos tréningen vagy képzésen az elmúlt 12 hónapban?',
    type: 'single-choice',
    options: [
      'Igen, céges keretből',
      'Igen, saját forrásból',
      'Nem, de szeretnék',
      'Nem, és nem is tervezem',
    ],
  },
  {
    id: 'q12_future_area',
    text: 'Melyik területen szeretnéd a legjobban fejleszteni az AI-os tudásod?',
    type: 'single-choice',
    options: [
      'Prompt engineering és hatékony használat',
      'AI-alapú szoftverarchitektúra',
      'LLM integráció saját termékbe',
      'AI biztonság és etika',
    ],
  },
]
