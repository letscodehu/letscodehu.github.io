## Why
The site currently locks visitors into a single visual mode even when their operating system is already set to dark mode, which makes late-night reading and low-light work uncomfortable. Enabling a tailored dark theme with an explicit toggle keeps the interface usable for everyone and aligns with modern platform expectations.

## What Changes
- Define a dark theme palette and responsive theming strategy that mirrors the existing light styles but reduces glare, respecting the operating system preference (`prefers-color-scheme`) by default.
- Add a persistent toggle button in the primary navigation area so users can override the default theme, with the UI updating instantly and storing their choice across sessions.
- Coordinate the theme switch with any shared layout styles or components (e.g., headers, code samples, cards) so both modes feel cohesive and accessible.

## Capabilities
### New Capabilities
- `dark-mode-themes`: Specify the styling tokens, component adjustments, and default selection logic required to render both light and dark palettes consistently.
- `dark-mode-toggle`: Detail the toggle control, preference persistence, and UX/K accessibility behavior for switching modes on demand.

### Modified Capabilities
- `<existing-name>`: <what requirement is changing>

## Impact
- Layout and typography styles for the header, navigation, cards, and code samples will need new CSS variables or theme-aware classes.
- Client-side JavaScript that renders the layout needs to read `prefers-color-scheme`, expose a toggle, and store the preference (e.g., in `localStorage` or a cookie) so it survives reloads.
- Ensure any shared components (modals, forms, third-party embeds) pick up the active theme to avoid jarring contrast flashes.
