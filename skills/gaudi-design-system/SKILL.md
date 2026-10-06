---
name: gaudi-design-system
description: Build React UI with the Gaudi design system (@gaudi/design-system). Use whenever a project depends on @gaudi/design-system, or when asked to build or change pages, forms, dialogs, tables, dashboards, app shells, chat interfaces, charts or blog/MDX layouts with Gaudi components, tokens or blocks. Covers finding the right component, reading its real API, exact public imports, composing with tokens, accessibility, RTL and i18n, and validating usage.
---

# Building UI with Gaudi

Gaudi (`@gaudi/design-system`) is a React 19 design system shipped as JSX source with Tailwind CSS v4. It owns presentation, tokens, semantics, keyboard/focus behaviour and local interaction state. Your application owns data, routing, permissions, persistence, network calls and translations.

## Workflow: Find → Read → Import → Compose → Validate

1. **Find the owner.** Search before writing markup. With the MCP server use `search` (or `list_components`, `list_blocks`). Without it, read `node_modules/@gaudi/design-system/llms.txt` (the index) or `references/catalogue.md`. Prefer an existing block (`list_blocks`) as the starting point for whole pages.
2. **Read the real API.** Call `get_component(<name>)` (or read the component section in `node_modules/@gaudi/design-system/llms-full.txt`). Use only documented props and values. If a prop is not documented, it does not exist; compose parts instead of inventing options.
3. **Import from the exact public entry.** Use the path reported by `get_component` / `get_install_command`. Prefer owner leaf entries in route code (`@gaudi/design-system/core/Button`); category entries (`/core`, `/chat`, `/charts`, …) and the root are also valid. Never import `src/…`, `components/…` or other private paths, and never copy component source into the app.
4. **Compose with the system.** Use Gaudi parts, semantic token utilities and the icon registry. Do not hand-roll buttons, menus, dialogs, focus traps, tables, scroll areas or icons that Gaudi already provides.
5. **Validate.** Run `validate_usage` on the code you wrote and fix every error and warning. It checks imports, export names, documented props and variant values, accessible names, hard-coded English in label props, physical direction classes and raw colours.

## Setup (once per project)

- Install: `pnpm add github:ahmadassaf/design-system` (until published to npm; the import name is always `@gaudi/design-system`). Peers: `react`, `react-dom`, `next`, `next-themes`, `tailwindcss`; optional `recharts` (charts) and `@xyflow/react` (Flow).
- CSS: `import '@gaudi/design-system/global.css'` once in the root layout. If the app owns its Tailwind entry, import `@gaudi/design-system/styles.css` after Tailwind instead.
- Next.js: `transpilePackages: ['@gaudi/design-system']`.
- Theming: `--ds-radius` (corners, default 4px), `--ds-space-scale` (density, default 1), dark mode via the `dark` class on `<html>`.
- Themes: presets (`list_themes`) apply with `data-theme="<id>"` on `<html>` plus `@gaudi/design-system/themes.css`, or `ThemeProvider`/`useTheme` + `getThemeScript()` from `@gaudi/design-system/themes`. Bring a shadcn/tweakcn/StyleGlide theme with `import_theme` (or `gaudi-ds theme import`), check it with `gaudi-ds theme check`, and never hard-code colours a theme should own: use the semantic utilities so every theme applies. Contract: `src/tokens/THEMING.md`.
- Details: `get_project_setup`.

## Which component? Decision tables

### Actions and navigation

| Need | Use | Not |
| --- | --- | --- |
| A command or submit | `Button` (`variant`, `tone`, `size`) | a styled `<div>` or `<a>` |
| A link that looks like a button | `Button` with `href` | `Link` wrapped in a button |
| Inline or internal navigation | `Link` | raw `<a>` for internal routes |
| Joined related actions | `ButtonGroup` | adjacent buttons with custom borders |
| Mode switch or pressed formatting | `ToggleGroup` | `Tabs` (tabs switch panels) |
| Menu of actions on a trigger | `DropdownMenu` (right click: `ContextMenu`) | `Popover` with buttons |
| Command palette / ⌘K search | `Commander` (`CommandDialog`) | a custom dialog with a list |
| Site header | `Menu` from `blocks/Navigation` | a new navigation owner |
| Primary site navigation menu | `NavigationMenu` | `DropdownMenu` |
| Page trail | `Breadcrumb` | text with slashes |
| Paging | `Pagination` | custom previous/next links |
| Steps in a process | `Stepper`; a full guided form: `Wizard` block | `Tabs` |
| Long-document section links | `Scrollspy` (articles: `TableOfContents`) | manual scroll listeners |

### Overlays and feedback

| Need | Use | Not |
| --- | --- | --- |
| Focused task or detail without leaving the page | `Dialog` (`variant='modal'`) | a fixed-position `<div>` |
| Explicit yes/no decision, destructive confirm | `Dialog` `variant='confirmation'` with `onConfirm` | `window.confirm` or a custom modal |
| Side panel (settings, details, comments) | `Sheet` | `Dialog` styled as a drawer |
| Small positioned content next to a trigger | `Popover` (hover preview: `HoverCard`) | `Tooltip` with interactive content |
| Short hint for an already-labelled control | `Tooltip` | the only label of an icon button |
| Result of an action, transient | `toast()` with one `ToastProvider` | a banner that never leaves |
| Inline message about nearby content | `Alert` (from `core/Banner`) | `Banner` |
| Site-wide announcement strip | `Banner` | `Alert` at the top of every page |
| Nothing to show / no results | `Empty` (from `core/EmptyState`) | blank space |
| Loading placeholder | `Skeleton`; inline wait: `Loader`; known progress: `Progress` | loaders for page layout |

### Forms and input

| Need | Use | Not |
| --- | --- | --- |
| Label, help text and error for any control | `Field` with `FieldLabel`, `FieldDescription`, `FieldError` | placeholder-only labels |
| Validation, error summary, inline edit, character count | `useFormValidation`, `FormErrorSummary`, `EditableField`, `CharacterCount` from `blocks/Forms` | ad-hoc error state |
| Single-line text with icons or addons | `Input` (`prefix`/`suffix`) or `InputGroup` parts | absolutely positioned icons |
| Multi-line text | `Textarea` | `contentEditable` |
| Numbers with steppers and locale formatting | `NumberField` | `Input type='number'` with custom buttons |
| Phone numbers / one-time codes | `PhoneInput` / `InputOTP` | split inputs |
| Pick from a known list (one or many) | `Select` (`options`, `multiple`, `searchable`) | a hand-built listbox |
| Type to filter a long list / free text allowed | `Combobox*` / `Autocomplete*` from `core/Select` | `Select` with thousands of options |
| Hierarchical choices | `Cascader` | nested selects |
| Plain platform select | `NativeSelect` | — |
| Binary setting that applies immediately | `Switch` | `Checkbox` |
| Binary choice submitted with a form, or many-of | `Checkbox` | `Switch` |
| One of a few visible options | `RadioGroup` | `Select` for two or three options |
| Value or range on a scale | `Slider` | `Input type='range'` |
| Dates | `Calendar` / `DateSelector`; booking slots: `ScheduleCalendar`, `TimeSlots` | raw date libraries in markup |
| Files | `FileUpload`; listing files: `Attachment` | `<input type='file'>` alone |
| Multi-step questions | `Questionnaire` | a custom state machine |

### Data display and layout

| Need | Use | Not |
| --- | --- | --- |
| Sortable, filterable, selectable records | `DataTable` (stable row IDs) | `<table>` with custom sorting |
| Article tables in prose | `Table` (`mdx/Table`) | `DataTable` in MDX |
| Search + facets + removable filters over a collection | `FilterBar` | custom chips and popovers |
| Rows of people, settings, integrations | `Item` parts | ad-hoc flex rows |
| Framed content | `Card` parts; metrics: `StatCard` | bordered `<div>` |
| Status or category label | `Badge` (from `core/Pill`) | coloured `<span>` |
| Disclosure sections | `Accordion` / `Collapsible` | `details` with custom styling |
| Related panels | `Tabs` | `ToggleGroup` |
| Hierarchy | `Tree` | nested lists |
| Contained scrolling | `ScrollArea` | `overflow-auto` on page wrappers |
| Resizable panes | `ResizablePanelGroup`, `ResizablePanel`, `ResizableHandle` | custom drag handles |
| Activity or milestones | `Timeline` | custom lists |
| Boards, schedules and plans | `Kanban`, `EventCalendar`, `Gantt` | hand-rolled drag and drop |
| Code | `CodeBlock` (tabs: `CodeBlockGroup`) | `<pre>` with custom highlighting |
| People | `Avatar`, `AvatarGroup` | `<img>` with initials logic |
| Icons | `Icon name='…'` from the registry (`get_tokens('icons')`) | importing arbitrary icon packs |

### Pages, apps, chat, charts and content

| Need | Use |
| --- | --- |
| Application frame with sidebar/rail | `AppShell` parts and `Sidebar*` from `blocks/AppShell`; start from an `app-shell-*` block |
| Sign-in / sign-up / onboarding / settings / profile pages | `Screen` + `AuthForm` (`blocks/Screens`, `blocks/AuthForm`); start from `screens-*` blocks |
| Dashboard | `DashboardGrid`, `DashboardPanel`, `DashboardToolbar` + `StatCard` + charts; start from `dashboard-*` blocks |
| Chat or agent UI | `ChatShell` (`blocks/Chat`) composing `ChatMessage`, `ChatPromptComposer`, `ChatMessageScroller` and `ChatMessageParts` |
| Charts | owners in `@gaudi/design-system/charts` (`LineChart`, `BarChart`, `AreaChart`, `DonutChart`, …) inside `ChartFrame` behaviour; never from the root entry; needs `recharts` |
| Node graphs | `Flow` (needs `@xyflow/react` and `@gaudi/design-system/flow.css`) |
| Blog article page | `LayoutWrapper` / `ArticleContentLayout`, `PostHeader`, `TableOfContents`, MDX primitives from `@gaudi/design-system/mdx` |

When two rows look similar, read both with `get_component` and follow their `decisionRules` and `notes`.

## Composition rules

- **Never invent props.** Use documented props and variant values only. Pass extra presentation through `className` with token utilities, or compose the exported parts.
- **Tokens, not values.** Semantic colour utilities (`bg-surface`, `bg-surface-muted`, `text-text`, `text-text-muted`, `border-border`, `bg-accent`, `text-accent-foreground`, and status tones `success`, `warning`, `danger`, `info`, `attention`, `discovery`). No hex, `rgb()` or raw palette shades (`bg-blue-500`) for UI state. Status colour always pairs with text or an icon.
- **Spacing and shape.** Prefer `gap-*` on flex/grid over `space-x/y-*`; density follows `--ds-space-scale`. Corners come from `--ds-radius`; do not add arbitrary radii. Match control sizes in a row (`size` props).
- **Layout.** Build for narrow containers; let labels and actions wrap; keep scrollable tables, charts and boards inside their own region.
- **Controlled state.** Use `value`/`onValueChange`, `open`/`onOpenChange` pairs consistently; keep business rules, fetching and persistence in the app.

## Accessibility, RTL and i18n

- Every control has a visible label (`FieldLabel`) or, when icon-only, an `aria-label`. Tooltips never replace a label.
- Pass user-facing strings through props so they can be translated: `title`, `description`, `label`, `placeholder` and every `*Label` prop (`closeLabel`, `confirmLabel`, `cancelLabel`, `pendingLabel`, `labels={…}`). Defaults are English; supply translations in non-English interfaces. Do not hard-code English in shared components.
- Use logical utilities so layouts mirror: `ms-*`/`me-*`, `ps-*`/`pe-*`, `start-*`/`end-*`, `text-start`/`text-end`, `border-s`/`border-e`, `rounded-s`/`rounded-e`. Avoid `ml-*`, `mr-*`, `pl-*`, `pr-*`, `left-*`, `right-*`, `text-left`, `text-right`.
- Set `dir` on the document (or wrap a subtree in `DirectionProvider`) for right-to-left languages; Gaudi's keyboard navigation and placement follow it.
- Keep focus visible and meaningful: dialogs and sheets return focus to their trigger; do not steal focus on load; respect reduced motion (Gaudi motion already does).
- Use semantic elements and Gaudi's landmarks; one `main` per page (`LayoutWrapper` provides it).

## Validate before finishing

- `validate_usage(code)` → fix all errors (unknown import/export, invalid variant value, missing accessible name) and warnings (undocumented props, hard-coded English, physical classes, raw colours).
- Re-read the component API if a warning says a prop is undocumented; do not silence it by guessing.
- Check that imports point at public entries and that the global stylesheet is loaded once.

## Reference

- `references/catalogue.md` — every component and hook with its import path, plus block families (generated).
- MCP tools: `search`, `list_components`, `get_component`, `get_examples`, `list_blocks`, `get_block`, `get_tokens`, `get_install_command`, `validate_usage`, `get_agent_skill`, `get_project_setup`.
- Registry blocks: `npx shadcn@latest add @gaudi/<name>` once the `@gaudi` registry is configured (see `get_install_command`). Blocks are copy-in compositions; the components they use stay package imports.
