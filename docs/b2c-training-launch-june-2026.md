# B2C training launch update (June 2026)

## Architecturally relevant changes

- **IA / copy (B2C landing):** Section order follows conversion flow (hero → immediate outcomes → problem → what it is → takeaways → lead magnet → mid CTA → trust → how it works → audience → program → final CTA). New i18n keys under `trainingB2c` include `heroOutcome`, `immediateOutcomes`, `whatItIs`, `leadMagnet*`, `midCta*`, `trust*`. Sticky mobile waitlist CTA also hides while the mid-page pay CTA is visible (third `IntersectionObserver` target).
- `TrainingB2CPage` now owns launch-state logic for:
  - time-based early-bird vs regular pricing (`2026-05-17` cutoff),
  - payment-link readiness and fallback behavior,
  - automatic waitlist popup triggers.
- Auto-popup behavior is event-driven and guarded once per page load:
  - opens on exit intent,
  - opens after 2 minutes of inactivity,
  - shared `once-per-page-load` gate prevents repeated automatic popups.
- Payment integration is config-driven via `src/config.ts`:
  - `B2C_PAYMENT_EARLY_BIRD_URL`
  - `B2C_PAYMENT_REGULAR_URL`
  - empty values keep current flow functional and fall back to waitlist signup.
- Launch copy/state keys were added in both locales under `trainingB2c.launch` (plus payment CTA keys), so future launch updates remain content/config changes rather than component rewrites.
