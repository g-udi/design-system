# Pattern catalogue verification

Verified on 29 September 2026 against the existing Storybook development environment.

| Check | Result |
| --- | --- |
| Full Storybook regression, including existing components | 1,427 tests passed across 191 files |
| Pattern catalogue in dark mode | 1,150 tests passed across 82 files |
| Public contracts, SSR, recurrence, clipboard, query immutability, icon coverage | 77 tests passed |
| Copyable source compiled through public Gaudi owner imports | All 1,149 examples passed |
| ESLint | Passed, no warnings |
| Git whitespace check | Passed |
| Package dry run | Passed; approximately 538 KB compressed / 2.37 MB unpacked, excluding examples and test tooling |
| Focused design scan of composition styles and catalogue | No findings |

Every one of the **1,149 component examples** was checked in both light and dark mode at **320, 375, 390, 639, 640, 767, 768, 1023, 1024, 1280, 1440, and 1920 pixels**. The test verifies the actual viewport width, waits for layout, checks document overflow, reports overflowing elements, and restores the prior viewport. Intentional scrolling stays inside tables, boards, chips, timelines, or code regions. The catalogue overview also has a separate responsive and search/filter interaction check.

Interaction coverage includes combobox keyboard selection, numeric clamping, stepper navigation, dialog focus return, tree expansion, keyboard reordering, questionnaire back/forward persistence and submission, file upload/removal, and message submission/replies. Axe checks run on the resulting states. Contract tests cover daylight-saving recurrence, quoted and multiline spreadsheet cells, cycle-safe filter moves, and every literal icon in the catalogue.

The final visual pass inspected the catalogue on phone and laptop layouts, the advanced spreadsheet grid, compound fields, and the calendar in dark mode. The viewport and theme overrides were restored. A final token adjustment to grid borders and badge focus/invert variants was confirmed with 34 grid stories and all 25 badge stories in both themes.

These checks validate the shipped examples and selected workflows. They do not imply exhaustive coverage of every possible composition, third-party integration, or application backend. Upload progress, chat replies, CRUD data, and server-data examples use local fixtures or simulations as shown in their source. No Storybook server was started and no production deployment was performed.

## Docs layout follow-up

The story checks above exercise isolated canvases; they did not catch the Accordion pattern list sitting outside the custom Docs page container. The examples now render inside that container, which has a 72rem maximum width, consistent page gutters, and a single preview inset. Example headings and descriptions are styled independently of the rendered components.

The actual Accordion and Button Docs documents were checked at **320, 375, 390, 639, 640, 767, 768, 769, 1023, 1024, 1280, 1440, and 1920 pixels**. All 22 Accordion pattern canvases and headings align with the content gutter; no document overflow was found on either page. At 320px, expanded source remains inside its horizontal scrolling region, and Arrow Down/Enter navigation opens the expected accordion panel. The full Storybook manager was visually checked at 375px and 1024px, with an additional dark-mode Docs check at 375px. Code controls have readable dark-mode colors and 44px phone targets. Temporary viewport and theme overrides were restored.

Validation after the layout change: all 23 Accordion stories, all 77 public contracts, ESLint, the layout scan, and `git diff --check` passed.

The code-action follow-up removes Storybook's negative 40px action margin, which overlapped the preview after its bottom margin was reduced. All **23 action footers** now follow the preview in normal flow, with a separate surface, aligned edges, and 32px desktop / 44px phone buttons. Footer alignment, button containment, target size, and document overflow passed at every width listed above. Expanded source was checked at 320px; copying the disabled/highlighted example returned its public imports and fixture source. Dark mode was checked at 375px, and the complete Storybook manager at 1024px. Clipboard content, viewport, and theme were restored. The 77 contracts, ESLint, layout scan, and whitespace check passed again.

Controlled Group's obsolete, undefined spacing class was replaced with the existing grid/gap pattern, including in its copyable source. The button-to-accordion gap measures **16px at all 13 widths listed above**, with aligned left edges and no page overflow. Collapse all and reopening were verified at 375px. The other visible action groups in Guided Setup, Inside Card, and Pattern Overview also use 16px gaps. Phone and full Storybook laptop layouts were visually checked, and all 23 Accordion stories, 77 contracts, lint, and whitespace checks passed.

## AlertDialog docs and open-dialog checks

The AlertDialog follow-up registers all fourteen pattern stories with autodocs alongside the three convenience examples. Its main Docs page renders all **17 examples once**, with a source footer for each and a contained props table. The page passes the same 13-width check above. The unsaved-changes example now uses one dialog surface; the shared Frame references Gaudi's surface and border tokens instead of undefined upstream variables. Zero-padding unsaved-changes and logout footers stay inside the dialog.

All fourteen compound alert dialogs now have open/cancel/focus-return interaction checks, including the nested-dialog case. With `VITE_GAUDI_RESPONSIVE=1`, those checks measure the open portal and footer at all 13 widths. The 17 AlertDialog and 19 Frame stories passed in light and dark mode (36 per theme); all 77 contracts, lint, and public-source compilation for 1,149 examples also passed. Live Docs checks confirmed all 17 examples at every width, and the two repaired footers were rechecked across all 13 widths. Phone visuals were checked in both themes and the full Storybook page at laptop width.

## Dialog naming and consolidation

The confirmation API and its examples now belong to `Dialog`: use `variant='confirmation'` for the convenience API and `DialogConfirmation*` for composition. Legacy `AlertDialog*` imports delegate to the Dialog implementation. Modal and sheet behavior stays available through the existing Dialog API. The single `Core/Dialog` Docs page contains all 39 confirmation, modal, drawer and sheet examples with public, copyable source.

Verification passed: 40 Storybook interaction/a11y tests (39 Dialog examples plus DialogPortal), 77 contracts, lint and all 1,149 public-source examples. The confirmation tests cover successful, rejected and pending actions, Cancel-first focus, nested dialogs and focus return. Live Docs checks at 320, 375, 390, 639, 640, 767, 768, 769, 1023, 1024, 1280, 1440 and 1920px found all 39 examples, aligned source footers and no document overflow. Temporary viewport overrides were restored.

## Avatar extension

The existing Avatar convenience component now composes the same primitives as its 35 patterns. It adds local/data image support, loading/error recovery, Unicode initials, host-provided presence and verification, custom fallback artwork, six sizes, inherited image/fallback radii and data-driven AvatarGroup overflow. Legacy labels, tones and sizes remain supported. Account-menu, reviewer-roster, image-recovery, presence, identity and international-name workflows extend the owner with six complete examples. All **44 examples** are included on the main Docs page.

Verification: all 44 Avatar stories passed in light and dark, and the combined Avatar/Accordion run passed 88 stories. All 82 contracts, lint and 1,155 public-source examples passed. Live Docs checks covered 320, 375, 390, 639, 640, 767, 768, 769, 1023, 1024, 1280, 1440 and 1920px in both themes, with 44 previews and source footers, no document overflow and no preview errors. Manual interaction checks confirmed account selection, successful local image loading, broken-image initials, the six-person reviewer roster and correct RTL badge positioning. Temporary viewport/theme overrides were restored. An explicit Storybook callback spy prevents implicit-action errors during image loading in Docs.

## Reproduce

```sh
pnpm lint
pnpm test:contracts
node scripts/verify-pattern-sources.mjs
VITE_GAUDI_RESPONSIVE=1 pnpm exec vitest run --project=storybook --maxWorkers=4
VITE_GAUDI_THEME=dark VITE_GAUDI_RESPONSIVE=1 pnpm exec vitest run --project=storybook Patterns --maxWorkers=4
git diff --check
npm pack --dry-run
```

The source inventory, owner mapping, compatibility aliases, and licenses are documented in [PATTERN-COVERAGE.md](PATTERN-COVERAGE.md) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
