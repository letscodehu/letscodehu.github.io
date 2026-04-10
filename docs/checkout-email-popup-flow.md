# Checkout Email Popup Flow

## Architectural change

Before redirecting to Stripe, B2C checkout CTAs now open an email popup.

1. User submits email in popup.
2. Frontend sends `POST` request to the checkout capture Function URL.
3. On success, frontend redirects to the Stripe payment link with `prefilled_email` query param.

## Runtime/config impact

- New frontend config constants in `src/config.ts`:
  - `CHECKOUT_EMAIL_CAPTURE_API_URL`
  - `CHECKOUT_EMAIL_CAPTURE_TIMEOUT_MS`
- Both B2C pages now gate checkout through `CheckoutEmailPopup`.
