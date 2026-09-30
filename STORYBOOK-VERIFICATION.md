> Latest verification: [Component documentation parity — 30 September 2026](.storybook/verification/2026-09-30/README.md). All 105 Docs pages and 1,447 stories pass in both themes. The record below preserves the earlier 29 September audit.

# Storybook verification — 29 September 2026

Gaudi is a curated design system for blogs and applications. This pass aligns its documentation and verifies the complete current Storybook index.

## Result

- **1,435 stories**, each run in light and dark themes: **2,870 passing story runs** and **57,400 viewport checks**.
- **105 assembled Docs pages**, individually visited in both themes at all 20 widths: **4,200 additional layout and typography checks**. Every page renders its expected examples, with no duplicate IDs inside examples, visible Storybook render errors, or initial page jumps in the verified final state.
- **Seven foundation guides and the Component Catalogue**, checked in both themes at all 20 widths: **320 additional checks**. The guides are included in the 1,435-story total; this is a separate check of their stable, non-autoplay presentation.
- Lint, **88 contract tests**, catalogue synchronization (**1,540 entries**), and `git diff --check` pass.
- After the full suites, targeted reruns covered subsequent fixture repairs: chart gradients, command selection, mobile button groups/sidebar, pagination, guide alignment, and Select startup behavior. These also pass in the relevant themes.

## What changed

- Shared documentation body text is **13px**, with **28px page titles**, **18px sections**, and **16px example headings**. Guides and Docs use the available width with a shared 24px side inset (16px at 640px and below) and consistent section rhythm. Real component previews and typography specimens retain their public Gaudi styles.
- Semantic token content is visible on entry; collapsed palette and supporting-token sections have explicit Show/Hide affordances. Colors & Tokens and Typography now use the same outer layout as the other guides.
- Curated extensions remain attached to their existing component owners and participate in autodocs. Original component metadata takes precedence, while all curated examples remain visible. Button now exposes all 68 examples, Select 86, Avatar 44, and Dialog 39.
- Responsive fixes cover navigation dropdowns, pagination, MDX tooltips, loading skeletons, article tables of contents, sidebar actions, and button-group labels. Wide charts, grids, and boards remain contained in their intended scrolling regions.
- Dark-theme fixture fixes cover typography metadata, card and pagination surfaces, and editorial examples. Image theme variants no longer leave a hidden image button focusable.
- Independent examples use unique checkbox, heading, and chart-gradient IDs. TableOfContents accepts `contentRef` so multiple articles on a Docs page do not index each other's visuals.
- Select examples open through interaction instead of stealing focus during Docs load. The inline command example starts unselected, preventing cmdk from scrolling the host page; typing and keyboard selection remain functional.

## Current side padding

The final spacing adjustment uses **24px on each side above 640px** and **16px on phones at 640px and below**. Documentation text and code retain the full available width. Getting Started, Colors & Tokens, and Accordion Docs pass all 21 widths (320–2560px) in both themes: **126 gutter and overflow checks**. Lint, 88 contract tests, and `git diff --check` pass. The earlier follow-up measurements below record the prior 16px-all-widths iteration.

## Follow-up: smaller side gutters

Removed the centered 72rem cap from the shared guide and Docs layout. Both now use the available width with a **16px inset on each side**, including wide desktop screens.

Verified all **105 Docs pages and eight guide/catalogue pages** at the original 20 widths plus **2560px**. Rechecked the eight guides and Accordion Docs in dark mode. All **2,562 measurements** show 16px left/right insets, 28px page titles, and no document overflow. Phone and wide-desktop captures confirm alignment. Lint, all 88 contract tests, the layout scan, and `git diff --check` pass. Viewport overrides and light theme were restored after verification.

[Every gutter measurement](.storybook/verification/2026-09-29/gutters.csv)

## Follow-up: documentation text fills the page

Removed the remaining 75ch limits from guide intros, section descriptions, component descriptions, and example descriptions. Removed the 64rem documentation wrappers from shared page headings, guide copy, and code panels. Typography specimens and real component examples retain their own intended layout.

Verified eight guides/catalogue pages plus Accordion, Button, Select, and Chart Docs in both themes at all 21 widths listed in the gutter follow-up: **504 checks**, with no document overflow or remaining caps on the checked documentation copy. At 1920px, the Getting Started intro occupies the full 1888px content area and renders on one line; its code panel aligns with that area. At narrow widths, prose and code wrap within their containers. The phone copy control works. Lint, 88 contract tests, and `git diff --check` pass.

[Text-width measurements](.storybook/verification/2026-09-29/text-widths.csv)

## Widths checked

**320, 375, 390, 639, 640, 641, 767, 768, 769, 1023, 1024, 1025, 1279, 1280, 1281, 1440, 1535, 1536, 1537, and 1920 CSS pixels**, at 900px viewport height. This includes narrow/common phones, tablet, laptop and wide desktop sizes, and both sides of the 640/768/1024/1280/1536 breakpoints.

## Method and practical limits

The existing Chromium Storybook interaction and accessibility suite ran every story. The added `VITE_GAUDI_AUDIT=1` after-each audit resizes every rendered story through the width matrix and checks document overflow. It verifies the shared heading/body scale on guide pages and restores the prior viewport after each story.

A separate browser pass opened each assembled Docs page and guide in both themes, measured typography and layout at every width, checked example counts and duplicate IDs, and captured phone and desktop views. The phone captures for all 105 Docs pages and eight guides were visually reviewed. This is an automated per-story audit plus a visual review of assembled documentation; it is not a manual inspection of every pixel of all 1,435 story variants.

Additional live checks exercised token search, semantic disclosure collapse/expansion, token copying, Docs code expansion/collapse and copying, and mobile layout containment. Existing story interactions cover the components' keyboard, selection, dialog and state behaviors. The work was verified locally in Chromium/Codex's in-app browser; Safari, Firefox, production deployment, and live backend integrations were not part of this pass.

## Reproduce

With project dependencies installed:

```sh
VITE_GAUDI_AUDIT=1 pnpm exec vitest run --project=storybook --maxWorkers=4
VITE_GAUDI_AUDIT=1 VITE_GAUDI_THEME=dark pnpm exec vitest run --project=storybook --maxWorkers=4
pnpm lint
pnpm test:contracts
node scripts/sync-story-catalogue.mjs --check
git diff --check
```

## Page-by-page records

- [Every story and its light/dark result](.storybook/verification/2026-09-29/stories.csv)
- [Every Docs page, example count, typography and render result](.storybook/verification/2026-09-29/docs.csv)
- [Foundation guide and catalogue results](.storybook/verification/2026-09-29/guides.csv)

| Docs page | Examples | Light, all widths | Dark, all widths |
| --- | ---: | --- | --- |
| Blocks/Application/AppShell | 2 | Pass | Pass |
| Blocks/Application/AuthForm | 3 | Pass | Pass |
| Blocks/Application/KanbanBoard | 2 | Pass | Pass |
| Blocks/Application/ResourceList | 3 | Pass | Pass |
| Blocks/Application/SettingsPanel | 2 | Pass | Pass |
| Blocks/Application/StatGroup | 2 | Pass | Pass |
| Blocks/Application/Wizard | 2 | Pass | Pass |
| Blocks/KanbanBoard | 6 | Pass | Pass |
| Blocks/Navigation/Breadcrumb | 15 | Pass | Pass |
| Blocks/Navigation/Navigation Menu | 4 | Pass | Pass |
| Blocks/Navigation/Pagination | 15 | Pass | Pass |
| Blocks/Navigation/Sidebar | 5 | Pass | Pass |
| Blocks/ResourceList | 12 | Pass | Pass |
| Blocks/Thoughts | 3 | Pass | Pass |
| Core/Accordion | 44 | Pass | Pass |
| Core/AspectRatio | 8 | Pass | Pass |
| Core/Attachment | 6 | Pass | Pass |
| Core/Avatar | 44 | Pass | Pass |
| Core/Banner | 24 | Pass | Pass |
| Core/Breadcrumb | 3 | Pass | Pass |
| Core/Button | 68 | Pass | Pass |
| Core/ButtonGroup | 57 | Pass | Pass |
| Core/Calendar | 34 | Pass | Pass |
| Core/Card | 42 | Pass | Pass |
| Core/Carousel | 14 | Pass | Pass |
| Core/Cascader | 20 | Pass | Pass |
| Core/Checkbox | 24 | Pass | Pass |
| Core/CmdLauncher | 10 | Pass | Pass |
| Core/CmdLauncherShortcut | 1 | Pass | Pass |
| Core/DataTable | 40 | Pass | Pass |
| Core/Dialog | 39 | Pass | Pass |
| Core/DialogPortal | 1 | Pass | Pass |
| Core/DropdownMenu | 35 | Pass | Pass |
| Core/EmptyState | 23 | Pass | Pass |
| Core/EventCalendar | 5 | Pass | Pass |
| Core/Field | 27 | Pass | Pass |
| Core/FileUpload | 14 | Pass | Pass |
| Core/FilterBar | 14 | Pass | Pass |
| Core/Gantt | 7 | Pass | Pass |
| Core/Grid | 2 | Pass | Pass |
| Core/Icon | 29 | Pass | Pass |
| Core/Input | 75 | Pass | Pass |
| Core/InputOtp | 6 | Pass | Pass |
| Core/Kbd | 11 | Pass | Pass |
| Core/Link | 5 | Pass | Pass |
| Core/Marker | 6 | Pass | Pass |
| Core/Message | 20 | Pass | Pass |
| Core/NavigationMenu | 3 | Pass | Pass |
| Core/NumberField | 6 | Pass | Pass |
| Core/Pagination | 5 | Pass | Pass |
| Core/PhoneInput | 8 | Pass | Pass |
| Core/Pill | 30 | Pass | Pass |
| Core/Popover | 22 | Pass | Pass |
| Core/Progress | 11 | Pass | Pass |
| Core/Questionnaire | 7 | Pass | Pass |
| Core/RadioGroup | 20 | Pass | Pass |
| Core/Rating | 9 | Pass | Pass |
| Core/Resizable | 10 | Pass | Pass |
| Core/ScrollArea | 5 | Pass | Pass |
| Core/Scrollspy | 2 | Pass | Pass |
| Core/Select | 86 | Pass | Pass |
| Core/Separator | 6 | Pass | Pass |
| Core/Skeleton | 12 | Pass | Pass |
| Core/Slider | 12 | Pass | Pass |
| Core/Sortable | 8 | Pass | Pass |
| Core/Spinner | 14 | Pass | Pass |
| Core/Stepper | 18 | Pass | Pass |
| Core/Switch | 17 | Pass | Pass |
| Core/Tabs | 12 | Pass | Pass |
| Core/Terminal | 3 | Pass | Pass |
| Core/Textarea | 9 | Pass | Pass |
| Core/TextHighlight | 4 | Pass | Pass |
| Core/Timeline | 15 | Pass | Pass |
| Core/Toast | 24 | Pass | Pass |
| Core/ToggleGroup | 33 | Pass | Pass |
| Core/Tooltip | 19 | Pass | Pass |
| Core/Tree | 7 | Pass | Pass |
| MDX/Aside | 1 | Pass | Pass |
| MDX/Callout | 1 | Pass | Pass |
| MDX/Chart | 33 | Pass | Pass |
| MDX/Citation | 1 | Pass | Pass |
| MDX/CitationTracker | 1 | Pass | Pass |
| MDX/CodeGroupTabs | 29 | Pass | Pass |
| MDX/Details | 1 | Pass | Pass |
| MDX/FAQ | 1 | Pass | Pass |
| MDX/FileTree | 1 | Pass | Pass |
| MDX/Footnote | 1 | Pass | Pass |
| MDX/Highlight | 1 | Pass | Pass |
| MDX/Image | 1 | Pass | Pass |
| MDX/ImageModal | 1 | Pass | Pass |
| MDX/LatexText | 1 | Pass | Pass |
| MDX/Mermaid | 1 | Pass | Pass |
| MDX/Preview | 3 | Pass | Pass |
| MDX/Quote | 1 | Pass | Pass |
| MDX/Table | 18 | Pass | Pass |
| MDX/Tooltip | 1 | Pass | Pass |
| MDX/Video | 2 | Pass | Pass |
| Post/Breadcrumbs | 1 | Pass | Pass |
| Post/Disclaimer | 2 | Pass | Pass |
| Post/Post | 2 | Pass | Pass |
| Post/PostHeader | 2 | Pass | Pass |
| Post/PostNavigation | 2 | Pass | Pass |
| Post/PostSeriesBox | 2 | Pass | Pass |
| Post/PostSharing | 2 | Pass | Pass |
| Post/TableOfContents | 3 | Pass | Pass |
