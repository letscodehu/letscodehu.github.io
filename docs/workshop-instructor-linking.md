# Workshop instructor section linking

## Change

The workshop landing page instructor section now renders selected terms as explicit links in both HU and EN locales.

## Linked terms

- `Krisztián` / `Krisztián` -> LinkedIn profile (`/in/papp-krisztian`)
- `Letscode.hu közösség` / `Letscode.hu community` -> Letscode.hu YouTube channel
- `DevOps gyakorlatok` / `DevOps practices` -> Vimeo talk URL
- `ADR` / `ADR` -> ADR talk URL

## Implementation note

The copy is split into structured i18n parts and link metadata, then composed in Vue template rendering (no raw HTML injection), keeping locale-level control over wording and link labels.
