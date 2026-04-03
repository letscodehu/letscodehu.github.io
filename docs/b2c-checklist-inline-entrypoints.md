## B2C page: checklist inline entrypoints

### Purpose
Surface the Architect’s Reality Check checklist and waitlist offer in the body copy of the individual training page (`TrainingB2CPage`), not only in the signup popup.

### Locations
1. **Lead magnet block** — After takeaways: `trainingB2c.leadMagnetTitle`, `leadMagnetBody`, ghost button `leadMagnetCta` → opens `SignupPopup` (`openSignup`).
2. **Bottom CTA** — Gift box: `ctaGiftTitle`, `ctaGiftBody` (emoji in template with `aria-hidden`).

### i18n keys
- `trainingB2c.leadMagnetTitle`, `trainingB2c.leadMagnetBody`, `trainingB2c.leadMagnetCta`
- `trainingB2c.ctaGiftTitle`, `trainingB2c.ctaGiftBody`
