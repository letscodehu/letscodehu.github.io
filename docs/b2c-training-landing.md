# B2C Training Landing - Executed Plan

## Architectural changes
- Added a dedicated B2C training route and static generation path for localized URLs:
  - `/en/training/architect-mindset`
  - `/hu/kepzes/architect-gondolkodas`
- Introduced a standalone B2C page component (`TrainingB2CPage`) to keep B2C messaging and conversion flow isolated from existing B2B training pages.
- Added a reusable `SignupPopup` UI component that handles waitlist signup as an in-page modal workflow.

## Mailchimp integration
- Configured signup to use the live Mailchimp endpoint with client-side JSONP (`subscribe/post-json`) flow.
- Implemented popup-level submit state handling:
  - input validation,
  - loading state,
  - success state,
  - generic/network/timeout error paths.
- Added SSR-safe guards so popup DOM and JSONP operations only run in browser context.

## Content and navigation updates
- Added new `trainingB2c` and `signupPopup` i18n sections in both English and Hungarian.
- Added a B2B-to-B2C cross-link block on the existing training page to surface the individual-developer offer.

## Copy positioning refinement
- Reframed B2C messaging to be decision-first: architect-level decision quality is the primary promise.
- Repositioned ADR as a lightweight framework, not the core headline topic.
- Updated Hungarian wording to keep a more natural tone in titles and session names (for example: `architekt szemlélet`, cleaner day titles, and less mixed-language phrasing).
- Aligned English copy with the same positioning so HU and EN pages communicate the same training intent.

## Onsite format clarification
- Added explicit onsite logistics copy to the B2C training section in both languages.
- Clearly communicates that the training is:
  - held in Budapest,
  - delivered in a small-group format,
  - available only in-person (no remote joining).
- Added rationale to the visible copy: shared whiteboard drawing/modeling is a core part of the training, so online participation is not supported.
- Updated both the `notFor` list and signup popup intro to reinforce that waitlist notifications refer to in-person Budapest cohorts.
