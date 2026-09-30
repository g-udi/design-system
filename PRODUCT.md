# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Gaudi serves developers and coding agents building blogs and applications. They need a shared place to find, evaluate, extend, and reuse interface components without rebuilding them for each product. The resulting interfaces serve both readers and people completing tasks in applications.

## Product Purpose

Gaudi is a curated design system for blogs and applications. It brings reusable React components, design foundations, and practical interface patterns into one coherent system. Success means a useful pattern can be discovered, adapted once, documented with real use cases, and reused through `@gaudi/design-system` across products.

## Positioning

Gaudi began as the blog's design system and has expanded into a design system for reading and working on the web. Application controls, data views, navigation, dialogs, and workflow blocks sit alongside editorial layouts, post components, and MDX experiences. The blog remains a first-class consumer.

Curation is an ongoing practice: useful components and patterns are selected, then integrated into Gaudi's visual language and interaction contracts. Patterns come from multiple sources; component ownership and example depth follow a shared contract. When a pattern matches an existing component, extend that component. Add a new owner when there is a distinct gap. Breadth should come with practical states, accessible behavior, responsive examples, and honest usage boundaries.

## Operating Context

The package is installed from `github:ahmadassaf/design-system` and imported as `@gaudi/design-system`. Consumers import `@gaudi/design-system/global.css` and use its documented entrypoints, Tailwind preset, and plugins. Site-aware components receive metadata and navigation through `SiteConfigProvider` or `LayoutContainer`. Application components receive data, actions, and state through their public APIs. Storybook starts with seven top-level pages: Getting Started, Accessibility, Colors & Tokens, Icons, Indicators, States & Recovery, and Typography. The component list follows with its docs and examples. Getting Started introduces the curated design system and links to the single Component Catalogue for searching components and usage examples. Interaction checks and axe accessibility tests verify the examples.

## Capabilities and Constraints

Reusable UI belongs here: core components, layout, blocks, navigation, post chrome, MDX UI, tokens, icons, and shared utilities. Consuming applications own business rules, routes, permissions, API clients, persistence, and content. Package-internal imports are relative. MDX components stay in the `./mdx` entrypoint, and the compiled-MDX runtime stays in `./mdx/runtime` so article dependencies do not enter the root import path.

## Brand Commitments

The system name is Gaudi. The package name is `@gaudi/design-system`. The source repository is `ahmadassaf/design-system`. The voice is clear, practical, and precise. Describe supported behavior and real use cases; do not imply universal coverage or fabricate customers, benchmarks, or proof of production readiness. Preserve attribution and licensing for curated source material.

## Evidence on Hand

Repository evidence includes `README.md`, `AGENTS.md`, `package.json`, `src/tokens/tokens.json`, `src/styles.css`, Storybook stories, and component source under `src/components/`. `REUI-COVERAGE.md` and `THIRD_PARTY_NOTICES.md` record curated source coverage and attribution. Verification records describe what was checked. Storybook fixtures demonstrate local state and illustrative data; they do not establish a working backend or provider integration.

## Product Principles

- Curate for reuse across the blog and applications.
- Extend an existing component when a discovered pattern matches it.
- Integrate patterns through shared tokens, icons, APIs, and interaction conventions.
- Document rich use cases, relevant states, accessibility, and supported boundaries.
- Keep product data and business logic in consuming applications.
- Keep heavy MDX/article dependencies out of the root export path.
- Preserve reading quality and task usability across themes, screen sizes, and input methods.

## Accessibility & Inclusion

Gaudi targets accessible web UI. Storybook's axe suite runs WCAG 2.0/2.1 A and AA checks, and components should preserve keyboard operation, visible focus, semantic roles, useful alt text, and reduced-motion behavior. Curated additions must meet the same expectations as existing components.
