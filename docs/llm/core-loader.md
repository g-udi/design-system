# Loader

> Core/Loader · core · `@gaudi/design-system/core/Loader`

An accessible loading indicator with arcs, dots, expanding rings, and an indeterminate bar. Loader replaces the former Spinner component and story.

## Import

```js
import Loader from '@gaudi/design-system/core/Loader';
// also: import { … } from '@gaudi/design-system/core';
```

Exports: `Loader`, `LoaderRoot`, `default`, `loaderVariants`

## Props

| Name | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `arc \| dual-arc \| bar \| beat \| bounce \| circle-dots \| clip \| puff \| three-dots \| triangle \| two-dots` | `arc` | no | Selects the motion and shape. Every variant represents an unknown wait; use Progress when completion can be measured. |
| `size` | `xs \| sm \| md \| lg` | `md` | no | 12, 16, 20, or 32px tall. The bar is three times as wide; other variants are square. Shapes keep these dimensions across spacing presets. |
| `label` | `string` | `Loading` | no | Accessible status label describing the operation. A visible label belongs beside the indicator. |
| `LoaderRoot` | `component` | `currentColor, sm` | no | Composition primitive with the same variants and sizing. Inherits text color and accepts aria-label rather than label. Loader adds the accent color and md default. |
| `loaderVariants` | `string[]` | — | no | Supported variant names for controls or a variant picker. |
| `className` | `string` | — | no | Additional classes on the outer element. |

## Variants

- `variant`: `arc`, `dual-arc`, `bar`, `beat`, `bounce`, `circle-dots`, `clip`, `puff`, `three-dots`, `triangle`, `two-dots`
- `size`: `xs`, `sm`, `md`, `lg`

## Usage

```jsx
import { Loader } from '@gaudi/design-system/core/Loader';

<Loader variant='three-dots' size='md' label='Loading articles' />
```

## Accessibility

Each loader exposes role="status" and a readable label. Motion is decorative to that status. With reduced motion, rotation, travel, scaling and bouncing stop; the whole indicator breathes slowly in place. For an already-labelled button or busy region, use aria-hidden="true" to avoid duplicate announcements.

## Notes

- Use className="text-current" to inherit surrounding text, or a semantic tone such as text-text-muted. Explicit size utility classes can override the dimensions. Keep the bar at its natural 3:1 ratio.
- All animation is CSS and SVG; there are no timers or browser-only rendering dependencies. Unmount the loader when the operation finishes. Loading state, cancellation, progress and recovery belong to the host.
- Import Loader from the root, core, or core/Loader entry. Spinner, SpinnerRoot and core/Spinner have been renamed to Loader, LoaderRoot and core/Loader; update existing imports.
- The Shadix UI loader reference informed the variant family. Geometry and motion are implemented locally using Gaudi colors, density and motion conventions.

## Examples

- Playground (Storybook `core-loader--playground`)
- Animation variants (Storybook `core-loader--variants`)

Curated patterns:

- In buttons, badges and inputs — registry item `@gaudi/loader-inline-controls` (uses `Badge`, `Button`, `InputGroup`, `InputGroupAddon`, `InputGroupInput`, `LoaderRoot`)
- Inline status — registry item `@gaudi/loader-inline-status` (uses `ChatActivityIndicator`, `LoaderRoot`)
- Overlays and empty states — registry item `@gaudi/loader-overlays` (uses `Button`, `CardContent`, `CardDescription`, `CardHeader`, `CardRoot`, `CardTitle`, `Empty`, `EmptyContent`, `EmptyDescription`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `Label`, `LoaderRoot`, `SwitchRoot`)

## Related

`core-progress`

## README

A named loading status with eleven CSS animation variants. `Loader` replaces `Spinner`, and the Storybook owner is `Core/Loader`.

```jsx
import { Loader } from '@gaudi/design-system/core/Loader';

<Loader variant='three-dots' size='md' label='Loading articles' />
```

- `variant`: `arc` (default), `dual-arc`, `bar`, `beat`, `bounce`, `circle-dots`, `clip`, `puff`, `three-dots`, `triangle`, or `two-dots`. These indicate an unknown wait; use `Progress` for measured completion.
- `size`: `xs` 12px, `sm` 16px, `md` 20px (default), or `lg` 32px. The bar is three times as wide as it is tall. Other variants are square. Intrinsic dimensions stay fixed across density presets.
- `label`: accessible status label, default `Loading`. Describe the active operation and provide visible status text where useful.
- `className`: use `text-current` to inherit surrounding color or a semantic tone such as `text-text-muted`. Explicit size utilities can override dimensions; preserve the bar's 3:1 ratio.
- SVG attributes and refs pass through. Set `aria-hidden='true'` when a button or containing region already announces the same state.

`LoaderRoot` is the composition primitive: the same variants, `sm` default, current text color, and `aria-label` instead of `label`. `loaderVariants` exports the supported names. All three are available from the root, `core`, and `core/Loader` entries; the leaf also has a default `Loader` export.

Reduced motion stops rotation, travel, scaling, and hopping. The indicator uses Gaudi's slow opacity breath while keeping its status label. The SVG/CSS implementation has no timers, and server rendering is deterministic. Unmount it when work finishes; the host owns loading state, cancellation, errors, and recovery.

Existing button, input, inline-status, overlay, and empty-state examples remain under Loader. Update `Spinner`, `SpinnerRoot`, and `core/Spinner` imports to `Loader`, `LoaderRoot`, and `core/Loader`. The Shadix UI reference informed the variant family; no remote animation code or assets are loaded.
