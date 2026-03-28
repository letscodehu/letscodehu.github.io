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

## B2C copy refresh (pain-first narrative)
- Reordered `TrainingB2CPage` to: hero → problem → solution → takeaways → how it works → day 1/2 session detail → who / not for → CTA (no separate credibility block).
- Replaced abstract “architect mindset” framing with concrete developer pain, career-relevant outcomes, and logistics folded into “How it works” (removed standalone `format` i18n block).
- Waitlist popup copy matches the personalized CTA; still collects first name and email only (context note is invited on follow-up email, not a new Mailchimp field).

## Hungarian copy pass
- Refined `trainingB2c` and `training.b2cCardBody` in `hu.json` for more natural developer Hungarian: fixed a `forWho` agreement error, reduced calques and mixed English (e.g. trade-off → kompromisszum, system design → rendszertervező), aligned day-2 “Containerek” with konténer terminology, and softened CTA wording.

## Redundancy reduction
- Trimmed `trainingB2c.howItWorks` in `en.json` and `hu.json` to logistics + format + bring-your-context only; removed day 1/2 bullets that duplicated `day1`/`day2` session grids.
- Extended `howItWorksClosing` to point readers to the day sections below for the detailed schedule.

## Hero intro layout
- `trainingB2c.intro` is a string array (EN/HU); `TrainingB2CPage` renders each entry as its own paragraph with vertical spacing for readability.
