# Checkout Email Popup Flow

## Architectural change

On the ads landing (`TrainingB2CAdsLandingPage`), each primary workshop CTA uses a per-click random split (~50%): either the email popup opens, or the browser navigates straight to the Stripe payment link (no `prefilled_email`).

When the popup path is chosen:

1. User submits email in popup.
2. Frontend sends `POST` request to the checkout capture Function URL.
3. On success, frontend redirects to the Stripe payment link with `prefilled_email` query param.

## Analytics (`src/tracking.ts`)

Consent-aware helpers (GA only if analytics accepted; FB only if marketing accepted):

| Trigger | GA4 event | Facebook |
| --- | --- | --- |
| Every primary CTA click | `training_workshop_cta_click` (`placement`, `next_step`) | `trackCustom` `TrainingWorkshopCtaClick` |
| Popup branch only, when modal opens | `training_workshop_email_popup_open` (`placement`) | `trackCustom` `TrainingWorkshopEmailPopupOpen` |
| Any navigation to Stripe checkout | `training_workshop_stripe_redirect` (`source`: `cta_direct` \| `email_popup`) | `InitiateCheckout` (+ params) |

`placement` is one of `hero`, `middle`, `bottom`, `sticky`.

## Runtime/config impact

- New frontend config constants in `src/config.ts`:
  - `CHECKOUT_EMAIL_CAPTURE_API_URL`
  - `CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS`
- The ads landing uses `CheckoutEmailPopup` on the popup branch only; direct Stripe uses the same payment URL as the popup flow without prefilled email.

## Ads landing FAQ

The conversion-focused ads landing (`TrainingB2CAdsLandingPage`) includes an FAQ block before the final CTA: native `<details>` / `<summary>` accordions (closed by default). One item pulls cancellation and no-show / late rules from the same i18n keys as the B2C terms page (`trainingB2cTerms`) and links to the full terms route for the active language.
