# Workshop Checkout Email Popup Flow

## Architectural change

On the ads landing (`TrainingB2CAdsLandingPage`), every primary workshop CTA opens `CheckoutEmailPopup` instead of navigating directly to Stripe.

## User flow

1. CTA click opens the email popup (`next_step: email_popup`).
2. User submits email; the client POSTs to `CHECKOUT_EMAIL_CAPTURE_API_URL`.
3. Popup switches to a redirect message (`redirectTitle` / `redirectBody` in i18n).
4. After 4 seconds, the browser navigates to the Stripe Payment Link with `prefilled_email`.

Submit and redirect states block closing the modal (backdrop, Escape, close button).

## Analytics (`src/tracking.ts`)

Consent-aware helpers (GA only if analytics accepted; FB only if marketing accepted):

| Trigger | GA4 event | Facebook |
| --- | --- | --- |
| Every primary CTA click | `training_workshop_cta_click` (`placement`, `next_step: email_popup`) | `trackCustom` `TrainingWorkshopCtaClick` |
| Popup open | `training_workshop_email_popup_open` (`placement`) | `trackCustom` `TrainingWorkshopEmailPopupOpen` |
| Stripe navigation after popup | `training_workshop_stripe_redirect` (`source: email_popup`) | `InitiateCheckout` (+ params) |

`placement` is one of `hero`, `middle`, `bottom`, `sticky`.

## Payment link

- Canonical Stripe Payment Link: `https://buy.stripe.com/8x2eVde7b9Te3Xv7tVaVa02` — defined as `STRIPE_CHECKOUT_URL` in `TrainingB2CAdsLandingPage.vue` and passed into the popup.

## Runtime/config impact

- `CheckoutEmailPopup` owns the 4s redirect delay (`STRIPE_REDIRECT_DELAY_MS`) and clears timers on close/unmount.
- Email capture uses `CHECKOUT_EMAIL_CAPTURE_API_URL` from `src/config.ts`; redirect to Stripe still proceeds if the capture request fails (same as prior popup behavior).
