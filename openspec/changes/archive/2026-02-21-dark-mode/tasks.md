## 1. Theme foundation

- [x] 1.1 Define light and dark palettes as CSS custom properties (`--color-bg`, `--color-foreground`, etc.) and create `.theme-light` / `.theme-dark` rules that apply them to the `<html>` scope.
- [x] 1.2 Inject a minimal inline preference script near the top-level template that reads stored overrides, falls back to `prefers-color-scheme` (with light as final fallback), and applies the appropriate theme class before the main stylesheet loads to avoid flashes.
- [x] 1.3 Update shared layout components (header, navigation, cards, forms, code samples) so they derive their colors from the new tokens or theme-aware utility classes.

## 2. Toggle control and persistence

- [x] 2.1 Add a toggle button to the primary navigation that exposes `aria-pressed`, announces the current mode, and reflects the html theme class state via text or icon.
- [x] 2.2 Wire the toggle to switch the `<html>` class between `.theme-light` and `.theme-dark`, trigger the CSS transitions on the custom properties, and keep the button label/state synchronized when activated by mouse or keyboard.
- [x] 2.3 Persist the explicit choice (`dark`/`light`) in `localStorage` (or a fallback cookie) and ensure the preference script rehydrates it before the rest of the UI renders.

## 3. Stability and rollout

- [x] 3.1 Document the new theming behavior and toggle usage in the docs (README or a relevant guide) so future contributors understand the tokens and toggling flow.
- [x] 3.2 QA the implementation across Chrome, Firefox, and Safari, verifying OS preference defaults, stored overrides, toggle accessibility, and no flashes when loading.
- [x] 3.3 Monitor for any regressions (e.g., hard-coded colors) and note them in the change notes for follow-up beyond this change if needed.
