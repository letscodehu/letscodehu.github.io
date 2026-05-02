# Workshop Direct Stripe Checkout Flow

## Architectural change

On the ads landing (`TrainingB2CAdsLandingPage`), every primary workshop CTA navigates directly to the canonical Stripe payment link. The email popup branch is not used on this page.

## Analytics (`src/tracking.ts`)

Consent-aware helpers (GA only if analytics accepted; FB only if marketing accepted):

| Trigger | GA4 event | Facebook |
| --- | --- | --- |
| Every primary CTA click | `training_workshop_cta_click` (`placement`, `next_step: stripe_checkout`) | `trackCustom` `TrainingWorkshopCtaClick` |
| Direct navigation to Stripe checkout | `training_workshop_stripe_redirect` (`source: cta_direct`) | `InitiateCheckout` (+ params) |

`placement` is one of `hero`, `middle`, `bottom`, `sticky`.

## Payment link

- Canonical Stripe Payment Link: `https://buy.stripe.com/8x2eVde7b9Te3Xv7tVaVa02?prefilled_promo_code=EARLYBIRD` — defined as `STRIPE_CHECKOUT_URL` in `TrainingB2CAdsLandingPage.vue`.

## Runtime/config impact

- The ads landing no longer mounts `CheckoutEmailPopup`; CTA clicks call `window.location.assign(STRIPE_CHECKOUT_URL)` immediately.
- The checkout email capture configuration remains available for other flows, but the workshop landing does not call it.

## Ads landing FAQ

The conversion-focused ads landing (`TrainingB2CAdsLandingPage`) includes an FAQ block before the final CTA: native `<details>` / `<summary>` accordions (closed by default). One item pulls cancellation and no-show / late rules from the same i18n keys as the B2C terms page (`trainingB2cTerms`) and links to the full terms route for the active language.
