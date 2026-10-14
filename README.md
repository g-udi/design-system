# <img src=".storybook/public/brand/gaudi-icon-dark.svg" width="32" alt=""> Gaudi Design System

Gaudi is a curated design system for blogs and applications. It brings reusable React components, design foundations, and practical interface patterns into one coherent system.

It began with the blog and has grown to support application interfaces: forms, data views, navigation, dialogs, dashboards, and complete workflows alongside rich editorial and MDX experiences. Components and patterns discovered across other systems are selected, adapted, and extended for reuse in Gaudi.

The system is called **Gaudi**. The source repository is hosted at [`g-udi/design-system`](https://github.com/g-udi/design-system), and the package import name is `@gaudi/design-system`.

- **Website:** [design.gaudi.site](https://design.gaudi.site): getting started, foundations, theming, AI tooling and every component with live examples.
- **Storybook:** [storybook.gaudi.site](https://storybook.gaudi.site): every story, interaction state and theme preset.
- **Registry:** [design.gaudi.site/r](https://design.gaudi.site/r/registry.json): copy-in blocks and patterns for the shadcn CLI.

Use `GaudiBrand` from `@gaudi/design-system/icons/brands/gaudi` in demo and content headers: a compact dark tile with a white G followed by ordinary “Gaudi” text. `GaudiLogo` provides the tile alone for compact icon slots and favicons, including the `Gaudi` icon registry name. The dark tile is the default in both themes; `tone="light"` explicitly selects the white alternative. The graphic `GaudiWordmark` remains available as artwork but is not used in demos. Storybook's sidebar stays unbranded. The four original SVGs live in [`src/icons/brands/artwork`](src/icons/brands/artwork). `pnpm brand:build` preserves their geometry while regenerating the React components, Storybook images and favicons; see the [brand usage notes](src/icons/brands/README.md).

## What belongs in Gaudi

- **Foundations:** shared tokens, typography, colors, icons, motion, and accessibility conventions.
- **Components:** reusable controls and compositions, with variants and interaction states for real product use.
- **Patterns and blocks:** application shells, settings, onboarding, collections, and editorial page sections.
- **Publishing:** post components, reading layouts, and MDX primitives for the blog and other content experiences.

## How the system grows

Start with a useful component or use case, then reconcile it with the catalogue. **When an existing component matches, extend it** with the missing variants, behaviors, and examples. Add a new public component only when it owns reusable behavior, accessibility, or a meaningful composition contract. Thin wrappers and cosmetic arrangements stay as examples under the existing owner.

Adapt incoming patterns to Gaudi's tokens, icons, public APIs, accessibility, and responsive behavior. Document practical examples, interaction states, usage boundaries, and copyable imports. Preserve source attribution and licensing. The collection remains open to useful patterns discovered across projects and libraries.

## For Agents

Read [`AGENTS.md`](./AGENTS.md) before changing the package or consuming it from an application. It contains the clean-code, KISS/DRY, ownership, Storybook, accessibility, and responsive verification rules. This README covers shared usage and development; colocated component READMEs cover owner-specific APIs. Keep documentation in those files instead of adding separate product, design, coverage, or audit guides.

## Install

```sh
pnpm add github:g-udi/design-system
```

The repository name and package name are intentionally different: install from GitHub, then import from `@gaudi/design-system`.

Gaudi ships React source for a JSX-aware bundler and Tailwind CSS v4 processing.
In Next.js, include `transpilePackages: ['@gaudi/design-system']` in your config.
React, React DOM, Next.js, `next-themes`, and Tailwind remain shared framework peers;
Gaudi installs its implementation libraries. Install the optional `recharts` and
`@xyflow/react` peers when using Charts and Flow respectively. See `package.json`
for supported versions.

## Usage

```js
import { Avatar, Button, Dialog } from '@gaudi/design-system';
import '@gaudi/design-system/global.css';
```

For route-level app code that imports one or two components, prefer leaf entrypoints
so bundlers do not traverse the full convenience barrel:

```js
import Button from '@gaudi/design-system/core/Button';
import Dialog from '@gaudi/design-system/core/Dialog';
```

The public CSS imports stay stable. `src/styles.css` aggregates shared foundations and
owner-local component styles; `src/global.css` adds Tailwind and application body defaults.
Tokens live in `src/tokens/tokens.css`, with utility aliases in `src/tokens/theme.css`.
Component state, motion, and responsive CSS lives beside the component. Storybook-only
styles remain in docs or story fixtures and are excluded from the package.

The stylesheet includes its own packaged Tailwind configuration and source scan;
it does not depend on this repository's development config. CSS token definitions
are authoritative. `tokens.json` is the supported JavaScript/preset projection,
with contract tests keeping shared values and ESM/CJS exports synchronized.

Only explicit entries in `package.json` are public. Use owner paths such as
`/core/Button`, `/chat/ChatInput`, and `/hooks/state/use-controllable-state`;
raw `/components/*` and private implementation paths are no longer exported.
`AlertDialog` aliases have been removed: use `Dialog variant="confirmation"`
or `DialogConfirmationRoot` and its parts from `/core/Dialog`.

Example fixtures inside this repository use the same public namespaces:

```js
import { AppShellFrame, SidebarProvider } from '@gaudi/design-system/blocks/AppShell';
import { DashboardGrid, DashboardPanel } from '@gaudi/design-system/blocks/Dashboard';
import Button from '@gaudi/design-system/core/Button';
import { CardRoot, CardContent } from '@gaudi/design-system/core/Card';
import { Badge } from '@gaudi/design-system/core/Pill';
```

These are [package self-references](https://nodejs.org/api/packages.html#self-referencing-a-package-using-its-name),
resolved through `package.json` exports in Storybook, tests, and consuming apps.
`jsconfig.json` uses bundler module resolution so editor navigation follows those
same exports, without a separate path-alias map. Runtime implementation files and
private example helpers keep relative imports; new examples use public owner
entries instead of traversing component directories with `../../../`.
Use `@gaudi/design-system/utilities/cn` for the class-name helper without loading
the component barrel.

## Corner radius

Elements use a soft 4px radius. Set `--ds-radius` on the application root after
importing Gaudi’s stylesheet to change corners globally, without rebuilding CSS:

```css
:root {
  --ds-radius: 4px; /* Use 0px for square corners. */
}
```

Accordion highlights, text highlights, and internal panel seams stay square.
Use Storybook’s **Corners** toolbar to preview the setting across stories.


## Input caret mode

Use Storybook’s **Caret** toolbar to switch between **Native caret** and **Smooth caret** across inputs. Smooth caret is enabled by default in applications and Storybook. Use `InputConfigProvider` from `@gaudi/design-system/context` to change it for a subtree. An individual input or textarea can override it with `caretMode='native'` or `caretMode='smooth'`. Set `caretMode='native'` on the provider to opt out. See [Input](src/components/core/Input/README.md#smooth-caret-mode) for coverage and browser-native fallbacks.

Use `EmailInput` from `@gaudi/design-system/core/Input` for a single email address with smooth caret support and HTML pattern validation. Use `NumberField` for numeric entry. Both use text editors and inherit the provider; plain `Input type='email'` and `Input type='number'` retain the browser caret. See [EmailInput](src/components/core/Input/README.md#emailinput) for validation differences.

## Application interfaces

Application interfaces are a first-class part of Gaudi. Compose controls and blocks for workspaces, settings, onboarding, and data workflows using the same foundations as the blog. Use the [component catalogue](#component-catalogue) and owner documentation to find the supported API and examples for a workflow.

```jsx
import DataTable from '@gaudi/design-system/core/DataTable';
import '@gaudi/design-system/global.css';

<DataTable
  caption="Article library"
  columns={columns}
  rows={articles}
  searchable
  sortable
  selectable
  columnVisibility
  pagination
  pageSize={10}
/>
```

Use stable row IDs for interactive tables. Prefer leaf imports, keep request and persistence logic in the consuming app, and use the public components to compose route-specific screens. Storybook's **Component Catalogue** links to workflow examples and component docs, including the integration boundaries of each composition.

Gaudi owns layout, semantics, keyboard/focus behavior, and local interaction. Applications supply records, permissions, scheduling and workflow rules, routing, and service integrations. Authentication, uploads, messages, and saves in Storybook use local state and illustrative data; they do not establish backend connections or persistence.

Chat parts are available from `@gaudi/design-system/chat` and the root entry; Blocks/Chat demonstrates composed conversations. Charts use `@gaudi/design-system/charts` and its owner subpaths, keeping Recharts out of the root import. Shared hooks are available from `@gaudi/design-system/hooks` and the root entry. Text and background effects are available from `@gaudi/design-system/animations`, the root entry, and owner paths such as `/animations/GlyphInspector`. Their Storybook pages live under Animations/Text and Animations/Backgrounds. Backgrounds use theme-aware colours, visibility-aware playback, reduced-motion support and static fallbacks. The WebGL backgrounds draw at up to 30 frames per second, cap device pixel ratio at 1.5 and limit their drawing buffer to approximately two million pixels. Foreground content remains available when WebGL is unavailable. Aurora (Borealis) also lives under Backgrounds; its existing layout imports remain supported. MDX adapters retain their separate entries below.

Interactive backgrounds retain bounded pointer wakes, click ripples, and eased press/release state; these stop with the animation and leave foreground controls usable. LiquidEther transports and dissipates dye in a small local fluid simulation. Background playgrounds include a Gaudi header and hero over a 500px preview, with a Demo content switch that hides the composition without restarting the animation. Pause controls and Gaudi colours remain available; the independently authored effects follow the linked visual references without importing upstream implementations.

All chat components use a `Chat` prefix, including compound parts such as
`ChatMessageContent`, `ChatBubbleGroup`, and `ChatSpeechInput`. Import owners through
paths such as `@gaudi/design-system/chat/ChatMessage` or
`@gaudi/design-system/chat/ChatVoice`. Migrate earlier unprefixed component imports
and owner paths to these names; the old names are no longer exported. Hooks and
data helpers retain their existing names, and Storybook links retain their IDs.

## Blog and content interfaces

**Blog migration target:** use [`ScrollArea` with `smooth` enabled](src/components/core/ScrollArea/README.md#blog-migration-decision) as the main area hosting blog post content. Keep post/MDX content in one bounded article viewport, with navigation in the surrounding layout. Share `viewportRef` with `ReadingIndicator.targetRef`, and adapt table-of-contents observation, heading links and route scroll restoration to that viewport during migration. Touch and reduced-motion scrolling remain native. The `Smooth blog reading` Storybook example demonstrates the intended composition; the blog shell itself is not migrated yet.

Post components are available through `@gaudi/design-system/post` and its leaf entrypoints. MDX article components are available individually so consumers do not pull charts,
Mermaid, or other heavyweight modules into routes that only render one primitive:

```js
import Callout from '@gaudi/design-system/mdx/Callout';
import Preview from '@gaudi/design-system/mdx/Preview';
```

The `@gaudi/design-system/mdx` barrel remains available when the complete catalogue
is intentionally required.

The compiled-MDX runtime (`MDXLayoutRenderer`, `useMDXComponent`) has its own entry:

```js
import { MDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';
```

Gaudi intentionally exports only reusable MDX primitives. Article-specific diagrams,
explorers, and other custom interactive work belong to the content bundle. A
content-owned client boundary can merge its catalogue with Gaudi before rendering
compiled MDX:

```jsx
'use client';

import Aside from '@gaudi/design-system/mdx/Aside';
import Callout from '@gaudi/design-system/mdx/Callout';
import { MDXLayoutRenderer as GaudiMDXLayoutRenderer } from '@gaudi/design-system/mdx/runtime';

import { ContentComponents } from './visualisations';

export default function ContentMDXLayoutRenderer(props) {
  return (
    <GaudiMDXLayoutRenderer
      components={{ Aside, Callout, ...ContentComponents }}
      {...props}
    />
  );
}
```

The merge must happen in a client module because React component maps cannot be
passed from a server page to a client component. This contract keeps the design
system reusable while allowing each trusted content repository to ship
self-contained React, HTML, scoped styles, data, and tests.

### Article navigation

`TableOfContents` renders the heading hierarchy first and then an optional
“Diagrams & tables” index. It discovers captioned figures and tables inside the
article, assigns stable fragment identifiers when needed, and tracks the active
visual as the reader scrolls.

### Site configuration

Gaudi never imports data from the consuming app. Site-aware components (navigation,
footer, and command launcher) read metadata and navigation links from the
`SiteConfigProvider` context; `LayoutContainer` wires it up for you:

```jsx
import LayoutContainer from '@gaudi/design-system/layout/LayoutContainer';

<LayoutContainer
  metadata={ siteMetadata }        // { author, title, locale, theme, github, linkedin, twitter, email, … }
  navigation={ navigationMetadata } // { links: [...], categoriesMetadata: {...} }
  jsonLd={ websiteJsonLd }          // object or () => object, rendered as application/ld+json
  menuProps={{ posts, projects, thoughts, categories, publications, tags }}
  footerProps={ footerProps }
>
  {children}
</LayoutContainer>
```

Standalone usage without `LayoutContainer` wraps the tree directly:

```jsx
import { SiteConfigProvider } from '@gaudi/design-system/context';

<SiteConfigProvider metadata={ siteMetadata } navigation={ navigationMetadata }>
  <App />
</SiteConfigProvider>
```

`LayoutContainer` is an async server component because it can await `jsonLd`.
Import it directly from its leaf entry. Its theme provider uses `next-themes`
with `metadata.theme` as the default; Gaudi no longer reads or writes a separate
`__theme__` cookie. Standalone headers should be inside your `next-themes`
provider. Applications own any additional cookie or persistence policy.

Use the Tailwind preset and plugins from the package:

```js
const designSystemPreset = require('@gaudi/design-system/tailwind-preset');
const addVariablesColors = require('@gaudi/design-system/tailwind/addVariablesColors');
const tailwindGrid = require('@gaudi/design-system/tailwind/tailwindGrid');

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',
    './node_modules/@gaudi/design-system/src/**/*.{js,jsx,mdx}'
  ],
  plugins: [ addVariablesColors, tailwindGrid ],
  presets: [ designSystemPreset ]
};
```

## Theming

A theme overrides the semantic `--ds-*` contract (surfaces, text, borders, accent, focus, status, charts, sidebar and shadows for light and dark, plus fonts, radius and density); every other token derives from it, so components need no theme-specific code. Presets: `gaudi` (default), `folio`, `graphite`, `contrast`, `pastel`, `midnight`, `grove` and `ember`, each passing WCAG AA in both modes.

```jsx
// Static: every preset, switched by an attribute
import '@gaudi/design-system/themes.css';
// <html data-theme='folio' className='dark'>

// Next.js app router: no-flash script in app/layout.jsx, provider in a client component
import { getThemeScript, ThemeProvider, useTheme } from '@gaudi/design-system/themes';
// <head><script dangerouslySetInnerHTML={{ __html: getThemeScript() }} /></head>
// <ThemeProvider defaultMode='system'>{children}</ThemeProvider>
// const { theme, setTheme, mode, setMode } = useTheme();
```

**Bring any [StyleGlide](https://www.styleglide.ai/themes), [tweakcn](https://tweakcn.com) or [shadcn/ui](https://ui.shadcn.com/themes) theme.** The contract follows the shadcn CSS-variable convention, so themes made in those tools import as-is (`gaudi-ds theme import`, the `import_theme` MCP tool or Theme Studio). We would rather point you to them than reinvent them.

Apps that keep `next-themes` for light/dark pass `enableMode={false}` to `ThemeProvider` and `getThemeScript`. Load fonts with `next/font` or `@fontsource`; Gaudi never downloads them.

- Guide: [THEMING.md](src/tokens/THEMING.md) (contract, runtime API, Next.js setup, fonts, import/export, contrast).
- Storybook: **Theming / Overview** renders that guide with live swatches, a preset gallery and contrast results; **Theming / Theme Studio** edits, generates, checks and exports themes. The **Theme preset** toolbar previews every story in any preset alongside the light/dark switch.
- CLI: `gaudi-ds theme list | import <file|url> [--fix] | export <id> --format css|shadcn|registry|json | check <file|id> | generate --brand <colour>`.
- MCP tools `list_themes`, `get_theme`, `import_theme` and `export_theme`; presets are registry items `theme-<id>`.

## AI & agents

Gaudi ships machine-readable docs, an agent skill, a local MCP server and a copy-in block registry. All of it is generated from the sources of truth (owner `stories/docs/*.docs.js`, READMEs, the story catalogue, `coverage.json`, `public-names.json`, tokens, the icon registry and `package.json` exports) so it cannot drift from the components.

| Piece | Where | Ships in npm package |
| --- | --- | --- |
| Metadata | `ai/components.json`, `blocks.json`, `tokens.json`, `icons.json`, `setup.json`, `exports.json` | yes |
| LLM docs | `llms.txt` (index), `llms-full.txt` (every page), `docs/llm/<id>.md` (one page per component/hook) | `llms*.txt` yes; `docs/llm` repo only (package excludes `docs/`) |
| Agent skill | `skills/gaudi-design-system/SKILL.md` + generated `references/catalogue.md` | yes |
| CLI / MCP | `bin/gaudi-ds.mjs`, `cli/` | yes |
| Registry | `registry.json`, `public/r/<name>.json` | no (about 5 MB; repo only until hosted) |

This setup follows the [llms.txt proposal](https://llmstxt.org), the [shadcn registry spec](https://ui.shadcn.com/docs/registry) and the [Model Context Protocol](https://modelcontextprotocol.io) with its official [TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk). See [credits](#credits--acknowledgements).

Regenerate after changing components, docs, stories or tokens. `pnpm catalogue:sync` now also runs `pnpm ai:build`; the registry is separate:

```sh
pnpm ai:build            # ai/, docs/llm/, llms.txt, llms-full.txt, skill catalogue
pnpm ai:check            # fails when any generated file is stale
pnpm registry:build      # registry.json + public/r/*.json (--check to verify)
pnpm registry:validate   # official shadcn schemas; installs shadcn into node_modules/.cache on first use
pnpm test:ai             # search/validate unit tests, skill installer, MCP stdio smoke test
```

### llms.txt

`llms.txt` follows the llms.txt convention: package summary, install/import/CSS/preset setup, then Foundations, components by category (each linking to `docs/llm/<id>.md`), Blocks & patterns, MCP & skills, and Registry. Links are repository-relative until a docs host is chosen. `llms-full.txt` concatenates every page (API table, usage, accessibility, notes, examples and the owner README).

### Agent skill

```sh
npx @gaudi/design-system skills install --agent claude   # default
npx @gaudi/design-system skills install --agent all --dir ../my-app
npx @gaudi/design-system skills list
```

| Agent | Installed to |
| --- | --- |
| `claude` | `.claude/skills/gaudi-design-system/SKILL.md` and `references/` |
| `cursor` | `.cursor/rules/gaudi-design-system.mdc` (auto-attached for JS/TS/MDX) |
| `codex`, `opencode` | a managed section in `AGENTS.md` (between `gaudi-design-system:start/end` markers) |
| `windsurf` | `.windsurf/rules/gaudi-design-system.md` (`trigger: model_decision`) |
| `vscode` | `.github/instructions/gaudi-design-system.instructions.md` (Copilot, `applyTo` JS/TS/MDX) |

Re-running is idempotent: unchanged files are reported as such and the AGENTS.md section is replaced in place. Before publishing, run the same commands with `node /path/to/design-system/bin/gaudi-ds.mjs` in place of `npx @gaudi/design-system`.

### MCP server

A local stdio server reads the shipped `ai/` metadata (no network). Tools: `search`, `list_components`, `get_component`, `get_examples`, `list_blocks`, `get_block`, `get_tokens`, `get_install_command`, `validate_usage`, `get_agent_skill`, `get_project_setup`; prompt: `build`.

```sh
claude mcp add gaudi-ds -- npx -y @gaudi/design-system mcp
# before publishing (local checkout):
claude mcp add gaudi-ds -- node "/path/to/design-system/bin/gaudi-ds.mjs" mcp
```

Cursor (`.cursor/mcp.json`) and Windsurf (`~/.codeium/windsurf/mcp_config.json`):

```json
{ "mcpServers": { "gaudi-ds": { "command": "npx", "args": ["-y", "@gaudi/design-system", "mcp"] } } }
```

VS Code (`.vscode/mcp.json`):

```json
{ "servers": { "gaudi-ds": { "type": "stdio", "command": "npx", "args": ["-y", "@gaudi/design-system", "mcp"] } } }
```

Codex (`~/.codex/config.toml`):

```toml
[mcp_servers.gaudi-ds]
command = "npx"
args = ["-y", "@gaudi/design-system", "mcp"]
```

OpenCode (`opencode.json`): `{ "mcp": { "gaudi-ds": { "type": "local", "command": ["npx", "-y", "@gaudi/design-system", "mcp"] } } }`. For any client, `node /path/to/design-system/bin/gaudi-ds.mjs` runs the same server from a repository checkout in place of `npx -y @gaudi/design-system`. `get_block` returns block source when `public/r` exists (a repository checkout); otherwise it returns the install command.

### Registry (blocks & patterns)

`pnpm registry:build` emits a shadcn-compatible registry for the curated examples in `coverage.json`: page-level blocks (`registry:block`: app shells, sidebars, screens, dashboards, forms, scheduling, stat cards, chat) and component patterns (`registry:example`). Each item's file is the owner fixture rewritten by the Storybook `publicSource` helper, so it imports components from `@gaudi/design-system` (declared as a dependency) instead of copying them. `registry.json` is generated; do not edit it by hand, and do not use `shadcn build` (it would copy the fixtures' relative imports).

The registry is served from https://design.gaudi.site/r. Consumers add the namespace to their `components.json`:

```json
{ "registries": { "@gaudi": "https://design.gaudi.site/r/{name}.json" } }
```

```sh
npx shadcn@latest add @gaudi/screens-account-settings
npx shadcn@latest add https://design.gaudi.site/r/screens-account-settings.json
```

Install the package from GitHub first (`pnpm add github:g-udi/design-system`), or build the registry with `GAUDI_PACKAGE_SPEC=github:g-udi/design-system pnpm registry:build` so items declare that spec. Some items reference demo assets (`/avatars/…`, `static/images/…`) listed in their `docs`/`meta.assets`; supply your own. Copied compositions keep the [third-party notice](#third-party-notices).

## Development

Implementation files stay with their component owner. Examples and fixtures live in the owner's `stories/` folder; tests mirror runtime ownership under `tests/`. Shared documentation UI, hook examples, and catalogue data live in `src/docs/`. `.storybook/` holds configuration, preview styles, audit tooling, and static assets.

For example, Button lives in `src/components/core/Button/Button.jsx`, its examples in `src/components/core/Button/stories/`, and its contracts in `tests/components/core/Button/`. Public imports remain `@gaudi/design-system/core/Button`. See [code organization](AGENTS.md#code-organization) for the full conventions.

```sh
pnpm install
pnpm storybook
pnpm lint
pnpm test:contracts
pnpm pack:check
pnpm test:consumer
pnpm test-storybook
pnpm test-storybook:run
pnpm build-storybook
```

CI and version releases share `.github/workflows/validation.yml`: lint, catalogue
freshness, copyable example compilation, contracts and ownership checks, a packed
production consumer, Storybook interactions and axe accessibility, responsive checks
in both themes, container layout checks, and the Storybook build. Version releases
can write only after the same validation passes for the checked-out commit; the
version commit and annotated tag are pushed atomically.

`pnpm test-storybook` keeps the interactive watch workflow. `pnpm test-storybook:run`
is the finite full-catalogue gate used by CI: it executes every story in light and
dark themes, preserving the responsive/source or container-layout audit flags.
Each bounded group starts a fresh Vitest/browser process; no tests are retried or
filtered. Per-group logs and completion ledgers, plus an aggregate summary, are
saved under `.storybook/verification/<date>/`. A missing, skipped, duplicate or
failed story, a browser transport error, an incomplete group, or changed source
fails the full run. Set `GAUDI_STORYBOOK_REPORT_DIR` to select its evidence directory.
Fresh processes bound the browser's lifetime; they do not establish the cause of
an upstream transport failure in an unbatched run.

Storybook uses local fixtures and static assets to document components without depending on the blog repository or remote services. These fixtures are not part of the runtime API. Contributor rules and story conventions live in [AGENTS.md](AGENTS.md#storybook-and-examples).

When a local Storybook server is already running, reuse it for browser checks. Coding agents only start a server or run its build when explicitly requested. For a documentation-only change, check links, references, and formatting. For code changes, run the relevant checks:

```sh
git diff --check
pnpm lint
pnpm test:contracts
node scripts/sync-story-catalogue.mjs --check
```

After a structural move, run `pnpm pack:check`. It extracts the actual npm archive,
resolves every public entry and its runtime imports, rejects private imports and
development files, and compiles the distributed stylesheet in isolation.
`pnpm test:consumer` adds a production Next.js build and browser checks for server
rendering, hydration, dialog focus, native forms, and sanitized math/diagrams using
that archive. Both checks
reuse installed dependency versions and remove their temporary consumer afterward.

Run affected Storybook tests with a file filter, for example:

```sh
pnpm exec vitest run --project=storybook src/components/core/Attachment/stories/AttachmentMedia.stories.jsx
```

Use `VITE_GAUDI_AUDIT=1` to validate authored/copied Docs source and run the responsive width audit (add `VITE_GAUDI_AUDIT_THEMES=both` to check both CSS themes and restore the original theme), `VITE_GAUDI_VISUAL=1` for container layout checks, and `VITE_GAUDI_THEME=dark` for dark-theme checks. Run standalone visual and responsive audit modes separately. Add `VITE_GAUDI_AUDIT_VISUAL=1` to a responsive run to record container-layout heuristics as advisory `visualFindings` at each width; inspect those findings before classifying intentional layouts as defects. Add `VITE_GAUDI_AUDIT_DENSITIES=all` to check all five supported spacing presets: the default density uses the full breakpoint matrix, and the other densities use 320, 390, 768, 1440 and 1920px. Density overrides are restored afterward; screenshot captures remain at the default density. For screenshot evidence, pass comma-separated story IDs (including their derived states) or `*` in `VITE_GAUDI_AUDIT_SCREENSHOTS` and a repository-local absolute directory in `VITE_GAUDI_AUDIT_SCREENSHOT_DIR`; run that capture with `--no-file-parallelism` because the browser provider targets the active test frame. Captures cover 320, 390 and 1440px. Set `GAUDI_AUDIT_REPORT_DIR` to a repository-local evidence directory to persist one JSON report per story/state and theme, including every width actually checked; browser console output alone is not a reliable audit record. With Storybook running, `pnpm audit:controls http://localhost:6006` exercises each component’s exposed Docs controls and reset through their actual widgets, verifies delivered args, and records stable rendered changes in `.storybook/verification/<date>/controls/results.json`. Use `--inventory` for story metadata, `--filter=<docs-id-regex>` for focused confirmation, and `GAUDI_CONTROLS_REPORT_DIR` to choose the evidence directory. Canvas uniforms are recorded separately; canvas pixels, conditional controls, equivalent values, and interaction-dependent effects still require owner-specific checks. Unresolved results remain explicit in the report; they are not visual passes. Interaction-dependent controls declare `parameters.controlAudit.interaction`. Intentional full-width examples declare `parameters.visualAudit.wide` with a reason. After changing pattern sources, run `node scripts/verify-pattern-sources.mjs` to check their copyable public imports.

Every UI change needs visual and interaction checks across narrow/common phones, tablets, laptops, and wide desktops, including affected breakpoints and adjacent widths. Inspect wrapping, clipping, alignment, and contained scrolling; report the widths actually checked and restore viewport/theme overrides. Historical results under [`.storybook/verification/`](.storybook/verification/) describe their dated scope, not the current state of the entire system.

### Documentation site

The website lives in [`site/`](site/README.md), a Next.js app that installs this checkout (`link:..`) and generates its component pages from the same catalogue, coverage and fixtures. Every push to `main` deploys it to Vercel with Storybook built into the same deployment: [design.gaudi.site](https://design.gaudi.site) serves the website and registry, and [storybook.gaudi.site](https://storybook.gaudi.site) serves Storybook. Run it locally with `pnpm --dir site install` and `pnpm --dir site dev`.

## Storybook navigation

The sidebar starts with eight guides: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, Typography, and Theming (with Theme Studio nested under it). The component list follows: Core, Blocks, Chat, Charts, Hooks, Animations (Text and Backgrounds), and MDX. Blog compositions live under Blocks/Blog. Getting Started links to the single Component Catalogue. Site navigation is documented under Blocks/Navigation; reusable navigation primitives live under Core/Navigation.

Run `pnpm catalogue:sync` after adding, removing, or renaming stories to refresh the catalogue fallback. The running catalogue also reads Storybook's current index.

## Component catalogue

Open **Component Catalogue** from Storybook's Getting Started page to search owners and practical use cases. Owner docs contain the supported APIs, interaction states, and copyable imports; the current index replaces duplicated Markdown inventories and example counts.

**MDX / Overview** introduces article authoring and the unified, remark and rehype pipeline, adapted from “Creating Rich & Interactive Blog Posts.” Follow one example from source through its syntax trees to React, then open the individual article component pages.

Existing convenience APIs and compound parts share their owner. Where names would collide, documented parts use explicit names such as `CardRoot` alongside `Card`, or `SelectRoot` alongside `Select`. Use the public contract shown in the owner's examples.

The [pattern coverage manifest](src/docs/catalogue/coverage.json) records curated example source paths, original hashes, owners, and story IDs. [Public name mappings](src/docs/catalogue/public-names.json) drive copyable imports; the [catalogue snapshot](src/docs/catalogue/catalogue.json) supports tests and offline browsing. Authored component documentation lives under each owner's `stories/docs/`; the shared registry only assembles it. Maintain these sources when examples change.

## Local example assets

Storybook uses `src/docs/fixtures/site/` for shared site data and `.storybook/public/` for static assets. Names, roles, handles, and presence are fictional demo data. Components receive image URLs from their applications and do not choose a provider.

- Person avatars use Gaudi's generated illustrations served from `/avatars/person-<nn>.svg`; see the [avatar README](.storybook/public/avatars/README.md) for the generator and the shared demo identities. Initials, workspace marks, fallback colors, and deliberate image failures remain explicit examples.
- Non-person example artwork uses twelve local gradient SVGs at `.storybook/public/static/images/art/0.svg` through `11.svg`: aurora, dusk, lagoon, meadow, ember, iris, rose, sky, sand, mint, peach, and slate. Each uses `preserveAspectRatio='xMidYMid slice'` to crop to its frame. Stories can import names from `src/docs/fixtures/site/artwork.js`; copyable fixtures use paths such as `static/images/art/3.svg`. Avatar fallback tones share these gradient shades.
- [Flag assets](.storybook/public/flags/README.md) have their own provenance. Markdown files under chat fixture folders are downloadable attachment examples, not contributor guides.

## License

Gaudi is released under the [MIT License](LICENSE), Copyright (c) 2026 Ahmad Assaf. Third-party code and assets keep their own licences, and brand logos remain their owners' trademarks; see [Third-party notices](#third-party-notices).

## Third-party notices

Gaudi is built on open-source work. The notices below cover code adapted into this repository. Their licence texts ship in the npm package: in [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES) and beside the adapted files. [Credits & acknowledgements](#credits--acknowledgements) lists every dependency, asset and inspiration.

### Component parts and patterns

Some compound component parts and [SignaturePad](src/components/core/SignaturePad/README.md) include portions derived from [ReUI](https://reui.io) by [Keenthemes](https://keenthemes.com), under the following license. The notice also covers any portions derived from its free examples.

MIT License

Copyright (c) 2025 Keenthemes Inc

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

SignaturePad adapts the [ReUI signature pad](https://reui.io/docs/components/base/signature-pad)
from the `base-vega` registry retrieved on 5 October 2026, under the Keenthemes MIT
notice above. Gaudi supplies its controls, tokens, shared hooks, and documentation.

### Interactive icon artwork

Gaudi's animated icons use lucide-animated artwork by pqoqubbw (MIT), pinned at
`072c38b1b04ea738d90a084485ccaad4b890ddca`:
[pqoqubbw/icons](https://github.com/pqoqubbw/icons)

The MIT notice is retained in [src/icons/animated/LICENSE](src/icons/animated/LICENSE). Original Lucide
geometry used for draw treatments retains the ISC notice in
[src/icons/animated/LUCIDE-LICENSE](src/icons/animated/LUCIDE-LICENSE). Per-name source and canonical glyph metadata
are exported as `animatedIconMetadata`; maintenance notes live in
[src/icons/animated/README.md](src/icons/animated/README.md).

### Voice orbs

The [ChatPersona](src/components/chat/ChatPersona/README.md) orb renderers combine three MIT-licensed projects:

- [VoiceOrbs](https://voiceorbs.vercel.app) ([amunozdev/voiceorbs](https://github.com/amunozdev/voiceorbs)) by Alexis Munoz, pinned at `339ab42d98f6c4ffa03709ffa71f9f6965a2171a`: the iridescent, mercury and waveform renderers and `voice-orb-model.js`.
- [Thinking Orbs](https://libraries.dev/orbs) ([Jakubantalik/Libraries.dev](https://github.com/Jakubantalik/Libraries.dev)) by Jakub Antalik, pinned at `0d448879917f92c2b9f2773c1f91054f4c83dae5`: the dotted-sphere geometry of the activity renderer.
- [orb-ui](https://orb-ui.com) ([exprmntl/orb-ui](https://github.com/exprmntl/orb-ui)) by Alexander Chen, version 0.9.0, pinned at `0e78ad509e1b3a48013fb810eb25b130c355115d`: the circle, bars, cloud and radial styles (visual themes only; its voice-provider adapters are not included).

Their MIT notices are retained in [src/components/chat/ChatPersona/orbs/LICENSE](src/components/chat/ChatPersona/orbs/LICENSE) and [THIRD_PARTY_LICENSES](THIRD_PARTY_LICENSES).

### Credits & acknowledgements

Licences were read from each package's `LICENSE` file or `package.json` in `node_modules`, or from the vendored file's header, on 5 October 2026. `tests/contracts/third-party-notices.contract.test.js` fails when a dependency or peer dependency is missing from this inventory or its recorded licence no longer matches.

#### Runtime and peer dependencies

Installed from npm, never copied. Each package keeps its own licence file.

| Package | Licence | Use |
| --- | --- | --- |
| [@base-ui/react](https://base-ui.com) | MIT | runtime |
| [@date-fns/tz](https://github.com/date-fns/date-fns) | MIT | runtime |
| [@dnd-kit/core](https://github.com/clauderic/dnd-kit) | MIT | runtime |
| [@dnd-kit/modifiers](https://github.com/clauderic/dnd-kit) | MIT | runtime |
| [@dnd-kit/sortable](https://github.com/clauderic/dnd-kit) | MIT | runtime |
| [@dnd-kit/utilities](https://github.com/clauderic/dnd-kit) | MIT | runtime |
| [@headless-tree/core](https://github.com/lukasbach/headless-tree) | MIT | runtime |
| [@headless-tree/react](https://github.com/lukasbach/headless-tree) | MIT | runtime |
| [@heroicons/react](https://github.com/tailwindlabs/heroicons) | MIT | runtime |
| [@modelcontextprotocol/sdk](https://modelcontextprotocol.io) | MIT | runtime |
| [@radix-ui/react-accordion](https://radix-ui.com/primitives) | MIT | runtime |
| [@radix-ui/react-tabs](https://radix-ui.com/primitives) | MIT | runtime |
| [@shadcn/react](https://ui.shadcn.com) | MIT | runtime |
| [@tanstack/react-table](https://tanstack.com/table) | MIT | runtime |
| [@tanstack/react-virtual](https://tanstack.com/virtual) | MIT | runtime |
| [class-variance-authority](https://github.com/joe-bell/cva) | Apache-2.0 | runtime |
| [clsx](https://github.com/lukeed/clsx) | MIT | runtime |
| [cmdk](https://github.com/pacocoursey/cmdk) | MIT | runtime |
| [date-fns](https://github.com/date-fns/date-fns) | MIT | runtime |
| [embla-carousel-react](https://www.embla-carousel.com) | MIT | runtime |
| [framer-motion](https://github.com/motiondivision/motion/) | MIT | runtime |
| [input-otp](https://input-otp.rodz.dev/) | MIT | runtime |
| [katex](https://katex.org) | MIT | runtime |
| [lenis](https://github.com/darkroomengineering/lenis) | MIT | optional smooth wheel behavior in ScrollArea |
| [lucide-react](https://lucide.dev) | ISC | runtime |
| [maplibre-gl](https://maplibre.org/maplibre-gl-js/docs/) | BSD-3-Clause | Map renderer, gestures, and geographic overlays |
| [mermaid](https://github.com/mermaid-js/mermaid) | MIT | runtime |
| [mini-svg-data-uri](https://github.com/tigt/mini-svg-data-uri) | MIT | runtime |
| [radix-ui](https://radix-ui.com/primitives) | MIT | runtime |
| [react-day-picker](https://daypicker.dev) | MIT | runtime |
| [react-icons](https://github.com/react-icons/react-icons) | MIT | runtime |
| [react-phone-number-input](https://gitlab.com/catamphetamine/react-phone-number-input) | MIT | runtime |
| [react-resizable-panels](https://react-resizable-panels.vercel.app/) | MIT | runtime |
| [sanitize-html](https://github.com/apostrophecms/apostrophe/tree/main/packages/sanitize-html) | MIT | runtime |
| [shiki](https://github.com/shikijs/shiki) | MIT | runtime |
| [sonner](https://sonner.emilkowal.ski/) | MIT | runtime |
| [tailwind-merge](https://github.com/dcastil/tailwind-merge) | MIT | runtime |
| [tw-animate-css](https://github.com/Wombosvideo/tw-animate-css) | MIT | runtime |
| [vaul](https://vaul.emilkowal.ski/) | MIT | runtime |
| [zod](https://zod.dev) | MIT | runtime |
| [@xyflow/react](https://reactflow.dev) | MIT | peer (optional) |
| [next](https://nextjs.org) | MIT | peer |
| [next-themes](https://github.com/pacocoursey/next-themes) | MIT | peer |
| [react](https://react.dev/) | MIT | peer |
| [react-dom](https://react.dev/) | MIT | peer |
| [recharts](https://github.com/recharts/recharts) | MIT | peer (optional) |
| [tailwindcss](https://tailwindcss.com) | MIT | peer |

react-icons bundles third-party icon sets under their own licences. Gaudi's registry uses Font Awesome (CC BY 4.0), Flat Color Icons (MIT), Simple Icons (CC0 1.0), Heroicons 2 (MIT), Remix Icon (Apache-2.0) and VS Code Codicons (CC BY 4.0), in `src/icons/index.jsx`. Lucide (ISC) includes Feather geometry (MIT).

#### Adapted and vendored code

| Source | Licence | Files |
| --- | --- | --- |
| [ReUI](https://reui.io) by [Keenthemes](https://keenthemes.com), free component primitives | MIT | Derived portions of compound component parts; `src/components/core/SignaturePad/` |
| [lucide-animated](https://github.com/pqoqubbw/icons) by pqoqubbw | MIT | `src/icons/animated/catalog/*.jsx`, `RefreshCw.jsx`, `Rocket.jsx`; notice in `src/icons/animated/LICENSE` |
| [Lucide](https://lucide.dev) | ISC | Draw-treatment geometry in `src/icons/animated/`; notice in `src/icons/animated/LUCIDE-LICENSE` |
| [AI SDK Elements](https://github.com/vercel/ai-elements) by [Vercel](https://vercel.com) | [Apache-2.0](https://github.com/vercel/ai-elements/blob/main/LICENSE) | The reasoning disclosure behaviour in `src/components/chat/ChatReasoning/ChatMessageReasoning.jsx` (auto-open while streaming, one-second auto-close, measured "Thought for" duration), re-implemented on Gaudi primitives; notice in `THIRD_PARTY_LICENSES` |
| [rehype-code-group](https://github.com/ITZSHOAIB/rehype-code-group) by Sohab Sk | MIT | Storybook-only client script `.storybook/public/static/scripts/tabs.js` (0.1.3); notice in its `LICENSE` and `THIRD_PARTY_LICENSES`; not in the package |
| [VoiceOrbs](https://github.com/amunozdev/voiceorbs) by Alexis Munoz | MIT | `src/components/chat/ChatPersona/orbs/` (iridescent, mercury and waveform renderers, `voice-orb-model.js`); notice in its `LICENSE` |
| [Thinking Orbs](https://github.com/Jakubantalik/Libraries.dev) by Jakub Antalik | MIT | `src/components/chat/ChatPersona/orbs/activity-orb.jsx` (dotted-sphere geometry); notice in `orbs/LICENSE` |
| [orb-ui](https://github.com/exprmntl/orb-ui) by Alexander Chen | MIT | `src/components/chat/ChatPersona/orbs/` (`circle-orb.jsx`, `bars-orb.jsx`, `field-orb.jsx`); notice in `orbs/LICENSE` |

#### Assets

| Asset | Source | Licence |
| --- | --- | --- |
| Storybook demo avatars (`.storybook/public/avatars/`) | Gaudi originals, generated by `scripts/generate-avatars.mjs` from `src/docs/fixtures/site/avatars.js` | This repository; Storybook only, not in the package ([details](.storybook/public/avatars/README.md)) |
| Flags (`.storybook/public/flags/`) | [Flagpedia / flagcdn](https://flagcdn.com) | Public domain ([provenance](.storybook/public/flags/README.md)) |
| Gradient art, logos, post illustrations, favicons | Gaudi originals | This repository |
| Brand logos (`src/icons/brands/`) | Brand-owned marks; provenance not recorded, kept by owner decision. 17 of 18 match [svgl](https://svgl.app) (likely source, [MIT](https://github.com/pheralb/svgl/blob/main/LICENSE)); none match [Simple Icons](https://simpleicons.org) ([details](src/icons/brands/README.md)) | Trademarks of their respective owners, used for identification only; no endorsement implied |
| Storybook loading dots (`.storybook/public/static/icons/loading.svg`) | Gaudi original (redrawn; the earlier file had no traceable source) | This repository |
| Storybook UI fonts (Nunito Sans) and KaTeX fonts | Bundled by `storybook` and `katex` | Their packages' licences |

The Map stories bundle simplified [borough boundaries](https://data.cityofnewyork.us/City-Government/Borough-Boundaries/gthc-hcne) from NYC Department of City Planning and [street centerlines](https://data.cityofnewyork.us/City-Government/Centerline/inkn-q76z) from NYC Office of Technology and Innovation. Sources, transformations, and NYC Open Data terms are recorded in [.storybook/public/static/maps/provenance.json](.storybook/public/static/maps/provenance.json).

#### Development tooling

These tools build, test and document Gaudi. They are not distributed, except that some pattern fixtures import the starred packages: [Storybook](https://storybook.js.org): `storybook`, `@storybook/nextjs-vite` and the a11y, docs, themes and vitest addons (MIT), [Vitest](https://vitest.dev) with `vitest` and `@vitest/browser-playwright` (MIT), [Playwright](https://playwright.dev) (`playwright`, Apache-2.0), [ESLint](https://eslint.org): `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks` and `globals` (MIT), [esbuild](https://esbuild.github.io) (`esbuild`, MIT), [sharp](https://sharp.pixelplumbing.com) (`sharp`, Apache-2.0, official brand asset generation), `@tailwindcss/vite` (MIT), `styled-jsx` (MIT), `react-hook-form`\* and `@hookform/resolvers`\* (MIT), `little-date`\* (MIT), `lodash-es`\* (MIT) and `embla-carousel-autoplay`\* (MIT).

#### Design systems worth bookmarking

Gaudi's code is its own: nothing from these sites is copied unless it is listed under [Adapted and vendored code](#adapted-and-vendored-code). They are worth browsing for ideas, patterns and craft.

**Components and blocks**

- [shadcn/ui](https://ui.shadcn.com): the open-code component model and CSS-variable theme convention Gaudi's themes follow.
- [reui](https://reui.io): components, application blocks and agent tooling (skills, MCP, registry, llms.txt) for shadcn/ui.
- [Aceternity UI](https://ui.aceternity.com): 200+ copy-paste components, blocks and landing templates built with Tailwind CSS and Motion.
- [Arc UI](https://uiarc.dev): animated components and blocks for shadcn and Next.js, with an MCP server for agents.
- [beUI](https://beui.dev): free, open-source animated components for React and Next.js.
- [shadcn.io](https://www.shadcn.io): community components, blocks and [hooks](https://www.shadcn.io/hooks).
- [AI SDK Elements](https://elements.ai-sdk.dev): chat and agent interface parts for the AI SDK.

**Motion and effects**

- [React Bits](https://reactbits.dev): animated text effects, backgrounds and hero sections. Each Gaudi animation README links the effect that inspired it.
- [Skiper UI](https://skiper-ui.com): animated components, scroll progress and media interactions.

**Themes**

- [StyleGlide](https://www.styleglide.ai/themes), [tweakcn](https://tweakcn.com) and [shadcn/ui themes](https://ui.shadcn.com/themes): theme editors whose output Gaudi's Theme Studio and `importTheme` accept as-is.

**Finding more**

- [Shoogle](https://shoogle.dev): a search engine for shadcn components, blocks and templates across registries.
- [registry.directory](https://registry.directory): a directory of shadcn/ui registries.

**Standards**

- The [llms.txt proposal](https://llmstxt.org), the [shadcn registry spec](https://ui.shadcn.com/docs/registry) and the [Model Context Protocol](https://modelcontextprotocol.io), which shape Gaudi's AI tooling.
