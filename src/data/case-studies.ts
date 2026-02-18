export interface CaseStudy {
  slug: string
  title: string
  excerpt: string
  content: string
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'rebuilding-engineering-trust-30k-dau-backoffice',
    title: 'Rebuilding Engineering Trust in a 30k DAU Backoffice Platform',
    excerpt:
      'How we stabilized delivery, increased test coverage 6x, and decoupled the domain from Salesforce in a scale-up backoffice.',
    content: `## Context

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
  },
]

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug)
}
