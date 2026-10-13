# Agent instructions for Gaudi

Gaudi is a curated React design system for blogs and applications. The repository is `ahmadassaf/design-system`; the package is `@gaudi/design-system`. These instructions apply throughout the repository. See [README.md](README.md) for installation, public imports, development commands, and source notices; use component READMEs and Storybook for detailed APIs.

## Clean code: KISS, DRY, and ownership

- **Find the existing owner first.** Search the catalogue, source, hooks, and utilities before adding code. Extend the matching component and fix shared causes there so every consumer benefits. Reuse Gaudi throughout Gaudi, including stories and blocks.
- **Keep the implementation simple.** Choose the smallest coherent solution to the actual requirement. Avoid speculative options, generic engines, factories, forwarding layers, and configuration systems for a single use case. A little explicit composition is better than an abstraction that hides different behavior.
- **Share responsibilities, not just similar markup.** Extract genuinely repeated behavior or presentation into its existing owner or a small private helper. Keep specialized semantics distinct; do not force unrelated interactions through one oversized component.
- **Make public components earn their place.** A public owner needs reusable behavior, accessibility, or a meaningful, stable composition contract. A label and a few existing controls, a cosmetic preset, or a forwarding wrapper usually belong in a story or private composition. Keep the useful demo under its parent workflow instead of creating another export and Docs page.
- **Use the system's primitives.** Compose existing buttons, fields, selections, menus, dialogs, trees, scrolling, sorting, and layout parts. Do not hand-roll equivalent DOM, pointer engines, focus management, tokens, icons, or generic hooks.
- **Keep one clear contract.** Use explicit props, stable IDs, and predictable callbacks. Do not add no-op props, duplicate signatures, or compatibility aliases merely to preserve an unnecessary wrapper. When deliberately consolidating an API, inventory its capabilities, migrate affected callers, exports, stories, tests, and docs, and remove obsolete code in the same change. Preserve unrelated supported APIs.
- **Organize by responsibility.** Keep helpers and styles with their owner; keep fixtures and demo-only helpers out of production code. Split a file when responsibilities separate, not to meet an arbitrary line count. Avoid premature folders and barrel layers.
- **Write readable code.** Use names that describe intent, straightforward control flow, and comments that explain a constraint or decision. Remove dead code and obsolete comments. Do not add metadata or historical narration that Git already records.

## Code organization

Follow Gaudi's organization principle: component ownership first, then responsibility. Public import paths, filesystem layout, and Storybook titles serve different purposes; reorganizing examples must not force an application migration.

```text
src/components/<domain>/<Owner>/
  index.js                    explicit public exports
  Owner.jsx                   implementation; small owners stay flat
  Owner.css                   owner styles, states, motion, and breakpoints
  ownerModel.js               owner-specific data/geometry helpers, when needed
  README.md                   usage, contracts, accessibility
  components/                 private rendering pieces of a larger owner
  hooks/                      owner-specific interaction hooks, when needed
  stories/
    Owner.stories.jsx         metadata, args, examples, interaction checks
    docs/                     authored API and usage metadata
    fixtures/                 demo data, assets, and composed examples
      <family>/               curated examples grouped within their owner

tests/components/<domain>/<Owner>/  matching contract tests
tests/support/                     shared test harness
tests/contracts/                   package/documentation/resource contracts
src/context/                       shared React context, not generic utilities
src/docs/components/               shared documentation UI and helpers
src/docs/stories/                  foundation and catalogue pages
src/docs/hooks/                    hook catalogue, docs helpers, and stories
src/docs/fixtures/                 genuinely shared example data
src/docs/catalogue/                story snapshot, coverage, public-name mappings
```

- Keep Gaudi's domain and public owner names stable. Public entries expose deliberate APIs; internal source paths are implementation details. Example fixtures import Gaudi through supported `@gaudi/design-system/<domain>/<Owner>` entries, using package self-reference. Keep runtime implementation imports and private example helpers relative.
- Component CSS lives beside its owner as `Owner.css` (or a CSS module when locally scoped), including its responsive rules, states, and motion. `src/styles.css` only aggregates imports. Shared tokens belong in `src/tokens/`; shared typography, layout, motion, and interaction defaults belong in `src/foundations/`. Keep catalogue/example CSS under docs or stories and out of the distributed stylesheet. Remove unused rules after checking actual and dynamically constructed class references.
- Runtime CSS is the token authority; `tokens.json` is the supported JavaScript/preset projection. Update shared values together and run the token parity contracts. Keep the ESM/CJS assembly synchronized without introducing a second token policy.
- Only create folders with a real role. Keep small components flat; use `components/`, `hooks/`, or a specific responsibility folder when a larger owner needs it. Do not recreate a generic `parts/`, `internal/`, or `extended/` bucket.
- Name React modules for their component and helpers for their responsibility. Use names such as `SelectPrimitives.jsx`, `Autocomplete.jsx`, `flowLayout.js`, and `chatFileExplorerModel.js`; omit imported-source suffixes such as `-extended`. Avoid ambiguous same-basename `.js`/`.jsx` siblings and case-only filename differences.
- Review production modules around 400–500 lines for distinct responsibilities. Extract cohesive models, interactions, or rendering sections when useful; do not split coherent functions, story collections, or artwork solely to meet a line count.
- Keep an owner's stories, fixtures, demo-only helpers, and example assets under its `stories/` directory. Share data through `src/docs/fixtures/` only when multiple owners actually use it. `.storybook/` contains Storybook configuration, preview styling, audit tooling, static assets, and verification evidence.
- Mirror runtime ownership under `tests/`; do not put contracts beside distributed runtime modules. Keep hook documentation and stories in `src/docs/hooks/`, separate from `src/hooks/` runtime functions.
- Exclude complete `stories/` directories, `src/docs/`, and `tests/` from the package. For structural moves, verify public exports, relative imports, catalogue IDs, contract inventory, copied example imports, and package contents; update manifests and documentation in the same change.

## Package and application boundaries

- Gaudi owns reusable presentation, tokens, semantics, accessibility, keyboard/focus behavior, local interaction state, and generic utilities. Applications own business rules, permissions, workflow policy, routing, service requests, persistence, product models, and protocol normalization.
- Accept prepared values, labels, tones, icons, descriptors, and callbacks. Preserve supplied IDs, label casing, zero and empty values, and formatter output. Do not infer domain meaning, favorable colors, totals, or workflow decisions from presentation data.
- Keep route data, metadata, API routes, Contentlayer output, and one-off page wiring in the consuming app. Content files, bibliography files, and article-specific interactive components belong in the content bundle.
- Consumers import Gaudi instead of copying its components or recreating shared styles. Prefer supported leaf imports for focused dependencies; the documented root and category entries remain valid. `package.json` exports define the public paths.
- **Use package namespaces in example fixtures.** Import Gaudi components, hooks, icons, context, and utilities through supported `@gaudi/design-system/...` entries, including when an example lives inside the component's own directory. Use paths such as `@gaudi/design-system/core/Button`, `@gaudi/design-system/blocks/AppShell`, and `@gaudi/design-system/utilities/cn`; do not add directory-traversal imports such as `../../../../../core/Button/index.js` or `../../../index.js` for public Gaudi APIs. Prefer focused owner or utility entries over the root barrel.
- `package.json` exports are the resolver authority; do not duplicate them in editor or bundler aliases. New namespaced imports must resolve through a supported export. Keep runtime implementation imports and private example helpers, data, and assets relative.
- Never import consumer files such as `@/data/meta/*`, `@/app/content/*`, `@/lib/utils/*`, or `contentlayer/generated`. Do not introduce `@/` aliases or app-owned content fixtures in `src/`.
- Site data enters through `SiteConfigProvider` and component props. `LayoutContainer` accepts `metadata`, `navigation`, `jsonLd`, `menuProps`, and `footerProps`. Generic helpers such as `formatDate`, `sortPosts`, and `coreContent` live in `src/utilities/`.
- Gaudi and Storybook never load third-party images, iframes, scripts, fonts, CSS resources, or remote demo services. Use local assets under `.storybook/public` and static mocks. Host integrations must be explicitly configured, with no built-in service URLs. Plain `href` link targets are fine. `tests/contracts/no-external-resources.contract.test.js` enforces the resource boundary.
- Each public owner needs an implementation, explicit `index.js`, authored documentation, owner-local stories, and meaningful coverage in mirrored contracts or local Storybook plays. Keep shared/server-only exceptions explicit in the completeness contract; never add empty tests merely to satisfy inventory. Add a README when detailed usage needs one. Do not export private implementation folders or import Storybook fixtures into runtime code.
- Keep package exports explicit. Verify the real archive and compiled CSS after boundary changes with `pnpm pack:check`; use `pnpm test:consumer` for framework/server/client changes. Framework/provider libraries remain peers where consumers must share their instance; package-owned implementation libraries are dependencies. Optional peer features must remain behind their documented entries.
- Chat and agent building blocks live in `src/components/chat/<Owner>`, the `./chat` entry, and the root exports. Blocks/Chat owns only the composed `ChatShell` and its examples; shared chat behavior belongs to Chat owners.
- Charts live in `src/components/charts/<Owner>` and `./charts`, with `ChartFrame` owning shared framing and Recharts parts. Keep charts out of the root so unrelated pages do not load Recharts. MDX/Chart is only the article adapter.
- Hooks live in `src/hooks/<group>/use-x.js` (`a11y`, `data`, `environment`, `interaction`, `layout`, `state`) with camelCase exports, JavaScript, and relative imports. `src/hooks/index.js` supplies both `./hooks` and root exports. Use shared hooks for controllable state, media queries, layout effects, reduced motion, and mounted state. Keep hooks free of markup and product policy; document public hooks in `src/docs/hooks/catalogue.js` and follow [the hooks README](src/hooks/README.md).

## Interaction and implementation quality

- **Smooth caret is the default for editable text across Gaudi and Storybook.** Keep that default in `InputConfigProvider` and the Storybook Caret toolbar. Use `Input`/`FieldInput` for text, search, URLs and telephone text; `Textarea` for multiline entry; `EmailInput` for one email address; and `NumberField` with `NumberFieldInput` for numeric values. Apply this to reusable components, forms, fixtures, guides and copied examples, not only dedicated demos.
- Do not use `Input`, `FieldInput`, `InputGroupInput` or raw inputs with native `type='email'` or `type='number'` in DS consumers: those types do not expose selection positions. Preserve email pattern validation, numeric min/max/step, null/empty behavior, form submission and callbacks when migrating. Numeric identifiers such as card numbers and postal codes remain text with an appropriate `inputMode`; do not coerce them to numbers. Use `NumberField` inside `Field` for automatic label/error wiring, or provide explicit IDs and descriptions for primitive compositions.
- Keep `caretMode='native'` available at provider and field level. Respect reduced motion, forced colors, touch, IME, selection, password masking, read-only fields and browser-managed date/time/file controls. Do not weaken those fallbacks to make animation appear universal. Purpose-built text editors such as DataGrid may keep their existing parser and caret hook. Any new native email/number exception needs a documented semantic reason and focused coverage in the input-choice contract.

- Controlled values remain authoritative. Compose host callbacks, honor cancellation where the contract allows it, and respect disabled/read-only changes immediately. Avoid duplicate state that can be derived from current props.
- Keep keys and DOM identity stable through selection, filtering, responsive changes, and updates. Preserve focus and scroll position; return focus to a surviving, meaningful target when an overlay or row disappears.
- Use semantic elements, visible labels, associated errors, visible keyboard focus, and meaningful accessible names. Support keyboard interaction, reduced motion, and nested/portaled overlays. Shortcuts must respect editable fields and IME composition.
- Clean up listeners, subscriptions, observers, timers, object URLs, and pending work. Prevent stale asynchronous results from affecting a different request, selection, or unmounted view.
- Keep server rendering and the first client render deterministic. Read browser globals in effects, subscriptions, or guarded snapshots. Add client boundaries where required without pulling server-safe helpers into client-only modules.

## Visual and responsive conventions

- Use the official Gaudi artwork in `src/icons/brands/artwork/` for all Gaudi branding. `GaudiLogo` defaults to the compact dark tile with a white G in both themes; use `tone='light'` only when explicitly requested. Use `GaudiBrand` (that tile followed by ordinary “Gaudi” text) in every demo/content header, and the tile alone for compact icon slots, avatars and favicons. Do not use the graphic `GaudiWordmark` in demos or combine it with the symbol. Import from `@gaudi/design-system/icons/brands/gaudi` in examples. Keep Storybook's sidebar unbranded. Do not substitute a letter, generic icon, or redrawn mark. Original `light` SVGs are white artwork and `dark` SVGs are black artwork; generated `gaudi-icon-light/dark` assets are named for their tile background. Run `pnpm brand:build` after artwork changes to refresh the React components, Storybook assets and favicons. Keep other companies' and individual agents' identities distinct.
- Preserve Gaudi's clear hierarchy, compact controls, neutral surfaces, restrained elevation, and functional blue accents. Keep article reading comfortable and application layouts efficient. Compose both light and dark themes deliberately; never use color as the only status cue.
- Use existing typography, semantic colors, icon registry entries, variants, and class helpers. Match rendered control heights, insets, and alignment across composed parts; do not introduce another local scale.
- Corners use the shared `--ds-radius` tokens (4px by default, configurable down to 0px). Accordion trigger highlights, text highlights, and internal panel seams stay square. Reserve circular geometry for intrinsic shapes such as status dots, radio indicators, loading rings, and explicitly circular avatars.
- Inner spacing follows `--ds-space-scale` (default 1; presets in `tokens.spaceScales`). Padding, gaps, control heights, and sizes scale through `src/spacing.css`; component CSS uses `calc(var(--ds-space-scale, 1) * <length>)` for padding and gaps. Prefer `gap-*` over `space-x/y-*`. Margins, layout widths, and prose rhythm stay fixed.
- Intrinsic shapes (icons, switches, checkboxes, radios, sliders, progress, avatars, keys, badges, stars, spinners, and calendar days) reset the spacing multiplier to 1 in `src/spacing.css`. Add new shape parts there so density changes do not distort them. Token contracts check raw component padding/gap lengths.
- Build for narrow containers as well as wide pages. Let labels and actions wrap, keep full-width elements aligned, and contain deliberately scrollable charts, tables, and boards within their own regions.

## Storybook and examples

- Start the sidebar with eight flat guides: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, Typography, and Theming (with Theme Studio nested under Theming). Follow with Core, Blocks, Chat, Charts, Hooks, Animations (Text and Backgrounds), and MDX. Blog compositions belong under Blocks/Blog; Article owns the complete blog reading examples; PostHeader, PostNavigation, PostSeriesBox, and TableOfContents are the reusable Blog blocks. Article contents must reuse TableOfContents and the same Scrollspy viewport as reading progress. Keep Getting Started linked to the single Component Catalogue; do not hide the individual guides, owners, or examples.
- There is no top-level Navigation section. The site header (`Menu`, its private phone sheet and brand mark, and exported `MenuSearch`) belongs to Blocks/Navigation. Reusable navigation primitives belong under Core/Navigation. Do not create parallel menu owners or separate Docs pages for private header parts.
- Keep one Docs page per owner. Native and pattern story files share a literal title and `autodocs`; load native examples first. Use the Accordion stories and shared docs helpers as the reference. Chat, Charts, and Hooks retain their own top-level sections; Blocks shows real compositions.
- Show each use case once. Combine cosmetic size, tone, density, shape, or placement variants in a compact example. Keep materially different workflows and behavior separate. Welcome messages, prompt suggestions, session panels, and preference controls should be demonstrated in their full chat context when they are just compositions.
- Make `Playground` a realistic composition driven by `args`. Every exposed control must visibly affect the preview. Reuse `docsArgTypes`, `playgroundSource`, and authored component documentation; avoid handwritten source copies that can drift from the rendered example.
- Include useful states, working callbacks, copyable public imports, and accessibility guidance. Interactive examples need appropriate play coverage. Do not imply that mocked authentication, uploads, messages, or saves connect to real services.
- Keep shared fixtures in one place, with local assets in `.storybook/public`. Pattern fixtures export `Pattern` and import Gaudi from public package namespaces directly; `publicSource` preserves these imports and supports older relative examples. Preserve source attribution and licensing in [README.md](README.md#third-party-notices) and bundled license files.
- Use the existing local gradient artwork in `.storybook/public/static/images/art/` for demo images and illustrations, including single-image and lightbox examples. Do not substitute diagrams or screenshots for gradient imagery.
- Keep story names literal and IDs stable. When merging examples, remove obsolete fixtures and coverage entries together. Update the pattern coverage/public-name manifests when affected, then run `pnpm catalogue:sync` after adding, removing, or renaming stories.
- Give independent examples unique form, heading, and SVG IDs. Do not steal focus or scroll the page on initial Docs load. Test assembled Docs pages when shared examples or docs rendering change.
- Documentation uses the shared 13px body scale in `.storybook/documentation.css`; wrap real specimens on guide pages in `data-docs-example` so docs styles do not alter components. The docs canvas owns outer spacing; `ExampleFrame` only caps and centers examples. Avoid redundant padding and galleries that repeat existing stories.
- Use the theme toolbar instead of duplicating light/dark stories. Keep gallery rows aligned; give taller examples room to wrap. Responsive examples must demonstrate the actual component's behavior, not conceal clipping with page-wide overflow rules.
- Each public hook needs its catalogue entry and a story under `src/docs/hooks/stories/<group>/` with a literal title/id, `autodocs`, `hookMeta`, practical Gaudi compositions, and copyable `@gaudi/design-system/hooks` imports. Hook contracts cover exports, documentation, SSR, and pure logic.

## MDX boundaries

- MDX primitives live only in `./mdx`, with compiled rendering in `./mdx/runtime`. The blog engine owns markdown processing, remark/rehype plugins, and API routes; the content bundle owns content and bibliography files.
- Bespoke article diagrams and explorers remain content-owned. A content client renderer can merge its catalogue with `MDXComponents` and pass it to `MDXLayoutRenderer`; do not export these one-off components from Gaudi.
- Citations use markdown such as `[@HusseinYC18]` and bibliography frontmatter such as `bibliography: ['meta/bibliography/references.bib']`. Gaudi only hydrates generated citation popovers and trackers.
- Core `LinkPreview` and `normalizeLinkPreview` own preview UI; MDX `Preview` adapts them. The app generates previews and explicitly supplies `SiteConfigProvider preview={{ endpoint }}` and `preview.resolveImage`. There is no default endpoint or third-party page fetching. `WebPreview` and `Embed` reuse LinkPreview for blocked frames and links.
- All code rendering uses Core `CodeBlock` (`CodeBlockGroup` for tabs). MDX maps fences through `CodeFence`/`CodeGroup` and `remarkCode`; do not add a second code renderer or redundant wrappers.

## Verification and maintenance

- Scope checks to the change: link/reference and formatting checks for prose; lint, relevant contracts, and affected Storybook interaction/accessibility checks for code. Add meaningful regression coverage for behavior fixes. Broaden coverage when shared primitives, exports, or package boundaries affect more consumers.
- For every UI change, verify narrow phones, common phones, tablets, laptops, and wide desktops, including affected breakpoints and neighboring widths. Check wrapping, clipping, horizontal overflow, full-width alignment, and interactions. Fix issues and recheck; report the widths actually tested and restore temporary viewport/theme overrides.
- Compare implementations of the same semantic role side by side (for example, primitive and composed table headers). Include the supported spacing presets when changing geometry, and test disabled/read-only behavior as well as appearance. Capture open overlays and settled animations as well as resting states; check their content bounds, since a visible trigger or clipped popup can still pass a visibility assertion. Track rendered checks, actually inspected images, and uncovered states separately.
- Inspect rendered changes as well as automated results. Confirm play functions and assertions passed and inspect errors; a finished render alone is not proof. Verify a changed computed style before capturing a matrix; restart a stale preview and discard its captures. Check the live Storybook `/index.json` and affected assembled Docs pages, including source toggles; a successful manager response does not prove its catalogue or examples are healthy. Copied examples must include public imports and their required data, without Storybook configuration or test code. Old audit totals and passing surviving tests do not prove that a removed capability was preserved.
- Use `git diff --check`, `pnpm lint`, and `pnpm test:contracts` as applicable. README documents Storybook checks and audit modes. Only start a Storybook server or run its build when explicitly requested; reuse an existing server for browser checks. CI and releases use the same reusable validation workflow, including package/consumer, catalogue/source, interaction/axe, responsive, and Storybook build checks.
- Review the final diff for duplicate owners, unnecessary wrappers, unused code, broken imports, and lost examples. Preserve unrelated working-tree changes. State what changed, what was actually verified, and any remaining limitation.
- Keep durable contributor rules in this `AGENTS.md`, package setup and shared guidance in the root `README.md`, and owner-specific APIs in colocated `README.md` files. Update those sources rather than creating more design, product, coverage, migration, or audit Markdown guides. Record current inventory in the catalogue/manifests and historical verification in existing machine-readable evidence or Git/PR history. Markdown attachment fixtures are runtime demo data, not extra guides.
- Keep work and communication in the current task. Do not send messages into separate user-visible tasks unless the user explicitly requests that action; internal subagents can coordinate within this task.
