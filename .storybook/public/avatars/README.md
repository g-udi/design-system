# Demo avatars

These illustrated avatars are Storybook fixture assets, served at `/avatars/person-<nn>.svg`
(for example `/avatars/person-20.svg`). They are Gaudi originals: abstract faces drawn by the
deterministic generator in [`src/docs/fixtures/site/avatars.js`](../../../src/docs/fixtures/site/avatars.js)
from the gradient artwork palettes, so each seed always produces the same picture and no
third-party artwork or network request is involved. Regenerate them with
`node scripts/generate-avatars.mjs` after changing the generator.

They are demo data only: the names, roles and handles shown beside them are fictional. They are
not part of the published package; applications supply their own avatar URLs. When inlined, the
SVG colors read `--avatar-start`, `--avatar-end`, `--avatar-bloom`, `--avatar-glow`, `--avatar-body`,
`--avatar-face`, `--avatar-hair`, `--avatar-blush` and `--avatar-ink`, falling back to the generated palette.

## Shared demo identities

| Demo identity | Avatar path |
| --- | --- |
| Maya Chen | `person-20.svg` |
| Alex Johnson | `person-41.svg` |
| Sam Rivera | `person-31.svg` |
| Jo Morgan | `person-24.svg` |
| Lina Ahmed | `person-07.svg` |
| Jules Martin | `person-50.svg` |

Avatar displays its supplied accessible fallback while an image loads or when it is unavailable. See the root [README](../../../README.md#local-example-assets) for other local fixture conventions.
