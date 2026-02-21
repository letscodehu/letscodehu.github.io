## ADDED Requirements

### Requirement: Dual theme tokens
The system SHALL define a complete set of theme tokens (CSS custom properties such as `--color-bg`, `--color-foreground`, `--color-border`, `--color-muted`, etc.) for both light and dark palettes and apply them via `.theme-light` and `.theme-dark` classes on the `<html>` element so components can rely on consistent names regardless of the active mode.

#### Scenario: Light theme renders token values
- **WHEN** the html element has `.theme-light` before styles cascade
- **THEN** all components read the light palette values from the shared CSS custom properties so backgrounds and text match the established light design

#### Scenario: Dark theme renders token values
- **WHEN** the html element has `.theme-dark`
- **THEN** every component inherits the dark palette values through the same property names so contrast is appropriate for low-light viewing

### Requirement: Default to operating system preference
The system SHALL resolve the active theme as follows: use an explicit preference stored in `localStorage` (or a fallback cookie) if present, otherwise respect the `prefers-color-scheme` media query, and fall back to `.theme-light` when neither source is available, ensuring the class is set before the main stylesheet loads to prevent a flash of the incorrect theme.

#### Scenario: Browser prefers dark with no stored preference
- **WHEN** the browser's `prefers-color-scheme: dark` media query matches and there is no stored preference
- **THEN** the html element is initialized with `.theme-dark` so the page renders in dark mode by default

### Requirement: Theme applies across shared components
The system SHALL ensure headers, navigation, cards, forms, code samples, and other shared layout pieces read the theme tokens (or apply matching theme-aware classes) so neither mode leaves any region stuck in the wrong palette.

#### Scenario: Components match the active tokens
- **WHEN** the theme class on `<html>` changes (either via preference detection or the toggle)
- **THEN** every shared component re-renders with the values from the currently active CSS custom property set so the UI feels cohesive in either mode
