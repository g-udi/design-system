# Gaudi Design System

Gaudi is a curated design system for blogs and applications. It brings reusable React components, design foundations, and practical interface patterns into one coherent system.

It began with the blog and has grown to support application interfaces: forms, data views, navigation, dialogs, dashboards, and complete workflows alongside rich editorial and MDX experiences. Components and patterns discovered across other systems are selected, adapted, and extended for reuse in Gaudi.

The system is called **Gaudi**. The source repository is hosted at [`ahmadassaf/design-system`](https://github.com/ahmadassaf/design-system), and the package import name is `@gaudi/design-system`.

## What belongs in Gaudi

- **Foundations:** shared tokens, typography, colors, icons, motion, and accessibility conventions.
- **Components:** reusable controls and compositions, with variants and interaction states for real product use.
- **Patterns and blocks:** application shells, settings, onboarding, collections, and editorial page sections.
- **Publishing:** post components, reading layouts, and MDX primitives for the blog and other content experiences.

## How the system grows

Start with a useful component or use case, then reconcile it with the catalogue. **When an existing component matches, extend it** with the missing variants, behaviors, and examples. Add a new component only when it fills a distinct gap.

Adapt incoming patterns to Gaudi's tokens, icons, public APIs, accessibility, and responsive behavior. Document practical examples, interaction states, usage boundaries, and copyable imports. Preserve source attribution and licensing. The collection remains open to useful patterns discovered across projects and libraries.

## For Agents

Coding agents should read [`AGENTS.md`](./AGENTS.md) before changing the package or consuming it from an application. The short version:

- reusable UI, MDX components, post chrome, navigation, blocks, tokens, icons, and shared styling live in Gaudi;
- route data, content files, bibliography files, Contentlayer output, API routes, and one-off app wiring stay in the consuming app;
- consuming applications import Gaudi instead of copying components or recreating shared styles;
- matching components are extended in place, with the richer use cases documented under the same owner.

## Install

```sh
pnpm add github:ahmadassaf/design-system
```

The repository name and package name are intentionally different: install from GitHub, then import from `@gaudi/design-system`.

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

## Application interfaces

Application interfaces are a first-class part of Gaudi. Compose controls and blocks for workspaces, settings, onboarding, and data workflows using the same foundations as the blog. See [application coverage](./APPLICATION-COVERAGE.md) for component families, usage boundaries, and Storybook entry points.

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

## Blog and content interfaces

Post components are available through `@gaudi/design-system/post` and its leaf entrypoints. MDX article components are available individually so consumers do not pull charts,
Mermaid, or other heavyweight peers into routes that only render one primitive:

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
footer, command launcher, theme switcher) read metadata and navigation links from the
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
import { SiteConfigProvider } from '@gaudi/design-system';

<SiteConfigProvider metadata={ siteMetadata } navigation={ navigationMetadata }>
  <App />
</SiteConfigProvider>
```

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

## Development

```sh
pnpm install
pnpm storybook
pnpm lint
pnpm test:contracts
pnpm test-storybook
pnpm build-storybook
```

CI (`.github/workflows/ci.yml`) runs lint, contract tests, the Storybook interaction +
axe accessibility suite (in Playwright browser mode), and the Storybook build on every
pull request and push to `main`.

Storybook uses local fixtures under `.storybook/fixtures/site/` and static assets under `.storybook/public/` to document site-aware components such as navigation and footer without depending on the blog repository. Those fixtures are not part of the design-system runtime API.

When a local Storybook server is already running, prefer lightweight verification:

```sh
git diff --check
pnpm test:contracts
```

## Storybook navigation

The sidebar starts with seven top-level pages: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, and Typography. The component list follows, with its docs and examples. Getting Started introduces Gaudi as a curated design system for blogs and applications and links to the single Component Catalogue, which searches components and use cases across Core, Blocks, Navigation, MDX, Post, and Layout.

Run `pnpm catalogue:sync` after adding or renaming stories to refresh the catalogue fallback. The running catalogue also reads Storybook's current index.

## Component catalogue

Gaudi brings together 81 curated component families with 1,149 practical Storybook examples. Matching compositions extend existing owners and preserve their convenience APIs. See [coverage and public imports](REUI-COVERAGE.md), [verification](REUI-VERIFICATION.md), and [source notices](THIRD_PARTY_NOTICES.md).
