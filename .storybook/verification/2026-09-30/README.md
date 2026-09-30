# Component documentation parity — 30 September 2026

All 105 component documentation pages now use Accordion's shared structure: a preview, working controls where the story accepts arguments, canonical usage, accessibility guidance, a separate API reference, and the complete example catalogue.

The shared layout retains 13px documentation text, consistent inline code, compact controls, responsive property lists, and the established gutters. Fixed examples no longer receive controls that cannot affect their render. Each example is mounted once; Accordion retains its approved presentation.

Nine configurable playgrounds were added for Avatar, Calendar, Dialog, EmptyState, Input, NumberField, Progress, Slider, and Textarea. Existing examples were retained. Calendar also now fits narrow containers while preserving 44px-tall date buttons. Corrected canonical snippets include SettingsPanel, CmdLauncher, Disclaimer, Tabs, Tooltip, FAQ, CitationTracker and Toast.

## Verification

- **1,447 stories passed in each theme**: 2,894 passing runs and 57,880 story viewport checks.
- **105 assembled Docs pages**, checked individually at 21 widths in both themes: **4,410 checks**, with all expected examples present, 13px body text, API references, no nested code elements, no visible Storybook error panels, and no document-level horizontal overflow.
- **85 React canonical snippets** passed JSX syntax validation. MDX authoring examples were reviewed in their rendered documentation and are excluded from that JSX parser check.
- **99 contract tests**, lint, catalogue synchronization (1,552 entries), and whitespace validation passed.
- Live checks covered Input controls, source expansion/copy and reset; Avatar size/shape; open Dialog containment; and responsive two-month Calendar layout.

Docs widths: **320, 375, 390, 639, 640, 641, 767, 768, 769, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1535, 1536, 1537, 1920, 2560px**. Story tests use the same matrix through 1920px. This covers phones, tablets, laptops, wide desktops and both sides of the 640/768/1024/1280/1536 breakpoints.

The existing Storybook interaction and accessibility suite exercises the authored play functions. The documentation audit checks rendered structure, typography, example coverage and overflow; it does not claim exhaustive manual inspection of every possible prop combination. Verification used local Chromium and the Codex in-app browser. Viewport and theme overrides were restored afterward.

## Records

- [Every documentation page and width](./docs.csv)
- [Every story in both themes](./stories.csv)
- [Counts and interaction coverage](./summary.json)

## Repeat the automated checks

```sh
VITE_GAUDI_AUDIT=1 pnpm test-storybook --run
VITE_GAUDI_THEME=dark VITE_GAUDI_AUDIT=1 pnpm test-storybook --run
pnpm test:contracts
pnpm lint
node scripts/sync-story-catalogue.mjs --check
git diff --check
```
