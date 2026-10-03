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
import { useHotkey, useMediaQuery } from '@gaudi/design-system/hooks';
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
- Gaudi and its Storybook never load anything from the network: no third-party images, iframes, scripts, fonts, CSS `url()`s, fetches or service URLs, and no built-in defaults that point at one. Stories use local assets under `.storybook/public` (portraits in `avatars/`, flags in `flags/`) and static mocks; services such as analytics or preview endpoints are app-supplied props. Plain `href` link targets are fine. `src/test-support/no-external-resources.contract.test.js` enforces this.
- MDX components live only in the `./mdx` entry (not re-exported from the root), and the compiled-MDX runtime lives in `./mdx/runtime`.
- Chat and agent building blocks (messages, bubbles, the message list, the composer, reply parts such as reasoning, tools and sources, and chat panels) live in `src/components/chat/<Owner>` and the `./chat` entry; they are also exported from the root. Blocks/Chat holds only `ChatShell`, which composes Chat parts and must not grow its own chat behaviour.
- Hooks live in `src/hooks/<group>/use-x.js` (groups: `a11y`, `data`, `environment`, `interaction`, `layout`, `state`; kebab-case files, camelCase exports). `src/hooks/index.js` is the barrel behind the `./hooks` entry, and the root entry re-exports it, so `@gaudi/design-system` and `@gaudi/design-system/hooks` both work. `src/hooks/catalogue.js` documents every public hook (group, summary, params, returns, accessibility); `src/hooks/README.md` has the conventions. Hooks must be SSR-safe (read browser globals only in effects, subscriptions or guarded snapshots), JS with relative imports, and free of markup and product rules. Components use the shared hooks instead of re-declaring generic ones (controllable state, media queries, isomorphic layout effects, reduced motion, mounted flags).
- Charts live in `src/components/charts/<Owner>` (one owner per chart family plus `ChartFrame`, the shared frame, Recharts parts and primitives) and the `./charts` entry. They are not exported from the root, so pages without a chart never load Recharts. MDX/Chart is only the MDX adapter (`<Chart type=…>` and the chart names in the MDX map); never build chart behaviour in `src/components/mdx`.

## Storybook Navigation

- Start the sidebar with seven flat, top-level pages: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, and Typography, in that order. Do not nest them under an Overview group.
- Keep the component list below those pages, with component docs and examples visible in their existing groups. The section order is Core, Blocks, Chat, Charts, Hooks, Navigation, MDX, Post, Layout (`.storybook/preview.js` storySort and `.storybook/navigation.js`). Do not replace the individual foundation guides with a combined Essentials page or hide the component list.
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
- There is no top-level Navigation section. The site header (`Menu`, with its private phone sheet and brand mark, and the exported `MenuSearch` entry) lives in `src/components/blocks/Navigation` and is documented on the single `Blocks/Navigation` page. Reusable navigation primitives are Core owners under `Core/Navigation/*` (NavigationMenu with `NavigationMenuAside` for two-block panels, FloatingMenu, Breadcrumb, Pagination); do not add parallel menu components or separate docs pages for header parts.
- Chat is a top-level sidebar section after Blocks: one page per Chat owner (`Chat/<Owner>`). Blocks/Chat documents the composed shell.
- Charts is a top-level sidebar section after Chat: one page per chart owner (`Charts/<Owner>`) with detailed examples. MDX/Chart documents writing those charts in an article.
- Hooks is a top-level sidebar section after Charts: `Hooks/Overview` lists every hook by group, then one docs page per hook (`Hooks/<Group>/<hook>`, e.g. `Hooks/Interaction/useOnClickOutside`). Each hook owns its file, a colocated `use-x.stories.jsx` (literal title and id, `tags: ['autodocs']`, `...hookMeta('<hook>')`, practical live examples built from Gaudi components with copyable `@gaudi/design-system/hooks` imports, play functions where interaction matters) and an entry in `src/hooks/catalogue.js`, which feeds the API table, accessibility notes and the overview. `src/hooks/hooks.contract.test.js` and `logic.contract.test.js` cover exports, docs, SSR rendering and the pure logic. A new hook needs all of these, then `pnpm catalogue:sync`.

## MDX Work

- MDX components expose runtime rendering primitives only. The blog engine owns markdown processing, remark/rehype plugins, and API routes; the content bundle owns content and bibliography files.
- Bespoke diagrams and explorers travel with the content that invokes them. A content-owned client renderer may merge its component catalogue with `MDXComponents` and pass the result to `MDXLayoutRenderer`; do not export those components from Gaudi.
- Citations are authored in markdown with syntax such as `[@HusseinYC18]` and bibliography frontmatter such as `bibliography: ['meta/bibliography/references.bib']`. Gaudi only hydrates the generated citation popovers and trackers.
- Link previews are generated by the blog markdown pipeline and preview API. Gaudi owns the preview UI: Core `LinkPreview` (with `normalizeLinkPreview`, the single rule for what rich information each link kind shows) and the MDX `Preview` adapter over it. Gaudi only calls an endpoint the app configures (`SiteConfigProvider preview={{ endpoint }}`; there is no default) and never fetches third-party pages; derived images (thumbnails, screenshots) come only from the app's `preview.resolveImage`; `WebPreview` and `Embed` reuse LinkPreview for blocked frames and links.
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
