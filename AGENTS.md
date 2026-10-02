# Agent Instructions For Gaudi

Gaudi is a curated design system for blogs and applications. It combines shared foundations, reusable components, application patterns, and editorial/MDX interfaces. The repository is `ahmadassaf/design-system`; the package import name is `@gaudi/design-system`.

## Use The Package

Install from GitHub and import from the package name:

```sh
pnpm add github:ahmadassaf/design-system
```

```js
import '@gaudi/design-system/global.css';
import { Button, Card, Footer, Link, Pill } from '@gaudi/design-system';
import { Callout, Table } from '@gaudi/design-system/mdx';
```

Use the Tailwind preset and plugins from Gaudi in consuming apps:

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

## Boundaries

- Put reusable UI, MDX components, post chrome, navigation, blocks, tokens, icons, and shared styling in this repository.
- Keep route data, metadata, Contentlayer output, API routes, and one-off page wiring in the consuming app. Keep content files, bibliography files, and article-specific interactive components in the content bundle.
- Do not copy Gaudi components into consuming applications. Import from `@gaudi/design-system` or the app's Gaudi-backed alias.
- Do not add app-owned content fixtures such as `app/content`, `data/meta`, or `.contentlayer/generated` to this package.
- Do not hand-roll colors, typography, spacing, or icons in consuming applications when Gaudi already exposes a token, variant, component, or icon registry entry.
- Never import consumer files (`@/data/meta/*`, `@/app/content/*`, `@/lib/utils/*`, `contentlayer/generated`) from this package. Site data flows in through `SiteConfigProvider` (metadata, navigation) and component props (`LayoutContainer`'s `metadata`/`navigation`/`jsonLd`/`menuProps`/`footerProps`); generic helpers such as `formatDate`, `sortPosts`, and `coreContent` live in `src/utilities/` and are exported from the root entry.
- All package-internal imports are relative. Do not introduce `@/` aliases in `src/`.
- MDX components live only in the `./mdx` entry (not re-exported from the root), and the compiled-MDX runtime lives in `./mdx/runtime`.
- Chat and agent building blocks (messages, bubbles, the message list, the composer, reply parts such as reasoning, tools and sources, and chat panels) live in `src/components/chat/<Owner>` and the `./chat` entry; they are also exported from the root. Blocks/Chat holds only `ChatShell`, which composes Chat parts and must not grow its own chat behaviour.
- Charts live in `src/components/charts/<Owner>` (one owner per chart family plus `ChartFrame`, the shared frame, Recharts parts and primitives) and the `./charts` entry. They are not exported from the root, so pages without a chart never load Recharts. MDX/Chart is only the MDX adapter (`<Chart type=…>` and the chart names in the MDX map); never build chart behaviour in `src/components/mdx`.

## Storybook Navigation

- Start the sidebar with seven flat, top-level pages: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, and Typography, in that order. Do not nest them under an Overview group.
- Keep the component list below those pages, with component docs and examples visible in their existing groups. Do not replace the individual foundation guides with a combined Essentials page or hide the component list.
- Getting Started is the introductory page and presents Gaudi as a curated design system for blogs and applications. Link the single Component Catalogue from that page. Keep the full story index intact so direct links, examples, and tests continue to work.
- The catalogue refreshes from Storybook's index. After adding or renaming stories, run `pnpm catalogue:sync` to update the fallback used by tests and offline browsing.

## Component Work

- Gaudi uses a soft 4px corner radius, controlled globally by --ds-radius. Cards, controls, badges, icon tiles, menus, and overlays must use the shared tokens so applications can change this setting (including 0px). Accordion trigger highlights, text highlights, and internal panel seams stay square. Do not hard-code decorative radii. Reserve circular geometry for intrinsic shapes such as status dots, radio indicators, loading rings, and explicitly circular avatars.

- Inner spacing follows one multiplier, --ds-space-scale (default 1; presets in `tokens.spaceScales`: tight 0.75 → spacious 1.5). Tailwind `p-*`/`px-*`/`py-*`/`pt|pr|pb|pl|ps|pe-*` and `gap-*`/`gap-x|y-*` utilities are re-declared in `src/spacing.css` to scale with it; component CSS writes padding and gaps as `calc(var(--ds-space-scale, 1) * <length>)`. Heights and `size-*` follow it too, so controls get shorter or taller. Intrinsic shapes (icons, switches, checkboxes, radios, sliders, progress, avatars, keys, badges, stars, spinners, calendar days) reset the multiplier to 1 in `src/spacing.css` so they never distort; add new shape parts to that list. Margins, layout widths, and prose rhythm stay fixed. Use `gap-*` rather than `space-x|y-*` for spacing that should follow the scale (space utilities cannot be overridden). The tokens contract test fails on raw padding/gap lengths in component CSS.

- Follow the existing folder contract: each public component owns its implementation, `index.js`, Storybook story, and contract test.
- Reconcile incoming components and patterns with the existing catalogue. When there is a match, extend the existing owner with the missing variants, behaviors, and use cases; do not skip it or create a parallel implementation.
- Add a new public component only for a distinct gap. Adapt curated work to Gaudi tokens, icons, APIs, responsive behavior, and accessibility conventions, and preserve source attribution and licensing.
- Treat blog and application use cases as first-class consumers. Keep domain-specific business logic in the consuming app.
- Public stories must include practical usage, relevant variants and states, copyable public imports, and accessibility notes. Make those examples discoverable from the component documentation, including examples added by extending an existing owner.
- Documentation uses the shared 13px body scale in `.storybook/documentation.css`. Keep real component and typography specimens inside `data-docs-example` wrappers on guide pages so documentation styles do not override their public appearance.
- Load original component stories before curated extensions. Every curated story must retain `autodocs` so merged Docs pages include all examples. Give independent examples unique form and heading IDs, and avoid stealing focus on initial Docs load.
- Blocks are composed product/editorial sections. Document every variant as a real usage example with its own code.
- Navigation is documented under `Blocks/Navigation`; low-level navigation pieces stay exported but are not separate docs destinations.
- Chat is a top-level sidebar section after Blocks: one page per Chat owner (`Chat/<Owner>`). Blocks/Chat documents the composed shell.
- Charts is a top-level sidebar section after Chat: one page per chart owner (`Charts/<Owner>`) with detailed examples. MDX/Chart documents writing those charts in an article.

## MDX Work

- MDX components expose runtime rendering primitives only. The blog engine owns markdown processing, remark/rehype plugins, and API routes; the content bundle owns content and bibliography files.
- Bespoke diagrams and explorers travel with the content that invokes them. A content-owned client renderer may merge its component catalogue with `MDXComponents` and pass the result to `MDXLayoutRenderer`; do not export those components from Gaudi.
- Citations are authored in markdown with syntax such as `[@HusseinYC18]` and bibliography frontmatter such as `bibliography: ['meta/bibliography/references.bib']`. Gaudi only hydrates the generated citation popovers and trackers.
- Link previews are generated by the blog markdown pipeline and preview API. Gaudi owns the `Preview` UI.
- Do not add redundant wrappers for code blocks; all code renders through the Core `CodeBlock` (`CodeBlockGroup` for tabs), and MDX maps fences to it via `CodeFence`/`CodeGroup` with the `remarkCode` plugin.

## Verification

Use lightweight checks while a local Storybook server is already running:

```sh
git diff --check
pnpm lint
pnpm test:contracts
```

Only run Storybook build or start a server when explicitly asked. CI runs lint,
contract tests, the Storybook interaction + axe a11y suite, and the Storybook build
on every pull request.
