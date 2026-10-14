# Frontend measurement (`src/tracking.ts`)

- **Analytics consent:** GA4 (`G-LMBD4YXBD9`), Hotjar.
- **Marketing consent:** Google Ads tag (`AW-939032288` via `gtag('config', …)`), Meta Pixel, LinkedIn Insight.

Consent Mode v2: `gtag('consent', 'default')` denies all four storage types; `applyTrackingConsent` sends `consent update` (analytics → `analytics_storage`, marketing → `ad_storage`/`ad_user_data`/`ad_personalization`) before any config. Needed because the Google tag `G-LMBD4YXBD9` (GA4 stream `G-C9P1PFP0PH`) and `AW-939032288` are linked on Google's side, so loading one fires the other.

Google Ads shares the same `gtag.js` / `#ga-script` loader as GA4 when both run; if only marketing is accepted, `gtag/js?id=AW-939032288` loads first, then GA4 can attach when analytics is enabled later.

`trackPageView` updates `page_path` on both configured IDs when each respective consent flag has loaded that tag.
