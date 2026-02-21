## ADDED Requirements

### Requirement: Accessible navigation toggle
The system SHALL render a toggle button inside the primary navigation bar that indicates the current theme via text/icon, exposes `aria-pressed`, and announces the active mode to assistive technologies so keyboard and screen-reader users can discover and operate it.

#### Scenario: Keyboard user toggles theme
- **WHEN** a keyboard user tabs to the toggle and presses Enter
- **THEN** the button announces the new mode, updates `aria-pressed`, and the theme class on `<html>` changes accordingly so assistive users understand the new state

### Requirement: Persistent preference storage
The system SHALL persist the user’s explicit theme choice in `localStorage` (or a fallback cookie) so subsequent visits start with the chosen mode instead of relying on the operating system preference again.

#### Scenario: Stored preference overrides OS default
- **WHEN** a user previously selected dark mode and re-opens the site on the same browser
- **THEN** the preference script reads the stored value and applies `.theme-dark` before the stylesheet loads, ignoring the OS preference

### Requirement: Instant theme updates
The system SHALL update the theme immediately when the toggle is activated, transitioning the CSS custom properties for background and foreground so the interface changes without requiring a page reload or navigation.

#### Scenario: Toggling theme animates
- **WHEN** the toggle is clicked or activated
- **THEN** the theme class on `<html>` switches instantly and shared components pick up the new CSS custom properties so the user perceives a smooth transition between modes
