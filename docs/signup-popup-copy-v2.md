## Signup popup copy (variation 2)

### Change
- Waitlist signup modal copy was updated to lead with the “Architect’s Reality Check” checklist offer, then explain waitlist and workshop tailoring.
- Hungarian strings are the source; English strings mirror the same structure and promise.

### i18n structure
- `signupPopup.title` — headline.
- `signupPopup.introChecklist` — first body paragraph (checklist email delivery).
- `signupPopup.introWaitlist` — second body paragraph (waitlist + optional reply for tailored examples).
- `signupPopup.successMessage` — aligned with checklist + waitlist confirmation.

### UI
- `src/components/ui/SignupPopup.vue` renders two `<p>` elements for the intro (`.intro` and `.intro.intro--follow`) instead of a single paragraph.
