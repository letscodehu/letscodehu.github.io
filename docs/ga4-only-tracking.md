# GA4-only Google tracking (#118)

- Removed the Google Ads tag (`AW-939032288`, `initGoogleAdsTag`, `loaded.ads`) from `src/tracking.ts`; Ads now gets conversions and remarketing audiences through the GA4 → Google Ads link. Consent Mode v2 signals are unchanged.
- Fixed duplicate page views: GA4 `config` runs once with `send_page_view: false`, and page views are explicit `page_view` events (`page_location`, `page_title`) sent from `router.afterEach` and, once, from `initGoogleAnalytics()` when consent comes after the first navigation. Consecutive sends for the same URL are deduplicated.
- LinkedIn Insight no longer loads while `LINKEDIN_PARTNER_ID` is empty or the `'0000000'` placeholder.
- Details: `docs/tracking.md`.
