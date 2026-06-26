export type QuestionType = 'single-choice' | 'multi-choice' | 'scale'

export interface QuizQuestion {
  id: string
  text: string
  type: QuestionType
  options?: string[]
  /** multi-choice: legfeljebb ennyi opció választható */
  maxSelections?: number
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
    id: 'q03_agents_autonomy',
    text: 'Milyen mértékben delegálsz komplett, end-to-end feladatokat (pl. bug fixálása a repo elemzésétől kezdve a tesztíráson át a Pull Request nyitásáig) autonóm AI ügynököknek (pl. Devin, Cursor/GitHub Agents)?',
    type: 'single-choice',
    options: [
      'Egyáltalán nem',
      'Csak kísérletezünk vele',
      'Heti szinten, kisebb taskokra',
      'Napi szinten, a workflow szerves része',
    ],
  },
  {
    id: 'q04_workflow_shift',
    text: 'Melyik szoftverfejlesztési fázisban vette át a legnagyobb arányban a manuális munkát az AI a napi rutinodban? (Válassz maximum kettőt!)',
    type: 'multi-choice',
    maxSelections: 2,
    exclusiveOption: 'Egyik fázisban sem / Nem érvényes rám',
    options: [
      'Boilerplate / Scaffolding',
      'Unit és E2E tesztek írása',
      'Legacy kód refaktorálása / migrálása',
      'Dokumentáció és API specifikáció írása',
      'Bugok és memory leak-ek izolálása',
      'Egyik fázisban sem / Nem érvényes rám',
    ],
  },
  {
    id: 'q05_ai_code_ratio',
    text: 'Becslésed szerint a csapatod által az elmúlt hónapban élesített (production) kód hány százalékát generálta AI, emberi módosítás nélkül vagy minimális módosítással?',
    type: 'single-choice',
    options: [
      '0–10%',
      '11–30%',
      '31–50%',
      '51–70%',
      '71%+',
      'Nem tudom / Nincs rálátásom',
    ],
  },
  {
    id: 'q06_hallucination_review',
    text: 'Mennyire tapasztalsz extra kognitív terhelést az AI-asszisztált PR-ok review-ja során a logikai hibák azonosításakor, a hagyományosan írt kódhoz képest?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Egyáltalán nem',
    maxLabel: 'Kifejezetten sok extra időt igényel',
  },
  {
    id: 'q07_company_support',
    text: 'Mennyire támogatja a céged az AI eszközök használatát?',
    type: 'scale',
    min: 1,
    max: 5,
    minLabel: 'Tiltja / nem tudja',
    maxLabel: 'Aktívan ösztönzi',
  },
  {
    id: 'q08_company_policy',
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
    id: 'q09_shadow_ai',
    text: 'A hivatalos vállalati policy mellett (vagy annak hiányában), becslésed szerint milyen gyakran kerül szenzitív vállalati forráskód, API kulcs, vagy adatbázis-séma publikus LLM-ek (pl. webes ChatGPT, Claude) promptjaiba a fejlesztőcsapaton belül?',
    type: 'single-choice',
    options: [
      'Soha, szigorúan blokkolva van',
      'Nagyon ritkán, véletlenül',
      "Előfordul, „megoldjuk okosban\" a gyorsaság miatt",
      'Rendszeres gyakorlat',
      'Nincs rálátásom',
    ],
  },
  {
    id: 'q10_local_vs_cloud',
    text: 'A vállalati adatvédelmi és biztonsági előírások miatt milyen arányban használtok lokálisan, saját hardveren futtatott LLM-eket a felhő alapú API-k helyett a kódolás támogatására?',
    type: 'single-choice',
    options: [
      'Kizárólag publikus felhőt használunk',
      'Főleg felhőt, de tesztelünk lokális modelleket',
      'Vegyes (hibrid) használat',
      'Főként lokális modelleket futtatunk (pl. Llama, Mistral) a kód titkossága miatt',
    ],
  },
  {
    id: 'q11_blocker',
    text: 'Mi a legnagyobb akadálya az AI szélesebb körű használatának nálad vagy a csapatodban?',
    type: 'single-choice',
    options: [
      'Biztonsági / adatvédelmi aggályok',
      'Minőség és megbízhatóság',
      'Hiányzó vállalati engedély / licenc',
      'Nincs akadály, már széles körben használjuk',
      'Szabályozói megfelelőség / EU AI Act',
    ],
  },
  {
    id: 'q12_company_type',
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
    id: 'q12b_role',
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
    id: 'q13_training',
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
    id: 'q14_prompt_injection',
    text: 'Mennyire vagytok felkészülve fejlesztői szinten az LLM-integrációkhoz kapcsolódó új típusú sebezhetőségek (pl. Prompt Injection, RAG adatmérgezés) kezelésére az általatok fejlesztett szoftverekben?',
    type: 'single-choice',
    options: [
      'Egyáltalán nem foglalkozunk vele',
      'Van alapszintű tudatosság, de nincsenek dedikált tesztek',
      'Vannak beépített védelmi vonalaink',
      'Szigorúan teszteljük (Red Teaming) ezeket a vektorokat a release előtt',
      'Nem fejlesztünk LLM-integrációt',
    ],
  },
  {
    id: 'q15_future_area',
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
