# B2C workshop checkout and legal page update

## Architectural changes
- Replaced the B2C waitlist popup flow with direct Stripe Checkout navigation on both B2C entry pages.
- Added a dedicated, routable Terms & Conditions page for the B2C workshop with HU/EN localization support.
- Extended route and prerender coverage so the new legal page is generated for canonical and Hungarian vanity URLs.

## Notes
- Stripe checkout URL is centralized per page component and used by hero, inline CTA, and mobile sticky CTA actions.
- Terms content is now finalized with a structured participation and cancellation policy in HU and EN, including force majeure handling and a direct contact mailto link.
