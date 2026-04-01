## B2C page: checklist inline entrypoints

### Purpose
Surface the Architect’s Reality Check checklist and waitlist offer in the body copy of the individual training page (`TrainingB2CPage`), not only in the signup popup.

### Locations
1. **After problem section** — `trainingB2c.problemImmediateHelp` in a callout paragraph (`.problem-patch`) inside the problem `BaseCard`, after `problemClosing`.
2. **Bottom CTA** — Full-width gift box above the waitlist button: `ctaGiftTitle`, `ctaGiftBody` (emoji in template with `aria-hidden`).

### i18n keys
- `trainingB2c.problemImmediateHelp`
- `trainingB2c.ctaGiftTitle`, `trainingB2c.ctaGiftBody`
