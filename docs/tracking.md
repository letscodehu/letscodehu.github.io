# Frontend measurement (`src/tracking.ts`)

- **Analytics consent:** GA4 (`G-R6KWGC5Y5M`), Hotjar.
- **Marketing consent:** Meta Pixel, LinkedIn Insight (skipped while `LINKEDIN_PARTNER_ID` is empty or the `'0000000'` placeholder).

There is no Google Ads tag (`AW-…`) on the site. Conversions are imported into Google Ads from GA4 and remarketing audiences are shared through the GA4 → Google Ads link.

Consent Mode v2: `gtag('consent', 'default')` denies all four storage types; `applyTrackingConsent` sends `consent update` (analytics → `analytics_storage`, marketing → `ad_storage`/`ad_user_data`/`ad_personalization`) before GA4 is configured, and again on every later change (including revocation). The `ad_*` signals still follow marketing consent because the GA4 → Ads audience sharing depends on them.

## Page views

- GA4 is configured exactly once, with `send_page_view: false`; the `gtag.js` script has no `onload` re-config (it processes the queued `dataLayer` itself).
- Page views are only sent as an explicit `gtag('event', 'page_view', { page_location, page_title })`, where `page_location` is the full URL.
- `router.afterEach` (`src/main.ts`) calls `trackPageView()` for every completed navigation; it does nothing until GA4 is loaded.
- When consent arrives after the first navigation (banner decision, or stored consent applied on mount), `initGoogleAnalytics()` sends one page_view for the current page.
- Both paths go through `sendPageView()`, which runs after the route renders and unhead flushes the title, and skips the send if the current URL was the last one reported — so the router hook and a late init never double-count a page.
