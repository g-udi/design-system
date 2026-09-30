# Application expansion verification

Verified locally on 29 September 2026 against the existing Gaudi Storybook server at port 6007.

## Automated checks

- `pnpm lint`: passed.
- `pnpm test:contracts`: 45 passed, including server rendering, stable form identity, numeric-zero selection, empty tables, progress bounds and file-selection limits.
- `pnpm exec vitest --project=storybook --run`: 259 passed across 109 story files. This includes the existing catalogue, the new components/blocks, interactive workflows and axe accessibility checks. Both light and dark state galleries are covered.
- `git diff --check`: passed.
- `pnpm pack:check`: passed; application styles and new component/block leaf entrypoints are included.
- Radix dependency inspection: Dialog, AlertDialog, DropdownMenu, Tooltip and HoverCard share `react-dismissable-layer` 1.1.19; Dialog and DropdownMenu share `react-focus-scope` 1.1.16.
- All 23 new public families have indexed Storybook Docs pages, alongside 64 component/block examples.
- The four new registry icons are included in the shared Vite dependency pre-optimization list, avoiding a late reload during browser tests.

The initial passes caught and corrected an empty-data render loop, disabled-upload contrast, a Select option-identity reset, loading-state listbox semantics, and a late icon optimization reload. The final full suite passed after the component fixes. Wizard now moves focus when a stage or outcome changes rather than taking focus on initial page load.

## Responsive browser pass

Actual CSS viewport widths checked: **320, 390, 639, 640, 641, 768, 1023, 1024, 1025, 1280, 1536 and 1920px** (900px viewport height).

- Light and dark component galleries: document width matched the viewport at every width. Inputs, textareas, radio cards, view controls, upload controls, tabs, collection tools, feedback, settings, authentication and wizard layouts remained contained.
- Workspace: navigation collapses below 1024px and returns to its desktop rail at 1024px. Checked 1023/1024/1025 explicitly. Settings stack below 640px; checked 639/640/641.
- Dialog and sheet placement checked at 320, 390, 640, 768, 1024, 1280 and 1920px. Every overlay stayed inside the viewport. Focus moved inside on open; forward/backward tabbing remained inside; Escape/close returned to the trigger.
- At 390px, the article table had a 356px scrolling region containing 568px of table content. The board had a 358px scrolling region containing 800px of columns. Neither enlarged the page.
- Mobile navigation opened, selected Settings and closed correctly. Draft creation added a row and updated summary counts. Table search/sorting/selection/columns/pagination, board moves, form submissions, file selection/removal and async failure recovery are covered by interactions.
- Dark dialog surface resolved to `rgb(26, 26, 26)` with `rgb(212, 212, 212)` text. Light/dark styles apply through portals.
- Temporary viewport overrides were reset and the final preview returned to light mode.

## Scope and limits

Use [APPLICATION-COVERAGE.md](./APPLICATION-COVERAGE.md) and **Overview / Application patterns** for the exact ReUI mapping and unimplemented specialist categories. Tests cover Chromium; this is not a Safari/Firefox certification. No new Storybook server or production build was started, and no deployment was made.

The Impeccable detector's radius, type-size and shadow advisories were resolved by reusing Gaudi's existing token scale. Its existing `.impeccable/design.json` sidecar predates DESIGN.md; an Impeccable `document` refresh can synchronize that metadata separately.
