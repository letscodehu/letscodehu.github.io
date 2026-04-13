# Training submenu navigation

## Architectural change

The header navigation now models `Training` as a parent menu group with two explicit destinations instead of a single direct link.

## Route mapping

- `General training` -> `training-en` (`/:lang/training`)
- `Architect Mindset` -> `training-b2c-ads-en` (`/:lang/training/workshop-budapest`)

## Active-state behavior

- Parent `Training` stays active on all training-related routes.
- Submenu item highlight reflects the concrete current destination (`training-en` or `training-b2c-ads-en`).
