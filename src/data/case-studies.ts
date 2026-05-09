export type CaseStudyLang = 'en' | 'hu'

export interface CaseStudy {
  slug: string
  titleEn: string
  titleHu: string
  excerptEn: string
  excerptHu: string
  contentEn: string
  contentHu: string
}

export interface LocalizedCaseStudy {
  slug: string
  title: string
  excerpt: string
  content: string
}

export function localizeCaseStudy(cs: CaseStudy, lang: CaseStudyLang): LocalizedCaseStudy {
  if (lang === 'hu') {
    return {
      slug: cs.slug,
      title: cs.titleHu,
      excerpt: cs.excerptHu,
      content: cs.contentHu,
    }
  }
  return {
    slug: cs.slug,
    title: cs.titleEn,
    excerpt: cs.excerptEn,
    content: cs.contentEn,
  }
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'rebuilding-engineering-trust-30k-dau-backoffice',
    titleEn: 'Rebuilding Engineering Trust in a 30k DAU Backoffice Platform',
    titleHu:
      'Mérnöki bizalom helyreállítása egy ~30 000 napi aktív felhasználós backoffice platformon',
    excerptEn:
      'How we stabilized delivery, increased test coverage 6x, and decoupled the domain from Salesforce in a scale-up backoffice.',
    excerptHu:
      'Hogyan stabilizáltuk a szállítást, hatszorosára növeltük a tesztlefedettséget, és leválasztottuk a domaint a Salesforce-ról egy növekvő backoffice környezetben.',
    contentEn: `## Context

A scale-up operating in the big data domain relied on an external backoffice platform serving ~30,000 daily active users.

The original solution was heavily built around Salesforce, where end users managed:

- Accounts and organizational users
- Permissions
- License tiers
- Support cases

Over time, two major business problems emerged:

- Non-scalable licensing model – each Salesforce user incurred license cost.
- Revenue leakage – the permission model allowed users (even unintentionally) to remain on lower license tiers than required.

The company decided to replace the Salesforce-centric model with a dedicated external Identity Provider (IDP). Salesforce remained as a data source, but no longer as the primary system of truth.

This transition introduced significant architectural and operational challenges.

## The Core Challenges

### Business-Level Issues

- Revenue loss due to incorrect license mapping
- Complex domain with multiple edge cases
- Need for a properly modeled license-rights relationship

### Engineering & DevOps Issues

**Operational Instability**

- Quarterly anonymized production data copy → staging environment downtime
- ~100 developers blocked for up to a week every quarter

**Architecture**

- Single Maven module monolith
- Tightly coupled components
- Frontend directly dependent on Salesforce response schemas
- No proper domain boundaries

**Testing**

- 10% test coverage
- Flaky tests (some hitting live Salesforce tenants)
- QA automation suite never fully green
- Heavy reliance on manual testing

**CI/CD**

- ClickOps-built Jenkins instance
- No reliable backup strategy
- Long waiting times for CI jobs
- Paid static analysis tooling largely ignored

**Infrastructure**

- AWS + Terraform
- No modularization strategy for future service extraction

**Result:** Low trust in engineering, slow release cycles, high cognitive load, and fragile deployments.

## Intervention Strategy

The first step was not refactoring — but prioritization and stabilization.

### 1. Establishing a Safe Baseline

Before touching architecture:

- Incrementally enabled static analysis checks
- Introduced high-level regression tests
- Removed invalid and misleading tests (e.g., Salesforce-dependent tests)
- Reduced noise to increase signal in CI

Goal: create a foundation where refactoring would not increase risk.

### 2. CI/CD Stabilization

- Implemented regular Jenkins backups
- Cleaned and updated plugins
- Introduced EC2 Spot-based runners to reduce queue time
- Later migrated to GitHub Actions with internal EC2 Spot runners
- Improved pipeline reliability and developer feedback loop

### 3. Architectural Refactoring (Clean Architecture)

The monolithic single-module codebase was restructured:

- Split into multiple modules with clear boundaries
- Introduced ports & adapters
- Decoupled core domain from Salesforce schema
- Removed Salesforce-specific field leakage from frontend

This enabled:

- Independent domain modeling of licenses and permissions
- Isolation of external dependencies
- Safer long-term evolution

### 4. Testing & QA Modernization

- Increased test coverage from 10% → 60% in 3 months
- Reduced failure ratio by 60%
- Maintained execution speed despite increased coverage
- Introduced BDD-style skeleton for QA
- Created dedicated QA pipeline
- Enabled gradual migration from legacy test suite

Result: test suite became a confidence mechanism instead of a liability.

### 5. Preparing for Modularization

- Identified domains suitable for extraction from the monolith
- Built Helm charts for future services
- Introduced proper secrets management using SOPS + KMS
- Prepared infrastructure for controlled service decomposition

## Results

Within 3 months:

- 6x test coverage increase
- 60% reduction in flaky failures
- Stable CI/CD infrastructure
- Reduced developer wait time
- Decoupled domain model
- Foundation for service extraction
- Improved engineering confidence

Most importantly: The system shifted from being a delivery bottleneck to a platform the organization could safely build upon.`,
    contentHu: `## Kontextus

Egy big data területen működő scale-up vállalat külső backoffice platformra támaszkodott, amelyet közel 30 000 napi aktív felhasználó használt.

Az eredeti megoldás erősen a Salesforce köré épült; a végfelhasználók itt kezelték:

- Fiókokat és szervezeti felhasználókat
- Jogosultságokat
- Licencszinteket
- Support eseteket

Idővel két fő üzleti probléma jelent meg:

- Nem skálázódó licencmodell – minden Salesforce-felhasználó külön licencköltséget jelentett.
- Bevételvesztés – a jogosultsági modell miatt a felhasználók (akár nem szándékosan is) alacsonyabb licencszinten maradhattak, mint amennyihez valójában joguk lett volna.

A vállalat úgy döntött, hogy a Salesforce-központú modellt egy dedikált külső Identity Providerrel (IDP) váltja fel. A Salesforce adatforrásként megmaradt, de már nem az elsődleges „single source of truth”.

Ez az átállás jelentős architekturális és üzemeltetési kihívásokat hozott.

## A központi kihívások

### Üzleti szintű problémák

- Bevételkiesés a helytelen licenc-hozzárendelés miatt
- Összetett domain számos szélső esettel
- Szükség volt a licenc–jogosultság viszony helyes modellezésére

### Mérnöki és DevOps problémák

**Üzemeltetési instabilitás**

- Negyedévente anonimizált éles adatmásolat → a staging környezet leállítása
- ~100 fejlesztő akár egy hétig blokkolva minden negyedévben

**Architektúra**

- Egyetlen Maven modulú monolit
- Szorosan összekapcsolt komponensek
- A frontend közvetlenül a Salesforce válaszsémáitól függött
- Nem voltak tiszta domainhatárok

**Tesztelés**

- 10%-os tesztlefedettség
- Instabil tesztek (egy részük élő Salesforce tenantokat használt)
- A QA automatizáció sosem volt teljesen zöld
- Erős manuális tesztelésre támaszkodás

**CI/CD**

- ClickOps-szal felépített Jenkins példány
- Megbízható backup stratégia nélkül
- Hosszú várakozás a CI jobokra
- Fizetős statikus analízis eszközök nagyrészt figyelmen kívül hagyva

**Infrastruktúra**

- AWS + Terraform
- Nem volt moduláris stratégia a későbbi szolgáltatás-kiemeléshez

**Eredmény:** Alacsony bizalom a mérnöki szervezet iránt, lassú kiadási ciklusok, magas kognitív terhelés és törékeny telepítések.

## Beavatkozási stratégia

Az első lépés nem a refaktorálás volt, hanem a prioritások rendezése és a stabilizáció.

### 1. Biztonságos kiindulóállapot kialakítása

Mielőtt az architektúrához nyúltunk volna:

- Fokozatosan bekapcsoltuk a statikus analízis ellenőrzéseket
- Magas szintű regressziós teszteket vezettünk be
- Érvénytelen és félrevezető teszteket eltávolítottunk (pl. Salesforce-függő tesztek)
- Csökkentettük a zajt, hogy a CI pipeline eredménye érthetőbb legyen

Cél: olyan alapot teremteni, ahol a refaktorálás nem növeli a kockázatot.

### 2. CI/CD stabilizáció

- Rendszeres Jenkins backupok
- Pluginok takarítása és frissítése
- EC2 Spot alapú futtatók bevezetése a soridő csökkentésére
- Később migráció GitHub Actionsre, belső EC2 Spot futtatókkal
- Megbízhatóbb pipeline és gyorsabb visszajelzés a fejlesztőknek

### 3. Architekturális refaktorálás (Clean Architecture)

A monolitot átszerveztük:

- Több modulra bontás egyértelmű határokkal
- Ports & adapters bevezetése
- A domain leválasztása a Salesforce sémáról
- Salesforce-specifikus mezők „szivárgásának” megszüntetése a frontendről

Ez lehetővé tette:

- A licencek és jogosultságok független domain-modellezését
- Külső függőségek izolálását
- Biztonságosabb hosszú távú fejlődést

### 4. Tesztelés és QA modernizáció

- Tesztlefedettség 10% → 60% három hónap alatt
- A hibák aránya ~60%-kal csökkent
- A futási sebesség megmaradt a nagyobb lefedettség mellett is
- BDD-stílusú vázat vezettünk be a QA számára
- Dedikált QA pipeline
- Fokozatos migráció a régi tesztcsomagról

Eredmény: a tesztcsomag bizalomépítő eszköz lett a teherré válás helyett.

### 5. Felkészülés a modularizációra

- Azonosítottuk a monolitból kivehető domaineket
- Helm chartokat készítettünk a jövőbeli szolgáltatásokhoz
- SOPS + KMS alapú secret management
- Infrastruktúra előkészítése kontrollált szolgáltatás-kiemeléshez

## Eredmények

Három hónapon belül:

- Hatszoros tesztlefedettség-növekedés
- ~60%-kal kevesebb instabil (flaky) hiba
- Stabil CI/CD infrastruktúra
- Rövidebb fejlesztői várakozás
- Leválasztott domainmodell
- Alap a szolgáltatások kivonásához
- Erősödött mérnöki bizalom

Legfontosabb: A rendszer a szállítás szűk keresztmetszetéből olyan platformmá vált, amire a szervezet biztonságosan építhet.`,
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}
