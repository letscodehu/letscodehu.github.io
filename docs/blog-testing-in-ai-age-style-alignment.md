# Blog style alignment

- Refactored `testing-in-ai-age` HU article to follow the same narrative structure as `overengineering-vs-underengineering-compliance-nightmare`.
- Shifted from slogan-heavy flow to case-driven argumentation (`situation -> decision -> consequences -> practical guidance`).
- Kept the original technical thesis while making tone and pacing closer to the established long-form blog style.
- Applied `.cursor/rules/anafora.mdc`: removed repeated sentence starters, replaced antithetic `nem X, hanem Y` phrasing with positive statements, and varied list/sentence rhythm.
- Added practical guardrail guidance: use ArchUnit tests or linter rules to constrain excessive AI-generated mocking patterns.
- Added a dedicated section on test execution speed as a delivery constraint (pipeline wait time, context switching cost, and AI-codegen/slow-validation mismatch).
- Tightened voice with more assertive, high-contrast phrasing in opening, pain points, and conclusion sections.
- Added end-of-article CTA: Weblica conference talk link and direct contact-page handoff for urgent team support.
- Clarified testing tradeoff: solitary unit tests are valid for specific deterministic/edge-case scenarios, but not as a default strategy.
- Translated the finalized HU article to EN with the same narrative structure, technical emphasis, and CTA flow.
- Strengthened title alignment in HU article: framed unit-test frustration as a long-standing software design issue (coupling), with AI amplifying that structural weakness.
- Expanded HU conclusion with historical framing: teams have long neglected test quality; AI-generated tests do not remove this cost, they expose and scale it.
- Mirrored the same historical framing in EN conclusion to keep parity between language versions.
- Added a follow-up sociable-test step in HU/EN: `OrderServiceFactory` centralizes wiring (`create` + `forTesting`), aligned with the article's `OrderService` / `PricingService` example domain.
