---
name: Gaudi Design System
description: Curated React design system for blogs and applications, with shared foundations, components, and interface patterns.
colors:
  accent: "#2563eb"
  accent-dark: "#1d4ed8"
  accent-subtle: "#eff6ff"
  surface: "#ffffff"
  surface-muted: "#fafafa"
  surface-dark: "#171717"
  text: "#171717"
  text-muted: "#404040"
  text-subtle: "#737373"
  border: "#d4d4d4"
  success: "#15803d"
  warning: "#b45309"
  danger: "#dc2626"
  discovery: "#0f766e"
typography:
  scale:
    xs: "0.75rem"
    sm: "0.875rem"
    base: "1rem"
    lg: "1.125rem"
    xl: "1.25rem"
    "2xl": "1.5rem"
    "3xl": "1.875rem"
    index-hero-sm: "2rem"
    "4xl": "2.25rem"
    index-hero-lg: "2.625rem"
    "5xl": "3rem"
    "6xl": "3.75rem"
    "7xl": "4.5rem"
    "8xl": "6rem"
  display:
    fontFamily: "var(--font-space-inter), Inter Variable, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0"
  headline:
    fontFamily: "var(--font-space-inter), Inter Variable, system-ui, sans-serif"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "0"
  body:
    fontFamily: "var(--font-space-inter), Inter Variable, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "var(--font-space-inter), Inter Variable, system-ui, sans-serif"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0"
  mono:
    fontFamily: "JetBrains Mono, Menlo, Monaco, monospace"
rounded:
  sm: "var(--ds-radius)"
  card: "var(--ds-radius)"
  control: "var(--ds-radius)"
  pill: "var(--ds-radius)"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "0.75rem 1.5rem"
  card-elevated:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.card}"
    padding: "1rem"
  input-default:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.control}"
    padding: "0.5rem 0.75rem"
  pill-soft:
    backgroundColor: "{colors.accent-subtle}"
    textColor: "{colors.accent-dark}"
    rounded: "{rounded.pill}"
    padding: "0.125rem 0.625rem"
---

# Design System: Gaudi Design System

## Overview

**Creative North Star: "Clarity for reading and working"**

Gaudi is a curated design system for reading and working on the web. It brings the blog and application interfaces together through clear hierarchy, compact controls, neutral surfaces, and blue accents that signal action, selection, and wayfinding.

Components and patterns can come from many sources; their integration should feel coherent. Extend existing owners, use shared foundations, and support practical use cases across articles, forms, data views, navigation, and complete workflows. Preserve comfortable reading alongside efficient task completion.

**Key Characteristics:**

- Neutral reading and working surfaces with blue used as a functional accent.
- Compact geometry, visible focus, and restrained elevation.
- Separate root, MDX, and runtime entrypoints to keep interfaces lean.
- Dark mode is intentionally composed, not mechanically inverted.

## Colors

The palette is a cool editorial neutral base with blue as the primary action and information accent, plus semantic tones for status and content meaning.

### Primary

- **Editorial Blue**: The primary action, active navigation, link, selection, and focus hue. Use it sparingly so interactive targets remain easy to find.
- **Deep Editorial Blue**: Hover, active, and stronger emphasis states for the primary accent.
- **Quiet Blue Field**: Soft selected or informational backgrounds where the accent needs to support text rather than dominate it.

### Secondary

- **Discovery Teal**: Used for discovery, metadata, or positive exploratory emphasis when blue would imply primary action.
- **Indigo Support**: Available in component tone scales for technical or secondary emphasis, especially charts and badges.

### Tertiary

- **Amber Warning**, **Rose Attention**, **Red Danger**, and **Green Success** carry semantic state. They should always be paired with text, icons, labels, or position so color is not the only signal.

### Neutral

- **Paper Surface**: The default light surface for documents, cards, controls, and Storybook canvas.
- **Muted Surface**: Low-emphasis regions, code-adjacent backgrounds, and soft cards.
- **Ink Text**: Primary text and headings.
- **Muted Ink**: Secondary text, metadata, and helper copy.
- **Neutral Border**: Separators and component strokes.
- **Dark Surface**: The dark reading base, with neutral-300 style text rather than pure white body copy.

### Named Rules

**The Rare Accent Rule.** Blue is functional, not decorative. Spend it on action, selection, focus, links, and data emphasis before using it for atmosphere.

## Typography

**Display Font:** Space Inter custom property with Inter Variable and system fallbacks.
**Body Font:** The same sans stack for consistent editorial rhythm.
**Label/Mono Font:** JetBrains Mono with Menlo, Monaco, and monospace fallbacks for code and measured keyboard notation.

**Character:** Typography is direct, compact, and technical without becoming mechanical. Weight and spacing carry hierarchy more than ornament.

### Hierarchy

- **Scale**: 0.625rem, 0.75rem, 0.875rem, 1rem, 1.125rem, 1.25rem, 1.5rem, 1.875rem, 2rem, 2.25rem, 2.625rem, 3rem, 3.75rem, 4.5rem, and 6rem are the documented size steps. The 0.625rem micro step is reserved for fixed-size inline citation numerals; it is not a general interface-text size. The 2rem and 2.625rem intermediates belong to editorial-index hero titles, where 1.875rem and 3rem create too little or too much contrast with the surrounding archive. Use other intermediate values only by adding them to the system intentionally.
- **Display** (700, variable size, 1.15 line-height): Large page and foundation headings.
- **Headline** (700, tight line-height): Section headers, post titles, and component docs titles.
- **Title** (600-700, compact): Card titles, dialog titles, and grouped UI headings.
- **Body** (400, 1rem, 1.6 line-height): Article and interface prose, with long reading content kept in comfortable measures.
- **Label** (600, compact): Button text, field labels, badges, navigation labels, and dense metadata.
- **Mono**: Code, terminal surfaces, keyboard shortcuts, data, and literal tokens only.

### Named Rules

**The Single Voice Rule.** Use one sans family for interface and editorial UI. Bring in mono only for code, data, or keyboard notation.

## Layout

Layouts are responsive, centered, and content-led. Components use Tailwind spacing conventions, with tight internal grouping and clear separation between sections. Navigation and tool surfaces favor scanable density over large marketing-style composition. Horizontal overflow is reserved for data tables and code-like surfaces that deliberately provide scroll containment.

## Elevation & Depth

Gaudi is flat by default with modest structural elevation. Borders define most surfaces; shadows appear for cards, popovers, command launchers, dialogs, and hover states where depth communicates layer or interaction.

### Shadow Vocabulary

- **Card Shadow**: A small low-contrast resting shadow for elevated cards.
- **Card Hover Shadow**: A wider soft hover shadow used only when interaction needs lift.
- **Floating Shadow**: A compact layered shadow for menus and floating controls.
- **Launcher Shadow**: A deeper shadow for the command launcher and modal-like overlays.

### Named Rules

**The Border-First Rule.** Prefer border and tonal separation at rest. Add shadow when a surface is floating, modal, or actively interactive.

## Shapes

Gaudi uses a subtle 2px radius for element boundaries. The global CSS variable `--ds-radius` drives cards, controls, badges, icon tiles, menus, overlays, code blocks, and documentation frames through shared tokens. Applications can override it on `:root`, including `0px` for square corners. Storybook’s Corners toolbar previews 0px, 2px, 4px, and 8px. Accordion trigger highlights, text highlights, and internal panel seams stay square regardless of the global setting. Do not hard-code decorative radii. Circular geometry is reserved for intrinsic shapes such as status dots, radio indicators, loading rings, and explicitly circular avatars. Keep keyboard focus rings visible.

## Components

### Buttons

- **Shape:** Compact controls using the global corner radius.
- **Primary:** Blue solid fill with white text and balanced horizontal padding.
- **Hover / Focus:** Hover darkens or tints within the same tone; keyboard focus uses a visible neutral ring.
- **Secondary / Ghost / Subtle:** Secondary variants use outline, soft, ghost, or text-like emphasis while preserving tone semantics.

### Chips

- **Style:** Capitalized compact labels using the global corner radius and strong tone mapping.
- **State:** Solid variants carry high emphasis; soft and outline variants support metadata, tags, and filters.

### Cards / Containers

- **Corner Style:** Subtle 2px corners by default, following `--ds-radius`.
- **Background:** White or muted neutral in light mode, neutral dark surfaces in dark mode.
- **Shadow Strategy:** Elevated cards may rest on a small shadow; outline and soft cards stay flatter.
- **Border:** Border is the default structural separator.
- **Internal Padding:** Small to medium spacing, scaled by component density.

### Inputs / Fields

- **Style:** Rounded neutral border, white or dark surface fill, clear placeholder tone.
- **Focus:** Border change and visible focus treatment without color-only dependency.
- **Error / Disabled:** Error state uses red border/text with ARIA invalid wiring; disabled state reduces opacity and blocks pointer interaction when appropriate.

### Navigation

Navigation supports both content sites and application workspaces. Keep active state visible and adapt the structure to the task: site links and search for reading, workspace navigation and contextual actions for applications. Preserve focus management and keyboard access when navigation moves into a mobile overlay.

### MDX Article Components

MDX components support reading: citations, previews, callouts, code tabs, charts, Mermaid diagrams, images, video, tables, and tooltips. Heavy article dependencies stay isolated in the MDX entrypoints.

## Do's and Don'ts

### Do:

- **Do** use Gaudi tokens, variants, icons, and exported components before creating a local one-off.
- **Do** preserve the root, MDX, and runtime entrypoint separation.
- **Do** keep keyboard focus, dialog focus trapping, alt text, and reduced-motion behavior intact.
- **Do** use blue to clarify interaction and current state.

### Don't:

- **Don't** import consuming app data, generated content, or route-specific files into Gaudi.
- **Don't** copy components into consuming applications when an exported Gaudi primitive exists.
- **Don't** use color as the only status cue.
- **Don't** add large decorative shadows, glass effects, or oversized radii to routine reading and application surfaces.
