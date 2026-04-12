# Frontend measurement (`src/tracking.ts`)

- **Analytics consent:** GA4 (`G-R6KWGC5Y5M`), Hotjar.
- **Marketing consent:** Google Ads tag (`AW-939032288` via `gtag('config', …)`), Meta Pixel, LinkedIn Insight.

Google Ads shares the same `gtag.js` / `#ga-script` loader as GA4 when both run; if only marketing is accepted, `gtag/js?id=AW-939032288` loads first, then GA4 can attach when analytics is enabled later.

`trackPageView` updates `page_path` on both configured IDs when each respective consent flag has loaded that tag.
