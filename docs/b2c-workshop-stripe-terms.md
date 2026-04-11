# B2C workshop checkout and legal page update

## Architectural changes
- Replaced the B2C waitlist popup flow with direct Stripe Checkout navigation on both B2C entry pages.
- Added a dedicated, routable Terms & Conditions page for the B2C workshop with HU/EN localization support.
- Extended route and prerender coverage so the new legal page is generated for canonical and Hungarian vanity URLs.

## Notes
- Stripe checkout URL is centralized per page component and used by hero, inline CTA, and mobile sticky CTA actions.
- Terms content is now finalized with a structured participation and cancellation policy in HU and EN, including force majeure handling and a direct contact mailto link.

## 2026-04-11
- `TrainingB2CTermsPage`: back control uses client history when available, otherwise navigates to the Architect Mindset B2C route for the active locale.
- Training overview card and blog sidebar CTA title for the B2C track: branded as **Architect Mindset képzés** (HU) / **Architect Mindset training** (EN).
- `TrainingB2CAdsLandingPage`: workshop dates and pricing appear in the hero and offer meta so the June 11–12 Budapest slot is visible above the fold.
