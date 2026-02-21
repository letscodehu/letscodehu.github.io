## Context
The existing site only ships the light palette and never adjusts to the visitor's system preference, so people who browse at night or with OS-level dark mode see a glaring white UI. We want to surface a cohesive dark theme that mirrors the current layout while honoring the OS `prefers-color-scheme` media query by default, and also offer an explicit toggle so users can pick the mode that fits their workflow.

## Goals / Non-Goals
**Goals:**
- Honor the visitor's operating system preference when the page loads, with instant theming that reads `prefers-color-scheme` and falls back to light when unsupported.
- Provide a persistent toggle inside the primary navigation that switches between light and dark themes, updates accessible states, and remembers the user's choice across sessions.
- Ensure shared components (headers, cards, code samples, forms, embeds) receive the same theme tokens so layouts stay consistent in both modes.

**Non-Goals:**
- Introducing a fully separate UI layout; the switch is only about colors/contrast, not restructuring pages.
- Server-side rendering of different themes; the switch happens in the client after load because the preference is stored locally.
- Customizing third-party embed content beyond applying a matching class when possible.

## Decisions
1. **Theme token strategy:** Create a CSS custom property map (`--color-bg`, `--color-foreground`, `--color-border`, etc.) for each palette and toggle them with a `.theme-light` / `.theme-dark` class on the `<html>` element. This keeps component styles generic and relies on the cascading variables for contrast adjustments.
2. **Preference detection cascade:** Read `localStorage` (or cookie if `localStorage` is unavailable) for an explicit preference first, then fall back to the `prefers-color-scheme` media query, and default to light if neither is available. This gives users override control while still following their OS setting, and it allows rapid theming before the DOM paints through an inline `<script>` that applies the class before the stylesheet loads.
3. **Toggle placement and state:** Place the toggle button in the main navigation so it is always visible. Keep its state in sync with the `<html>` theme class, expose `aria-pressed`, and announce the current theme for screen readers. Persist the selection in `localStorage` and reapply it on every page load by re-running the same preference logic.
4. **Animation and transitions:** Fade theme changes subtly (e.g., short `transition` on background and color variables) to avoid flash-of-illegal-theming. Avoid animating layout properties to keep performance predictable.

## Risks / Trade-offs
- [Risk] The inline preference script adds a small amount of client-side logic before the framework bootstrap, which increases the bootstrap payload marginally → Mitigation: keep the script minimal and only interact with the DOM after `document.documentElement` is available.
- [Risk] Third-party embeds (videos, iframes) might still show light UI even in dark mode → Mitigation: wrap them in containers that absorb the background color and document the limitation for future replacements.
- [Risk] Persisting theme preference in `localStorage` means the value stays tied to the browser/device, so signed-in users moving between devices will not see their preference → Mitigation: document the limitation for product-side conversations; a future enhancement could sync a preference server-side.

## Migration Plan
1. Introduce the theming tokens and default light/dark CSS rules in theme-related stylesheets, and ensure the new classes cascade throughout shared components.
2. Add the inline preference detection script near the top of `_document`/base template, and confirm the CSS class is set before the stylesheet renders to prevent flashes.
3. Implement the toggle button component tied to the theme class, and wire the persistence logic in the main layout script so it survives navigation.
4. QA across modern browsers (Chrome, Firefox, Safari) and ensure that `prefers-color-scheme` defaults work; test toggling while embedded in long-lived components like modals.
5. Ship the design and monitor for any regressions via QA before writing tasks for implementation and updates.

## Open Questions
- Should the toggle override be scoped per subdomain or global to all docs? Current plan is per browser storage, but if we need server syncing we need product guidance.
- Do any legacy components rely on hard-coded colors that need refactoring first, or can they inherit the theme tokens once introduced?
- Are there analytics or telemetry considerations (e.g., tracking mode preference) that we should capture now or defer to a later phase?
