export type QuestionType = 'single-choice' | 'multi-choice' | 'scale'

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  /** multi-choice: ezt választva a többi opció törlődik (kizáró opció) */
  exclusiveOption?: string
  min?: number
  max?: number
  minLabel?: string
  maxLabel?: string
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q01_usage_frequency',
    text: 'Milyen gyakran használsz AI eszközöket a munkádban?',
    type: 'single-choice',
    options: [
      'Egyáltalán nem',
      'Alkalmanként (havonta néhányszor)',
      'Rendszeresen (hetente többször)',
      'Minden nap, a legtöbb feladathoz',
    ],
  },
  {
    id: 'q02_tools',
    text: 'Melyik AI eszközöket használod fejlesztéshez? (több is választható)',
    type: 'multi-choice',
    options: [
      'GitHub Copilot',
      'Cursor',
      'Claude Code',
      'Codex (OpenAI)',
      'Windsurf',
      'Kiro',
      'Gemini CLI',
      'Egyéb agent / kódoló eszköz',
      'Chat-alapú asszisztens (ChatGPT, Claude, Gemini)',
      'Nem használok AI eszközt',
    ],
    exclusiveOption: 'Nem használok AI eszközt',
  },
  {
    id: 'q03_use_case',
    text: 'Mire használod az AI-t a munkádban? (több is választható)',
    type: 'multi-choice',
    options: [
      'Kódgenerálás / autocomplete',
      'Kód review és refaktor',
      'Dokumentáció és tesztek írása',
      'Hibakeresés / magyarázat',
      'Nem használom AI-t a munkámhoz',
    ],
    exclusiveOption: 'Nem használom AI-t a munkámhoz',
  },
  {
    id: 'q04_time_saved',
    text: 'Átlagosan mennyi időt spórol neked az AI eszközök használata naponta?',
    type: 'single-choice',
    options: [
      'Nem spórol időt',
      'Kevesebbet, mint 30 percet',
      '30 perctől 1 óráig',
      'Több mint 1 óra',
      'Nem használok AI eszközt',
    ],
  },
  {
    id: 'q05_trust',
    text: 'Mennyire bízol az AI által generált kódban felülvizsgálat nélkül?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Egyáltalán nem',
    maxLabel: 'Teljesen megbízom',
  },
  {
    id: 'q06_company_support',
    text: 'Mennyire támogatja a céged az AI eszközök használatát?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Tiltja / nem tudja',
    maxLabel: 'Aktívan ösztönzi',
  },
  {
    id: 'q07_company_policy',
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
    id: 'q08_blocker',
    text: 'Mi a legnagyobb akadálya az AI szélesebb körű használatának nálad vagy a csapatodban?',
    type: 'single-choice',
    options: [
      'Biztonsági / adatvédelmi aggályok',
      'Minőség és megbízhatóság',
      'Költség / budget',
      'Hiányzó tudás / tapasztalat (skill-gap)',
      'Vezetői támogatás / kultúra hiánya',
      'Hiányzó vállalati engedély / licenc',
      'Nincs akadály, már széles körben használjuk',
    ],
  },
  {
    id: 'q09_team_need',
    text: 'Mi segítené leginkább a csapatod AI-használatát?',
    type: 'single-choice',
    options: [
      'Egységes gyakorlat / belső guideline-ok',
      'Képzés / tréning a csapatnak',
      'Megfelelő eszközök kiválasztása és bevezetése',
      'Policy / governance / biztonsági keretek',
      'Semmi, jól működik',
    ],
  },
  {
    id: 'q10_role',
    text: 'Mi a szereped a fejlesztésben?',
    type: 'single-choice',
    options: [
      'Junior fejlesztő',
      'Medior fejlesztő',
      'Senior fejlesztő',
      'Tech lead / architect',
      'Engineering manager / fejlesztési vezető',
      'CTO / VP / cégtulajdonos',
      'Egyéb (PM, QA, DevOps…)',
    ],
  },
  {
    id: 'q11_company_type',
    text: 'Milyen típusú szervezetnél dolgozol?',
    type: 'single-choice',
    options: [
      'Startup / scale-up',
      'Nagyvállalat / enterprise',
      'Ügynökség / szoftverház / outsourcing',
      'Freelancer / saját vállalkozás',
    ],
  },
  {
    id: 'q12_team_size',
    text: 'Hány fős fejlesztői csapatban dolgozol?',
    type: 'single-choice',
    options: [
      'Egyedül (freelancer / solo)',
      '2–10 fő',
      '11–50 fő',
      '50 fő felett',
    ],
  },
]
